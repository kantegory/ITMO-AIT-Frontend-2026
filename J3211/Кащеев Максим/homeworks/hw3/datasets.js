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
        <i class="bi bi-person-circle me-1" aria-hidden="true"></i>${user.name || "Мой аккаунт"}
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
    medical: { icon: "bi-heart-pulse", label: "Медицина" },
    text: { icon: "bi-newspaper", label: "Тексты" },
    video: { icon: "bi-camera-video", label: "Видео" },
    tabular: { icon: "bi-table", label: "Табличные данные" },
    audio: { icon: "bi-soundwave", label: "Аудио" }
  };

  const cat = categoryMap[dataset.category] || { icon: "bi-database", label: "Данные" };
  const likedIds = JSON.parse(localStorage.getItem("likedDatasetIds") || "[]");
  const favoriteIds = JSON.parse(localStorage.getItem("favoriteDatasetIds") || "[]");
  const isLiked = likedIds.includes(dataset.id);
  const isFavorite = favoriteIds.includes(dataset.id);

  card.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-1">
      <span class="dataset-badge" data-tag="${dataset.tagLabel || cat.label}" role="button" tabindex="0" aria-label="Фильтровать по тегу ${dataset.tagLabel || cat.label}">
        <i class="bi ${cat.icon}" aria-hidden="true"></i> ${cat.label}
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
        <span><i class="bi bi-download" aria-hidden="true"></i> ${dataset.downloads ?? 0}</span>
        <span><i class="bi bi-database" aria-hidden="true"></i> ${dataset.extra1 || ""}</span>
      </div>
      <div class="dataset-actions">
        <span class="like-btn ${isLiked ? "text-danger" : ""}" data-id="${dataset.id}" role="button" tabindex="0" aria-label="Нравится (${dataset.likes ?? 0})">
          <i class="bi bi-heart${isLiked ? "-fill" : ""}" aria-hidden="true"></i> ${dataset.likes ?? 0}
        </span>
        <span class="favorite-btn ${isFavorite ? "text-warning" : ""}" data-id="${dataset.id}" role="button" tabindex="0" aria-label="В избранное">
          <i class="bi bi-star${isFavorite ? "-fill" : ""}" aria-hidden="true"></i>
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
    const icon = likeEl.querySelector("i");
    const newCount = (dataset.likes ?? 0) + (already ? -1 : 1);
    if (!already) {
      likeEl.classList.add("text-danger");
      icon.classList.replace("bi-heart", "bi-heart-fill");
    } else {
      likeEl.classList.remove("text-danger");
      icon.classList.replace("bi-heart-fill", "bi-heart");
    }
    likeEl.innerHTML = `<i class="bi bi-heart${!already ? "-fill" : ""}" aria-hidden="true"></i> ${newCount}`;
    dataset.likes = newCount;
    likeEl.setAttribute("aria-label", `Нравится (${newCount})`);
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
    const icon = favEl.querySelector("i");
    if (!already) {
      favEl.classList.add("text-warning");
      icon.classList.replace("bi-star", "bi-star-fill");
      favEl.setAttribute("aria-label", "Убрать из избранного");
    } else {
      favEl.classList.remove("text-warning");
      icon.classList.replace("bi-star-fill", "bi-star");
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