export function createDraft({ name, kind, message }, email) {
  const cleanName = String(name ?? '')
    .trim()
    .replace(/[\r\n]+/g, ' ');
  const cleanKind = String(kind ?? '')
    .trim()
    .replace(/[\r\n]+/g, ' ');
  const cleanMessage = String(message ?? '').trim();
  if (!cleanName || cleanName.length > 80 || cleanMessage.length < 15 || cleanMessage.length > 1500) {
    throw new Error('Completa tu nombre y describe el proyecto entre 15 y 1500 caracteres.');
  }
  const subject = `Proyecto: ${cleanKind}`;
  const body = `Hola Aymar,\n\nSoy ${cleanName}. Me gustaría hablar contigo sobre ${cleanKind.toLowerCase()}.\n\n${cleanMessage}\n\nGracias,\n${cleanName}`;
  return {
    subject,
    body,
    mailto: `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
