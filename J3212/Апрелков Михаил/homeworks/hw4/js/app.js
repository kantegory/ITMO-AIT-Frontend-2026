const API_BASE_URL = "http://localhost:3000";
const CURRENT_USER_KEY = "currentUser";
const THEME_STORAGE_KEY = "tripatropa-theme";

function applyThemeFromStorage() {
  try {
    if (localStorage.getItem(THEME_STORAGE_KEY) === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {}
}

applyThemeFromStorage();

function setupThemeToggle() {
  document.querySelectorAll("#themeToggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        try {
          localStorage.setItem(THEME_STORAGE_KEY, "light");
        } catch (e) {}
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        try {
          localStorage.setItem(THEME_STORAGE_KEY, "dark");
        } catch (e) {}
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  setupThemeToggle();
  setupBudgetSlider();
  setupCopyLink();
  setupAuthNavButton();
  setupAuthForms();

  await initSearchPage();
  await initDestinationPage();
  await initProfilePage();
  await initCollaborationPage();
});

const SPRITE_URL = "images/sprite.svg";

function iconSprite(name, extraClass) {
  const id = name.indexOf("icon-") === 0 ? name : "icon-" + name;
  const cls = "icon-svg" + (extraClass ? " " + extraClass : "");
  return (
    '<svg class="' +
    cls +
    '" aria-hidden="true" focusable="false"><use href="' +
    SPRITE_URL +
    "#" +
    id +
    '"></use></svg>'
  );
}

function showToast(message) {
  const toastEl = document.getElementById("mainToast");
  if (!toastEl || typeof bootstrap === "undefined") return;

  const body = toastEl.querySelector(".toast-body");
  if (body) body.textContent = message;

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toast.show();
}

async function apiRequest(path, options) {
  const response = await fetch(API_BASE_URL + path, options);
  if (!response.ok) {
    throw new Error("API error: " + response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function getSavedRoutesForUser(userId) {
  const uid = Number(userId);
  if (!Number.isFinite(uid)) return [];
  const allSaved = await apiRequest("/savedRoutes");
  return allSaved.filter(function (item) {
    return Number(item.userId) === uid;
  });
}

function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

async function loginUser(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  let users = await apiRequest(
    "/users?email=" +
      encodeURIComponent(normalizedEmail) +
      "&password=" +
      encodeURIComponent(password)
  );
  if (!users.length) {
    const byEmail = await apiRequest(
      "/users?email=" + encodeURIComponent(normalizedEmail)
    );
    users = byEmail.filter((user) => String(user.password) === String(password));
  }
  if (!users.length) return null;
  const user = users[0];
  setCurrentUser(user);
  return user;
}

async function registerUser(name, email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const existing = await apiRequest("/users?email=" + encodeURIComponent(normalizedEmail));
  if (existing.length) {
    throw new Error("Пользователь с таким email уже существует");
  }

  const payload = {
    name,
    email: normalizedEmail,
    password
  };
  return apiRequest("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

function setupAuthNavButton() {
  const links = document.querySelectorAll('a[href="login.html"]');
  if (!links.length) return;
  const user = getCurrentUser();

  links.forEach((link) => {
    const text = link.textContent ? link.textContent.trim() : "";
    const isNavAuthButton =
      text === "Войти" ||
      text === "Выйти" ||
      link.classList.contains("btn-outline-primary");
    if (!isNavAuthButton) return;

    if (user) {
      link.textContent = "Выйти";
      link.addEventListener("click", function (e) {
        e.preventDefault();
        logout();
        window.location.href = "login.html";
      });
    } else {
      link.textContent = "Войти";
      link.setAttribute("href", "login.html");
    }
  });
}

function setupAuthForms() {
  setupLoginForm();
  setupRegisterForm();
}

function setupLoginForm() {
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  if (!emailInput || !passwordInput) return;

  const form = emailInput.closest("form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    try {
      const user = await loginUser(emailInput.value.trim(), passwordInput.value);
      if (!user) {
        showToast("Неверный email или пароль");
        return;
      }
      window.location.href = "search.html";
    } catch (error) {
      showToast("Ошибка входа");
    }
  });
}

function setupRegisterForm() {
  const nameInput = document.getElementById("registerName");
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");
  const passwordConfirmInput = document.getElementById("registerPasswordConfirm");
  if (!nameInput || !emailInput || !passwordInput || !passwordConfirmInput) return;

  const form = nameInput.closest("form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (passwordInput.value !== passwordConfirmInput.value) {
      showToast("Пароли не совпадают");
      return;
    }

    try {
      await registerUser(
        nameInput.value.trim(),
        emailInput.value.trim(),
        passwordInput.value
      );
      showToast("Аккаунт создан, теперь войдите");
      setTimeout(function () {
        window.location.href = "login.html";
      }, 500);
    } catch (error) {
      showToast(error.message || "Ошибка регистрации");
    }
  });
}

function setupBudgetSlider() {
  const range = document.getElementById("budgetRange");
  const output = document.getElementById("budgetValue");
  if (!range || !output) return;

  const update = () => {
    output.textContent = range.value + " ₽";
  };

  update();
  range.addEventListener("input", update);
}

function setupCopyLink() {
  const btn = document.getElementById("copyRouteLinkBtn");
  const input = document.getElementById("shareRouteInput");
  if (!btn || !input) return;

  btn.addEventListener("click", function () {
    const text = input.value;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast("Ссылка скопирована"),
        () => showToast("Не удалось скопировать")
      );
    } else {
      showToast("Не удалось скопировать");
    }
  });
}

function bindSearchFormSubmitGuard() {
  const form = document.querySelector("[data-search-form]");
  if (!form || form.dataset.submitGuard === "true") return;
  form.dataset.submitGuard = "true";
  form.addEventListener(
    "submit",
    function (e) {
      e.preventDefault();
    },
    true
  );
}

async function initSearchPage() {
  const grid = document.querySelector("[data-routes-grid]");
  if (!grid) return;

  bindSearchFormSubmitGuard();
  setupSaveButtons();

  try {
    const routes = await apiRequest("/routes");
    const user = getCurrentUser();
    const saved = user ? await getSavedRoutesForUser(user.id) : [];
    const savedByRouteId = new Set(saved.map((item) => String(item.routeId)));

    renderRoutes(grid, routes, savedByRouteId);
  } catch (error) {
    showToast("Не удалось загрузить маршруты");
  }

  setupSearchFilters();
}

function renderRoutes(grid, routes, savedByRouteId) {
  const html = routes
    .map((route, index) => {
      const isSaved = savedByRouteId.has(String(route.id));
      const saveClass = isSaved ? "btn-success" : "btn-outline-secondary";
      const saveText = isSaved ? "Сохранено" : "Сохранить";
      const durationGroup = getDurationGroup(route.durationDays);
      const typeLabel = route.type === "nature" ? "Природа" : "Город";

      return (
        '<div class="col-md-6 col-lg-4" data-route-card data-title="' +
        escapeAttr(route.title.toLowerCase()) +
        '" data-type="' +
        escapeAttr(route.type) +
        '" data-budget="' +
        Number(route.budget) +
        '" data-duration-group="' +
        durationGroup +
        '" data-duration-days="' +
        Number(route.durationDays) +
        '" data-route-id="' +
        route.id +
        '" data-original-index="' +
        index +
        '">' +
        '<div class="card tripatropa-card h-100">' +
        '<img src="' +
        escapeAttr(route.image) +
        '" class="card-img-top" alt="' +
        escapeAttr(route.title) +
        '" />' +
        '<div class="card-body">' +
        '<h5 class="card-title mb-1">' +
        escapeHtml(route.title) +
        "</h5>" +
        '<p class="card-text text-muted-sm mb-2">' +
        escapeHtml(route.description) +
        "</p>" +
        '<div class="mb-3 d-flex flex-wrap gap-2">' +
        '<span class="badge bg-primary-subtle text-primary">' +
        iconSprite("buildings", "me-1") +
        " " +
        escapeHtml(typeLabel) +
        "</span>" +
        '<span class="badge bg-success-subtle text-success">' +
        Number(route.durationDays) +
        " дня</span>" +
        '<span class="badge bg-secondary-subtle text-secondary">' +
        Number(route.budget).toLocaleString("ru-RU") +
        " ₽</span>" +
        "</div>" +
        '<div class="d-flex justify-content-between align-items-center mt-auto">' +
        '<a href="destination.html?id=' +
        route.id +
        '" class="btn btn-outline-primary btn-sm">Открыть</a>' +
        '<button type="button" class="btn btn-sm btn-save-route ' +
        saveClass +
        '" data-saved="' +
        (isSaved ? "true" : "false") +
        '" data-route-id="' +
        route.id +
        '">' +
        saveText +
        "</button>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
      );
    })
    .join("");

  grid.innerHTML = html;
}

function getDurationGroup(days) {
  const value = Number(days);
  if (value <= 3) return "1-3";
  if (value <= 7) return "4-7";
  if (value <= 14) return "8-14";
  return "15+";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return String(value).replaceAll('"', "&quot;");
}

function setupSaveButtons() {
  const grid = document.querySelector("[data-routes-grid]");
  if (!grid || grid.dataset.saveBound === "true") return;
  grid.dataset.saveBound = "true";

  grid.addEventListener("click", async function (e) {
    const btn = e.target.closest(".btn-save-route");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const currentUser = getCurrentUser();
    if (!currentUser) {
      showToast("Войдите, чтобы сохранять маршруты");
      return;
    }

    const uid = Number(currentUser.id);
    if (!Number.isFinite(uid)) {
      showToast("Ошибка сессии — войдите снова");
      return;
    }

    const routeId = Number(btn.dataset.routeId);
    if (!Number.isFinite(routeId)) {
      showToast("Не удалось определить маршрут");
      return;
    }

    try {
      const isSaved = btn.getAttribute("data-saved") === "true";
      if (isSaved) {
        const savedItems = (await getSavedRoutesForUser(uid)).filter(function (item) {
          return Number(item.routeId) === routeId;
        });
        if (savedItems.length) {
          await apiRequest("/savedRoutes/" + savedItems[0].id, {
            method: "DELETE"
          });
        }
        btn.setAttribute("data-saved", "false");
        btn.classList.remove("btn-success");
        btn.classList.add("btn-outline-secondary");
        btn.textContent = "Сохранить";
        showToast("Маршрут удалён из сохранённых");
      } else {
        await apiRequest("/savedRoutes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: uid,
            routeId: routeId
          })
        });
        btn.setAttribute("data-saved", "true");
        btn.classList.remove("btn-outline-secondary");
        btn.classList.add("btn-success");
        btn.textContent = "Сохранено";
        showToast("Маршрут сохранён");
      }
    } catch (error) {
      showToast("Ошибка сохранения маршрута");
    }
  });
}

function setupSearchFilters() {
  const form = document.querySelector("[data-search-form]");
  const grid = document.querySelector("[data-routes-grid]");
  if (!form || !grid) return;
  if (form.dataset.filtersBound === "true") return;
  form.dataset.filtersBound = "true";

  const destinationInput = document.getElementById("destinationInput");
  const typeSelect = document.getElementById("typeSelect");
  const budgetRange = document.getElementById("budgetRange");
  const durationSelect = document.getElementById("durationSelect");
  const sortSelect = document.getElementById("sortSelect");
  const countEl = document.getElementById("routesCount");

  const cards = Array.from(grid.querySelectorAll("[data-route-card]"));

  function applyFilters() {
    const query = destinationInput ? destinationInput.value.trim().toLowerCase() : "";
    const typeValue = typeSelect ? typeSelect.value : "any";
    const budgetMax = budgetRange ? Number(budgetRange.value) : Number.POSITIVE_INFINITY;
    const durationValue = durationSelect ? durationSelect.value : "any";

    let visibleCount = 0;

    cards.forEach((card) => {
      const title = (card.dataset.title || "").toLowerCase();
      const cardType = card.dataset.type || "city";
      const cardBudget = Number(card.dataset.budget || "0");
      const cardDurationGroup = card.dataset.durationGroup || "any";

      let visible = true;

      if (query && !title.includes(query)) visible = false;
      if (visible && typeValue !== "any" && cardType !== typeValue) visible = false;
      if (visible && cardBudget > budgetMax) visible = false;
      if (visible && durationValue !== "any" && cardDurationGroup !== durationValue) {
        visible = false;
      }

      card.style.display = visible ? "" : "none";
      if (visible) visibleCount += 1;
    });

    if (countEl) {
      countEl.textContent = visibleCount + " " + getRoutesWord(visibleCount);
    }
  }

  function sortCards() {
    if (!sortSelect) return;
    const mode = sortSelect.value;
    const sorted = [...cards].sort((a, b) => {
      if (mode === "price") {
        return Number(a.dataset.budget || "0") - Number(b.dataset.budget || "0");
      }
      if (mode === "duration") {
        return Number(a.dataset.durationDays || "0") - Number(b.dataset.durationDays || "0");
      }
      return Number(a.dataset.originalIndex || "0") - Number(b.dataset.originalIndex || "0");
    });

    sorted.forEach((card) => grid.appendChild(card));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    sortCards();
    applyFilters();
  });

  if (destinationInput) destinationInput.addEventListener("input", applyFilters);
  if (typeSelect) typeSelect.addEventListener("change", applyFilters);
  if (budgetRange) budgetRange.addEventListener("input", applyFilters);
  if (durationSelect) durationSelect.addEventListener("change", applyFilters);
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      sortCards();
      applyFilters();
    });
  }

  sortCards();
  applyFilters();
}

function getRoutesWord(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "маршрут";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "маршрута";
  return "маршрутов";
}

async function initDestinationPage() {
  const tabs = document.getElementById("destinationTabs");
  if (!tabs) return;

  const params = new URLSearchParams(window.location.search);
  const routeId = Number(params.get("id") || "1");

  try {
    const route = await apiRequest("/routes/" + routeId);
    const reviews = await apiRequest("/reviews?routeId=" + routeId);
    renderDestination(route, reviews);
    setupReviewCreate(routeId);
    setupReviewDelete();
  } catch (error) {
    showToast("Не удалось загрузить страницу маршрута");
  }
}

function renderDestination(route, reviews) {
  const titleEl = document.querySelector("h1.h3");
  const descEl = document.querySelector("section.bg-dark p.mb-3");
  const heroImage = document.querySelector("section.bg-dark img");
  const badges = document.querySelectorAll("section.bg-dark .badge");
  const attractionsRow = document.querySelector("#attractions .row.g-4");
  const recList = document.querySelector("#attractions .list-group");
  const reviewsRow = document.querySelector("#reviews .row.g-4");
  const mapBlock = document.querySelector("#map .ratio");
  const currentUser = getCurrentUser();

  if (titleEl) titleEl.textContent = route.title;
  if (descEl) descEl.textContent = route.description;
  if (heroImage && route.image) {
    heroImage.src = route.image;
    heroImage.alt = route.title;
  }
  if (badges[0])
    badges[0].innerHTML =
      iconSprite("buildings", "me-1") + " " + (route.type === "nature" ? "Природа" : "Город");
  if (badges[1])
    badges[1].innerHTML =
      iconSprite("clock", "me-1") + " " + route.durationDays + " дня";
  if (badges[2])
    badges[2].innerHTML =
      iconSprite("currency-ruble", "me-1") +
      " ~" +
      Number(route.budget).toLocaleString("ru-RU") +
      " ₽";

  if (attractionsRow && Array.isArray(route.attractions)) {
    attractionsRow.innerHTML = route.attractions
      .map(
        (item) =>
          '<div class="col-md-4"><div class="card tripatropa-card h-100"><div class="card-body"><h5 class="card-title">' +
          escapeHtml(item.name) +
          '</h5><p class="card-text text-muted-sm">' +
          escapeHtml(item.description) +
          '</p><span class="badge bg-primary-subtle text-primary">' +
          escapeHtml(item.day) +
          "</span></div></div></div>"
      )
      .join("");
  }

  if (recList && Array.isArray(route.recommendations)) {
    recList.innerHTML = route.recommendations
      .map((item) => '<li class="list-group-item">' + escapeHtml(item) + "</li>")
      .join("");
  }

  if (reviewsRow) {
    reviewsRow.innerHTML = reviews
      .map((review) => buildReviewCardHtml(review, currentUser))
      .join("");
  }

  if (mapBlock && route.map && route.map.lat && route.map.lng) {
    const lat = Number(route.map.lat);
    const lng = Number(route.map.lng);
    const zoom = Number(route.map.zoom || 12);
    const delta = 0.05;
    const left = lng - delta;
    const right = lng + delta;
    const top = lat + delta;
    const bottom = lat - delta;
    const src =
      "https://www.openstreetmap.org/export/embed.html?bbox=" +
      encodeURIComponent(left + "," + bottom + "," + right + "," + top) +
      "&layer=mapnik&marker=" +
      encodeURIComponent(lat + "," + lng);

    mapBlock.classList.remove("d-flex", "align-items-center", "justify-content-center", "bg-light");
    mapBlock.innerHTML =
      '<iframe title="Карта маршрута" src="' +
      src +
      '" style="width:100%;height:100%;border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
  }
}

function renderStars(rating) {
  const rounded = Math.max(0, Math.min(5, Number(rating) || 0));
  let html = "";
  for (let i = 1; i <= 5; i += 1) {
    html += i <= rounded ? iconSprite("star-fill", "") : iconSprite("star", "");
  }
  return html;
}

function buildReviewCardHtml(review, currentUser) {
  const currentUserId = currentUser ? Number(currentUser.id) : null;
  const reviewAuthorId = review.authorId != null ? Number(review.authorId) : null;
  const canDelete = currentUserId !== null && reviewAuthorId === currentUserId;
  const deleteButton = canDelete
    ? '<button type="button" class="btn btn-outline-danger btn-sm" data-delete-review-id="' +
      review.id +
      '">Удалить</button>'
    : "";

  return (
    '<div class="col-md-4" data-review-id="' +
    review.id +
    '"><div class="card tripatropa-card h-100"><div class="card-body"><div class="d-flex justify-content-between mb-1"><span class="fw-semibold">' +
    escapeHtml(review.author) +
    '</span><span class="text-warning">' +
    renderStars(review.rating) +
    '</span></div><p class="text-muted-sm mb-2">' +
    escapeHtml(review.text) +
    "</p>" +
    deleteButton +
    "</div></div></div>"
  );
}

function setupReviewCreate(routeId) {
  const reviewsPane = document.getElementById("reviews");
  if (!reviewsPane) return;
  if (reviewsPane.querySelector("[data-review-create]")) return;

  const formHtml =
    '<div class="card tripatropa-card mb-3" data-review-create>' +
    '<div class="card-body">' +
    '<h2 class="h6 mb-2">Добавить отзыв</h2>' +
    '<div class="row g-2 align-items-end">' +
    '<div class="col-md-7"><label class="form-label mb-1">Текст</label><input type="text" class="form-control" id="reviewTextInput" placeholder="Краткий отзыв" /></div>' +
    '<div class="col-md-3"><label class="form-label mb-1">Оценка</label><select class="form-select" id="reviewRatingInput"><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option></select></div>' +
    '<div class="col-md-2 d-grid"><button class="btn btn-primary" id="addReviewBtn" type="button">Добавить</button></div>' +
    "</div>" +
    "</div>" +
    "</div>";

  reviewsPane.insertAdjacentHTML("afterbegin", formHtml);
  const addBtn = document.getElementById("addReviewBtn");
  const textInput = document.getElementById("reviewTextInput");
  const ratingInput = document.getElementById("reviewRatingInput");
  const reviewsRow = document.querySelector("#reviews .row.g-4");
  if (!addBtn || !textInput || !ratingInput || !reviewsRow) return;

  addBtn.addEventListener("click", async function () {
    const text = textInput.value.trim();
    if (!text) {
      showToast("Введите текст отзыва");
      return;
    }

    const user = getCurrentUser();
    const author = user && user.name ? user.name : "Гость";
    const authorId = user ? Number(user.id) : null;
    const rating = Number(ratingInput.value || "5");

    try {
      const review = await apiRequest("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          routeId: Number(routeId),
          author: author,
          authorId: authorId,
          rating: rating,
          text: text
        })
      });

      reviewsRow.insertAdjacentHTML(
        "afterbegin",
        buildReviewCardHtml(review, user)
      );
      textInput.value = "";
      ratingInput.value = "5";
      showToast("Отзыв добавлен");
    } catch (error) {
      showToast("Не удалось добавить отзыв");
    }
  });
}

function setupReviewDelete() {
  const reviewsRow = document.querySelector("#reviews .row.g-4");
  if (!reviewsRow || reviewsRow.dataset.deleteReady === "true") return;
  reviewsRow.dataset.deleteReady = "true";

  reviewsRow.addEventListener("click", async function (e) {
    const btn = e.target.closest("[data-delete-review-id]");
    if (!btn) return;

    const reviewId = btn.getAttribute("data-delete-review-id");
    if (!reviewId) return;
    const user = getCurrentUser();
    if (!user) {
      showToast("Только авторизованный пользователь может удалить свой отзыв");
      return;
    }

    try {
      const review = await apiRequest("/reviews/" + reviewId);
      if (!review || Number(review.authorId) !== Number(user.id)) {
        showToast("Можно удалить только свой отзыв");
        return;
      }

      await apiRequest("/reviews/" + reviewId, {
        method: "DELETE"
      });
      const card = btn.closest("[data-review-id]");
      if (card) card.remove();
      showToast("Отзыв удалён");
    } catch (error) {
      showToast("Не удалось удалить отзыв");
    }
  });
}

async function initProfilePage() {
  const notesInput = document.getElementById("travelNotes");
  const saveBtn = document.getElementById("saveNoteBtn");
  if (!notesInput || !saveBtn) return;

  const user = getCurrentUser();
  if (!user) {
    showToast("Войдите, чтобы открыть профиль");
    return;
  }

  fillProfileHeader(user);
  try {
    await fillProfileSavedRoutes(user.id);
  } catch (error) {
    showToast("Не удалось загрузить сохранённые маршруты");
  }
  try {
    await setupNoteSaving(user.id);
  } catch (error) {
    showToast("Не удалось загрузить заметки");
  }
}

function fillProfileHeader(user) {
  const hello = document.querySelector("h1.h4");
  const email = document.querySelector(".profile-email-line");
  if (hello) {
    hello.textContent = "Привет, " + (user.name || "путешественник") + "!";
  }
  if (email) {
    email.innerHTML = iconSprite("envelope", "me-1") + " " + escapeHtml(user.email);
  }
}

async function fillProfileSavedRoutes(userId) {
  const container = document.getElementById("savedRoutesGrid");
  if (!container) return;

  const uid = Number(userId);
  if (!Number.isFinite(uid)) {
    container.innerHTML =
      '<div class="col-12"><div class="text-muted-sm">Не удалось определить пользователя.</div></div>';
    return;
  }

  const mine = await getSavedRoutesForUser(uid);

  const seenRouteIds = new Set();
  const uniqueSaved = [];
  mine.forEach(function (item) {
    const rid = Number(item.routeId);
    if (!Number.isFinite(rid) || seenRouteIds.has(rid)) return;
    seenRouteIds.add(rid);
    uniqueSaved.push(item);
  });

  if (!uniqueSaved.length) {
    container.innerHTML =
      '<div class="col-12"><div class="text-muted-sm">Сохранённых маршрутов пока нет.</div></div>';
    return;
  }

  const routePromises = uniqueSaved.map(function (item) {
    return apiRequest("/routes/" + item.routeId).catch(function () {
      return null;
    });
  });
  const routes = (await Promise.all(routePromises)).filter(Boolean);
  if (!routes.length) {
    container.innerHTML =
      '<div class="col-12"><div class="text-muted-sm">Не удалось загрузить данные маршрутов.</div></div>';
    return;
  }

  container.innerHTML = routes
    .map(
      (route) =>
        '<div class="col-md-6"><div class="card h-100 border-0 bg-light"><div class="card-body"><h5 class="card-title mb-1">' +
        escapeHtml(route.title) +
        '</h5><p class="text-muted-sm mb-2">' +
        Number(route.durationDays) +
        ' дня • ' +
        escapeHtml(route.type === "nature" ? "природа" : "город") +
        '</p><div class="mb-2 d-flex flex-wrap gap-2"><span class="badge bg-primary-subtle text-primary">' +
        escapeHtml(route.type === "nature" ? "Природа" : "Город") +
        '</span><span class="badge bg-secondary-subtle text-secondary">' +
        Number(route.budget).toLocaleString("ru-RU") +
        ' ₽</span></div><a href="destination.html?id=' +
        route.id +
        '" class="small text-decoration-none">Открыть маршрут →</a></div></div></div>'
    )
    .join("");
}

async function setupNoteSaving(userId) {
  const btn = document.getElementById("saveNoteBtn");
  const textarea = document.getElementById("travelNotes");
  const listEl = document.getElementById("profileNotesList");
  if (!btn || !textarea || !listEl) return;

  const normalizedUserId = Number(userId);
  if (!Number.isFinite(normalizedUserId)) return;

  if (btn.dataset.noteAddBound === "true") return;
  btn.dataset.noteAddBound = "true";

  let notes = [];
  try {
    notes = await apiRequest("/notes?userId=" + normalizedUserId);
  } catch (error) {
    showToast("Не удалось загрузить заметки");
  }

  renderProfileNotesList(listEl, notes, normalizedUserId);
  setupProfileNoteDelete(listEl);

  btn.addEventListener("click", async function (e) {
    e.preventDefault();
    const text = textarea.value.trim();
    if (!text) {
      showToast("Введите текст заметки");
      return;
    }

    const nowIso = new Date().toISOString();
    try {
      const created = await apiRequest("/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: normalizedUserId,
          text: text,
          updatedAt: nowIso
        })
      });

      const emptyHint = listEl.querySelector("[data-note-empty]");
      if (emptyHint) emptyHint.remove();

      listEl.insertAdjacentHTML(
        "afterbegin",
        renderProfileNoteLi(created, normalizedUserId)
      );
      textarea.value = "";
      showToast("Заметка добавлена");
    } catch (error) {
      showToast("Не удалось сохранить заметку");
    }
  });
}

function sortProfileNotesByDateDesc(notes) {
  return [...notes].sort((a, b) => {
    const ta = new Date(a.updatedAt || 0).getTime();
    const tb = new Date(b.updatedAt || 0).getTime();
    return tb - ta;
  });
}

function renderProfileNotesList(listEl, notes, currentUserId) {
  const sorted = sortProfileNotesByDateDesc(notes);
  if (!sorted.length) {
    listEl.innerHTML =
      '<li class="list-group-item text-muted-sm" data-note-empty="1">Пока нет заметок — добавьте первую ниже.</li>';
    return;
  }
  listEl.innerHTML = sorted.map((n) => renderProfileNoteLi(n, currentUserId)).join("");
}

function renderProfileNoteLi(n, currentUserId) {
  const noteId = escapeAttr(String(n.id));
  const updated = n.updatedAt ? new Date(n.updatedAt).toLocaleString("ru-RU") : "";
  const canDelete =
    Number.isFinite(Number(currentUserId)) && Number(n.userId) === Number(currentUserId);

  const deleteBtn = canDelete
    ? '<button type="button" class="btn btn-sm btn-outline-danger flex-shrink-0" data-delete-profile-note-id="' +
      noteId +
      '">Удалить</button>'
    : "";

  return (
    '<li class="list-group-item d-flex align-items-start justify-content-between gap-2" data-profile-note-id="' +
    noteId +
    '"><div class="flex-grow-1 min-w-0"><div class="text-muted-sm small">' +
    escapeHtml(updated || "без даты") +
    '</div><div class="mt-1">' +
    escapeHtml(n.text || "") +
    "</div></div>" +
    deleteBtn +
    "</li>"
  );
}

function setupProfileNoteDelete(listEl) {
  if (!listEl || listEl.dataset.noteDeleteBound === "true") return;
  listEl.dataset.noteDeleteBound = "true";

  listEl.addEventListener("click", async function (e) {
    const delBtn = e.target.closest("[data-delete-profile-note-id]");
    if (!delBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const user = getCurrentUser();
    if (!user || !Number.isFinite(Number(user.id))) {
      showToast("Войдите снова");
      return;
    }

    const uid = Number(user.id);
    const noteId = delBtn.getAttribute("data-delete-profile-note-id");
    if (!noteId) return;

    try {
      const note = await apiRequest("/notes/" + noteId);
      if (Number(note.userId) !== uid) {
        showToast("Можно удалить только свою заметку");
        return;
      }

      await apiRequest("/notes/" + noteId, {
        method: "DELETE"
      });

      const li = delBtn.closest("[data-profile-note-id]");
      if (li) li.remove();

      if (!listEl.querySelector("[data-profile-note-id]")) {
        listEl.innerHTML =
          '<li class="list-group-item text-muted-sm" data-note-empty="1">Пока нет заметок — добавьте первую ниже.</li>';
      }

      showToast("Заметка удалена");
    } catch (error) {
      showToast("Не удалось удалить заметку");
    }
  });
}

async function initCollaborationPage() {
  const notesUl = document.getElementById("collabNotesUl");
  if (!notesUl) return;

  const shareInput = document.getElementById("shareRouteInput");
  if (shareInput) {
    const pageUrl = window.location.href.split(/[?#]/)[0];
    const folder = pageUrl.replace(/[^/]*$/, "");
    shareInput.value = folder + "destination.html?id=1";
  }

  const currentUser = getCurrentUser();

  try {
    const notes = await apiRequest("/collabNotes?tripId=default");
    if (notes.length) {
      notesUl.innerHTML = notes.map((n) => renderCollabNoteLi(n, currentUser)).join("");
    }
    setupCollabNoteDelete(notesUl);
  } catch (error) {
    showToast("Не удалось загрузить общие заметки");
    setupCollabNoteDelete(notesUl);
  }

  const actUl = document.getElementById("collabActivityUl");
  if (actUl) {
    try {
      const acts = await apiRequest("/collabActivities?tripId=default");
      if (acts.length) {
        actUl.innerHTML = acts.map((a) => renderCollabActivityLi(a)).join("");
      }
    } catch (error) {}
  }

  const addBtn = document.getElementById("collabNoteBtn");
  const addInput = document.getElementById("collabNoteInput");
  if (!addBtn || !addInput) return;

  addBtn.addEventListener("click", async function () {
    const text = addInput.value.trim();
    if (!text) {
      showToast("Введите текст заметки");
      return;
    }

    const user = getCurrentUser();
    const author = user && user.name ? user.name : "Гость";
    const initial = (author.trim()[0] || "?").toUpperCase();

    try {
      const authorId = user ? Number(user.id) : null;
      const created = await apiRequest("/collabNotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tripId: "default",
          authorId: authorId,
          author: author,
          initial: initial,
          initialVariant: "secondary",
          text: text
        })
      });

      notesUl.insertAdjacentHTML("beforeend", renderCollabNoteLi(created, getCurrentUser()));
      addInput.value = "";
      showToast("Заметка добавлена в общий список");
    } catch (error) {
      showToast("Не удалось добавить заметку");
    }
  });
}

function renderCollabNoteLi(n, currentUser) {
  const v = String(n.initialVariant || "primary");
  let badgeClass = "bg-primary-subtle text-primary";
  if (v === "success") badgeClass = "bg-success-subtle text-success";
  if (v === "warning") badgeClass = "bg-warning-subtle text-warning";
  if (v === "secondary") badgeClass = "bg-secondary-subtle text-secondary";

  const canDelete =
    currentUser &&
    n.authorId != null &&
    String(n.authorId) !== "" &&
    Number(n.authorId) === Number(currentUser.id);

  const deleteBtn = canDelete
    ? '<button type="button" class="btn btn-sm btn-outline-danger ms-2 align-self-start flex-shrink-0" data-delete-collab-note-id="' +
      escapeAttr(String(n.id)) +
      '">Удалить</button>'
    : "";

  return (
    '<li class="list-group-item d-flex align-items-start" data-collab-note-id="' +
    escapeAttr(String(n.id)) +
    '"><span class="badge ' +
    badgeClass +
    ' me-2">' +
    escapeHtml(n.initial || "?") +
    '</span><div class="flex-grow-1 min-w-0"><div class="fw-semibold">' +
    escapeHtml(n.author) +
    '</div><div class="text-muted-sm">' +
    escapeHtml(n.text) +
    "</div></div>" +
    deleteBtn +
    "</li>"
  );
}

function setupCollabNoteDelete(notesUl) {
  if (!notesUl || notesUl.dataset.collabDeleteBound === "true") return;
  notesUl.dataset.collabDeleteBound = "true";

  notesUl.addEventListener("click", async function (e) {
    const btn = e.target.closest("[data-delete-collab-note-id]");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const user = getCurrentUser();
    if (!user) {
      showToast("Войдите, чтобы удалять заметки");
      return;
    }

    const noteId = btn.getAttribute("data-delete-collab-note-id");
    if (!noteId) return;

    try {
      const note = await apiRequest("/collabNotes/" + noteId);
      if (note.authorId == null || Number(note.authorId) !== Number(user.id)) {
        showToast("Можно удалить только свою заметку");
        return;
      }

      await apiRequest("/collabNotes/" + noteId, {
        method: "DELETE"
      });

      const li = btn.closest("[data-collab-note-id]");
      if (li) li.remove();
      showToast("Заметка удалена");
    } catch (error) {
      showToast("Не удалось удалить заметку");
    }
  });
}

function renderCollabActivityLi(a) {
  const icon = String(a.icon || "circle").replace(/[^a-z0-9-]/gi, "");
  const color = String(a.iconColor || "secondary").replace(/[^a-z]/g, "");

  return (
    '<li class="list-group-item text-muted-sm">' +
    iconSprite(icon, "me-1 text-" + color) +
    escapeHtml(a.text) +
    "</li>"
  );
}

