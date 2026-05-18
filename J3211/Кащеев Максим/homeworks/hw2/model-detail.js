const API_BASE = "http://localhost:3001";

function setupNavbarAuth() {
  const navAuth = document.getElementById("navAuthArea");
  if (!navAuth) return;

  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");

  if (!token || !rawUser) return;

  const user = JSON.parse(rawUser);
  navAuth.innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <a href="account.html" class="btn btn-outline-glass btn-sm">
        <i class="bi bi-person-circle me-1"></i>${user.name || "Мой аккаунт"}
      </a>
      <button class="btn btn-outline-glass btn-sm" id="btnLogout">
        Выйти
      </button>
    </div>
  `;

  document.getElementById("btnLogout")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });
}

function getQueryId() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  return id ? Number(id) : null;
}

function renderFallback(wrapper) {
  wrapper.innerHTML = `
    <section>
      <h1 class="detail-main-title">ResNet‑50 Custom</h1>
      <div class="detail-meta">
        medAI · Computer Vision · PyTorch · Обновлено 10 февраля
      </div>
      <div class="detail-badges">
        <span class="badge-pill"><i class="bi bi-bounding-box"></i> Классификация изображений</span>
        <span class="badge-pill"><i class="bi bi-cpu"></i> ResNet‑50 · Fine-tuning</span>
        <span class="badge-pill"><i class="bi bi-cloud-download"></i> Доступна для скачивания</span>
      </div>
      <p class="detail-desc">
        Дообученная модель ResNet‑50 для классификации медицинских снимков. Модель обучена на 12 000 МРТ‑изображений мозга и достигает точности 94% на валидационном наборе.
      </p>
      <h2 class="detail-section-title">Особенности</h2>
      <ul class="detail-list">
        <li>Поддержка входных изображений 224×224 и 512×512 пикселей.</li>
        <li>Нормализация по статистике ImageNet и медицинского датасета.</li>
        <li>Скрипты для инференса на CPU и GPU.</li>
      </ul>
      <div class="detail-actions">
        <button class="btn btn-primary-glass btn-sm"><i class="bi bi-download"></i> Скачать модель</button>
        <button class="btn-like" id="fallbackLikeBtn"><i class="bi bi-heart"></i> Добавить в избранное</button>
        <a href="javascript:history.back()" class="btn-back"><i class="bi bi-arrow-left"></i> Назад</a>
      </div>
    </section>
    <aside class="stats-panel">
      <div class="stats-row"><span>Загрузок</span><span class="stats-value">2 330</span></div>
      <div class="stats-row"><span>Просмотры</span><span class="stats-value">4 650</span></div>
      <div class="stats-row"><span>Лайки</span><span class="stats-value">344</span></div>
      <hr class="my-1">
      <div class="stats-row"><span>Точность (val)</span><span class="stats-value">94%</span></div>
      <div class="stats-row"><span>mAP / F1</span><span class="stats-value">0.91 / 0.89</span></div>
      <div class="stats-row"><span>Лицензия</span><span class="stats-pill"><i class="bi bi-shield-check"></i> Apache‑2.0</span></div>
    </aside>
  `;
}

function renderFromModel(wrapper, model) {
  const downloads = model.downloads ?? 0;
  const likes = model.likes ?? 0;
  const tag = model.tagLabel || model.shortType || model.category || "Model";

  wrapper.innerHTML = `
    <section>
      <h1 class="detail-main-title">${model.title}</h1>
      <div class="detail-meta">Категория: ${tag}</div>
      <div class="detail-badges">
        <span class="badge-pill"><i class="bi bi-cpu"></i> ${tag}</span>
        <span class="badge-pill"><i class="bi bi-cloud-download"></i> Доступна для скачивания</span>
      </div>
      <p class="detail-desc">${model.description || "Описание модели скоро будет добавлено."}</p>
      <h2 class="detail-section-title">Особенности</h2>
      <ul class="detail-list">
        <li>Slug модели: <code>${model.slug || "нет"}</code>.</li>
        <li>Категория: ${model.category || "—"}.</li>
        <li>Доп. метрика: ${model.extra1 || model.badge || "—"}.</li>
      </ul>
      <div class="detail-actions">
        <button class="btn btn-primary-glass btn-sm"><i class="bi bi-download"></i> Скачать модель</button>
        <button class="btn-like" id="modelLikeBtn"><i class="bi bi-heart"></i> Добавить в избранное</button>
        <a href="javascript:history.back()" class="btn-back"><i class="bi bi-arrow-left"></i> Назад</a>
      </div>
    </section>
    <aside class="stats-panel">
      <div class="stats-row"><span>Загрузок</span><span class="stats-value">${downloads}</span></div>
      <div class="stats-row"><span>Лайки</span><span class="stats-value">${likes}</span></div>
      <hr class="my-1">
      <div class="stats-row"><span>Лицензия</span><span class="stats-pill"><i class="bi bi-shield-check"></i> Open Source</span></div>
    </aside>
  `;

  const likeBtn = document.getElementById("modelLikeBtn");
  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      if (!localStorage.getItem("token")) {
        alert("Войдите, чтобы добавлять в избранное");
        window.location.href = "login.html";
        return;
      }
      let favs = JSON.parse(localStorage.getItem("favoriteModelIds") || "[]");
      if (!favs.includes(model.id)) {
        favs.push(model.id);
        localStorage.setItem("favoriteModelIds", JSON.stringify(favs));
        likeBtn.innerHTML = '<i class="bi bi-heart-fill"></i> В избранном';
      }
    });
  }
}

async function initDetail() {
  setupNavbarAuth();

  const wrapper = document.getElementById("detailWrapper");
  if (!wrapper) return;

  const id = getQueryId();
  if (!id) {
    renderFallback(wrapper);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/model/${id}`);
    if (!res.ok) {
      renderFallback(wrapper);
      return;
    }
    const model = await res.json();
    renderFromModel(wrapper, model);
  } catch (e) {
    console.error(e);
    renderFallback(wrapper);
  }
}

document.addEventListener("DOMContentLoaded", initDetail);