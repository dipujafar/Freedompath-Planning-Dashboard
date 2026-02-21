export function sanitizeAllHTML(input: string) {
   if (!input || typeof input !== 'string') return '';

  // 1. Decode HTML entities (&lt;p&gt; → <p>)
  const textarea = typeof document !== 'undefined'
    ? document.createElement('textarea')
    : null;

  let decoded = input;
  if (textarea) {
    textarea.innerHTML = input;
    decoded = textarea.value;
  } else {
    // Node.js fallback (minimal)
    decoded = input
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }

  // 2. Extract paragraph contents
  const matches = decoded.match(/<p>([\s\S]*?)<\/p>/gi);
  if (!matches) return '';

  const result = [];
  let buffer = '';

  for (const block of matches) {
    const text = block
      .replace(/<\/?p>/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!text) continue;

    buffer += (buffer ? ' ' : '') + text;

    // Commit paragraph when sentence is complete
    if (/[.!?]$/.test(text)) {
      result.push(`<p>${buffer}</p>`);
      buffer = '';
    }
  }

  if (buffer) {
    result.push(`<p>${buffer}</p>`);
  }

  return result.join('');
}

export function capitalizeParagraphs(html: string) {
  return html.replace(/<p>([^<])/gi, (_, char) => `<p>${char.toUpperCase()}`);
}
