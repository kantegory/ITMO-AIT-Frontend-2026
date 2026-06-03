import { getModels, isLoggedIn, logout } from "./api.js";

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

function createModelCard(model, index) {
  const card = document.createElement("article");
  card.className = "model-card";
  card.dataset.id = model.id;
  card.setAttribute("role", "article");
  card.setAttribute("aria-labelledby", `model-title-${model.id}`);
  card.tabIndex = 0;

  const categoryMap = {
    cv: { icon: "bi-bounding-box", label: "Computer Vision" },
    nlp: { icon: "bi-chat-dots", label: "NLP" },
    gen: { icon: "bi-magic", label: "Generative" },
    dataset: { icon: "bi-database", label: "Dataset" },
    tabular: { icon: "bi-table", label: "Tabular" },
    audio: { icon: "bi-soundwave", label: "Audio" },
    multimodal: { icon: "bi-layers", label: "Multimodal" },
    video: { icon: "bi-camera-video", label: "Видео / Детекция" }
  };

  const cat = categoryMap[model.category] || { icon: "bi-cpu", label: model.shortType || "Model" };
  const badgeText = model.tagLabel || `${cat.label} · Model`;

  const likedIds = JSON.parse(localStorage.getItem("likedModelIds") || "[]");
  const favoriteIds = JSON.parse(localStorage.getItem("favoriteModelIds") || "[]");
  const isLiked = likedIds.includes(model.id);
  const isFavorite = favoriteIds.includes(model.id);

  card.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-1">
      <span class="model-badge badge-tag" data-tag="${model.tagLabel || cat.label}" role="button" tabindex="0" aria-label="Фильтровать по тегу ${model.tagLabel || cat.label}">
        <i class="bi ${cat.icon}" aria-hidden="true"></i> ${badgeText}
      </span>
      <span class="model-tag-pill">${model.shortType || cat.label}</span>
    </div>
    <h2 class="model-title mb-0" id="model-title-${model.id}">${model.title}</h2>
    <div class="model-meta">
      Категория: ${cat.label}
    </div>
    <p class="model-desc">
      ${model.description || ""}
    </p>
    <div class="model-footer">
      <div class="model-stats">
        <span><i class="bi bi-download" aria-hidden="true"></i> ${model.downloads ?? 0}</span>
        <span><i class="bi bi-eye" aria-hidden="true"></i> ${Math.round((model.downloads ?? 0) * 1.7)}</span>
      </div>
      <div class="model-actions">
        <span class="like-btn ${isLiked ? "text-danger" : ""}" data-id="${model.id}" role="button" tabindex="0" aria-label="Нравится (${model.likes ?? 0})">
          <i class="bi bi-heart${isLiked ? "-fill" : ""}" aria-hidden="true"></i> ${model.likes ?? 0}
        </span>
        <span class="favorite-btn ${isFavorite ? "text-warning" : ""}" data-id="${model.id}" role="button" tabindex="0" aria-label="В избранное">
          <i class="bi bi-star${isFavorite ? "-fill" : ""}" aria-hidden="true"></i>
        </span>
      </div>
    </div>
  `;

  const badgeEl = card.querySelector(".badge-tag");
  badgeEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    const tag = badgeEl.getAttribute("data-tag") || "";
    applyFilter({ search: tag });
  });

  card.addEventListener("click", (e) => {
    if (e.target.closest(".like-btn") || e.target.closest(".favorite-btn") || e.target.closest(".badge-tag")) {
      return;
    }
    window.location.href = `model-detail.html?id=${model.id}`;
  });

  const likeEl = card.querySelector(".like-btn");
  likeEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      alert("Войдите, чтобы ставить лайки");
      window.location.href = "login.html";
      return;
    }
    let liked = JSON.parse(localStorage.getItem("likedModelIds") || "[]");
    const already = liked.includes(model.id);
    liked = already ? liked.filter(id => id !== model.id) : [...liked, model.id];
    localStorage.setItem("likedModelIds", JSON.stringify(liked));
    const icon = likeEl.querySelector("i");
    const newCount = (model.likes ?? 0) + (already ? -1 : 1);
    if (!already) {
      likeEl.classList.add("text-danger");
      icon.classList.replace("bi-heart", "bi-heart-fill");
    } else {
      likeEl.classList.remove("text-danger");
      icon.classList.replace("bi-heart-fill", "bi-heart");
    }
    likeEl.innerHTML = `<i class="bi bi-heart${!already ? "-fill" : ""}" aria-hidden="true"></i> ${newCount}`;
    model.likes = newCount;
    likeEl.setAttribute("aria-label", `Нравится (${newCount})`);
  });

  const favEl = card.querySelector(".favorite-btn");
  favEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      alert("Войдите, чтобы добавлять модели в избранное");
      window.location.href = "login.html";
      return;
    }
    let favorites = JSON.parse(localStorage.getItem("favoriteModelIds") || "[]");
    const already = favorites.includes(model.id);
    favorites = already ? favorites.filter(id => id !== model.id) : [...favorites, model.id];
    localStorage.setItem("favoriteModelIds", JSON.stringify(favorites));
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

async function renderModels(filters = {}) {
  const grid = document.getElementById("modelsGrid");
  if (!grid) return;

  grid.innerHTML = '<p class="text-muted">Загрузка моделей...</p>';

  try {
    const models = await getModels(filters);
    grid.innerHTML = "";

    if (!Array.isArray(models) || !models.length) {
      grid.innerHTML = '<p class="text-muted">По вашему запросу ничего не найдено.</p>';
      return;
    }

    models.forEach((m, idx) => {
      grid.appendChild(createModelCard(m, idx));
    });
  } catch (e) {
    console.error("renderModels error:", e);
    grid.innerHTML = '<p class="text-danger">Ошибка загрузки моделей.</p>';
  }
}

function setupCategoryFilters() {
  const bar = document.getElementById("filtersBar");
  if (!bar) return;
  const buttons = Array.from(bar.querySelectorAll(".pill-filter"));

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.getAttribute("data-category");
      if (!cat || cat === "all") {
        renderModels();
      } else if (cat === "video") {
        renderModels({ search: "video detection детекция traffic camera" });
      } else {
        renderModels({ category: cat });
      }
    });
  });
}

function applyFilter(filterObj) {
  const bar = document.getElementById("filtersBar");
  if (bar) {
    const buttons = Array.from(bar.querySelectorAll(".pill-filter"));
    buttons.forEach(b => b.classList.remove("active"));
    const allBtn = buttons.find(b => b.getAttribute("data-category") === "all");
    allBtn && allBtn.classList.add("active");
  }
  renderModels(filterObj);
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavbarAuth();
  setupCategoryFilters();
  renderModels();
});