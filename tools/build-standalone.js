#!/usr/bin/env node
/* Inline the game into one self-contained HTML file.
 *
 *   node tools/build-standalone.js                 -> dist/sofia-bennett-only.html
 *   node tools/build-standalone.js --artifact out  -> body-fragment form (no
 *                                                     doctype/html/head/body),
 *                                                     for hosts that supply
 *                                                     their own page skeleton
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const args = process.argv.slice(2);
const artifact = args.includes('--artifact');
const outArg = args.find((a) => !a.startsWith('--'));

let html = read('index.html');
const css = read('css/styles.css');
const js = ['js/names.js', 'js/audio.js', 'js/game.js'].map(read).join('\n');

// A standalone file has no sibling sw.js to register.
const jsInline = js.replace(
  /\n  if \('serviceWorker' in navigator[\s\S]*?\n  }\n/,
  '\n'
);
if (jsInline === js) throw new Error('service-worker block not found — did game.js change?');

// Drop every external reference; there are no sibling files any more.
html = html
  .replace(/^\s*<link rel="manifest"[^>]*>\n/m, '')
  .replace(/^\s*<link rel="icon"[^>]*>\n/m, '')
  .replace(/^\s*<link rel="apple-touch-icon"[^>]*>\n/m, '')
  .replace(/^\s*<link rel="stylesheet" href="css\/styles\.css">\n/m,
           '<style>\n' + css + '\n</style>\n')
  .replace(/^\s*<script src="js\/names\.js"><\/script>\n\s*<script src="js\/audio\.js"><\/script>\n\s*<script src="js\/game\.js"><\/script>\n/m,
           '<script>\n' + jsInline + '\n</script>\n');

for (const leftover of [/<link /, /<script src=/]) {
  if (leftover.test(html)) throw new Error('an external reference survived inlining: ' + leftover);
}

let out;
if (artifact) {
  // Keep <title> and <style> (hosts hoist them), drop the page skeleton.
  const title = html.match(/<title>[\s\S]*?<\/title>/)[0];
  const style = html.match(/<style>[\s\S]*?<\/style>/)[0];
  const body = html.match(/<body>([\s\S]*)<\/body>/)[1];
  out = title + '\n' + style + '\n' + body.trim() + '\n';
} else {
  out = html;
}

const dest = outArg || (artifact ? 'dist/sofia-bennett-only.artifact.html'
                                 : 'dist/sofia-bennett-only.html');
fs.mkdirSync(path.dirname(path.join(root, dest)), { recursive: true });
fs.writeFileSync(path.join(root, dest), out);
console.log(`${dest}  ${(Buffer.byteLength(out) / 1024).toFixed(1)} KB`);
