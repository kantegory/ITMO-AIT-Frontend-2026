import { getSpaces, isLoggedIn, logout } from "./api.js";

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

function createSpaceCard(space, index) {
  const card = document.createElement("article");
  card.className = "space-card";
  card.dataset.id = space.id;
  card.setAttribute("role", "article");
  card.setAttribute("aria-labelledby", `space-title-${space.id}`);
  card.tabIndex = 0;

  const likedIds = JSON.parse(localStorage.getItem("likedSpaceIds") || "[]");
  const isLiked = likedIds.includes(space.id);

  card.innerHTML = `
    <span class="space-tag" data-tag="${space.badge || ""}" role="button" tabindex="0" aria-label="Фильтровать по тегу ${space.badge || "Demo"}">
      <svg class="icon" aria-hidden="true"><use href="sprite.svg#icon-lightning-charge"></use></svg> ${space.badge || "Demo · Space"}
    </span>
    <h2 class="space-title mb-0" id="space-title-${space.id}">${space.title}</h2>
    <div class="space-meta">${space.extra1 || ""}</div>
    <p class="space-desc">
      ${space.description || ""}
    </p>
    <div class="space-footer">
      <div class="space-stats">
        <span><svg class="icon" aria-hidden="true"><use href="sprite.svg#icon-people"></use></svg> ${space.runs ?? 0} запусков</span>
        <span class="like-btn ${isLiked ? "text-danger" : ""}" data-id="${space.id}" role="button" tabindex="0" aria-label="Нравится (${space.likes ?? 0})">
          <svg class="icon ${isLiked ? 'icon-fill' : ''}" aria-hidden="true"><use href="sprite.svg#${isLiked ? 'icon-heart-fill' : 'icon-heart'}"></use></svg> ${space.likes ?? 0}
        </span>
      </div>
      <a href="#" class="text-decoration-none small" aria-label="Открыть пространство ${space.title}">Открыть пространство <svg class="icon" aria-hidden="true"><use href="sprite.svg#icon-arrow-right-short"></use></svg></a>
    </div>
  `;

  const tagEl = card.querySelector(".space-tag");
  tagEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    const tag = tagEl.getAttribute("data-tag") || "";
    applySpaceFilter({ search: tag });
  });

  card.addEventListener("click", (e) => {
    if (e.target.closest(".like-btn") || e.target.closest(".space-tag") || e.target.closest("a")) {
      return;
    }
    alert(`Здесь могла бы быть страница пространства "${space.title}"`);
  });

  const likeEl = card.querySelector(".like-btn");
  likeEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      alert("Войдите, чтобы ставить лайки пространствам");
      window.location.href = "login.html";
      return;
    }
    let liked = JSON.parse(localStorage.getItem("likedSpaceIds") || "[]");
    const already = liked.includes(space.id);
    liked = already ? liked.filter(id => id !== space.id) : [...liked, space.id];
    localStorage.setItem("likedSpaceIds", JSON.stringify(liked));
    const newCount = (space.likes ?? 0) + (already ? -1 : 1);
    const newHeartIcon = !already ? 'icon-heart-fill' : 'icon-heart';
    likeEl.innerHTML = `<svg class="icon ${!already ? 'icon-fill' : ''}" aria-hidden="true"><use href="sprite.svg#${newHeartIcon}"></use></svg> ${newCount}`;
    space.likes = newCount;
    likeEl.setAttribute("aria-label", `Нравится (${newCount})`);
    if (!already) {
      likeEl.classList.add("text-danger");
    } else {
      likeEl.classList.remove("text-danger");
    }
  });

  return card;
}

async function renderSpaces(filters = {}) {
  const grid = document.getElementById("spacesGrid");
  if (!grid) return;

  grid.innerHTML = '<p class="text-muted">Загрузка пространств...</p>';

  try {
    const spaces = await getSpaces(filters);
    grid.innerHTML = "";

    if (!Array.isArray(spaces) || !spaces.length) {
      grid.innerHTML = '<p class="text-muted">По вашему запросу ничего не найдено.</p>';
      return;
    }

    spaces.forEach((s, idx) => {
      grid.appendChild(createSpaceCard(s, idx));
    });
  } catch (e) {
    console.error("renderSpaces error:", e);
    grid.innerHTML = '<p class="text-danger">Ошибка загрузки пространств.</p>';
  }
}

function applySpaceFilter(filterObj) {
  renderSpaces(filterObj);
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavbarAuth();
  renderSpaces();
});