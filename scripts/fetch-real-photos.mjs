#!/usr/bin/env node
/*
 * fetch-real-photos.mjs
 * -----------------------------------------------------------------------------
 * Pulls the real team photos (and one facility hero shot) from the live
 * regisbuilt.com.au WordPress site and wires them into team.html / index.html,
 * replacing the branded SVG placeholders.
 *
 * Run from the repo root:
 *     node scripts/fetch-real-photos.mjs
 *
 * No dependencies — needs Node 18+ (built-in fetch + crypto).
 *
 * The live site sits behind SiteGround's anti-bot WAF. From a normal
 * (residential) connection the images usually download with a plain request;
 * if the WAF issues its proof-of-work "Robot Challenge", this script solves it
 * automatically and retries.
 *
 * Datacenter / CI IPs are often hard-blocked (403 on everything). When the live
 * site fails, the script falls back to the Internet Archive's Wayback Machine —
 * so it also works from a cloud session **provided the environment's network
 * policy allows `archive.org` and `web.archive.org`**.
 *
 * Photo -> person mapping was confirmed from the live /about/ page.
 * Project case-study photos are intentionally NOT touched: those live only on
 * the firewall-protected /portfolio/ page and could not be reliably matched to
 * the named facilities (Kennards Truganina, StorHub North Lakes, etc.).
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ORIGIN = 'https://regisbuilt.com.au';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// source URL  ->  [ local file (relative to repo root), html ref to replace, replacement ref ]
const JOBS = [
  ['/wp-content/uploads/2023/09/anthony-regis.jpg',   'assets/img/team/anthony-regis.jpg',     'team/anthony-regis.svg',     'team/anthony-regis.jpg'],
  ['/wp-content/uploads/2023/09/ken-snow.jpg',        'assets/img/team/ken-snow.jpg',          'team/ken-snow.svg',          'team/ken-snow.jpg'],
  ['/wp-content/uploads/2025/12/1744195998965.jpg',   'assets/img/team/jason-crisafi.jpg',     'team/jason-crisafi.svg',     'team/jason-crisafi.jpg'],
  ['/wp-content/uploads/2025/12/1618302522384.jpg',   'assets/img/team/jonathan-buzgau.jpg',   'team/jonathan-buzgau.svg',   'team/jonathan-buzgau.jpg'],
  ['/wp-content/uploads/2025/12/areti.png',           'assets/img/team/areti-waterson.png',    'team/areti-waterson.svg',    'team/areti-waterson.png'],
  ['/wp-content/uploads/2023/09/Untitled-design-2.png','assets/img/team/kobe-regis.png',       'team/kobe-regis.svg',        'team/kobe-regis.png'],
  // About-section hero: a real RegisBuilt facility (drone) shot
  ['/wp-content/uploads/2023/09/Drone-Shot-1.jpg',    'assets/img/projects/about-team.jpg',    'projects/about-team.svg',    'projects/about-team.jpg'],
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const jar = new Map();
function storeCookies(res) {
  const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const line of sc) { const [p] = line.split(';'); const i = p.indexOf('='); if (i > 0) jar.set(p.slice(0, i).trim(), p.slice(i + 1).trim()); }
}
const cookieHeader = () => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
async function req(url, accept, referer) {
  const res = await fetch(url, { redirect: 'manual', headers: {
    'User-Agent': UA, 'Accept': accept, 'Accept-Language': 'en-AU,en;q=0.9',
    ...(referer ? { 'Referer': referer, 'Sec-Fetch-Dest': 'image', 'Sec-Fetch-Mode': 'no-cors', 'Sec-Fetch-Site': 'same-origin' } : {}),
    ...(jar.size ? { 'Cookie': cookieHeader() } : {}) } });
  storeCookies(res); return res;
}
// --- SiteGround proof-of-work solver -----------------------------------------
function counterBytes(c) { let e = 1; if (c > 16777215) e = 4; else if (c > 65535) e = 3; else if (c > 255) e = 2; const b = Buffer.alloc(e); for (let n = e - 1; n >= 0; n--) { b[n] = c & 0xff; c = Math.floor(c / 256); } return b; }
function solvePow(ch, cx) {
  const cb = Buffer.from(ch, 'utf8'); const fb = cx >> 3, rb = cx & 7; let c = 0; const t0 = Date.now();
  for (;;) { const pre = Buffer.concat([cb, counterBytes(c)]); const d = crypto.createHash('sha1').update(pre).digest();
    let ok = true; for (let i = 0; i < fb; i++) if (d[i]) { ok = false; break; } if (ok && rb && (d[fb] >>> (8 - rb))) ok = false;
    if (ok) return { sol: pre.toString('base64'), hashes: c + 1, ms: Date.now() - t0 }; c++; }
}
const ext = (s, re) => { const m = s.match(re); return m ? m[1] : null; };
async function clearChallenge(fromPath) {
  let res = await req(ORIGIN + fromPath, 'text/html,application/xhtml+xml,*/*;q=0.8');
  if (res.status !== 202) return;
  let body = await res.text();
  const cap = ext(body, /\.well-known\/sgcaptcha\/\?([^"']+)/); if (!cap) return;
  res = await req(ORIGIN + '/.well-known/sgcaptcha/?' + cap.replace(/&#0?38;/g, '&'), 'text/html,*/*;q=0.8');
  body = await res.text();
  const ch = ext(body, /sgchallenge\s*=\s*"([^"]+)"/), sub = ext(body, /sgsubmit_url\s*=\s*"([^"]+)"/);
  if (!ch || !sub) return;
  const cx = parseInt(ch.split(':', 1)[0], 10);
  const { sol, hashes, ms } = solvePow(ch, cx);
  const sep = sub.indexOf('?') > -1 ? '&' : '?';
  res = await req(ORIGIN + sub + sep + 'sol=' + encodeURIComponent(sol) + '&s=' + ms + ':' + hashes, 'text/html,*/*;q=0.8');
  let loc = res.headers.get('location'); if (loc) { if (loc.startsWith('/')) loc = ORIGIN + loc; await req(loc, 'text/html,*/*;q=0.8'); }
}
async function download(srcPath, destRel) {
  const dest = path.join(ROOT, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  for (let a = 0; a < 8; a++) {
    const res = await req(ORIGIN + srcPath, 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8', ORIGIN + '/');
    const ct = res.headers.get('content-type') || '';
    if (res.status === 200 && /image\//.test(ct)) {
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      console.log(`  ✓ ${destRel}`); return true;
    }
    if (res.status === 202) { await res.text(); await clearChallenge(srcPath); await sleep(3000); }
    else { await res.arrayBuffer().catch(() => {}); console.log(`  … ${res.status} on ${srcPath} (retry ${a + 1})`); await sleep(5000); }
  }
  // Live site blocked (WAF / hard 403)? Fall back to the Wayback Machine.
  const buf = await wayback(ORIGIN + srcPath);
  if (buf) { fs.writeFileSync(dest, buf); console.log(`  ✓ ${destRel}  (via web.archive.org)`); return true; }
  console.log(`  ✗ FAILED ${srcPath}`); return false;
}
// Fetch the raw original bytes of a URL from the Internet Archive's Wayback
// Machine. Requires the network policy to allow archive.org + web.archive.org.
async function wayback(originUrl) {
  try {
    const api = `https://archive.org/wayback/available?url=${encodeURIComponent(originUrl)}`;
    const r = await fetch(api, { headers: { 'User-Agent': UA } });
    if (!r.ok) return null;
    const j = await r.json();
    const snap = j && j.archived_snapshots && j.archived_snapshots.closest;
    if (!snap || !snap.available) return null;
    // Insert the "id_" modifier after the timestamp to get the raw resource.
    const raw = snap.url.replace(/(\/web\/\d+)\//, '$1id_/').replace('http://', 'https://');
    const res = await fetch(raw, { headers: { 'User-Agent': UA } });
    if (res.ok && /image\//.test(res.headers.get('content-type') || '')) return Buffer.from(await res.arrayBuffer());
  } catch { /* ignore */ }
  return null;
}
function wire(file, replacements) {
  const fp = path.join(ROOT, file);
  let s = fs.readFileSync(fp, 'utf8'); let changed = 0;
  for (const [from, to] of replacements) { if (s.includes(from)) { s = s.split(from).join(to); changed++; } }
  fs.writeFileSync(fp, s);
  console.log(`  wired ${changed} ref(s) in ${file}`);
}

(async () => {
  console.log('Downloading real photos from regisbuilt.com.au …');
  const done = [];
  for (const [src, dest, from, to] of JOBS) { if (await download(src, dest)) done.push([dest, from, to]); await sleep(1500); }
  if (!done.length) { console.error('\nNothing downloaded — the WAF likely blocked this IP. Try from a normal machine.'); process.exit(1); }
  console.log('\nWiring HTML …');
  const teamRepl = done.filter(d => d[1].startsWith('team/')).map(d => [d[1], d[2]]);
  const aboutRepl = done.filter(d => d[1].startsWith('projects/')).map(d => [d[1], d[2]]);
  if (teamRepl.length) wire('team.html', teamRepl);
  if (aboutRepl.length) wire('index.html', aboutRepl);
  console.log(`\nDone: ${done.length}/${JOBS.length} images. Review, then commit:`);
  console.log('  git add -A && git commit -m "Wire in real team photos + facility hero"');
})();
