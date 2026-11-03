import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const names = ['index.html', 'support.html', 'privacy.html', 'account-deletion.html'];
const pages = Object.fromEntries(names.map(name => [name, readFileSync(resolve(root, name), 'utf8')]));
const home = pages['index.html'], support = pages['support.html'], privacy = pages['privacy.html'];

test('all six mode and gameplay-video labels describe free play', () => {
  assert.equal((home.match(/class="mode-tag">FREE TO PLAY/g) || []).length, 6);
  assert.doesNotMatch(home, /OPTIONAL IN-APP UNLOCK|THE FREE CORE GAME/);
  assert.match(home, /All game modes, Infinity and every difficulty are free/);
  assert.match(home, /In Classic, checkmate on any board wins/);
});

test('search and social copy identify free modes and the closed Android test', () => {
  assert.match(home, /<title>Chess: Time Wars \| All Game Modes Free<\/title>/);
  for (const attribute of ['name="description"', 'property="og:description"']) {
    const tag = home.match(new RegExp(`<meta ${attribute} content="([^"]+)"`));
    assert.ok(tag);
    assert.match(tag[1], /All rulesets, Infinity and difficulties included/);
    assert.match(tag[1], /Android in closed testing/);
  }
});

test('shared footers offer optional support, not paid game upgrades', () => {
  for (const [name, html] of Object.entries(pages)) {
    const footer = html.slice(html.indexOf('<footer>'));
    assert.match(footer, /All game modes are free in Apple version 1\.0\.3 and later/, name);
    assert.match(footer, /Optional ad removal and coffee tips/, name);
    assert.match(footer, /Android is in closed testing; public release is coming soon/, name);
    assert.doesNotMatch(footer, /Upgrades for the Apple version|In development/, name);
    assert.match(html, /href="assets\/icon\.png\?v=20261103-free-game"/, name);
  }
});

test('support distinguishes free modes, durable ad removal and consumable tips', () => {
  assert.doesNotMatch(support, /Where do I buy upgrades|purchases unlock Causal Collapse|If an item remains locked/);
  assert.match(support, /No purchase or restore is needed for game modes/);
  assert.match(support, /previous Complete Pack owners retain ad removal/);
  assert.match(support, /consumed tips are not restored/);
  assert.match(support, /no gameplay features, subscription, currency or ad-removal benefit/);
});

test('tutorial instructions distinguish pending iOS 1.0.4 from released clients', () => {
  assert.match(support, /iOS 1\.0\.4 or later/);
  assert.match(support, /Start &gt; Rules of Time &gt; Full Tutorial/);
  assert.match(support, /awaiting App Review as of November 3, 2026/);
  assert.match(support, /iOS 1\.0\.3 or earlier/);
  assert.match(support, /Android internal build 16/);
  assert.match(support, /Start &gt; Choose Your Rules &gt; Full Tutorial/);
});

test('banner and post-match disclosures are version scoped and preserve ad-free play', () => {
  assert.match(privacy, /submitted <strong>iOS 1\.0\.4 update<\/strong>, once available/);
  assert.match(privacy, /minimum three-minute gap between full-screen ads/);
  assert.match(privacy, /Active games and tutorials are ad-free/);
  assert.match(privacy, /both banners and full-screen ads after ownership is verified/);
  assert.match(support, /not a claim that the pending update is already public/);
});

test('Android disclosures separate offline, online-only and combined test builds', () => {
  assert.match(privacy, /closed-test build 11 includes optional online play but no commerce SDKs/);
  assert.match(privacy, /internal build 16 combines optional online play/);
  assert.match(privacy, /sample ad units, not revenue units/);
  assert.match(privacy, /Full-screen ad breaks occur only after completed whole matches/);
  assert.match(privacy, /Younger and unknown-age testers remain offline for these optional tests/);
  assert.match(privacy, /commerce opt-in does not enable it/);
});

test('purchase privacy covers repeat consumption without making tips permanent ownership', () => {
  assert.match(privacy, /Coffee tips are verified and consumed with Google so they can be repeated/);
  assert.match(privacy, /consumed tips do not become permanent ad-removal ownership or restorable entitlements/);
  assert.match(privacy, /Beta enrollment alone does not make a transaction free/);
  assert.match(pages['account-deletion.html'], /deleting game data does not refund a tip/);
});

test('public pages do not publish private test enrollment or add checkout or ad scripts', () => {
  for (const [name, html] of Object.entries(pages)) {
    assert.doesNotMatch(html, /play\.google\.com\/apps\/internaltest|testers-community@|<form\b|<iframe\b/, name);
    const sources = [...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(sources, name === 'account-deletion.html' ? ['external-deletion.js?v=20261016'] : [], name);
  }
});

test('the favicon reuses the exact approved borderless asset', () => {
  const hash = createHash('sha256').update(readFileSync(resolve(root, 'assets/icon.png'))).digest('hex');
  assert.equal(hash, 'aec6e096a4872ad7104d819d297e659945d1aeb61de2b2cc1797f60f633a3619');
});

test('HTML IDs are unique and every local asset and fragment resolves', () => {
  const ids = Object.fromEntries(names.map(name => {
    const values = [...pages[name].matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(values).size, values.length, `${name}: duplicate IDs`);
    return [name, new Set(values)];
  }));
  let references = 0;
  for (const [name, html] of Object.entries(pages)) {
    for (const [, reference] of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) {
      const url = new URL(reference.replaceAll('&amp;', '&'), `https://chesstimewars.github.io/${name}`);
      if (url.origin !== 'https://chesstimewars.github.io') continue;
      const local = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
      assert.ok(existsSync(resolve(root, local)), `${name}: missing ${reference}`);
      if (url.hash) assert.ok(ids[local]?.has(decodeURIComponent(url.hash.slice(1))), `${name}: missing fragment ${reference}`);
      references++;
    }
  }
  assert.ok(references >= 80, `Expected all local references, checked ${references}`);
});
