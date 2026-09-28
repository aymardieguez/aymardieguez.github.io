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
    projectLink.querySelector('span').textContent = name;
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
    document.querySelector('#draft-subject').textContent = draft.subject;
    document.querySelector('#draft-preview').value = draft.body;
    document.querySelector('#draft-status').textContent = '';
    form.hidden = true;
    result.hidden = false;
    document.querySelector('#draft-heading').focus();
  });
  document.querySelector('#edit-brief').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    message.focus();
  });
  document.querySelector('#copy-draft').addEventListener('click', async () => {
    const preview = document.querySelector('#draft-preview');
    const status = document.querySelector('#draft-status');
    try {
      await window.navigator.clipboard.writeText(preview.value);
      status.textContent = 'Mensaje copiado. Pégalo en tu correo y envíalo cuando quieras.';
    } catch {
      preview.focus();
      preview.select();
      status.textContent = 'Selecciona Copiar en tu dispositivo o pulsa Ctrl+C (⌘C en Mac).';
    }
  });
  const copyEmail = document.querySelector('#copy-email');
  copyEmail.hidden = false;
  copyEmail.addEventListener('click', async () => {
    const emailLink = document.querySelector('.contact-email');
    const emailText = emailLink.querySelector('span');
    const status = document.querySelector('#email-copy-status');
    try {
      await window.navigator.clipboard.writeText(emailText.textContent);
      status.textContent = 'Dirección copiada.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(emailText);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Selecciona Copiar en tu dispositivo o pulsa Ctrl+C (⌘C en Mac).';
    }
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
