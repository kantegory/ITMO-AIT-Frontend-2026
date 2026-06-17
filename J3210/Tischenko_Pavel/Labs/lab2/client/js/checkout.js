import { CoursesApi, EnrollmentsApi } from "./api.js";
import { getAuth } from "./storage.js";
import { initSessionUI } from "./session.js";
import { initTheme } from "./theme.js";
import { formatRub, qs, setText, showAlert, clearAlert } from "./ui.js";

function getCourseId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("courseId");
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await initSessionUI();

  const alertBox = qs('[data-checkout="alert"]');
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

  const course = await CoursesApi.get(courseId).catch(() => null);
  if (!course) {
    showAlert(alertBox, { type: "danger", message: "Курс не найден." });
    return;
  }

  setText(qs('[data-checkout="title"]'), course.title);
  setText(
    qs('[data-checkout="meta"]'),
    `Направление: ${course.direction} · Уровень: ${course.level} · ${course.durationWeeks} недель`
  );
  setText(qs('[data-checkout="price"]'), `${formatRub(course.price)} ₽`);

  const payBtn = qs("#payBtn");
  if (!payBtn) return;

  payBtn.addEventListener("click", async () => {
    clearAlert(alertBox);
    payBtn.disabled = true;
    payBtn.textContent = "Оплачиваем…";

    try {
      const already = await EnrollmentsApi.hasCourse(course.id).catch(() => false);
      if (!already) {
        await EnrollmentsApi.create({
          userId: auth.user?.id,
          courseId: course.id,
          progress: 0,
          completedLessons: [],
          completedSeminars: [],
          createdAt: new Date().toISOString(),
        });
      }
      showAlert(alertBox, { type: "success", message: "Готово! Переходим к обучению…" });
      window.location.href = `/learn.html?courseId=${encodeURIComponent(course.id)}`;
    } catch (e) {
      showAlert(alertBox, { type: "danger", message: e?.message || "Не удалось оформить покупку." });
      payBtn.disabled = false;
      payBtn.textContent = "Оплатить и начать";
    }
  });
});

