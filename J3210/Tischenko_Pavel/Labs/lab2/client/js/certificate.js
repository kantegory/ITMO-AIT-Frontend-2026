import { AuthApi } from "./api.js";
import { getAuth } from "./storage.js";
import { initTheme } from "./theme.js";
import { qs, setText, showAlert, clearAlert, escapeHtml } from "./ui.js";

function getCertId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
}

async function apiGetCert(id) {
  const auth = getAuth();
  const res = await fetch(`/api/certificates/${encodeURIComponent(id)}`, {
    headers: {
      Accept: "application/json",
      Authorization: auth?.token ? `Bearer ${auth.token}` : "",
    },
  });
  if (!res.ok) throw new Error(`Не удалось загрузить сертификат (${res.status})`);
  return await res.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  const alertBox = qs('[data-cert="alert"]');
  clearAlert(alertBox);

  const auth = getAuth();
  if (!auth?.token) {
    window.location.href = "/auth.html#login";
    return;
  }

  const id = getCertId();
  if (!id) {
    showAlert(alertBox, { type: "warning", message: "Не указан id сертификата." });
    return;
  }

  const [me, cert] = await Promise.all([
    AuthApi.me().catch(() => null),
    apiGetCert(id).catch(() => null),
  ]);

  if (!me || !cert) {
    showAlert(alertBox, { type: "danger", message: "Не удалось загрузить данные сертификата." });
    return;
  }

  setText(qs('[data-cert="title"]'), cert.title || "Сертификат");
  setText(qs('[data-cert="name"]'), [me.firstName, me.lastName].filter(Boolean).join(" ") || me.email);
  setText(qs('[data-cert="date"]'), `Дата: ${String(cert.issuedAt || "").slice(0, 10)}`);

  const btn = qs("#printBtn");
  if (btn) {
    btn.addEventListener("click", () => window.print());
  }

  document.title = `Подвал обучения - ${escapeHtml(cert.title || "Сертификат")}`;
});

