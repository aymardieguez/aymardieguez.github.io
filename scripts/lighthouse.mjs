import { spawn } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

await mkdir('test-results', { recursive: true });
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  env: { ...process.env, PORT: '4174' },
  stdio: 'inherit',
});
try {
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      ready = (await fetch('http://127.0.0.1:4174')).ok;
    } catch {
      /* Server is starting. */
    }
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!ready) throw new Error('Preview server did not start');
  const audit = spawn(
    process.execPath,
    [
      'node_modules/lighthouse/cli/index.js',
      'http://127.0.0.1:4174',
      '--output=html',
      '--output=json',
      '--output-path=test-results/lighthouse',
      '--chrome-flags=--headless --no-sandbox',
      '--quiet',
    ],
    { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, stdio: 'inherit' },
  );
  const code = await new Promise((resolve) => audit.on('exit', resolve));
  if (code !== 0) throw new Error(`Lighthouse exited with code ${code}`);
  const report = JSON.parse(await readFile('test-results/lighthouse.report.json', 'utf8'));
  for (const category of Object.values(report.categories)) {
    console.log(`${category.title}: ${Math.round(category.score * 100)}/100`);
  }
  for (const key of ['largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time']) {
    console.log(`${report.audits[key].title}: ${report.audits[key].displayValue}`);
  }
} finally {
  server.kill();
}
