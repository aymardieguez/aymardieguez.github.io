import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createDraft } from '../assets/contact.mjs';
import { escapeHtml } from '../src/components.mjs';

const root = resolve('dist');
async function htmlFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith('.html')) result.push(path);
  }
  return result;
}
const pages = await htmlFiles(root);

test('Contact keeps accented text and reserved characters in the message, not URL parameters', () => {
  const message = 'Quiero una aplicación de diseño & datos. ¿Hablamos? #idea + equipo';
  const draft = createDraft({ name: 'María', kind: 'Aplicación web', message }, 'owner@example.com');
  for (const href of [draft.mailto, draft.gmail]) {
    const url = new URL(href);
    assert.ok(url.searchParams.get('body').includes(message));
    assert.ok(url.searchParams.get('body').includes('María'));
    assert.equal(url.hash, '');
    assert.equal(url.searchParams.has('bcc'), false);
  }
  assert.equal(new URL(draft.gmail).searchParams.get('to'), 'owner@example.com');
});

test('Contact rejects blank and excessive input', () => {
  const valid = { name: 'Ana', kind: 'Web profesional', message: 'Necesito una web para mi negocio.' };
  for (const value of [
    { ...valid, name: '   ' },
    { ...valid, name: 'a'.repeat(81) },
    { ...valid, message: '   ' },
    { ...valid, message: 'x'.repeat(1501) },
  ]) {
    assert.throws(() => createDraft(value, 'owner@example.com'));
  }
});

test('HTML helper escapes text and attribute delimiters', () => {
  assert.equal(
    escapeHtml('<img src="x" onerror=\'x\'>&'),
    '&lt;img src=&quot;x&quot; onerror=&#39;x&#39;&gt;&amp;',
  );
});

test('Every page is indexable HTML with unique metadata, one main and one h1', async () => {
  const titles = new Set();
  assert.equal(pages.length, 6);
  for (const path of pages) {
    const html = await readFile(path, 'utf8');
    assert.match(html, /<html lang="es">/);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path);
    assert.equal((html.match(/<main[ >]/g) || []).length, 1, path);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    assert.ok(!titles.has(title), 'Titles must be unique');
    titles.add(title);
    assert.match(html, /<meta name="description" content="[^"<>]+">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/aymardieguez.github.io\//);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${path}`);
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(image[0], /alt="[^"]+"/);
      assert.match(image[0], /width="\d+"/);
      assert.match(image[0], /height="\d+"/);
    }
  }
});

test('All internal links, images, scripts, styles and fragment targets resolve', async () => {
  for (const path of pages) {
    const html = await readFile(path, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"?]+)"/g)) {
      const reference = match[1];
      if (/^[a-z]+:/i.test(reference)) continue;
      const [url, fragment] = reference.split('#');
      let target = url
        ? url.startsWith('/')
          ? resolve(root, `.${url}`)
          : resolve(dirname(path), url)
        : path;
      if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
      assert.ok((await stat(target)).isFile(), `${path}: ${reference}`);
      if (fragment)
        assert.ok(
          (await readFile(target, 'utf8')).includes(`id="${fragment}"`),
          `${path}: missing ${reference}`,
        );
    }
  }
});

test('Production has no external runtime scripts and stays within transfer budgets', async () => {
  for (const path of pages) {
    const html = await readFile(path, 'utf8');
    assert.doesNotMatch(html, /<script[^>]+src="https?:/);
    assert.ok(Buffer.byteLength(html) < 45000);
  }
  const jsBytes =
    (await stat(resolve(root, 'assets/site.mjs'))).size +
    (await stat(resolve(root, 'assets/contact.mjs'))).size;
  assert.ok(jsBytes < 14000, 'JavaScript budget: 14 KB uncompressed');
  assert.ok((await stat(resolve(root, 'css/style.css'))).size < 50000, 'CSS budget: 50 KB');
  for (const image of await readdir(resolve(root, 'assets/projects')))
    assert.ok(
      (await stat(resolve(root, 'assets/projects', image))).size < 250000,
      `Image too large: ${image}`,
    );
});
