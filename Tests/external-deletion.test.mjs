import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {deletionStatusCode, deletionRequest, connectDeletionTool} from '../external-deletion.js';

const key = 'TW-D-' + 'A'.repeat(32) + '.' + 'b'.repeat(43), id = 'fixture-request';
const code = 'TW-S-' + createHash('sha256').update(key + '\0' + id).digest('hex');
test('status code matches the server, including its zero-byte separator', async () => {
  assert.equal(await deletionStatusCode(key, id), code);
  await assert.rejects(deletionStatusCode('not-a-key', id));
});
test('explicit POST uses only the fixed HTTPS destination and omits credentials/storage/referrer', async () => {
  const result = await deletionRequest('/v1/external-deletion', {deletionKey: key, requestID: id}, async (url, options) => {
    assert.equal(url, 'https://timewars-server-1022918397579.us-central1.run.app/v1/external-deletion');
    assert.equal(new URL(url).search, ''); assert.equal(options.method, 'POST');
    assert.equal(options.redirect, 'error'); assert.equal(options.credentials, 'omit');
    assert.equal(options.cache, 'no-store'); assert.equal(options.referrerPolicy, 'no-referrer');
    assert.deepEqual(JSON.parse(options.body), {deletionKey: key, requestID: id});
    return Response.json({status: 'pending', statusCode: code});
  });
  assert.equal(result.status, 'pending');
});
test('malformed payload or unexpected destination is refused before networking', async () => {
  const fetchRequest = () => { throw Error('Must not send'); };
  for (const [path, body] of [['/other', {}], ['/v1/external-deletion', {deletionKey: key, requestID: id, uid: 'other'}],
    ['/v1/external-deletion/status', {statusCode: 'bad'}]]) await assert.rejects(deletionRequest(path, body, fetchRequest), /invalid/);
});
test('bad receipts, verification denials and lost responses never report success', async () => {
  for (const response of [Response.json({status: 'deleted', statusCode: 'TW-S-' + 'f'.repeat(64)}),
    Response.json({status: 'other', statusCode: code}), new Response('{}', {status: 403})]) {
    await assert.rejects(deletionRequest('/v1/external-deletion/status', {statusCode: code}, async () => response));
  }
  await assert.rejects(deletionRequest('/v1/external-deletion/status', {statusCode: code}, async () => { throw Error('lost'); }), /lost/);
});
function fixture() {
  const elements = Object.fromEntries(['deletion-key', 'deletion-confirm', 'deletion-status', 'deletion-message',
    'delete-online', 'check-deletion', 'show-deletion-status'].map(name => [name, {disabled: true, value: '', checked: false,
      addEventListener(event, callback) { this[event] = callback; }}]));
  return {elements, doc: {getElementById: id => elements[id]}};
}
test('no automatic request; destructive control needs both key and explicit consequence approval', async () => {
  const {elements: e, doc} = fixture(); let calls = 0;
  connectDeletionTool(doc, 'https://chesstimewars.github.io', true, {send: async () => { calls++; }});
  assert.equal(calls, 0); await e['delete-online'].click(); assert.equal(calls, 0);
  e['deletion-key'].value = key; await e['delete-online'].click(); assert.equal(calls, 0);
  assert.match(e['deletion-message'].textContent, /confirm/);
});
test('lost deletion response retains the same retry identity and private receipt; pending is not completion', async () => {
  const {elements: e, doc} = fixture(); const requests = [];
  connectDeletionTool(doc, 'https://chesstimewars.github.io', true, {send: async (path, body) => {
    requests.push(body); if (requests.length === 1) throw Error('lost');
    return {status: 'pending', statusCode: e['deletion-status'].value};
  }});
  e['deletion-key'].value = key; e['deletion-confirm'].checked = true;
  await e['delete-online'].click(); const receipt = e['deletion-status'].value;
  assert.match(receipt, /^TW-S-[a-f0-9]{64}$/); assert.match(e['deletion-message'].textContent, /could not confirm/);
  await e['delete-online'].click(); assert.equal(requests[0].requestID, requests[1].requestID);
  assert.equal(e['deletion-status'].value, receipt); assert.equal(e['deletion-key'].value, '');
  assert.match(e['deletion-message'].textContent, /pending/);
});
test('unknown/insecure website origin leaves the tool inert', () => {
  for (const [origin, secure] of [['http://chesstimewars.github.io', false], ['https://untrusted.invalid', true]]) {
    const {elements: e, doc} = fixture(); connectDeletionTool(doc, origin, secure);
    assert.equal(e['delete-online'].disabled, true); assert.equal(e['delete-online'].click, undefined);
  }
});
