export function qs(sel, root = document) {
  return root.querySelector(sel);
}

export function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

export function setText(el, value) {
  if (!el) return;
  el.textContent = value;
}

export function formatRub(value) {
  try {
    return new Intl.NumberFormat("ru-RU").format(value);
  } catch {
    return String(value);
  }
}

export function showAlert(container, { type = "danger", title, message } = {}) {
  if (!container) return;
  container.innerHTML = `
    <div class="alert alert-${type} small mb-3" role="alert">
      ${title ? `<div class="fw-semibold mb-1">${escapeHtml(title)}</div>` : ""}
      ${message ? `<div>${escapeHtml(message)}</div>` : ""}
    </div>
  `;
}

export function clearAlert(container) {
  if (!container) return;
  container.innerHTML = "";
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

