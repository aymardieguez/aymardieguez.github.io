import { mkdir, writeFile, copyFile, readdir, stat, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { profile, projects } from '../src/content.mjs';
import { layout } from '../src/components.mjs';
import { home } from '../src/home.mjs';
import { caseStudy, privacy } from '../src/case-study.mjs';

async function copyTree(source, destination) {
  if ((await stat(source)).isDirectory()) {
    await mkdir(destination, { recursive: true });
    for (const name of await readdir(source)) await copyTree(`${source}/${name}`, `${destination}/${name}`);
  } else {
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }
}

const pages = [
  [
    'index.html',
    layout({
      title: 'Desarrollo web y aplicaciones | Aymar Salgado',
      description:
        'Diseño y desarrollo web para negocios y profesionales. Aymar Salgado, graduado en DAW: webs adaptadas al móvil y aplicaciones a medida.',
      body: home(),
    }),
  ],
  ...projects.map((project) => {
    const path = `/proyectos/${project.slug}/`;
    return [
      `proyectos/${project.slug}/index.html`,
      layout({
        title: `${project.name} · ${project.category} | Aymar Salgado`,
        description: project.summary,
        path,
        body: caseStudy(project),
        image: `/assets/projects/${project.slug}-1440.webp`,
        schema: {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.name,
          description: project.summary,
          url: profile.url + path,
          image: `${profile.url}/assets/projects/${project.slug}-1440.webp`,
          author: { '@type': 'Person', name: profile.name, url: profile.url },
          inLanguage: 'es',
        },
      }),
    ];
  }),
  [
    'privacidad/index.html',
    layout({
      title: 'Privacidad | Aymar Salgado',
      description: 'Cómo funciona el contacto y qué datos utiliza este portfolio.',
      path: '/privacidad/',
      body: privacy(),
    }),
  ],
  [
    '404.html',
    layout({
      title: 'Página no encontrada | Aymar Salgado',
      description: 'Vuelve al portfolio para explorar proyectos y servicios.',
      path: '/404.html',
      noindex: true,
      body: '<section class="legal shell section-space"><p class="eyebrow">Error 404</p><h1>Por aquí no era.</h1><p>Esta página no existe o ha cambiado de dirección.</p><a class="button primary" href="/">Volver al portfolio ↗</a></section>',
    }),
  ],
];

for (const [path, html] of pages) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, html);
}
const urls = ['/', ...projects.map((project) => `/proyectos/${project.slug}/`), '/privacidad/'];
await writeFile(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>${profile.url}${path}</loc></url>`).join('')}</urlset>\n`,
);
await writeFile(
  'robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /src/\nDisallow: /scripts/\nDisallow: /tests/\nDisallow: /docs/\nSitemap: ${profile.url}/sitemap.xml\n`,
);
await writeFile('.nojekyll', '');
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const path of [
  'index.html',
  '404.html',
  'proyectos',
  'privacidad',
  'css',
  'logo.svg',
  'robots.txt',
  'sitemap.xml',
  '.nojekyll',
])
  await copyTree(path, `dist/${path}`);
await mkdir('dist/assets', { recursive: true });
for (const path of ['projects', 'site.mjs', 'contact.mjs', 'social.jpg'])
  await copyTree(`assets/${path}`, `dist/assets/${path}`);
console.log(
  `Built ${pages.length} static pages. Root supports existing Pages publishing; dist contains only production assets.`,
);
