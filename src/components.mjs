import { profile } from './content.mjs';

export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
export const arrow =
  '<svg class="icon icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg>';
export const link = (href, label, className = 'text-link') =>
  `<a class="${className}" href="${escapeHtml(href)}">${label}${arrow}</a>`;
export const projectPath = (slug) => `/proyectos/${slug}/`;

export function projectImage(project, { eager = false, sizes = '(max-width: 760px) 92vw, 70vw' } = {}) {
  return `<img src="/assets/projects/${project.slug}-1440.webp" srcset="/assets/projects/${project.slug}-720.webp 720w, /assets/projects/${project.slug}-1440.webp 1440w" sizes="${sizes}" width="1440" height="${project.slug === 'viaja' ? 701 : project.slug === 'jose-vale' ? 713 : 717}" alt="${escapeHtml(project.imageAlt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

function header() {
  return `<a class="skip-link" href="#contenido">Saltar al contenido</a>
  <header class="site-header"><div class="shell header-inner">
    <a class="brand" href="/" aria-label="Aymar Salgado, inicio"><span class="brand-mark" aria-hidden="true">a<span>·</span></span><span>Aymar Salgado<span class="brand-sub">Desarrollador de software</span></span></a>
    <button class="menu-toggle" type="button" aria-controls="navigation" aria-expanded="false" hidden>Menú <span class="menu-icon" aria-hidden="true"></span></button>
    <nav id="navigation" aria-label="Principal"><a href="/#proyectos">Trabajo</a><a href="/#servicios">Servicios</a><a href="/#sobre-mi">Sobre mí</a>${link('/#contacto', 'Hablemos', 'nav-cta')}</nav>
  </div></header>`;
}

function footer() {
  return `<footer class="site-footer shell"><a class="footer-name" href="/">Aymar Salgado Dieguez</a><span>Software con propósito.</span><div>${link(profile.github, 'GitHub')}${link(profile.linkedin, 'LinkedIn')}<a href="/privacidad/">Privacidad</a></div></footer>`;
}

export function layout({
  title,
  description,
  path = '/',
  body,
  image = '/assets/social.jpg',
  schema,
  noindex = false,
}) {
  const url = profile.url + path;
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${profile.url}/#aymar`,
    name: profile.name,
    url: profile.url,
    jobTitle: 'Desarrollador de software',
    sameAs: [profile.github, profile.linkedin],
  };
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="theme-color" content="#f4f3ec">
<link rel="canonical" href="${url}"><link rel="icon" href="/logo.svg" type="image/svg+xml"><link rel="stylesheet" href="/css/style.css">
<meta property="og:type" content="website"><meta property="og:locale" content="es_ES"><meta property="og:site_name" content="Aymar Salgado"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${profile.url}${image}"><meta property="og:image:alt" content="${escapeHtml(title)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${profile.url}${image}">
${noindex ? '<meta name="robots" content="noindex, follow">' : ''}
<script type="application/ld+json">${JSON.stringify(schema || person).replace(/</g, '\\u003c')}</script><script type="module" src="/assets/site.mjs"></script>
</head><body>${header()}<main id="contenido" tabindex="-1">${body}</main>${footer()}</body></html>\n`;
}

export function contactCta(title = '¿Necesitas algo parecido?') {
  return `<section class="case-cta shell"><p class="eyebrow">El siguiente proyecto puede ser el tuyo</p><h2>${title}</h2><p>Cuéntame qué necesitas construir y veamos qué solución tiene sentido.</p>${link('/#contacto', 'Cuéntame tu proyecto', 'button primary')}</section>`;
}
