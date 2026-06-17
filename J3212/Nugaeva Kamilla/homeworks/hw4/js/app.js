const CURRENT_USER_KEY = "travel_current_user";
const THEME_KEY = "travel_theme";

function qs(selector) {
  return document.querySelector(selector);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}


function announce(message) {
  const statusEl = qs("#appStatus");
  if (!statusEl) return;

  statusEl.textContent = "";
  setTimeout(() => {
    statusEl.textContent = message;
  }, 30);
}

function typeLabel(type) {
  if (type === "city") return "Город";
  if (type === "nature") return "Природа";
  return "Любой";
}

function daysRangeLabel(days) {
  if (days <= 3) return "1–3 дня";
  if (days <= 7) return "4–7 дней";
  return "8+ дней";
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function removeCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeToggle(theme) {
  const toggleButton = qs("#themeToggle");
  if (!toggleButton) return;

  const nextLabel = theme === "dark" ? "Светлая тема" : "Тёмная тема";
  const iconId = theme === "dark" ? "sun" : "moon";

  toggleButton.innerHTML = `
    <svg class="icon" aria-hidden="true">
      <use href="assets/icons/sprite.svg#${iconId}"></use>
    </svg>
    <span>${nextLabel}</span>
  `;
  toggleButton.setAttribute("aria-label", nextLabel);
  toggleButton.setAttribute("title", nextLabel);
  toggleButton.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeToggle(theme);
}

function initThemeToggle() {
  const toggleButton = qs("#themeToggle");
  const theme = getPreferredTheme();

  applyTheme(theme);

  if (!toggleButton) return;

  toggleButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}

function requireAuth() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return null;
  }

  return user;
}

function renderSearchCard(place) {
  return `
    <article class="card h-100 search-card">
      <div class="card-body search-card-body">
        <div class="search-card-top d-flex justify-content-between align-items-start gap-3">
          <span class="search-type-badge">${typeLabel(place.type)}</span>
          <span class="search-price">до ${place.budget} $</span>
        </div>

        <h3 class="search-card-title">${escapeHtml(place.title)}</h3>

        <div class="search-meta-row">
          <span class="search-meta-pill">${daysRangeLabel(place.days)}</span>
          <span class="search-meta-pill">Подходит для city-break / short trip</span>
        </div>

        <p class="search-card-text">${escapeHtml(place.description)}</p>

        <a class="btn btn-primary search-card-btn" href="destination.html?place=${encodeURIComponent(place.key)}">
          Открыть направление
        </a>
      </div>
    </article>
  `;
}

async function initRegisterPage() {
  const form = qs("#registerForm");
  const nameEl = qs("#registerName");
  const emailEl = qs("#registerEmail");
  const passwordEl = qs("#registerPassword");
  const password2El = qs("#registerPassword2");

  if (!form || !nameEl || !emailEl || !passwordEl || !password2El) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();
    const password2 = password2El.value.trim();

    if (!name || !email || !password || !password2) {
      alert("Заполните все поля.");
      return;
    }

    if (password !== password2) {
      alert("Пароли не совпадают.");
      return;
    }

    try {
      const existingUser = await findUserByEmail(email);

      if (existingUser) {
        alert("Пользователь с таким email уже существует.");
        return;
      }

      await registerUser({
        name,
        email,
        password
      });

      alert("Регистрация прошла успешно. Теперь войдите в аккаунт.");
      window.location.href = "login.html";
    } catch (error) {
      console.error(error);
      alert("Не удалось зарегистрироваться.");
    }
  });
}

async function initLoginPage() {
  const form = qs("#loginForm");
  const emailEl = qs("#loginEmail");
  const passwordEl = qs("#loginPassword");

  if (!form || !emailEl || !passwordEl) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    if (!email || !password) {
      alert("Заполните email и пароль.");
      return;
    }

    try {
      const user = await loginUser(email, password);

      if (!user) {
        alert("Неверный email или пароль.");
        return;
      }

      setCurrentUser(user);
      alert("Вы успешно вошли.");
      window.location.href = "profile.html";
    } catch (error) {
      console.error(error);
      alert("Не удалось выполнить вход.");
    }
  });
}

async function initSearchPage() {
  const form = qs("#searchFiltersForm");
  const resultsEl = qs("#results");
  const typeEl = qs("#type");
  const budgetEl = qs("#budget");
  const daysEl = qs("#days");
  const resetBtn = qs("#resetBtn");
  const searchCountEl = qs("#searchCount");

  if (!form || !resultsEl || !typeEl || !budgetEl || !daysEl || !resetBtn || !searchCountEl) return;

  function renderPlaces(list) {
    searchCountEl.textContent = String(list.length);

    if (list.length === 0) {
      resultsEl.innerHTML = `
        <div class="empty-state" role="status">
          Ничего не найдено. Попробуйте изменить фильтры.
        </div>
      `;
      announce("Ничего не найдено");
      return;
    }

    resultsEl.innerHTML = list.map(renderSearchCard).join("");
    announce(`Найдено направлений: ${list.length}`);
  }

  async function loadPlaces() {
    const filters = {
      type: typeEl.value,
      budget: budgetEl.value.trim(),
      days: daysEl.value
    };

    try {
      resultsEl.setAttribute("aria-busy", "true");
      resultsEl.innerHTML = `<div class="empty-state" role="status">Загрузка...</div>`;

      const places = await getPlaces(filters);
      renderPlaces(places);
    } catch (error) {
      console.error(error);
      resultsEl.innerHTML = `<div class="empty-state" role="status">Направления не найдены. Попробуйте изменить фильтры.</div>`;
      announce("Ошибка загрузки направлений");
    } finally {
      resultsEl.setAttribute("aria-busy", "false");
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loadPlaces();
  });

  resetBtn.addEventListener("click", async () => {
    form.reset();
    typeEl.value = "all";
    daysEl.value = "all";
    budgetEl.value = "";
    await loadPlaces();
  });

  await loadPlaces();
}

function initAuthMenu() {
  const authLink = document.querySelector("#authMenuLink");
  const authMenu = document.querySelector("#authDropdownMenu");

  if (!authLink || !authMenu) return;

  const user = getCurrentUser();

  if (user) {
    authLink.textContent = `Привет, ${user.name}`;

    authMenu.innerHTML = `
      <li><a class="dropdown-item" href="#" id="switchAccountBtn">Войти в другой аккаунт</a></li>
      <li><a class="dropdown-item" href="#" data-logout>Выйти</a></li>
    `;

    const switchAccountBtn = document.querySelector("#switchAccountBtn");

    if (switchAccountBtn) {
      switchAccountBtn.addEventListener("click", (event) => {
        event.preventDefault();
        removeCurrentUser();
        window.location.href = "login.html";
      });
    }
  } else {
    authLink.textContent = "Вход";

    authMenu.innerHTML = `
      <li><a class="dropdown-item" href="login.html">Войти</a></li>
      <li><a class="dropdown-item" href="register.html">Регистрация</a></li>
    `;
  }

  initLogoutButtons();
}

async function initDestinationPage() {
  const heroImg = qs("#heroImg");
  const titleEl = qs("#placeTitle");
  const metaEl = qs("#placeMeta");
  const badgeEl = qs("#placeBadge");
  const descEl = qs("#placeDesc");
  const g1 = qs("#g1");
  const g2 = qs("#g2");
  const g3 = qs("#g3");
  const placesListEl = qs("#placesList");
  const tipsListEl = qs("#tipsList");
  const includedListEl = qs("#includedList");
  const mapFrame = qs("#mapFrame");
  const saveBtn = qs("#saveRouteBtn");

  if (
    !heroImg || !titleEl || !metaEl || !badgeEl || !descEl ||
    !g1 || !g2 || !g3 || !placesListEl || !tipsListEl ||
    !includedListEl || !mapFrame || !saveBtn
  ) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const placeKey = params.get("place");

  if (!placeKey) {
    titleEl.textContent = "Направление не найдено";
    return;
  }

  try {
    const place = await getPlaceByKey(placeKey);

    if (!place) {
      titleEl.textContent = "Направление не найдено";
      descEl.textContent = "Не удалось получить данные по выбранному направлению.";
      return;
    }

    heroImg.src = place.hero;
    heroImg.alt = `${place.title}: главное изображение направления`;
    titleEl.textContent = place.title;
    metaEl.textContent = `${typeLabel(place.type)} · ${daysRangeLabel(place.days)} · до ${place.budget} $`;
    badgeEl.textContent = place.badge || typeLabel(place.type);
    descEl.textContent = place.description;

    g1.src = place.gallery?.[0] || "";
    g2.src = place.gallery?.[1] || "";
    g3.src = place.gallery?.[2] || "";

    g1.alt = `${place.title} — фото маршрута 1`;
    g2.alt = `${place.title} — фото маршрута 2`;
    g3.alt = `${place.title} — фото маршрута 3`;

    placesListEl.innerHTML = (place.placesList || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    tipsListEl.innerHTML = (place.tipsList || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    includedListEl.innerHTML = (place.includedList || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    mapFrame.src = place.map || "";
    mapFrame.title = `Карта направления ${place.title}`;

    saveBtn.addEventListener("click", async () => {
      const user = requireAuth();
      if (!user) return;

      try {
        const existingRoutes = await getSavedRoutes(user.id);
        const alreadySaved = existingRoutes.some((route) => route.placeKey === place.key);

        if (alreadySaved) {
          announce("Маршрут сохранён в кабинете");
          alert("Маршрут сохранён в кабинете.");
          return;
        }

        await saveRoute({
          userId: user.id,
          placeKey: place.key,
          title: place.title,
          type: place.type,
          days: place.days,
          budget: place.budget
        });

        alert("Маршрут сохранён в кабинете.");
      } catch (error) {
        console.error(error);
        alert("Не удалось сохранить маршрут.");
      }
    });
  } catch (error) {
    console.error(error);
    titleEl.textContent = "Ошибка загрузки";
    descEl.textContent = "Не удалось загрузить данные направления.";
  }
}

async function initProfilePage() {
  const savedRoutesEl = qs("#savedRoutes");
  const clearSavedBtn = qs("#clearSavedBtn");
  const notesEl = qs("#notes");
  const saveNotesBtn = qs("#saveNotesBtn");
  const savedCountEl = qs("#savedCount");
  const greetingEl = qs("#profileGreeting");

  if (!savedRoutesEl || !notesEl || !saveNotesBtn) return;

  const user = requireAuth();
  if (!user) return;

  if (greetingEl) {
  greetingEl.textContent = `Вы вошли как ${user.name} (${user.email})`;
  }

  async function renderSavedRoutes() {
    try {
      const savedRoutes = await getSavedRoutes(user.id);

      if (savedCountEl) {
        savedCountEl.textContent = String(savedRoutes.length);
        savedRoutesEl.setAttribute("aria-busy", "false");
        announce(`Сохранённых маршрутов: ${savedRoutes.length}`);
      }

      if (savedRoutes.length === 0) {
        savedRoutesEl.innerHTML = `
          <div class="empty-state">
            Пока нет сохранённых маршрутов. Откройте страницу направления и нажмите «Сохранить маршрут».
          </div>
        `;
        return;
      }

      savedRoutesEl.innerHTML = savedRoutes.map((route) => `
        <article class="saved-route-card">
          <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div>
              <h3 class="saved-route-title">${escapeHtml(route.title)}</h3>
              <p class="saved-route-meta mb-0">
                ${typeLabel(route.type)} · ${daysRangeLabel(route.days)} · до ${route.budget} $
              </p>
            </div>
            <span class="type-pill">${typeLabel(route.type)}</span>
          </div>

          <div class="saved-route-actions d-flex gap-2 flex-wrap">
            <a href="destination.html?place=${encodeURIComponent(route.placeKey)}" class="btn btn-outline-primary">
              Открыть
            </a>
            <button class="btn btn-outline-danger" data-route-id="${route.id}">
              Удалить
            </button>
          </div>
        </article>
      `).join("");

      savedRoutesEl.querySelectorAll("[data-route-id]").forEach((button) => {
        button.addEventListener("click", async () => {
          const routeId = button.dataset.routeId;

          try {
            await deleteSavedRoute(routeId);
            await renderSavedRoutes();
          } catch (error) {
            console.error(error);
            alert("Не удалось удалить маршрут.");
          }
        });
      });
    } catch (error) {
      console.error(error);
      savedRoutesEl.innerHTML = `<div class="empty-state">Не удалось загрузить маршруты.</div>`;
    }
  }

  async function loadNotes() {
    try {
      const note = await getUserNote(user.id);
      notesEl.value = note ? note.text : "";
    } catch (error) {
      console.error(error);
      alert("Не удалось загрузить заметки.");
    }
  }

  if (clearSavedBtn) {
    clearSavedBtn.addEventListener("click", async () => {
      try {
        await clearSavedRoutesByUser(user.id);
        await renderSavedRoutes();
      } catch (error) {
        console.error(error);
        alert("Не удалось очистить маршруты.");
      }
    });
  }

  saveNotesBtn.addEventListener("click", async () => {
    const text = notesEl.value;

    try {
      const existingNote = await getUserNote(user.id);

      if (existingNote) {
        await updateUserNote(existingNote.id, { text });
      } else {
        await createUserNote({
          userId: user.id,
          text
        });
      }

      alert("Заметки сохранены.");
    } catch (error) {
      console.error(error);
      alert("Не удалось сохранить заметки.");
    }
  });

  await renderSavedRoutes();
  await loadNotes();
}

async function initCollaborationPage() {
  const form = qs("#shareForm");
  const shareToEl = qs("#shareTo");
  const shareTitleEl = qs("#shareTitle");
  const shareTypeEl = qs("#shareType");
  const shareNoteEl = qs("#shareNote");
  const shareFeedEl = qs("#shareFeed");
  const shareCountEl = qs("#shareCount");
  const clearShareBtn = qs("#clearShareBtn");

  if (
    !form || !shareToEl || !shareTitleEl || !shareTypeEl ||
    !shareNoteEl || !shareFeedEl || !shareCountEl || !clearShareBtn
  ) {
    return;
  }

  const user = getCurrentUser();

  async function renderSharedItems() {
    try {
      shareFeedEl.setAttribute("aria-busy", "true");
      const items = await getSharedItems();

      shareCountEl.textContent = String(items.length);
      shareFeedEl.setAttribute("aria-busy", "false");
      announce(`Записей в ленте: ${items.length}`);

      if (items.length === 0) {
        shareFeedEl.innerHTML = `
          <div class="empty-state" role="status">
            Пока нет отправленных маршрутов. Создайте первую запись.
          </div>
        `;
        announce("Лента пока пустая");
        return;
      }

      shareFeedEl.innerHTML = items.map((item) => `
        <article class="saved-route-card">
          <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div>
              <h3 class="saved-route-title">${escapeHtml(item.title)}</h3>
              <p class="saved-route-meta mb-1">
                Кому: ${escapeHtml(item.to)}
              </p>
              <p class="saved-route-meta mb-0">
                Тип: ${typeLabel(item.type)} · Автор: ${escapeHtml(item.authorName)}
              </p>
            </div>
            <span class="type-pill">${typeLabel(item.type)}</span>
          </div>

          <p class="mb-3">${escapeHtml(item.note || "Без заметки")}</p>

          <button class="btn btn-outline-danger" data-share-id="${item.id}">
            Удалить
          </button>
        </article>
      `).join("");

      shareFeedEl.querySelectorAll("[data-share-id]").forEach((button) => {
        button.addEventListener("click", async () => {
          const itemId = button.dataset.shareId;

          try {
            await deleteSharedItem(itemId);
            announce("Запись удалена");
            await renderSharedItems();
          } catch (error) {
            console.error(error);
            alert("Не удалось удалить запись.");
          }
        });
      });
    } catch (error) {
      console.error(error);
      shareFeedEl.innerHTML = `<div class="empty-state">Не удалось загрузить ленту.</div>`;
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const to = shareToEl.value.trim();
    const title = shareTitleEl.value.trim();
    const type = shareTypeEl.value;
    const note = shareNoteEl.value.trim();

    if (!to || !title) {
      alert("Заполните обязательные поля.");
      return;
    }

    try {
      await createSharedItem({
        userId: user ? user.id : null,
        authorName: user ? user.name : "Гость",
        to,
        title,
        type,
        note
      });

      form.reset();
      shareTypeEl.value = "city";
      await renderSharedItems();
      announce("Маршрут отправлен");
      alert("Маршрут отправлен.");
    } catch (error) {
      console.error(error);
      alert("Не удалось отправить маршрут.");
    }
  });

  clearShareBtn.addEventListener("click", async () => {
    try {
      await clearAllSharedItems();
      announce("Лента очищена");
      await renderSharedItems();
    } catch (error) {
      console.error(error);
      alert("Не удалось очистить ленту.");
    }
  });

  await renderSharedItems();
}

function initLogoutButtons() {
  const logoutButtons = document.querySelectorAll("[data-logout]");

  logoutButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      removeCurrentUser();
      window.location.href = "login.html";
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  initThemeToggle();
  initAuthMenu();

  await initRegisterPage();
  await initLoginPage();
  await initSearchPage();
  await initDestinationPage();
  await initProfilePage();
  await initCollaborationPage();
});