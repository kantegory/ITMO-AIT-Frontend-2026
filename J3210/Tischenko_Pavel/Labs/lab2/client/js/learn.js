import { AssignmentsApi, CertificatesApi, CoursesApi, EnrollmentsApi, LessonsApi } from "./api.js";
import { getAuth } from "./storage.js";
import { initSessionUI } from "./session.js";
import { initTheme } from "./theme.js";
import { escapeHtml, qs, setText, showAlert, clearAlert } from "./ui.js";

function getCourseId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("courseId");
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

function renderPlayer(container, lesson) {
  const embed = getYouTubeEmbedUrl(lesson.videoUrl);
  if (!embed) {
    container.innerHTML = `Видео: <a href="${escapeHtml(lesson.videoUrl)}" target="_blank" rel="noreferrer">открыть</a>`;
    return;
  }
  container.innerHTML = `
    <iframe
      title="${escapeHtml(lesson.title || "Видео-лекция")}"
      src="${escapeHtml(embed)}"
      style="width:100%;height:100%;border:0;border-radius:0.5rem;"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  `;
}

function calcProgress(completed, total) {
  if (!total) return 0;
  const done = Array.isArray(completed) ? completed.length : 0;
  return Math.min(1, Math.max(0, done / total));
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await initSessionUI();

  const alertBox = qs('[data-learn="alert"]');
  clearAlert(alertBox);

  const auth = getAuth();
  if (!auth?.token) {
    window.location.href = "/auth.html#login";
    return;
  }

  const courseId = getCourseId();
  if (!courseId) {
    showAlert(alertBox, { type: "warning", message: "Не указан courseId." });
    return;
  }

  const [course, lessons, assignments, enrollment] = await Promise.all([
    CoursesApi.get(courseId).catch(() => null),
    LessonsApi.listByCourse(courseId).catch(() => []),
    AssignmentsApi.listByCourse(courseId).catch(() => []),
    EnrollmentsApi.getForCourse(courseId).catch(() => null),
  ]);

  if (!course) {
    showAlert(alertBox, { type: "danger", message: "Курс не найден." });
    return;
  }

  if (!enrollment?.id) {
    showAlert(alertBox, { type: "warning", message: "Курс не куплен. Оформи покупку на странице курса." });
    return;
  }

  const lessonsSorted = (Array.isArray(lessons) ? lessons : []).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const seminarsSorted = (Array.isArray(assignments) ? assignments : []).sort((a, b) =>
    String(a.deadline || "").localeCompare(String(b.deadline || ""))
  );
  if (!lessonsSorted.length) {
    showAlert(alertBox, { type: "info", message: "В курсе пока нет лекций." });
  }

  setText(qs('[data-learn="courseTitle"]'), course.title);
  setText(qs('[data-learn="courseMeta"]'), `Направление: ${course.direction} · Уровень: ${course.level}`);

  const listEl = qs('[data-learn="list"]');
  const playerEl = qs('[data-learn="player"]');
  const itemTitleEl = qs('[data-learn="itemTitle"]');
  const progressEl = qs('[data-learn="progress"]');
  const completeBtn = qs("#completeBtn");
  const hintEl = qs('[data-learn="hint"]');

  let tab = "lessons"; // lessons | seminars
  let currentItem = lessonsSorted[0] || seminarsSorted[0] || null;
  let completedLessons = Array.isArray(enrollment.completedLessons) ? enrollment.completedLessons : [];
  let completedSeminars = Array.isArray(enrollment.completedSeminars) ? enrollment.completedSeminars : [];

  function updateProgressUi() {
    const total = lessonsSorted.length + seminarsSorted.length;
    const done = completedLessons.length + completedSeminars.length;
    const p = total ? Math.min(1, Math.max(0, done / total)) : 0;
    setText(progressEl, `Прогресс: ${Math.round(p * 100)}%`);
  }

  function renderList() {
    if (!listEl) return;
    const items = tab === "lessons" ? lessonsSorted : seminarsSorted;
    listEl.innerHTML = items
      .map((x) => {
        const id = x.id;
        const done = tab === "lessons" ? completedLessons.includes(id) : completedSeminars.includes(id);
        const title = tab === "lessons" ? x.title : x.title;
        const active = currentItem?.id === id;
        return `
          <button type="button"
                  class="list-group-item list-group-item-action ${active ? "active" : ""}"
                  data-item-id="${escapeHtml(id)}">
            <div class="d-flex justify-content-between align-items-center">
              <span>${escapeHtml(title || (tab === "lessons" ? "Лекция" : "Семинар"))}</span>
              <span class="badge-soft px-2 py-1">${done ? "✓" : ""}</span>
            </div>
          </button>
        `;
      })
      .join("");

    listEl.querySelectorAll("[data-item-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-item-id");
        currentItem = items.find((x) => String(x.id) === String(id)) || currentItem;
        renderCurrent();
        renderList();
      });
    });
  }

  function renderCurrent() {
    if (!currentItem) {
      setText(itemTitleEl, "—");
      if (playerEl) playerEl.textContent = "Выбери элемент слева.";
      return;
    }

    setText(itemTitleEl, currentItem.title || "—");

    if (tab === "lessons") {
      if (playerEl) renderPlayer(playerEl, currentItem);
      setText(hintEl, "Лекция: смотри видео и отмечай выполненное.");
      if (completeBtn) completeBtn.textContent = completedLessons.includes(currentItem.id) ? "Выполнено" : "Отметить как выполнено";
      if (completeBtn) completeBtn.disabled = completedLessons.includes(currentItem.id);
    } else {
      if (playerEl) {
        playerEl.innerHTML = `
          <div class="text-start w-100">
            <div class="small text-muted mb-2">Описание</div>
            <div class="mb-2">${escapeHtml(currentItem.description || "—")}</div>
            <div class="small text-muted">Дедлайн: ${escapeHtml(currentItem.deadline || "—")}</div>
          </div>
        `;
      }
      setText(hintEl, "Семинар: выполни задание и отметь как выполненное.");
      if (completeBtn) completeBtn.textContent = completedSeminars.includes(currentItem.id) ? "Выполнено" : "Отметить как выполнено";
      if (completeBtn) completeBtn.disabled = completedSeminars.includes(currentItem.id);
    }
  }

  function setTab(next) {
    tab = next;
    const items = tab === "lessons" ? lessonsSorted : seminarsSorted;
    currentItem = items[0] || null;
    document.querySelectorAll("[data-learn-tab]").forEach((b) => {
      const active = b.getAttribute("data-learn-tab") === next;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    renderCurrent();
    renderList();
  }

  updateProgressUi();
  setTab("lessons");

  document.querySelectorAll("[data-learn-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-learn-tab");
      if (next !== "lessons" && next !== "seminars") return;
      setTab(next);
    });
  });

  if (completeBtn) {
    completeBtn.addEventListener("click", async () => {
      if (!currentItem) return;
      completeBtn.disabled = true;
      try {
        if (tab === "lessons") {
          if (completedLessons.includes(currentItem.id)) return;
          completedLessons = [...completedLessons, currentItem.id];
        } else {
          if (completedSeminars.includes(currentItem.id)) return;
          completedSeminars = [...completedSeminars, currentItem.id];
        }

        const total = lessonsSorted.length + seminarsSorted.length;
        const done = completedLessons.length + completedSeminars.length;
        const progress = total ? Math.min(1, Math.max(0, done / total)) : 0;

        await EnrollmentsApi.patch(enrollment.id, {
          completedLessons,
          completedSeminars,
          progress,
        });
        updateProgressUi();
        renderCurrent();
        renderList();

        if (progress >= 1) {
          const myCerts = await CertificatesApi.my().catch(() => []);
          const exists = Array.isArray(myCerts) && myCerts.some((c) => c.courseId === courseId);
          if (!exists) {
            const newCert = await CertificatesApi.create({
              id: `cert_${Date.now()}`,
              userId: auth.user?.id,
              courseId,
              title: `Сертификат: ${course.title}`,
              issuedAt: new Date().toISOString(),
            });
            showAlert(alertBox, {
              type: "success",
              title: "Поздравляем!",
              message: "Курс завершён. Сертификат выдан и доступен в кабинете.",
            });
            if (newCert?.id) {
              window.setTimeout(() => {
                window.location.href = `/certificate.html?id=${encodeURIComponent(newCert.id)}`;
              }, 800);
            }
          }
        }
      } catch (e) {
        showAlert(alertBox, { type: "danger", message: e?.message || "Не удалось сохранить прогресс." });
      } finally {
        completeBtn.disabled = false;
      }
    });
  }
});

