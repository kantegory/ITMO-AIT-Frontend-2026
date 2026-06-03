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
        <svg class="icon" aria-hidden="true"><use href="sprite.svg#icon-user"></use></svg>
        ${user.name || "Мой аккаунт"}
      </a>
      <button class="btn btn-outline-glass btn-sm" id="btnLogout" aria-label="Выйти">Выйти</button>
    </div>
  `;
  document.getElementById("btnLogout")?.addEventListener("click", logout);
}

function createModelCard(model, index) {
  const item = document.createElement("div");
  item.className = "scroll-item";
  item.setAttribute("role", "article");
  item.setAttribute("aria-labelledby", `model-title-${model.id}`);
  item.tabIndex = 0;

  const combos = [["cb-blue", "cb-pink"], ["cb-cyan", "cb-blue"], ["cb-pink", "cb-lime"], ["cb-lime", "cb-cyan"]];
  const combo = combos[index % combos.length];
  const metricText = model.badge || model.extra1 || "";
  const likedIds = JSON.parse(localStorage.getItem("likedModelIds") || "[]");
  const favoriteIds = JSON.parse(localStorage.getItem("favoriteModelIds") || "[]");
  const isLiked = likedIds.includes(model.id);
  const isFavorite = favoriteIds.includes(model.id);

  const heartIcon = isLiked ? 'icon-heart-fill' : 'icon-heart';
  const starIcon = isFavorite ? 'icon-star-fill' : 'icon-star';

  item.innerHTML = `
    <div class="card-bubbles">
      <div class="card-bubble ${combo[0]} b1"></div>
      <div class="card-bubble ${combo[1]} b2"></div>
    </div>
    <div class="scroll-item-content">
      <div class="model-tag">
        <svg class="icon" aria-hidden="true"><use href="sprite.svg#icon-cpu"></use></svg>
        ${model.tagLabel || model.shortType || model.category || ""}
      </div>
      <div class="model-title" id="model-title-${model.id}">${model.title}</div>
      <div class="model-desc">${model.description || ""}</div>
      <div class="model-meta">
        <div class="meta-icons">
          <span class="like-btn ${isLiked ? "text-danger" : ""}" data-id="${model.id}" role="button" tabindex="0" aria-label="Нравится">
            <svg class="icon ${isLiked ? 'icon-fill' : ''}" aria-hidden="true"><use href="sprite.svg#${heartIcon}"></use></svg>
            ${model.likes ?? 0}
          </span>
          <span class="favorite-btn ${isFavorite ? "text-warning" : ""}" data-id="${model.id}" role="button" tabindex="0" aria-label="В избранное">
            <svg class="icon ${isFavorite ? 'icon-fill' : ''}" aria-hidden="true"><use href="sprite.svg#${starIcon}"></use></svg>
          </span>
          <span>
            <svg class="icon" aria-hidden="true"><use href="sprite.svg#icon-download"></use></svg>
            ${model.downloads ?? 0}
          </span>
        </div>
        <span class="model-badge">${metricText}</span>
      </div>
    </div>
  `;

  const tagEl = item.querySelector(".model-tag");
  tagEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    const searchValue = (model.tagLabel || model.shortType || model.category || "").trim();
    const input = document.getElementById("searchInput");
    if (input) input.value = searchValue;
    loadAndRenderModels(searchValue ? { search: searchValue } : {});
  });

  item.addEventListener("click", (e) => {
    if (e.target.closest(".like-btn") || e.target.closest(".favorite-btn")) return;
    alert(`Детальная страница модели "${model.title}"`);
  });

  const likeEl = item.querySelector(".like-btn");
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
    const iconSvg = likeEl.querySelector("svg use");
    const newCount = (model.likes ?? 0) + (already ? -1 : 1);
    if (!already) {
      likeEl.classList.add("text-danger");
      iconSvg.setAttribute("href", "sprite.svg#icon-heart-fill");
      likeEl.querySelector("svg").classList.add("icon-fill");
    } else {
      likeEl.classList.remove("text-danger");
      iconSvg.setAttribute("href", "sprite.svg#icon-heart");
      likeEl.querySelector("svg").classList.remove("icon-fill");
    }
    likeEl.innerHTML = `<svg class="icon ${!already ? 'icon-fill' : ''}" aria-hidden="true"><use href="sprite.svg#${!already ? 'icon-heart-fill' : 'icon-heart'}"></use></svg> ${newCount}`;
    model.likes = newCount;
    likeEl.setAttribute("aria-label", `Нравится (${newCount})`);
  });

  const favEl = item.querySelector(".favorite-btn");
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
    const iconSvg = favEl.querySelector("svg use");
    if (!already) {
      favEl.classList.add("text-warning");
      iconSvg.setAttribute("href", "sprite.svg#icon-star-fill");
      favEl.querySelector("svg").classList.add("icon-fill");
      favEl.setAttribute("aria-label", "Убрать из избранного");
    } else {
      favEl.classList.remove("text-warning");
      iconSvg.setAttribute("href", "sprite.svg#icon-star");
      favEl.querySelector("svg").classList.remove("icon-fill");
      favEl.setAttribute("aria-label", "В избранное");
    }
  });

  return item;
}

const carouselState = { models: [], index: 0 };

async function loadAndRenderModels(filters = {}) {
  const track = document.getElementById("modelsTrack");
  if (!track) return;
  track.innerHTML = '<p class="text-muted">Загрузка моделей...</p>';
  try {
    const models = await getModels(filters);
    track.innerHTML = "";
    carouselState.models = models || [];
    carouselState.index = 0;
    if (!Array.isArray(models) || !models.length) {
      track.innerHTML = '<p class="text-muted">По вашему запросу ничего не найдено.</p>';
      updateCarouselDots(0);
      return;
    }
    models.forEach((m, idx) => track.appendChild(createModelCard(m, idx)));
    track.style.transform = "translateX(0)";
    updateCarouselDots(models.length);
  } catch (e) {
    console.error(e);
    track.innerHTML = '<p class="text-danger">Ошибка загрузки моделей.</p>';
  }
}

function updateCarouselDots(total) {
  const dotsContainer = document.getElementById("carouselDots");
  if (!dotsContainer) return;
  dotsContainer.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "carousel-dot" + (i === 0 && total > 0 ? " active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
    dot.tabIndex = 0;
    dot.addEventListener("click", () => {
      if (!carouselState.models.length) return;
      const start = Math.floor((carouselState.models.length / 3) * i);
      carouselState.index = start;
      applyTransform();
      document.querySelectorAll(".carousel-dot").forEach((d, idx) => {
        d.classList.toggle("active", idx === i);
        d.setAttribute("aria-selected", idx === i ? "true" : "false");
      });
    });
    dotsContainer.appendChild(dot);
  }
}

function applyTransform() {
  const track = document.getElementById("modelsTrack");
  const step = 260 + 30;
  const total = carouselState.models.length;
  if (!total) return;
  const normalized = ((carouselState.index % total) + total) % total;
  track.style.transform = `translateX(${-normalized * step}px)`;
}

function setupCarouselControls() {
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  if (!prevBtn || !nextBtn) return;
  prevBtn.addEventListener("click", () => {
    carouselState.index--;
    applyTransform();
    const total = carouselState.models.length;
    if (total) {
      const zone = Math.floor((((carouselState.index % total) + total) % total) / total * 3);
      document.querySelectorAll(".carousel-dot").forEach((d, i) => {
        d.classList.toggle("active", i === zone);
        d.setAttribute("aria-selected", i === zone ? "true" : "false");
      });
    }
  });
  nextBtn.addEventListener("click", () => {
    carouselState.index++;
    applyTransform();
    const total = carouselState.models.length;
    if (total) {
      const zone = Math.floor((((carouselState.index % total) + total) % total) / total * 3);
      document.querySelectorAll(".carousel-dot").forEach((d, i) => {
        d.classList.toggle("active", i === zone);
        d.setAttribute("aria-selected", i === zone ? "true" : "false");
      });
    }
  });
}

function setupSearch() {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  if (!form || !input) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    loadAndRenderModels(input.value.trim() ? { search: input.value.trim() } : {});
  });
}

function setupPopularTags() {
  document.querySelectorAll(".popular-tag-pill").forEach(tag => {
    tag.addEventListener("click", () => {
      const search = tag.getAttribute("data-search") || "";
      const input = document.getElementById("searchInput");
      if (input) input.value = search;
      loadAndRenderModels(search ? { search } : {});
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavbarAuth();
  setupSearch();
  setupPopularTags();
  setupCarouselControls();
  loadAndRenderModels();
});