import { AuthApi, CertificatesApi, CoursesApi, EnrollmentsApi } from "./api.js";
import { getAuth } from "./storage.js";
import { initSessionUI } from "./session.js";
import { initTheme } from "./theme.js";
import { escapeHtml, formatRub, qs, setText, showAlert, clearAlert } from "./ui.js";

async function ensureAuth() {
  const auth = getAuth();
  if (!auth?.token) {
    window.location.href = "/auth.html#login";
    return null;
  }
  try {
    return await AuthApi.me();
  } catch {
    window.location.href = "/auth.html#login";
    return null;
  }
}

function renderProfile(me) {
  setText(qs("[data-profile='name']"), [me.firstName, me.lastName].filter(Boolean).join(" ") || me.email);
  setText(qs("[data-profile='role']"), me.role === "teacher" ? "тренер" : "студент");
}

async function renderEnrollments(me) {
  const box = qs("[data-student='alert']");
  clearAlert(box);
  const grid = qs("[data-student='courses']");
  if (!grid) return;

  const enrollments = await EnrollmentsApi.my();
  const courses = await CoursesApi.list();
  const courseMap = new Map(courses.map((c) => [c.id, c]));

  if (!enrollments.length) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-secondary small mb-0" role="status">
          Пока нет купленных курсов. Открой каталог и добавь курс на странице курса.
        </div>
      </div>
    `;
    setText(qs("[data-stats='active']"), "0");
    return;
  }

  setText(qs("[data-stats='active']"), String(enrollments.length));

  grid.innerHTML = enrollments
    .map((e) => {
      const c = courseMap.get(e.courseId);
      if (!c) return "";
      const pct = Math.round((Number(e.progress) || 0) * 100);
      return `
        <div class="col-md-6">
          <div class="course-card p-3 h-100">
            <h3 class="h6 mb-1">${escapeHtml(c.title)}</h3>
            <p class="card-text small text-muted mb-2">${escapeHtml(c.shortDescription || "")}</p>
            <div class="mb-2">
              <span class="small text-muted">Прогресс: ${pct}%</span>
              <div class="progress mt-1" aria-label="Прогресс по курсу">
                <div class="progress-bar" style="width: ${pct}%"></div>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <a href="course.html?id=${encodeURIComponent(c.id)}" class="btn btn-sm btn-outline-soft pill">
                Перейти к курсу
              </a>
              <span class="small text-muted">${formatRub(c.price)} ₽</span>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  const avgEl = qs('[data-progress="avg"]');
  const lastEl = qs('[data-progress="last"]');
  const nextEl = qs('[data-progress="next"]');

  const avg =
    enrollments.reduce((sum, e) => sum + (Number(e.progress) || 0), 0) /
    enrollments.length;
  setText(avgEl, `${Math.round(avg * 100)}%`);

  const last = [...enrollments]
    .sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")))[0];
  const lastCourse = last ? courseMap.get(last.courseId) : null;
  setText(
    lastEl,
    lastCourse
      ? `продолжал курс «${lastCourse.title}»`
      : "—"
  );

  const next = [...enrollments].sort((a, b) => (Number(a.progress) || 0) - (Number(b.progress) || 0))[0];
  const nextCourse = next ? courseMap.get(next.courseId) : null;
  setText(
    nextEl,
    nextCourse
      ? `зайти в обучение по курсу «${nextCourse.title}»`
      : "—"
  );
}

async function renderCertificates() {
  const pane = qs("#cert-pane");
  if (!pane) return;
  const certs = await CertificatesApi.my();
  if (!certs.length) {
    pane.innerHTML = `<div class="small text-muted">Пока нет сертификатов.</div>`;
    return;
  }
  pane.innerHTML = `
    <p class="text-muted mb-2">Твои сертификаты:</p>
    ${certs
      .map(
        (c) => `
      <div class="dashboard-chip mb-2">
        ${escapeHtml(c.title)}
        <span class="d-block small text-muted">Дата: ${escapeHtml(String(c.issuedAt).slice(0, 10))}</span>
        <a class="btn btn-sm btn-outline-soft pill mt-2" href="certificate.html?id=${encodeURIComponent(c.id)}">
          Открыть сертификат
        </a>
      </div>
    `
      )
      .join("")}
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await initSessionUI();

  const me = await ensureAuth();
  if (!me) return;
  if (me.role !== "student" && me.role !== "teacher") {
    showAlert(qs("[data-student='alert']"), { type: "warning", message: "Неизвестная роль пользователя." });
    return;
  }
  if (me.role === "teacher") {
    window.location.href = "/teacher.html";
    return;
  }

  renderProfile(me);
  await renderEnrollments(me);
  await renderCertificates();
});

