const origin = 'https://timewars-server-1022918397579.us-central1.run.app';
const keyPattern = /^TW-D-([A-F0-9]{32})\.([A-Za-z0-9_-]{43})$/;
const statusPattern = /^TW-S-[a-f0-9]{64}$/;

export async function deletionStatusCode(key, requestID, cryptoProvider = crypto) {
  if (!keyPattern.test(key) || !/^[A-Za-z0-9_-]{1,64}$/.test(requestID)) throw new Error('invalid');
  const bytes = await cryptoProvider.subtle.digest('SHA-256', new TextEncoder().encode(key + '\0' + requestID));
  return 'TW-S-' + Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, '0')).join('');
}

export async function deletionRequest(path, data, fetchRequest = fetch) {
  if (!['/v1/external-deletion', '/v1/external-deletion/status'].includes(path)) throw new Error('invalid');
  if (path.endsWith('/status') ? Object.keys(data).join() !== 'statusCode' || !statusPattern.test(data.statusCode) :
      Object.keys(data).sort().join() !== 'deletionKey,requestID' || !keyPattern.test(data.deletionKey) ||
      !/^[A-Za-z0-9_-]{1,64}$/.test(data.requestID)) throw new Error('invalid');
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetchRequest(origin + path, {method: 'POST',
      headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data),
      credentials: 'omit', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer', signal: controller.signal});
    if (!response.ok) throw new Error(response.status === 403 ? 'verification' : 'unavailable');
    const value = await response.json();
    if (!['pending', 'deleted'].includes(value.status) || !statusPattern.test(value.statusCode)) throw new Error('unavailable');
    const expected = path.endsWith('/status') ? data.statusCode : await deletionStatusCode(data.deletionKey, data.requestID);
    if (value.statusCode !== expected) throw new Error('unavailable');
    return value;
  } finally { clearTimeout(timer); }
}

export function connectDeletionTool(doc = document, locationOrigin = location.origin, secure = isSecureContext,
  {send = deletionRequest} = {}) {
  if (!secure || !['https://chesstimewars.github.io', 'http://localhost:4173', 'http://127.0.0.1:4173'].includes(locationOrigin)) return;
  const key = doc.getElementById('deletion-key'), confirm = doc.getElementById('deletion-confirm');
  const status = doc.getElementById('deletion-status'), message = doc.getElementById('deletion-message');
  const remove = doc.getElementById('delete-online'), check = doc.getElementById('check-deletion');
  const show = doc.getElementById('show-deletion-status');
  if (![key, confirm, status, message, remove, check, show].every(Boolean)) return;
  let previousKey, requestID, busy = false;
  for (const element of [key, confirm, status, remove, check, show]) element.disabled = false;
  show.addEventListener('click', () => {
    status.type = status.type === 'password' ? 'text' : 'password';
    show.textContent = status.type === 'password' ? 'Show Private Status Code' : 'Hide Private Status Code';
  });
  message.textContent = 'Online account deletion is separate from local saves and your underlying Google account.';
  async function perform(deleting) {
    if (busy) return;
    if (deleting && (!confirm.checked || !keyPattern.test(key.value.trim()))) {
      message.textContent = 'Enter your private ownership key and confirm the permanent deletion consequences first.'; return;
    }
    if (!deleting && !statusPattern.test(status.value.trim())) {
      message.textContent = 'Enter your private deletion status code first.'; return;
    }
    busy = true; remove.disabled = check.disabled = true;
    message.textContent = deleting ? 'Submitting deletion. Do not treat this as completion yet.' : 'Checking deletion status.';
    try {
      let path, data;
      if (deleting) {
        const value = key.value.trim();
        if (previousKey !== value) { previousKey = value; requestID = crypto.randomUUID(); }
        status.value = await deletionStatusCode(value, requestID);
        path = '/v1/external-deletion'; data = {deletionKey: value, requestID};
      } else { path = '/v1/external-deletion/status'; data = {statusCode: status.value.trim()}; }
      const result = await send(path, data);
      if (deleting) { key.value = ''; confirm.checked = false; previousKey = requestID = undefined; }
      message.textContent = result.status === 'deleted' ?
        'Online game account deletion is confirmed. This does not delete your Google account or provider-retained records.' :
        'Deletion is pending. Online access stays denied while the server retries. Retain your private status code and check again later.';
    } catch (error) {
      message.textContent = error.message === 'verification' ?
        'Ownership or status could not be verified. Check the private code or contact support without emailing it.' :
        'The service could not confirm completion. Retain your private status code and check again; a lost response does not prove the request failed.';
    } finally { busy = false; remove.disabled = check.disabled = false; }
  }
  remove.addEventListener('click', () => perform(true));
  check.addEventListener('click', () => perform(false));
}

if (typeof document !== 'undefined') connectDeletionTool();
