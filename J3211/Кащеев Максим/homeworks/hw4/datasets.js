import { getDatasets, isLoggedIn, logout } from "./api.js";

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
        <svg class="icon" aria-hidden="true"><use href="sprite.svg#icon-user"></use></svg>
        ${user.name || "Мой аккаунт"}
      </a>
      <button class="btn btn-outline-glass btn-sm" id="btnLogout" aria-label="Выйти">Выйти</button>
    </div>
  `;

  document.getElementById("btnLogout")?.addEventListener("click", logout);
}

function createDatasetCard(dataset, index) {
  const card = document.createElement("article");
  card.className = "dataset-card";
  card.dataset.id = dataset.id;
  card.setAttribute("role", "article");
  card.setAttribute("aria-labelledby", `dataset-title-${dataset.id}`);
  card.tabIndex = 0;

  const categoryMap = {
    medical: { icon: "icon-heart-pulse", label: "Медицина" },
    text: { icon: "icon-newspaper", label: "Тексты" },
    video: { icon: "icon-camera-video", label: "Видео" },
    tabular: { icon: "icon-table", label: "Табличные данные" },
    audio: { icon: "icon-soundwave", label: "Аудио" }
  };

  const cat = categoryMap[dataset.category] || { icon: "icon-database", label: "Данные" };
  const likedIds = JSON.parse(localStorage.getItem("likedDatasetIds") || "[]");
  const favoriteIds = JSON.parse(localStorage.getItem("favoriteDatasetIds") || "[]");
  const isLiked = likedIds.includes(dataset.id);
  const isFavorite = favoriteIds.includes(dataset.id);

  const heartIcon = isLiked ? 'icon-heart-fill' : 'icon-heart';
  const starIcon = isFavorite ? 'icon-star-fill' : 'icon-star';

  card.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-1">
      <span class="dataset-badge" data-tag="${dataset.tagLabel || cat.label}" role="button" tabindex="0" aria-label="Фильтровать по тегу ${dataset.tagLabel || cat.label}">
        <svg class="icon" aria-hidden="true"><use href="sprite.svg#${cat.icon}"></use></svg> ${cat.label}
      </span>
      <span class="dataset-tag-pill">${dataset.tagLabel || dataset.shortType || ""}</span>
    </div>
    <h2 class="dataset-title mb-0" id="dataset-title-${dataset.id}">${dataset.title}</h2>
    <div class="dataset-meta">
      ${dataset.extra1 || ""} · Категория: ${cat.label}
    </div>
    <p class="dataset-desc">
      ${dataset.description || ""}
    </p>
    <div class="dataset-footer">
      <div class="dataset-stats">
        <span><svg class="icon" aria-hidden="true"><use href="sprite.svg#icon-download"></use></svg> ${dataset.downloads ?? 0}</span>
        <span><svg class="icon" aria-hidden="true"><use href="sprite.svg#icon-database"></use></svg> ${dataset.extra1 || ""}</span>
      </div>
      <div class="dataset-actions">
        <span class="like-btn ${isLiked ? "text-danger" : ""}" data-id="${dataset.id}" role="button" tabindex="0" aria-label="Нравится (${dataset.likes ?? 0})">
          <svg class="icon ${isLiked ? 'icon-fill' : ''}" aria-hidden="true"><use href="sprite.svg#${heartIcon}"></use></svg> ${dataset.likes ?? 0}
        </span>
        <span class="favorite-btn ${isFavorite ? "text-warning" : ""}" data-id="${dataset.id}" role="button" tabindex="0" aria-label="В избранное">
          <svg class="icon ${isFavorite ? 'icon-fill' : ''}" aria-hidden="true"><use href="sprite.svg#${starIcon}"></use></svg>
        </span>
      </div>
    </div>
  `;

  const badgeEl = card.querySelector(".dataset-badge");
  badgeEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    const tag = badgeEl.getAttribute("data-tag") || "";
    applyDatasetFilter({ search: tag });
  });

  card.addEventListener("click", (e) => {
    if (e.target.closest(".like-btn") || e.target.closest(".favorite-btn") || e.target.closest(".dataset-badge")) {
      return;
    }
    alert(`Здесь могла бы быть детальная страница датасета "${dataset.title}"`);
  });

  const likeEl = card.querySelector(".like-btn");
  likeEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      alert("Войдите, чтобы ставить лайки");
      window.location.href = "login.html";
      return;
    }
    let liked = JSON.parse(localStorage.getItem("likedDatasetIds") || "[]");
    const already = liked.includes(dataset.id);
    liked = already ? liked.filter(id => id !== dataset.id) : [...liked, dataset.id];
    localStorage.setItem("likedDatasetIds", JSON.stringify(liked));
    const newCount = (dataset.likes ?? 0) + (already ? -1 : 1);
    const newHeartIcon = !already ? 'icon-heart-fill' : 'icon-heart';
    likeEl.innerHTML = `<svg class="icon ${!already ? 'icon-fill' : ''}" aria-hidden="true"><use href="sprite.svg#${newHeartIcon}"></use></svg> ${newCount}`;
    dataset.likes = newCount;
    likeEl.setAttribute("aria-label", `Нравится (${newCount})`);
    if (!already) {
      likeEl.classList.add("text-danger");
    } else {
      likeEl.classList.remove("text-danger");
    }
  });

  const favEl = card.querySelector(".favorite-btn");
  favEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      alert("Войдите, чтобы добавлять датасеты в избранное");
      window.location.href = "login.html";
      return;
    }
    let favorites = JSON.parse(localStorage.getItem("favoriteDatasetIds") || "[]");
    const already = favorites.includes(dataset.id);
    favorites = already ? favorites.filter(id => id !== dataset.id) : [...favorites, dataset.id];
    localStorage.setItem("favoriteDatasetIds", JSON.stringify(favorites));
    const newStarIcon = !already ? 'icon-star-fill' : 'icon-star';
    favEl.innerHTML = `<svg class="icon ${!already ? 'icon-fill' : ''}" aria-hidden="true"><use href="sprite.svg#${newStarIcon}"></use></svg>`;
    if (!already) {
      favEl.classList.add("text-warning");
      favEl.setAttribute("aria-label", "Убрать из избранного");
    } else {
      favEl.classList.remove("text-warning");
      favEl.setAttribute("aria-label", "В избранное");
    }
  });

  return card;
}

async function renderDatasets(filters = {}) {
  const grid = document.getElementById("datasetsGrid");
  if (!grid) return;

  grid.innerHTML = '<p class="text-muted">Загрузка датасетов...</p>';

  try {
    const datasets = await getDatasets(filters);
    grid.innerHTML = "";

    if (!Array.isArray(datasets) || !datasets.length) {
      grid.innerHTML = '<p class="text-muted">По вашему запросу ничего не найдено.</p>';
      return;
    }

    datasets.forEach((d, idx) => {
      grid.appendChild(createDatasetCard(d, idx));
    });
  } catch (e) {
    console.error("renderDatasets error:", e);
    grid.innerHTML = '<p class="text-danger">Ошибка загрузки датасетов.</p>';
  }
}

function setupDatasetFilters() {
  const bar = document.getElementById("datasetsFilters");
  if (!bar) return;
  const buttons = Array.from(bar.querySelectorAll(".pill-filter"));

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.getAttribute("data-category");
      if (!cat || cat === "all") {
        renderDatasets();
      } else {
        renderDatasets({ category: cat });
      }
    });
  });
}

function applyDatasetFilter(filterObj) {
  const bar = document.getElementById("datasetsFilters");
  if (bar) {
    const buttons = Array.from(bar.querySelectorAll(".pill-filter"));
    buttons.forEach(b => b.classList.remove("active"));
    const allBtn = buttons.find(b => b.getAttribute("data-category") === "all");
    allBtn && allBtn.classList.add("active");
  }
  renderDatasets(filterObj);
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavbarAuth();
  setupDatasetFilters();
  renderDatasets();
});