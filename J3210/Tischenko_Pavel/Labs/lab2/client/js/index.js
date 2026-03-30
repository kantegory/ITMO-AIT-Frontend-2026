import { CoursesApi } from "./api.js";
import { initSessionUI } from "./session.js";
import { initTheme } from "./theme.js";
import { escapeHtml, formatRub, qs, setText } from "./ui.js";

function courseBadge(direction) {
  switch (direction) {
    case "powerlifting":
      return "Пауэрлифтинг";
    case "crossfit":
      return "Кроссфит";
    case "fitness":
      return "Фитнес";
    default:
      return "Курс";
  }
}

function levelLabel(level) {
  switch (level) {
    case "beginner":
      return "начальный";
    case "intermediate":
      return "средний";
    case "advanced":
      return "продвинутый";
    case "any":
      return "для всех";
    default:
      return level || "—";
  }
}

function renderCourses(container, courses) {
  if (!courses.length) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-secondary small mb-0" role="status">
          Курсы не найдены. Попробуй изменить фильтры.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = courses
    .map(
      (c) => `
      <div class="col-md-3">
        <article class="course-card h-100 p-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge-soft px-2 py-1">${escapeHtml(courseBadge(c.direction))}</span>
            <span class="badge-soft px-2 py-1">Уровень: ${escapeHtml(levelLabel(c.level))}</span>
          </div>
          <h3 class="h6 mb-2">${escapeHtml(c.title)}</h3>
          <p class="card-text small text-muted mb-3">${escapeHtml(c.shortDescription || "")}</p>
          <ul class="list-unstyled small text-muted mb-3">
            <li>· ${escapeHtml(String(c.modulesCount ?? "—"))} модулей</li>
            <li>· Длительность: ${escapeHtml(String(c.durationWeeks ?? "—"))} недель</li>
          </ul>
          <p class="price-tag small mb-3">Стоимость: ${formatRub(c.price)} ₽</p>
          <a href="course.html?id=${encodeURIComponent(c.id)}" class="btn btn-sm btn-outline-soft w-100 pill" aria-label="Открыть страницу курса: ${escapeHtml(c.title)}">
            Открыть страницу курса
          </a>
        </article>
      </div>
    `
    )
    .join("");
}

async function loadCoursesFromFilters() {
  const direction = qs("#filterDirection")?.value || "";
  const level = qs("#filterLevel")?.value || "";
  const minPrice = Number(qs("#filterMinPrice")?.value || 0);
  const maxPriceRaw = qs("#filterMaxPrice")?.value;
  const maxPrice = maxPriceRaw === "" || maxPriceRaw === undefined ? Infinity : Number(maxPriceRaw);
  const status = qs('[data-courses="status"]');
  const grid = qs('[data-courses="grid"]');
  if (!grid) return;

  setText(status, "Загружаем курсы…");
  const list = await CoursesApi.list({ direction: direction || undefined, level: level || undefined, _sort: "price", _order: "asc" });
  const filtered = list.filter((c) => {
    const price = Number(c.price) || 0;
    return price >= minPrice && price <= maxPrice;
  });
  renderCourses(grid, filtered);
  setText(status, `Показано: ${filtered.length}`);
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await initSessionUI();

  const btn = qs("#filterButton");
  if (btn) btn.addEventListener("click", () => loadCoursesFromFilters());

  await loadCoursesFromFilters();
});

