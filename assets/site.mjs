import { createDraft } from './contact.mjs';

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.hidden = false;
navigation.dataset.enhanced = '';
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.dataset.open = 'false';
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.dataset.open = String(open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});

const blueprintControls = document.querySelector('.blueprint-controls');
if (blueprintControls) blueprintControls.hidden = false;

const modes = {
  web: ['Una interfaz clara para que tu negocio se entienda.', 'José Vale', '/proyectos/jose-vale/'],
  app: ['Interfaz, lógica y datos trabajando juntos.', 'VIAJA', '/proyectos/viaja/'],
  api: [
    'Servicios conectados para resolver una necesidad.',
    'La integración de Gemini en VIAJA',
    '/proyectos/viaja/#desarrollo',
  ],
};
document.querySelectorAll('[data-layer]').forEach((button) => {
  button.addEventListener('click', () => {
    const [description, name, href] = modes[button.dataset.layer];
    document.querySelector('.blueprint').dataset.active = button.dataset.layer;
    document
      .querySelectorAll('[data-layer]')
      .forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#blueprint-description').textContent = description;
    const projectLink = document.querySelector('#blueprint-project');
    projectLink.textContent = `${name} ↗`;
    projectLink.href = href;
  });
});

const form = document.querySelector('#project-form');
if (form) {
  form.hidden = false;
  const result = document.querySelector('#draft-result');
  const message = form.elements.message;
  const name = form.elements.name;
  [message, name].forEach((input) => input.addEventListener('input', () => input.setCustomValidity('')));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!name.value.trim()) {
      name.setCustomValidity('Escribe tu nombre.');
      name.reportValidity();
      return;
    }
    if (message.value.trim().length < 15) {
      message.setCustomValidity('Añade al menos 15 caracteres para explicar tu idea.');
      message.reportValidity();
      return;
    }
    const email = document.querySelector('.contact-email').getAttribute('href').replace('mailto:', '');
    const draft = createDraft(Object.fromEntries(new FormData(form)), email);
    document.querySelector('#draft-email').href = draft.mailto;
    document.querySelector('#draft-gmail').href = draft.gmail;
    form.hidden = true;
    result.hidden = false;
    document.querySelector('#draft-email').focus();
  });
  document.querySelector('#edit-brief').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    message.focus();
  });
}

// Without JS, all content remains visible. Only entering elements receive motion.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-ready');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll('.project, .service-row, .process li')
    .forEach((element) => observer.observe(element));
}
