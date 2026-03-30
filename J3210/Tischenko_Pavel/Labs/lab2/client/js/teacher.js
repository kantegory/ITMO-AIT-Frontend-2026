import { AssignmentsApi, AuthApi, CoursesApi, EnrollmentsApi, LessonsApi, MaterialsApi } from "./api.js";
import { getAuth } from "./storage.js";
import { initSessionUI } from "./session.js";
import { initTheme } from "./theme.js";
import { escapeHtml, formatRub, qs, setText, showAlert, clearAlert } from "./ui.js";

async function ensureTeacher() {
  const auth = getAuth();
  if (!auth?.token) {
    window.location.href = "/auth.html#login";
    return null;
  }
  try {
    const me = await AuthApi.me();
    if (me.role !== "teacher") {
      return { me, forbidden: true };
    }
    return { me, forbidden: false };
  } catch {
    window.location.href = "/auth.html#login";
    return null;
  }
}

async function renderMyCourses(me) {
  const grid = qs("[data-teacher='courses']");
  if (!grid) return;

  const courses = await CoursesApi.list();
  const mine = courses.filter((c) => c.teacherId === me.id);

  setText(qs("[data-teacher='count']"), String(mine.length));

  for (const id of ["#uploadCourseId", "#lessonCourseId", "#seminarCourseId"]) {
    const select = qs(id);
    if (select) {
      select.innerHTML = mine
        .map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.title)}</option>`)
        .join("");
    }
  }

  if (!mine.length) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-secondary small mb-0" role="status">
          Пока нет опубликованных курсов для этого преподавателя.
        </div>
      </div>
    `;
    return;
  }

  grid.innerHTML = mine
    .map(
      (c) => `
      <div class="col-md-6">
        <div class="course-card p-3 h-100">
          <h3 class="h6 mb-1">${escapeHtml(c.title)}</h3>
          <p class="card-text small text-muted mb-2">${escapeHtml(c.shortDescription || "")}</p>
          <div class="mb-2 small text-muted">
            Цена: ${formatRub(c.price)} ₽ · Рейтинг: ${escapeHtml(String(c.rating ?? "—"))}
          </div>
          <div class="d-flex gap-2">
            <a href="course.html?id=${encodeURIComponent(c.id)}" class="btn btn-sm btn-outline-soft pill w-100">
              Открыть курс
            </a>
            <button type="button" class="btn btn-sm btn-outline-soft pill" disabled aria-disabled="true">
              ⋯
            </button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

async function renderStats(me) {
  const pane = qs("#stats-pane");
  if (!pane) return;
  const courses = await CoursesApi.list();
  const mine = courses.filter((c) => c.teacherId === me.id);

  const enrollments = await EnrollmentsApi.my().catch(() => []);
  const allEnrollments = await fetch("/api/enrollments", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getAuth()?.token || ""}`,
    },
  })
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => []);

  const mineIds = new Set(mine.map((c) => c.id));
  const mineEnrollments = (Array.isArray(allEnrollments) ? allEnrollments : []).filter((e) =>
    mineIds.has(e.courseId)
  );

  const avg =
    mineEnrollments.length
      ? mineEnrollments.reduce((s, e) => s + (Number(e.progress) || 0), 0) / mineEnrollments.length
      : 0;

  pane.innerHTML = `
    <p class="text-muted mb-2">Обзор статистики по тренировочным программам:</p>
    <div class="dashboard-chip mb-2">
      Опубликованных курсов: ${escapeHtml(String(mine.length))}
    </div>
    <div class="dashboard-chip mb-2">
      Активных учеников (записей): ${escapeHtml(String(mineEnrollments.length))}
    </div>
    <div class="dashboard-chip">
      Средний прогресс по твоим курсам: ${escapeHtml(String(Math.round(avg * 100)))}%
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await initSessionUI();

  const result = await ensureTeacher();
  if (!result) return;

  const { me, forbidden } = result;
  clearAlert(qs("[data-teacher='alert']"));

  setText(qs("[data-teacher='name']"), [me.firstName, me.lastName].filter(Boolean).join(" ") || me.email);

  if (forbidden) {
    window.location.href = "/student.html";
    return;
  }

  await renderMyCourses(me);
  await renderStats(me);

  const createForm = qs("#createCourseForm");
  if (createForm) {
    createForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = qs('[data-teacher="createStatus"]');
      setText(status, "Создаём…");
      try {
        const title = qs("#newCourseTitle")?.value?.trim();
        const direction = qs("#newCourseDirection")?.value;
        const level = qs("#newCourseLevel")?.value;
        const price = Number(qs("#newCoursePrice")?.value || 0);
        const durationWeeks = Number(qs("#newCourseWeeks")?.value || 1);
        const modulesCount = Number(qs("#newCourseModules")?.value || 1);
        const shortDescription = qs("#newCourseDesc")?.value?.trim() || "";

        if (!title) {
          setText(status, "Нужно название.");
          return;
        }

        await CoursesApi.create({
          id: `c_${Date.now()}`,
          title,
          direction,
          level,
          price,
          durationWeeks,
          modulesCount,
          shortDescription,
          teacherId: me.id,
          rating: 5,
        });

        createForm.reset();
        setText(status, "Курс создан.");
        await renderMyCourses(me);
      } catch (err) {
        setText(status, err?.message || "Не удалось создать курс.");
      }
    });
  }

  const uploadForm = qs("#teacherUploadForm");
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const alertBox = qs("[data-teacher='uploadAlert']");
      clearAlert(alertBox);

      const courseId = qs("#uploadCourseId")?.value;
      const title = qs("#uploadTitle")?.value?.trim();
      const type = qs("#uploadType")?.value;
      const url = qs("#uploadUrl")?.value?.trim();

      if (!courseId || !title || !url) {
        showAlert(alertBox, { type: "warning", message: "Заполни курс, название и URL материала." });
        return;
      }

      try {
        await MaterialsApi.create({
          id: `m_${Date.now()}`,
          courseId,
          title,
          type: type || "link",
          url,
        });
        showAlert(alertBox, { type: "success", message: "Материал загружен. Обнови страницу курса, чтобы увидеть его." });
        uploadForm.reset();
      } catch (err) {
        showAlert(alertBox, { type: "danger", message: err?.message || "Не удалось загрузить материал." });
      }
    });
  }

  const lessonForm = qs("#teacherLessonForm");
  if (lessonForm) {
    lessonForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const alertBox = qs("[data-teacher='lessonAlert']");
      clearAlert(alertBox);

      const courseId = qs("#lessonCourseId")?.value;
      const title = qs("#lessonTitle")?.value?.trim();
      const videoUrl = qs("#lessonVideoUrl")?.value?.trim();
      const order = Number(qs("#lessonOrder")?.value || 0);
      const durationMinutes = Number(qs("#lessonDuration")?.value || 0);

      if (!courseId || !title || !videoUrl || !order || !durationMinutes) {
        showAlert(alertBox, { type: "warning", message: "Заполни курс, название, видео, порядок и длительность." });
        return;
      }

      try {
        await LessonsApi.create({
          id: `l_${Date.now()}`,
          courseId,
          title,
          videoUrl,
          order,
          durationMinutes,
        });
        showAlert(alertBox, { type: "success", message: "Лекция добавлена. Открой страницу курса или обучение, чтобы увидеть её." });
        lessonForm.reset();
      } catch (err) {
        showAlert(alertBox, { type: "danger", message: err?.message || "Не удалось добавить лекцию." });
      }
    });
  }

  const seminarForm = qs("#teacherSeminarForm");
  if (seminarForm) {
    seminarForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const alertBox = qs("[data-teacher='seminarAlert']");
      clearAlert(alertBox);

      const courseId = qs("#seminarCourseId")?.value;
      const title = qs("#seminarTitle")?.value?.trim();
      const description = qs("#seminarDesc")?.value?.trim();
      const deadline = qs("#seminarDeadline")?.value;

      if (!courseId || !title || !description || !deadline) {
        showAlert(alertBox, { type: "warning", message: "Заполни курс, название, описание и дедлайн." });
        return;
      }

      try {
        await AssignmentsApi.create({
          id: `a_${Date.now()}`,
          courseId,
          title,
          description,
          deadline,
        });
        showAlert(alertBox, { type: "success", message: "Семинар добавлен. Открой страницу курса или обучение, чтобы увидеть его." });
        seminarForm.reset();
      } catch (err) {
        showAlert(alertBox, { type: "danger", message: err?.message || "Не удалось добавить семинар." });
      }
    });
  }
});

