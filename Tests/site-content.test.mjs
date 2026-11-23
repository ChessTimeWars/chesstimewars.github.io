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

test('search and social copy identify free play across both platforms', () => {
  assert.match(home, /<title>Chess: Time Wars \| All Game Modes Free<\/title>/);
  for (const attribute of ['name="description"', 'property="og:description"']) {
    const tag = home.match(new RegExp(`<meta ${attribute} content="([^"]+)"`));
    assert.ok(tag);
    assert.match(tag[1], /All rulesets, Infinity and difficulties included/);
    assert.match(tag[1], /iPhone, iPad and Android/);
  }
});

test('Android download links identify the live public Play listing', () => {
  assert.match(home, /id="download"/);
  const playLinks = [...home.matchAll(/<a class="[^"]*google-play-link[^"]*" href="([^"]+)">Download on Google Play/g)];
  assert.equal(playLinks.length, 2);
  for (const [, href] of playLinks) {
    assert.equal(href, 'https://play.google.com/store/apps/details?id=com.chesstimewars.android');
  }
  assert.match(home, /IPHONE, IPAD &amp; ANDROID \/ AVAILABLE NOW/);
  assert.match(home, /Availability varies by country or region/);
  assert.match(home, /href="https:\/\/apps\.apple\.com\/app\/chess-time-wars\/id6818296008">Download on the App Store/);
  assert.match(support, /href="https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.chesstimewars\.android">download Chess: Time Wars on Google Play/);
  for (const html of [home, support]) {
    assert.doesNotMatch(html, /Check Google Play availability|The public (?:Android|Play) listing may not appear/);
  }
});

test('shared footers identify free play and regional store availability', () => {
  for (const [name, html] of Object.entries(pages)) {
    const footer = html.slice(html.indexOf('<footer>'));
    assert.match(footer, /All game modes are free/, name);
    assert.match(footer, /href="\.\/#download">iPhone, iPad &amp; Android downloads/, name);
    assert.match(footer, /Store availability varies by country or region/, name);
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
  assert.match(support, /Restore Google Play Purchases/);
});

test('tutorial instructions explain the current route on both platforms', () => {
  assert.match(support, /Start &gt; Rules of Time &gt; Full Tutorial/);
  assert.match(support, /Start &gt; Choose Your Rules &gt; Full Tutorial/);
});

test('both platforms describe safe-screen banners, post-match ads and verified ad removal', () => {
  assert.match(privacy, /Banners may appear on Home, in the pre-match lobby and on completed-match Results/);
  assert.match(privacy, /minimum three-minute gap between full-screen ads/);
  assert.match(privacy, /Active games and tutorials are ad-free/);
  assert.match(privacy, /both banners and full-screen ads after ownership is verified/);
  assert.match(support, /Active games, tutorials and partial Infinity results stay ad-free/);
  assert.match(support, /at least three minutes between full-screen ads/);
});

test('Android disclosures separate offline play, optional purchases and ads, and adult online play', () => {
  assert.match(privacy, /computer play on Android does not require a separate game account/);
  assert.match(privacy, /Google Play purchases and Google AdMob advertising are available only for players who select the adult age group/);
  assert.match(privacy, /Younger players and players who have not selected an age group can play offline without app-initiated requests/);
  assert.match(privacy, /checks applicable regional privacy choices before ad requests/);
  assert.match(privacy, /Optional online play separately requires the online notice and explicit Google sign-in/);
  assert.match(privacy, /after a completed whole match, with at least three minutes between full-screen ads/);
  assert.match(privacy, /unknown Play ownership fails closed/);
  assert.match(support, /choose a ruleset, then tap Play Online/);
});

test('purchase privacy covers repeat consumption without making tips permanent ownership', () => {
  assert.match(privacy, /Coffee tips are verified and consumed with Google so they can be repeated/);
  assert.match(privacy, /consumed tips do not become permanent ad-removal ownership or restorable entitlements/);
  assert.match(privacy, /You must choose an item and confirm any charge through Google Play/);
  assert.match(pages['account-deletion.html'], /deleting game data does not refund a tip/);
});

test('public pages do not publish private test enrollment or add checkout or ad scripts', () => {
  for (const [name, html] of Object.entries(pages)) {
    const publicCopy = html.replace(/<[^>]*>/g, ' ');
    assert.doesNotMatch(publicCopy, /\bbeta\b|\bclosed.testing\b|\btest ads\b|\binternal (?:build|testing)\b|\bawaiting App Review\b/i, name);
    assert.doesNotMatch(html, /play\.google\.com\/apps\/(?:internaltest|testing)|testers-community@|<form\b|<iframe\b/, name);
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
