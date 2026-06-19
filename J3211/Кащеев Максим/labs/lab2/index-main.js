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
        <i class="bi bi-person-circle me-1"></i>${user.name || "Мой аккаунт"}
      </a>
      <button class="btn btn-outline-glass btn-sm" id="btnLogout">
        Выйти
      </button>
    </div>
  `;

  document.getElementById("btnLogout")?.addEventListener("click", logout);
}

function createModelCard(model, index) {
  const item = document.createElement("div");
  item.className = "scroll-item";
  item.dataset.id = model.id;

  const combos = [
    ["cb-blue", "cb-pink"],
    ["cb-cyan", "cb-blue"],
    ["cb-pink", "cb-lime"],
    ["cb-lime", "cb-cyan"],
  ];
  const combo = combos[index % combos.length];

  const metricText = model.badge || model.extra1 || "";

  const likedIds = JSON.parse(localStorage.getItem("likedModelIds") || "[]");
  const favoriteIds = JSON.parse(
    localStorage.getItem("favoriteModelIds") || "[]",
  );
  const isLiked = likedIds.includes(model.id);
  const isFavorite = favoriteIds.includes(model.id);

  item.innerHTML = `
    <div class="card-bubbles">
      <div class="card-bubble ${combo[0]} b1"></div>
      <div class="card-bubble ${combo[1]} b2"></div>
    </div>
    <div class="scroll-item-content">
      <div class="model-tag">
        <i class="bi bi-cpu"></i> ${model.tagLabel || model.shortType || model.category || ""}
      </div>
      <div class="model-title">${model.title}</div>
      <div class="model-desc">${model.description}</div>
      <div class="model-meta">
        <div class="meta-icons">
          <span class="like-btn ${isLiked ? "text-danger" : ""}" data-id="${model.id}">
            <i class="bi bi-heart${isLiked ? "-fill" : ""}"></i> ${model.likes ?? 0}
          </span>
          <span class="favorite-btn ${isFavorite ? "text-warning" : ""}" data-id="${model.id}">
            <i class="bi bi-star${isFavorite ? "-fill" : ""}"></i>
          </span>
          <span><i class="bi bi-download"></i> ${model.downloads ?? 0}</span>
        </div>
        <span class="model-badge">${metricText}</span>
      </div>
    </div>
  `;

  const tagEl = item.querySelector(".model-tag");
  tagEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    const searchValue = (
      model.tagLabel ||
      model.shortType ||
      model.category ||
      ""
    ).trim();
    const input = document.getElementById("searchInput");
    if (input) input.value = searchValue;
    loadAndRenderModels(searchValue ? { search: searchValue } : {});
  });

  item.addEventListener("click", (e) => {
    if (e.target.closest(".like-btn") || e.target.closest(".favorite-btn"))
      return;
    alert(`Здесь могла бы быть детальная страница модели "${model.title}"`);
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
    liked = already
      ? liked.filter((id) => id !== model.id)
      : [...liked, model.id];
    localStorage.setItem("likedModelIds", JSON.stringify(liked));
    const icon = likeEl.querySelector("i");
    if (!already) {
      likeEl.classList.add("text-danger");
      icon.classList.replace("bi-heart", "bi-heart-fill");
    } else {
      likeEl.classList.remove("text-danger");
      icon.classList.replace("bi-heart-fill", "bi-heart");
    }
  });

  const favEl = item.querySelector(".favorite-btn");
  favEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      alert("Войдите, чтобы добавлять модели в избранное");
      window.location.href = "login.html";
      return;
    }
    let favorites = JSON.parse(
      localStorage.getItem("favoriteModelIds") || "[]",
    );
    const already = favorites.includes(model.id);
    favorites = already
      ? favorites.filter((id) => id !== model.id)
      : [...favorites, model.id];
    localStorage.setItem("favoriteModelIds", JSON.stringify(favorites));
    const icon = favEl.querySelector("i");
    if (!already) {
      favEl.classList.add("text-warning");
      icon.classList.replace("bi-star", "bi-star-fill");
    } else {
      favEl.classList.remove("text-warning");
      icon.classList.replace("bi-star-fill", "bi-star");
    }
  });

  return item;
}

const carouselState = {
  models: [],
  index: 0,
};

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
      track.innerHTML =
        '<p class="text-muted">По вашему запросу ничего не найдено.</p>';
      updateCarouselDots(0);
      return;
    }

    models.forEach((m, idx) => {
      track.appendChild(createModelCard(m, idx));
    });

    track.style.transform = "translateX(0)";
    updateCarouselDots(models.length);
  } catch (e) {
    console.error("loadAndRenderModels error:", e);
    track.innerHTML = '<p class="text-danger">Ошибка загрузки моделей.</p>';
  }
}

function setupSearch() {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const search = input.value.trim();
    loadAndRenderModels(search ? { search } : {});
  });
}

function setupPopularTags() {
  const tags = document.querySelectorAll(".popular-tag-pill");
  tags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const search = tag.getAttribute("data-search") || "";
      const input = document.getElementById("searchInput");
      if (input) input.value = search;
      loadAndRenderModels(search ? { search } : {});
    });
  });
}

function updateCarouselDots(total) {
  const dotsContainer = document.getElementById("carouselDots");
  if (!dotsContainer) return;
  const dots = Array.from(dotsContainer.querySelectorAll(".carousel-dot"));
  if (!total) {
    dots.forEach((d) => d.classList.remove("active"));
    return;
  }
  dots.forEach((dot, idx) => {
    dot.style.opacity = total <= idx ? "0.3" : "1";
  });
  dots.forEach((d, i) => d.classList.toggle("active", i === 0));
}

function setupCarouselControls() {
  const track = document.getElementById("modelsTrack");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  const dotsContainer = document.getElementById("carouselDots");
  const dots = dotsContainer
    ? Array.from(dotsContainer.querySelectorAll(".carousel-dot"))
    : [];

  if (!track || !prevBtn || !nextBtn || !dots.length) return;

  const cardWidth = 260;
  const gap = 30;
  const step = cardWidth + gap;

  function applyTransform() {
    const total = carouselState.models.length;
    if (!total) {
      track.style.transform = "translateX(0)";
      return;
    }
    const normalized = ((carouselState.index % total) + total) % total;
    const x = -normalized * step;
    track.style.transition = "transform 0.25s ease-out";
    track.style.transform = `translateX(${x}px)`;
  }

  function syncDots() {
    const total = carouselState.models.length;
    if (!total) return;
    const normalized = ((carouselState.index % total) + total) % total;
    const zone = Math.floor((normalized / total) * 3);
    dots.forEach((d, i) => d.classList.toggle("active", i === zone));
  }

  function move(delta) {
    if (!carouselState.models.length) return;
    carouselState.index += delta;
    applyTransform();
    syncDots();
  }

  prevBtn.addEventListener("click", () => move(-1));
  nextBtn.addEventListener("click", () => move(1));

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      const total = carouselState.models.length;
      if (!total) return;
      const start = Math.floor((total / 3) * idx);
      carouselState.index = start;
      applyTransform();
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    });
  });

  applyTransform();
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavbarAuth();
  setupSearch();
  setupPopularTags();
  setupCarouselControls();
  loadAndRenderModels();
});
