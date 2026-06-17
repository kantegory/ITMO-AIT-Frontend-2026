const places = [
  {
    key: "amsterdam",
    title: "Амстердам",
    type: "city",
    budget: 700,
    days: 5,
    description: "Каналы, музеи, прогулки и уютные районы.",
    link: "destination.html?place=amsterdam"
  },
  {
    key: "alps",
    title: "Альпы",
    type: "nature",
    budget: 1200,
    days: 7,
    description: "Горы, ледники, панорамные виды и активный отдых.",
    link: "destination.html?place=alps"
  },
  {
    key: "barcelona",
    title: "Барселона",
    type: "city",
    budget: 900,
    days: 6,
    description: "Архитектура, море и живая городская атмосфера.",
    link: "destination.html?place=barcelona"
  },
  {
    key: "karelia",
    title: "Карелия",
    type: "nature",
    budget: 300,
    days: 3,
    description: "Озёра, леса, тишина и короткая перезагрузка на природе.",
    link: "destination.html?place=karelia"
  },
  {
    key: "prague",
    title: "Прага",
    type: "city",
    budget: 500,
    days: 4,
    description: "Старый город, уютная архитектура и спокойный ритм.",
    link: "destination.html?place=prague"
  }
];

const STORAGE_KEY_ROUTES = "travel_saved_routes";
const STORAGE_KEY_NOTES = "travel_notes";
const STORAGE_KEY_SHARED = "travel_shared_items";

function qs(selector) {
  return document.querySelector(selector);
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderSearchCard(place) {
  return `
    <article class="card h-100 search-card">
      <div class="card-body search-card-body">
        <div class="search-card-top d-flex justify-content-between align-items-start gap-3">
          <span class="search-type-badge">${typeLabel(place.type)}</span>
          <span class="search-price">до ${place.budget} $</span>
        </div>

        <h3 class="search-card-title">${place.title}</h3>

        <div class="search-meta-row">
          <span class="search-meta-pill">${daysRangeLabel(place.days)}</span>
          <span class="search-meta-pill">Подходит для city-break / short trip</span>
        </div>

        <p class="search-card-text">${place.description}</p>

        <a class="btn btn-primary search-card-btn" href="${place.link}">Открыть направление</a>
      </div>
    </article>
  `;
}

function initSearchPage() {
  const resultsEl = qs("#results");
  const typeEl = qs("#type");
  const budgetEl = qs("#budget");
  const daysEl = qs("#days");
  const applyBtn = qs("#applyBtn");
  const resetBtn = qs("#resetBtn");
  const searchCountEl = qs("#searchCount");

  if (!resultsEl || !typeEl || !budgetEl || !daysEl || !applyBtn || !resetBtn) return;

  function renderPlaces(list) {
    if (searchCountEl) {
      searchCountEl.textContent = String(list.length);
    }

    if (list.length === 0) {
      resultsEl.innerHTML = `
        <div class="empty-state">
          Ничего не найдено. Попробуйте изменить фильтры по бюджету, типу или длительности.
        </div>
      `;
      return;
    }

    resultsEl.innerHTML = list.map(renderSearchCard).join("");
  }

  function applyFilters() {
    const typeValue = typeEl.value;
    const budgetValue = budgetEl.value.trim();
    const daysValue = daysEl.value;
    const budgetNumber = Number(budgetValue);

    const filtered = places.filter((place) => {
      if (typeValue !== "all" && place.type !== typeValue) return false;
      if (budgetValue !== "" && !Number.isNaN(budgetNumber) && place.budget > budgetNumber) return false;

      if (daysValue === "1-3" && !(place.days >= 1 && place.days <= 3)) return false;
      if (daysValue === "4-7" && !(place.days >= 4 && place.days <= 7)) return false;
      if (daysValue === "8+" && place.days < 8) return false;

      return true;
    });

    renderPlaces(filtered);
  }

  applyBtn.addEventListener("click", (event) => {
    event.preventDefault();
    applyFilters();
  });

  resetBtn.addEventListener("click", (event) => {
    event.preventDefault();
    typeEl.value = "all";
    budgetEl.value = "";
    daysEl.value = "all";
    renderPlaces(places);
  });

  renderPlaces(places);
}

function initProfilePage() {
  const savedRoutesEl = qs("#savedRoutes");
  const clearSavedBtn = qs("#clearSavedBtn");
  const notesEl = qs("#notes");
  const saveNotesBtn = qs("#saveNotesBtn");
  const savedCountEl = qs("#savedCount");

  function renderSavedRoutes() {
    if (!savedRoutesEl) return;

    const saved = loadJSON(STORAGE_KEY_ROUTES, []);
    if (savedCountEl) savedCountEl.textContent = String(saved.length);

    if (saved.length === 0) {
      savedRoutesEl.innerHTML = `
        <div class="empty-state">
          Пока нет сохранённых маршрутов. Откройте страницу направления и нажмите «Сохранить маршрут».
        </div>
      `;
      return;
    }

    savedRoutesEl.innerHTML = saved.map((route) => `
      <article class="saved-route-card">
        <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 class="saved-route-title">${escapeHtml(route.title)}</h3>
            <p class="saved-route-meta mb-0">${typeLabel(route.type)} · ${daysRangeLabel(route.days)} · до ${route.budget} $</p>
          </div>
          <span class="type-pill">${typeLabel(route.type)}</span>
        </div>

        <div class="saved-route-actions">
          <a href="destination.html?place=${encodeURIComponent(route.placeKey)}" class="btn btn-outline-primary">Открыть</a>
        </div>
      </article>
    `).join("");
  }

  if (clearSavedBtn && savedRoutesEl) {
    clearSavedBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY_ROUTES);
      renderSavedRoutes();
    });
  }

  if (notesEl) {
    notesEl.value = localStorage.getItem(STORAGE_KEY_NOTES) || "";
  }

  if (saveNotesBtn && notesEl) {
    saveNotesBtn.addEventListener("click", () => {
      localStorage.setItem(STORAGE_KEY_NOTES, notesEl.value);
      alert("Заметки сохранены.");
    });
  }

  if (savedRoutesEl) {
    renderSavedRoutes();
  }
}

function initDestinationPage() {
  const heroImg = qs("#heroImg");
  const titleEl = qs("#placeTitle");
  const metaEl = qs("#placeMeta");
  const badgeEl = qs("#placeBadge");
  const descEl = qs("#placeDesc");
  const g1 = qs("#g1");
  const g2 = qs("#g2");
  const g3 = qs("#g3");
  const placesList = qs("#placesList");
  const tipsList = qs("#tipsList");
  const includedList = qs("#includedList");
  const mapFrame = qs("#mapFrame");
  const saveBtn = qs("#saveRouteBtn");

  if (!heroImg || !titleEl || !metaEl || !badgeEl || !descEl || !g1 || !g2 || !g3 || !placesList || !tipsList || !includedList || !mapFrame || !saveBtn) {
    return;
  }

  const destinationData = {
    amsterdam: {
      title: "Амстердам",
      type: "city",
      budget: 700,
      daysLabel: "4–7 дней",
      badge: "Популярно",
      desc: "Каналы, музеи, прогулки и уютные районы. Отличный вариант для короткой поездки с насыщенной культурной программой.",
      images: {
        hero: "assets/img/amsterdam-hero.jpg",
        g1: "assets/img/amsterdam-1.jpg",
        g2: "assets/img/amsterdam-2.jpg",
        g3: "assets/img/amsterdam-3.jpg"
      },
      places: ["Рейксмузеум", "Музей Ван Гога", "Прогулка по каналам", "Район Jordaan"],
      tips: ["Покупайте билеты в музеи заранее", "Гулять удобнее пешком и на велосипеде", "Жильё вне центра обычно выгоднее"],
      included: ["Маршрут на 4–7 дней", "Список основных точек", "Советы и карта"],
      map: "https://www.openstreetmap.org/export/embed.html?bbox=4.88%2C52.35%2C4.92%2C52.38&layer=mapnik",
      save: { title: "Амстердам", type: "city", days: 5, budget: 700 }
    },
    alps: {
      title: "Альпы",
      type: "nature",
      budget: 1200,
      daysLabel: "4–7 дней",
      badge: "Природа",
      desc: "Горы, альпийские озёра и маршруты для активного отдыха. Подходит для поездки с фокусом на виды и трекинг.",
      images: {
        hero: "assets/img/alps-hero.jpg",
        g1: "assets/img/alps-1.jpg",
        g2: "assets/img/alps-2.jpg",
        g3: "assets/img/alps-3.jpg"
      },
      places: ["Панорамные подъёмники", "Озёра в долинах", "Маршруты хайкинга", "Смотровые площадки"],
      tips: ["Проверяйте прогноз перед выходом", "Берите удобную обувь", "Учитывайте местный транспорт и канатные дороги"],
      included: ["Маршрут на 4–7 дней", "Природные точки", "Карта и советы"],
      map: "https://www.openstreetmap.org/export/embed.html?bbox=6.80%2C45.85%2C7.05%2C46.05&layer=mapnik",
      save: { title: "Альпы", type: "nature", days: 7, budget: 1200 }
    },
    barcelona: {
      title: "Барселона",
      type: "city",
      budget: 900,
      daysLabel: "4–7 дней",
      badge: "Город + море",
      desc: "Архитектура, море и насыщенный городской ритм. Хороший выбор для совмещения прогулок и отдыха у воды.",
      images: {
        hero: "assets/img/barcelona-hero.jpg",
        g1: "assets/img/barcelona-1.jpg",
        g2: "assets/img/barcelona-2.jpg",
        g3: "assets/img/barcelona-3.jpg"
      },
      places: ["Саграда Фамилия", "Парк Гуэль", "Готический квартал", "Барселонета"],
      tips: ["Осторожнее в туристических местах", "На топовые локации бронируйте заранее", "Метро — самый удобный вариант"],
      included: ["Маршрут на 4–7 дней", "Главные точки", "Карта и советы"],
      map: "https://www.openstreetmap.org/export/embed.html?bbox=2.14%2C41.37%2C2.19%2C41.40&layer=mapnik",
      save: { title: "Барселона", type: "city", days: 6, budget: 900 }
    },
    karelia: {
      title: "Карелия",
      type: "nature",
      budget: 300,
      daysLabel: "1–3 дня",
      badge: "Бюджетно",
      desc: "Озёра, леса, тишина и спокойный формат отдыха. Идеально для короткой природной поездки.",
      images: {
        hero: "assets/img/karelia-hero.jpg",
        g1: "assets/img/karelia-1.jpg",
        g2: "assets/img/karelia-2.jpg",
        g3: "assets/img/karelia-3.jpg"
      },
      places: ["Горный парк Рускеала", "Ладожские шхеры", "Лесные маршруты", "Озёрные берега"],
      tips: ["Смотрите погоду заранее", "Лучше ехать на машине или с понятной логистикой", "Возьмите тёплую одежду вечером"],
      included: ["Маршрут на 1–3 дня", "Природные точки", "Карта и советы"],
      map: "https://www.openstreetmap.org/export/embed.html?bbox=30.25%2C61.93%2C30.75%2C62.15&layer=mapnik",
      save: { title: "Карелия", type: "nature", days: 3, budget: 300 }
    },
    prague: {
      title: "Прага",
      type: "city",
      budget: 500,
      daysLabel: "4–7 дней",
      badge: "Уютный city-break",
      desc: "Старый город, спокойная атмосфера и классическая европейская архитектура. Подходит для размеренной поездки.",
      images: {
        hero: "assets/img/prague-hero.jpg",
        g1: "assets/img/prague-1.jpg",
        g2: "assets/img/prague-2.jpg",
        g3: "assets/img/prague-3.jpg"
      },
      places: ["Карлов мост", "Староместская площадь", "Пражский град", "Мала Страна"],
      tips: ["Удобно исследовать центр пешком", "Лучше бронировать жильё заранее", "Утром на популярных точках меньше людей"],
      included: ["Маршрут на 4+ дней (возможность выбора)", "Главные точки", "Карта и советы"],
      map: "https://www.openstreetmap.org/export/embed.html?bbox=14.39%2C50.07%2C14.44%2C50.10&layer=mapnik",
      save: { title: "Прага", type: "city", days: 4, budget: 500 }
    }
  };

  function setList(listEl, items) {
    listEl.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
  }

  const params = new URLSearchParams(window.location.search);
  const key = params.get("place") || "amsterdam";
  const data = destinationData[key] || destinationData.amsterdam;

  titleEl.textContent = data.title;
  badgeEl.textContent = data.badge;
  descEl.textContent = data.desc;
  metaEl.textContent = `${typeLabel(data.type)} · ${data.daysLabel} · до ${data.budget} $`;

  heroImg.src = data.images.hero;
  heroImg.alt = data.title;
  g1.src = data.images.g1;
  g1.alt = `${data.title} фото 1`;
  g2.src = data.images.g2;
  g2.alt = `${data.title} фото 2`;
  g3.src = data.images.g3;
  g3.alt = `${data.title} фото 3`;

  setList(placesList, data.places);
  setList(tipsList, data.tips);
  setList(includedList, data.included);
  mapFrame.src = data.map;

  saveBtn.dataset.placeKey = key;
  saveBtn.dataset.title = data.save.title;
  saveBtn.dataset.type = data.save.type;
  saveBtn.dataset.days = String(data.save.days);
  saveBtn.dataset.budget = String(data.save.budget);

  saveBtn.addEventListener("click", () => {
    const route = {
      placeKey: saveBtn.dataset.placeKey,
      title: saveBtn.dataset.title,
      type: saveBtn.dataset.type,
      days: Number(saveBtn.dataset.days),
      budget: Number(saveBtn.dataset.budget)
    };

    const saved = loadJSON(STORAGE_KEY_ROUTES, []);
    const alreadyExists = saved.some((item) => item.placeKey === route.placeKey);

    if (alreadyExists) {
      alert("Этот маршрут уже сохранён.");
      return;
    }

    saved.push(route);
    saveJSON(STORAGE_KEY_ROUTES, saved);
    alert("Маршрут сохранён и теперь доступен в кабинете.");
  });
}

function initCollaborationPage() {
  const shareForm = qs("#shareForm");
  const shareToEl = qs("#shareTo");
  const shareTitleEl = qs("#shareTitle");
  const shareTypeEl = qs("#shareType");
  const shareNoteEl = qs("#shareNote");
  const shareFeedEl = qs("#shareFeed");
  const shareCountEl = qs("#shareCount");
  const clearShareBtn = qs("#clearShareBtn");

  if (!shareForm || !shareToEl || !shareTitleEl || !shareTypeEl || !shareNoteEl || !shareFeedEl) {
    return;
  }

  function renderFeed() {
    const items = loadJSON(STORAGE_KEY_SHARED, []);
    if (shareCountEl) shareCountEl.textContent = String(items.length);

    if (items.length === 0) {
      shareFeedEl.innerHTML = `
        <div class="empty-state">
          Пока нет записей. Добавьте первую заметку о маршруте.
        </div>
      `;
      return;
    }

    shareFeedEl.innerHTML = items.map((item) => `
      <article class="shared-entry-card">
        <div class="shared-entry-top">
          <div>
            <h3 class="shared-entry-title">${escapeHtml(item.title)}</h3>
            <p class="shared-entry-meta mb-1">Для: ${escapeHtml(item.to)}</p>
          </div>
          <span class="type-pill">${typeLabel(item.type)}</span>
        </div>
        <p class="shared-entry-note mb-0">${escapeHtml(item.note || "Без заметки")}</p>
      </article>
    `).join("");
  }

  shareForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const items = loadJSON(STORAGE_KEY_SHARED, []);
    items.unshift({
      to: shareToEl.value.trim(),
      title: shareTitleEl.value.trim(),
      type: shareTypeEl.value,
      note: shareNoteEl.value.trim()
    });

    saveJSON(STORAGE_KEY_SHARED, items);
    shareForm.reset();
    renderFeed();
  });

  if (clearShareBtn) {
    clearShareBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY_SHARED);
      renderFeed();
    });
  }

  renderFeed();
}

document.addEventListener("DOMContentLoaded", () => {
  initSearchPage();
  initProfilePage();
  initDestinationPage();
  initCollaborationPage();
});