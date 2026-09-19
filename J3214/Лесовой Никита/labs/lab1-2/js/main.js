document.addEventListener("DOMContentLoaded", () => {
  updateNavigation();
  initDirections();
  initDestination();
  initProfile();
  initTrip();
  initShareButton();
  initLogout();
});

function updateNavigation() {
  const user = getCurrentUser();
  document.querySelectorAll("[data-auth-link]").forEach((link) => {
    if (user) {
      link.textContent = user.firstName;
      link.href = "profile.html";
    }
  });
}

function initLogout() {
  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", () => {
      clearCurrentUser();
      window.location.href = "index.html";
    });
  });
}

function initDirections() {
  const form = document.querySelector("#filterForm");
  const list = document.querySelector("#destinationList");

  if (!form || !list) {
    return;
  }

  const loadDestinations = async () => {
    const params = {};
    const search = form.elements.search.value.trim();

    if (search) params["name:contains"] = search;
    if (form.elements.type.value) params.type = form.elements.type.value;
    if (form.elements.budget.value) params.budget = form.elements.budget.value;
    if (form.elements.duration.value) params.duration = form.elements.duration.value;

    list.setAttribute("aria-busy", "true");
    list.innerHTML = '<div class="col-12"><div class="api-status" role="status">Загружаем направления…</div></div>';

    try {
      const response = await api.get("/destinations", { params });
      renderDestinations(response.data, list);
    } catch (error) {
      list.innerHTML = `<div class="col-12"><div class="alert alert-danger">${getApiErrorMessage(error)}</div></div>`;
      document.querySelector("#resultCount").textContent = "0";
    } finally {
      list.setAttribute("aria-busy", "false");
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    loadDestinations();
  });

  form.addEventListener("reset", () => window.setTimeout(loadDestinations, 0));
  loadDestinations();
}

function renderDestinations(destinations, list) {
  document.querySelector("#resultCount").textContent = String(destinations.length);

  if (destinations.length === 0) {
    list.innerHTML = '<div class="col-12"><div class="empty-message p-5 text-center"><h3 class="h5">Ничего не найдено</h3><p class="text-secondary mb-0">Измените фильтры или сбросьте их.</p></div></div>';
    return;
  }

  list.innerHTML = destinations.map((destination) => `
    <div class="col-md-6 col-lg-4">
      <article class="card destination-card">
        <div class="destination-cover ${destination.coverClass}" aria-hidden="true">${destination.emoji}</div>
        <div class="card-body d-flex flex-column">
          <div class="mb-2">
            <span class="badge badge-soft">${destination.typeLabel}</span>
            <span class="badge text-bg-light">${destination.days} дня</span>
          </div>
          <h3 class="h5 card-title">${destination.name}</h3>
          <p class="card-text text-secondary">${destination.description}</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <strong>от ${formatPrice(destination.price)}</strong>
            <a class="btn btn-sm btn-travel" href="destination.html?id=${destination.id}">Подробнее</a>
          </div>
        </div>
      </article>
    </div>
  `).join("");
}

async function initDestination() {
  const title = document.querySelector("#destinationTitle");

  if (!title) {
    return;
  }

  const id = new URLSearchParams(window.location.search).get("id") || "1";
  const pageStatus = document.querySelector("#destinationStatus");

  try {
    const response = await api.get(`/destinations/${id}`);
    const destination = response.data;
    renderDestination(destination);
    loadWeather(destination);
    initSaveRoute(destination.id);
    pageStatus.remove();
  } catch (error) {
    showMessage(pageStatus, getApiErrorMessage(error));
  }
}

function renderDestination(destination) {
  document.title = `${destination.name} — Маршрут`;
  document.querySelector("#destinationTitle").textContent = destination.name;
  document.querySelector("#destinationDescription").textContent = destination.description;
  document.querySelector("#destinationBadge").textContent = `${destination.typeLabel} · ${destination.days} дня`;
  document.querySelector("#destinationDays").textContent = `${destination.days} дня`;
  document.querySelector("#destinationPrice").textContent = `от ${formatPrice(destination.price)}`;
  document.querySelector("#destinationSeason").textContent = destination.season;
  document.querySelector("#destinationPace").textContent = destination.pace;
  document.querySelector("#programList").innerHTML = destination.program.map((item) => `<li class="list-group-item">${item}</li>`).join("");
  document.querySelector("#recommendationsList").innerHTML = destination.recommendations.map((item) => `<li class="mb-2">${item}</li>`).join("");
  document.querySelector("#reviewsList").innerHTML = destination.reviews.map((item) => `<blockquote class="blockquote fs-6 border-bottom pb-3"><p>${item}</p></blockquote>`).join("");

  const delta = 0.07;
  const map = document.querySelector("#destinationMap");
  map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${destination.longitude - delta}%2C${destination.latitude - delta}%2C${destination.longitude + delta}%2C${destination.latitude + delta}&layer=mapnik&marker=${destination.latitude}%2C${destination.longitude}`;
  map.title = `Карта: ${destination.name}`;
}

async function loadWeather(destination) {
  const weather = document.querySelector("#weatherContent");

  try {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      timeout: 6000,
      params: {
        latitude: destination.latitude,
        longitude: destination.longitude,
        current: "temperature_2m,weather_code,wind_speed_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min",
        forecast_days: 4,
        timezone: "auto"
      }
    });

    const data = response.data;
    weather.innerHTML = `
      <div class="weather-current mb-3">
        <strong class="fs-3">${Math.round(data.current.temperature_2m)} °C</strong>
        <span>${weatherText(data.current.weather_code)}, ветер ${Math.round(data.current.wind_speed_10m)} км/ч</span>
      </div>
      <div class="row g-2">
        ${data.daily.time.map((date, index) => `
          <div class="col-6 col-md-3">
            <div class="weather-day">
              <strong>${formatWeatherDate(date)}</strong>
              <span>${weatherText(data.daily.weather_code[index])}</span>
              <span>${Math.round(data.daily.temperature_2m_min[index])}…${Math.round(data.daily.temperature_2m_max[index])} °C</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } catch (error) {
    weather.innerHTML = '<div class="alert alert-warning mb-0">Не удалось загрузить прогноз погоды.</div>';
  }
}

function weatherText(code) {
  if (code === 0) return "ясно";
  if ([1, 2, 3].includes(code)) return "облачно";
  if ([45, 48].includes(code)) return "туман";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "дождь";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "снег";
  if ([95, 96, 99].includes(code)) return "гроза";
  return "переменная погода";
}

function formatWeatherDate(value) {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function initSaveRoute(destinationId) {
  const button = document.querySelector("#saveRouteButton");
  const buttonLabel = button.querySelector("[data-button-label]");
  const toastElement = document.querySelector("#saveToast");
  const toastBody = toastElement.querySelector(".toast-body");

  button.addEventListener("click", async () => {
    const user = getCurrentUser();

    if (!user) {
      toastBody.innerHTML = 'Сначала <a href="login.html">войдите в аккаунт</a>.';
      bootstrap.Toast.getOrCreateInstance(toastElement).show();
      return;
    }

    try {
      const existing = await api.get("/savedRoutes", {
        params: { userId: user.id, destinationId }
      });

      if (existing.data.length === 0) {
        await api.post("/savedRoutes", { userId: user.id, destinationId });
      }

      buttonLabel.textContent = "Маршрут сохранён";
      button.classList.replace("btn-light", "btn-success");
      toastBody.textContent = "Направление добавлено в личный кабинет.";
      bootstrap.Toast.getOrCreateInstance(toastElement).show();
    } catch (error) {
      toastBody.textContent = getApiErrorMessage(error);
      bootstrap.Toast.getOrCreateInstance(toastElement).show();
    }
  });
}

async function initProfile() {
  const profileName = document.querySelector("#profileName");

  if (!profileName) {
    return;
  }

  const user = getCurrentUser();
  const content = document.querySelector("#profileContent");

  if (!user) {
    content.innerHTML = '<div class="alert alert-warning">Для просмотра кабинета необходимо <a href="login.html">войти</a>.</div>';
    return;
  }

  profileName.textContent = `${user.firstName} ${user.lastName}`;
  document.querySelector("#profileEmail").textContent = `${user.email} · ${user.city}`;
  document.querySelector("#profileAvatar").textContent = `${user.firstName[0]}${user.lastName[0]}`;

  try {
    const [savedResponse, destinationsResponse] = await Promise.all([
      api.get("/savedRoutes", { params: { userId: user.id } }),
      api.get("/destinations")
    ]);
    const ids = savedResponse.data.map((item) => item.destinationId);
    const destinations = destinationsResponse.data.filter((item) => ids.includes(item.id));
    document.querySelector("#savedCount").textContent = `${destinations.length} маршрута`;
    renderSavedRoutes(destinations);
  } catch (error) {
    showMessage(document.querySelector("#savedRoutes"), getApiErrorMessage(error));
  }
}

function renderSavedRoutes(destinations) {
  const container = document.querySelector("#savedRoutes");
  container.setAttribute("aria-busy", "false");

  if (destinations.length === 0) {
    container.innerHTML = '<div class="col-12"><div class="empty-message p-4">Сохранённых маршрутов пока нет.</div></div>';
    return;
  }

  container.innerHTML = destinations.map((destination) => `
    <div class="col-md-6">
      <article class="card destination-card">
        <div class="card-body">
          <div class="d-flex justify-content-between gap-3">
            <div><span class="badge badge-soft mb-2">Сохранено</span><h3 class="h5">${destination.name} · ${destination.days} дня</h3></div>
            <span class="fs-2" aria-hidden="true">${destination.emoji}</span>
          </div>
          <p class="text-secondary">${destination.description}</p>
          <a class="btn btn-outline-secondary btn-sm" href="destination.html?id=${destination.id}">Посмотреть</a>
        </div>
      </article>
    </div>
  `).join("");
}

async function initTrip() {
  const noteForm = document.querySelector("#noteForm");

  if (!noteForm) {
    return;
  }

  const user = getCurrentUser();
  const authWarning = document.querySelector("#tripAuthWarning");

  if (!user) {
    showMessage(authWarning, 'Для изменения общего плана необходимо <a href="login.html">войти</a>.', "warning");
    noteForm.querySelector("input").disabled = true;
    noteForm.querySelector("button").disabled = true;
  }

  try {
    const [tripResponse, notesResponse] = await Promise.all([
      api.get("/trips/1"),
      api.get("/notes", { params: { tripId: "1" } })
    ]);
    renderTrip(tripResponse.data, notesResponse.data);
  } catch (error) {
    showMessage(authWarning, getApiErrorMessage(error));
  }

  noteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = noteForm.elements.note;
    const text = input.value.trim();

    if (!text || !user) return;

    try {
      const response = await api.post("/notes", {
        tripId: "1",
        userId: user.id,
        text
      });
      addNoteToList(response.data);
      input.value = "";
    } catch (error) {
      showMessage(authWarning, getApiErrorMessage(error));
    }
  });
}

function renderTrip(trip, notes) {
  document.querySelector("#tripTitle").textContent = trip.title;
  document.querySelector("#tripDates").textContent = trip.dates;
  document.querySelector("#tripBudget").textContent = `Запланировано ${formatPrice(trip.planned)} из ${formatPrice(trip.budget)}`;
  const progress = Math.round((trip.planned / trip.budget) * 100);
  const progressBar = document.querySelector("#budgetProgress");
  progressBar.style.width = `${progress}%`;
  progressBar.textContent = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", String(progress));

  document.querySelector("#participantsList").innerHTML = trip.participants.map((participant) => `
    <div class="participant mb-3">
      <span class="participant-icon">${participant.name[0]}</span>
      <div><strong>${participant.name}</strong><div class="small text-secondary">${participant.role}</div></div>
    </div>
  `).join("");

  const list = document.querySelector("#notesList");
  list.innerHTML = "";
  notes.forEach(addNoteToList);
}

function addNoteToList(note) {
  const list = document.querySelector("#notesList");
  const item = document.createElement("li");
  item.className = "list-group-item d-flex justify-content-between align-items-start gap-3";
  item.dataset.id = note.id;

  const text = document.createElement("span");
  text.textContent = note.text;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-sm btn-outline-danger";
  button.textContent = "Удалить";
  button.disabled = !getCurrentUser();
  button.addEventListener("click", async () => {
    try {
      await api.delete(`/notes/${note.id}`);
      item.remove();
    } catch (error) {
      window.alert(getApiErrorMessage(error));
    }
  });

  item.append(text, button);
  list.append(item);
}

function initShareButton() {
  const button = document.querySelector("#copyTripLink");
  const input = document.querySelector("#tripLink");
  const status = document.querySelector("#copyStatus");

  if (!button || !input) return;

  input.value = `${window.location.origin}${window.location.pathname}`;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(input.value);
      button.textContent = "Скопировано";
      status.textContent = "Ссылка скопирована в буфер обмена";
    } catch (error) {
      input.select();
      document.execCommand("copy");
      button.textContent = "Скопировано";
      status.textContent = "Ссылка скопирована в буфер обмена";
    }
  });
}
