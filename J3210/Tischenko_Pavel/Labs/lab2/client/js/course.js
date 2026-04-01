import {
  AssignmentsApi,
  CoursesApi,
  EnrollmentsApi,
  LessonsApi,
  MaterialsApi,
  MessagesApi,
  ThreadsApi,
} from "./api.js";
import { getAuth } from "./storage.js";
import { initSessionUI } from "./session.js";
import { initTheme } from "./theme.js";
import { escapeHtml, formatRub, qs, setText, showAlert, clearAlert } from "./ui.js";

function getCourseId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
}

function getYouTubeEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

async function safeList(promise, fallback = []) {
  try {
    const res = await promise;
    return Array.isArray(res) ? res : fallback;
  } catch {
    return fallback;
  }
}

function setEnrollButtonState(btn, { state, href } = {}) {
  if (!btn) return;
  if (state === "logged_out") {
    btn.disabled = false;
    btn.textContent = "Войти, чтобы начать обучение";
    btn.dataset.state = state;
    return;
  }
  if (state === "idle") {
    btn.disabled = false;
    btn.textContent = "Купить курс";
    btn.dataset.state = state;
    return;
  }
  if (state === "loading") {
    btn.disabled = true;
    btn.textContent = "Оформляем…";
    btn.dataset.state = state;
    return;
  }
  if (state === "enrolled") {
    btn.disabled = false;
    btn.textContent = "Перейти к обучению";
    btn.dataset.state = state;
    btn.dataset.href = href || "/student.html";
  }
}

async function loadCourse() {
  const id = getCourseId();
  const titleEl = qs("[data-course='title']");
  const metaEl = qs("[data-course='meta']");
  const descEl = qs("[data-course='desc']");
  const priceEl = qs("[data-course='price']");
  const videoEl = qs("[data-course='video']");
  const enrollBtn = qs("#enrollBtn");
  const alertBox = qs("[data-course='alert']");
  clearAlert(alertBox);

  if (!id) {
    showAlert(alertBox, { type: "warning", message: "Не указан id курса в URL." });
    return;
  }

  setText(titleEl, "Загружаем курс…");
  const course = await CoursesApi.get(id);
  const allowedStyles = new Set(["powerlifting", "fitness", "crossfit"]);
  const styleKey = String(course?.direction || "").toLowerCase();
  if (allowedStyles.has(styleKey)) {
    document.body.setAttribute("data-course-style", styleKey);
  } else {
    document.body.removeAttribute("data-course-style");
  }
  setText(titleEl, course.title);
  metaEl.innerHTML = `
    <span class="badge-soft px-2 py-1">Направление: ${escapeHtml(course.direction)}</span>
    <span class="badge-soft px-2 py-1">Уровень: ${escapeHtml(course.level)}</span>
    <span class="badge-soft px-2 py-1">Длительность: ${escapeHtml(String(course.durationWeeks))} недель</span>
  `;
  setText(descEl, course.shortDescription || "");
  setText(priceEl, `${formatRub(course.price)} ₽`);

  const auth = getAuth();
  if (!auth?.token) {
    setEnrollButtonState(enrollBtn, { state: "logged_out" });
  } else {
    setEnrollButtonState(enrollBtn, { state: "loading" });
    const enrolled = await EnrollmentsApi.hasCourse(course.id).catch(() => false);
    setEnrollButtonState(enrollBtn, { state: enrolled ? "enrolled" : "idle", href: `/learn.html?courseId=${encodeURIComponent(course.id)}` });
  }

  if (videoEl) {
    videoEl.textContent = "Загружаем видео‑лекции…";
    const lessons = (await safeList(LessonsApi.listByCourse(course.id))).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    const first = lessons[0];
    if (!first?.videoUrl) {
      videoEl.textContent = "Видео‑лекций пока нет.";
    } else {
      const embed = getYouTubeEmbedUrl(first.videoUrl);
      const listHtml = lessons.length
        ? `<div class="mt-3 d-flex flex-wrap gap-2 justify-content-center" aria-label="Список видео-лекций">
            ${lessons
              .map(
                (l) => `<button type="button" class="btn btn-sm btn-outline-soft pill" data-lesson-id="${escapeHtml(l.id)}">${escapeHtml(l.title || "Лекция")}</button>`
              )
              .join("")}
          </div>`
        : "";

      const baseHtml = embed
        ? `<div style="width:100%;height:100%;display:flex;flex-direction:column;gap:12px;">
            <div style="flex:1;min-height:240px;">
              <iframe
                title="${escapeHtml(first.title || "Видео-лекция")}"
                src="${escapeHtml(embed)}"
                style="width:100%;height:100%;border:0;border-radius:0.5rem;"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
            ${listHtml}
          </div>`
        : `Видео‑лекция: <a href="${escapeHtml(first.videoUrl)}" target="_blank" rel="noreferrer">открыть</a>${listHtml}`;

      videoEl.innerHTML = baseHtml;

      try {
        const oembed = new URL("https://www.youtube.com/oembed");
        oembed.searchParams.set("url", first.videoUrl);
        oembed.searchParams.set("format", "json");
        const res = await fetch(oembed.toString(), { headers: { Accept: "application/json" } });
        if (res.ok) {
          const data = await res.json();
          const niceTitle = data?.title;
          if (niceTitle) {
            const iframe = videoEl.querySelector("iframe");
            if (iframe) iframe.setAttribute("title", niceTitle);
          }
        }
      } catch {
      }

      videoEl.querySelectorAll("[data-lesson-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const lessonId = btn.getAttribute("data-lesson-id");
          const lesson = lessons.find((x) => String(x.id) === String(lessonId));
          if (!lesson?.videoUrl) return;
          const iframe = videoEl.querySelector("iframe");
          const nextEmbed = getYouTubeEmbedUrl(lesson.videoUrl);
          if (iframe && nextEmbed) {
            iframe.src = nextEmbed;
            iframe.title = lesson.title || "Видео-лекция";
          } else {
            videoEl.innerHTML = `Видео‑лекция: <a href="${escapeHtml(lesson.videoUrl)}" target="_blank" rel="noreferrer">открыть</a>`;
          }
        });
      });
    }
  }

  const materials = await safeList(MaterialsApi.listByCourse(course.id));
  const assignments = await safeList(AssignmentsApi.listByCourse(course.id));
  const threads = await safeList(ThreadsApi.listByCourse(course.id));

  const materialsPane = qs("#materials-pane");
  if (materialsPane) {
    materialsPane.innerHTML = `
      <p class="text-muted mb-2">Материалы:</p>
      ${materials.length ? `<ul class="list-unstyled text-muted mb-0">
        ${materials.map((m) => `<li class="mb-1">· <a href="${escapeHtml(m.url)}" target="_blank" rel="noreferrer">${escapeHtml(m.title)}</a></li>`).join("")}
      </ul>` : `<div class="small text-muted">Пока нет материалов.</div>`}
    `;
  }

  const tasksPane = qs("#tasks-pane");
  if (tasksPane) {
    tasksPane.innerHTML = `
      <p class="text-muted mb-2">Задания:</p>
      ${assignments.length ? `<ol class="text-muted mb-0">
        ${assignments.map((a) => `<li class="mb-2"><div class="fw-semibold">${escapeHtml(a.title)}</div><div class="small">${escapeHtml(a.description || "")}</div></li>`).join("")}
      </ol>` : `<div class="small text-muted">Пока нет заданий.</div>`}
    `;
  }

  const discussionPane = qs("#discussion-pane");
  if (discussionPane) {
    if (!threads.length) {
      discussionPane.innerHTML = `<div class="small text-muted">Пока нет обсуждений.</div>`;
    } else {
      const sorted = [...threads].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
      const firstThread = sorted[0];

      discussionPane.innerHTML = `
        <div class="row g-3">
          <div class="col-md-4">
            <div class="small text-muted mb-2">Темы</div>
            <div class="list-group" role="list" aria-label="Список тем обсуждений">
              ${sorted
                .map(
                  (t, idx) => `
                    <button
                      type="button"
                      class="list-group-item list-group-item-action ${idx === 0 ? "active" : ""}"
                      data-thread-id="${escapeHtml(t.id)}"
                      aria-current="${idx === 0 ? "true" : "false"}"
                    >
                      ${escapeHtml(t.title)}
                    </button>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="col-md-8">
            <div class="d-flex justify-content-between align-items-baseline mb-2">
              <div class="small text-muted">Сообщения</div>
              <div class="small text-muted" data-discussion-status role="status" aria-live="polite">—</div>
            </div>
            <div data-discussion-messages aria-label="Сообщения темы"></div>
          </div>
        </div>
      `;

      const statusEl = qs("[data-discussion-status]", discussionPane);
      const messagesBox = qs("[data-discussion-messages]", discussionPane);

      async function loadThread(threadId) {
        if (!messagesBox) return;
        setText(statusEl, "Загружаем…");
        const messages = await safeList(MessagesApi.listByThread(threadId));
        if (!messages.length) {
          messagesBox.innerHTML = `<div class="small text-muted">Сообщений пока нет.</div>`;
        } else {
          const sortedMsgs = [...messages].sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
          messagesBox.innerHTML = sortedMsgs
            .map(
              (m) =>
                `<div class="dashboard-chip mb-2"><span class="small text-muted">${escapeHtml(m.authorRole)}:</span> ${escapeHtml(m.text)}</div>`
            )
            .join("");
        }
        setText(statusEl, "Готово.");
      }

      await loadThread(firstThread.id);

      discussionPane.querySelectorAll("[data-thread-id]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          discussionPane.querySelectorAll("[data-thread-id]").forEach((b) => {
            b.classList.remove("active");
            b.setAttribute("aria-current", "false");
          });
          btn.classList.add("active");
          btn.setAttribute("aria-current", "true");
          const threadId = btn.getAttribute("data-thread-id");
          if (threadId) await loadThread(threadId);
        });
      });
    }
  }

  if (enrollBtn) {
    enrollBtn.addEventListener("click", async () => {
      const currentState = enrollBtn.dataset.state;
      if (currentState === "enrolled") {
        window.location.href = `/learn.html?courseId=${encodeURIComponent(course.id)}`;
        return;
      }

      const authNow = getAuth();
      if (!authNow?.token) {
        window.location.href = "/auth.html#login";
        return;
      }

      try {
        const already = await EnrollmentsApi.hasCourse(course.id).catch(() => false);
        if (already) {
          setEnrollButtonState(enrollBtn, { state: "enrolled", href: `/learn.html?courseId=${encodeURIComponent(course.id)}` });
          showAlert(alertBox, { type: "info", message: "Курс уже куплен. Переходим к обучению…" });
          window.location.href = `/learn.html?courseId=${encodeURIComponent(course.id)}`;
          return;
        }

        window.location.href = `/checkout.html?courseId=${encodeURIComponent(course.id)}`;
      } catch (e) {
        showAlert(alertBox, { type: "danger", message: e?.message || "Не удалось записаться." });
        setEnrollButtonState(enrollBtn, { state: "idle" });
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await initSessionUI();
  await loadCourse();
});

