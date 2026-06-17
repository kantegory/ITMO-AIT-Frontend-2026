const API_URL = "http://localhost:3000";
const AUTH_STORAGE_KEY = "authData";
const THEME_STORAGE_KEY = "siteThemePreference";
const SYSTEM_THEME_MEDIA = window.matchMedia("(prefers-color-scheme: dark)");

const DEFAULT_EVENTS = [];

function getStoredThemePreference() {
    const storedValue = localStorage.getItem(THEME_STORAGE_KEY);
    return storedValue === "light" || storedValue === "dark" || storedValue === "system"
        ? storedValue
        : "system";
}

function getResolvedTheme(themePreference = getStoredThemePreference()) {
    if (themePreference === "light" || themePreference === "dark") {
        return themePreference;
    }

    return SYSTEM_THEME_MEDIA.matches ? "dark" : "light";
}

function applyTheme(themePreference = getStoredThemePreference()) {
    const resolvedTheme = getResolvedTheme(themePreference);
    document.documentElement.setAttribute("data-bs-theme", resolvedTheme);
    document.body?.setAttribute("data-theme-preference", themePreference);

    const themeSelect = document.getElementById("themeSelect");
    if (themeSelect) {
        themeSelect.value = themePreference;
        themeSelect.setAttribute("aria-label", `Текущая тема: ${themeSelect.options[themeSelect.selectedIndex]?.textContent || themePreference}`);
    }
}

function changeTheme(themePreference) {
    localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    applyTheme(themePreference);
    showToast(`Тема интерфейса изменена: ${themePreference === "system" ? "системная" : themePreference === "dark" ? "тёмная" : "светлая"}`, "Темизация сайта");
}

function buildThemeSwitcherMarkup() {
    const currentPreference = getStoredThemePreference();

    return `
        <div class="theme-switcher" role="group" aria-label="Переключатель темы сайта">
            <label class="visually-hidden" for="themeSelect">Выберите тему сайта</label>
            <select id="themeSelect" class="form-select form-select-sm" onchange="changeTheme(this.value)">
                <option value="system" ${currentPreference === "system" ? "selected" : ""}>Системная тема</option>
                <option value="light" ${currentPreference === "light" ? "selected" : ""}>Светлая тема</option>
                <option value="dark" ${currentPreference === "dark" ? "selected" : ""}>Тёмная тема</option>
            </select>
        </div>
    `;
}


function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function showToast(message, title = "Уведомление") {
    const toastBody = document.getElementById("mainToastBody");
    const toastElement = document.getElementById("mainToast");
    const toastTitle = document.getElementById("mainToastTitle");

    if (toastBody && toastElement && window.bootstrap) {
        toastBody.textContent = message;
        if (toastTitle) toastTitle.textContent = title;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    } else {
        alert(message);
    }
}


function updateFilterStatus(message) {
    const status = document.getElementById("filterResultsStatus");
    if (status) status.textContent = message;
}

function updateEventsBusyState(isBusy) {
    const container = document.getElementById("eventsContainer");
    if (container) container.setAttribute("aria-busy", String(isBusy));
}

function getAuthData() {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)) || null;
}

function saveAuthData(authData) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

function clearAuthData() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

function getCurrentUser() {
    return getAuthData()?.user || null;
}

function getToken() {
    return getAuthData()?.accessToken || "";
}

async function apiRequest(path, options = {}) {
    const token = getToken();
    const headers = {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
        const message = typeof data === "object" && data !== null
            ? data.message || data.error || "Ошибка запроса"
            : "Ошибка запроса";
        throw new Error(message);
    }

    return data;
}

async function loadEvents() {
    return await apiRequest("/events?_sort=id&_order=asc");
}

async function loadEventById(eventId) {
    return await apiRequest(`/events/${encodeURIComponent(eventId)}`);
}

function typeLabel(type) {
    if (type === "concert") return "Концерт";
    if (type === "theatre") return "Театр";
    if (type === "exhibition") return "Выставка";
    return "Мероприятие";
}

function renderAuthButtons() {
    const container = document.getElementById("authButtons");
    if (!container) return;

    const user = getCurrentUser();

    const themeSwitcher = buildThemeSwitcherMarkup();

    if (!user) {
        container.innerHTML = `
            ${themeSwitcher}
            <a href="login.html" class="btn btn-outline-light" aria-label="Перейти на страницу входа">Вход</a>
            <a href="register.html" class="btn btn-warning" aria-label="Перейти на страницу регистрации">Регистрация</a>
        `;
        applyTheme();
        return;
    }

    container.innerHTML = `
        ${themeSwitcher}
        <a href="profile.html" class="btn btn-outline-light" aria-label="Открыть личный кабинет пользователя ${escapeHtml(user.name)}">${escapeHtml(user.name)}</a>
        <button type="button" class="btn btn-danger" onclick="logoutUser()" aria-label="Выйти из аккаунта">Выйти</button>
    `;
    applyTheme();
}

function logoutUser() {
    clearAuthData();
    window.location.href = "index.html";
}

function buildEventCard(event) {
    const safeTitle = escapeHtml(event.title);
    const typeText = typeLabel(event.type);
    const metaText = `${escapeHtml(event.cityLabel || event.city)} • ${escapeHtml(event.date)}`;

    return `
        <div class="col-md-4 event-card"
            data-title="${escapeHtml((event.title || "").toLowerCase())}"
            data-type="${escapeHtml(event.type)}"
            data-city="${escapeHtml((event.city || "").toLowerCase())}">
            <article class="card h-100 event-list-card" aria-labelledby="event-title-${escapeHtml(event.id)}">
                <img src="${escapeHtml(event.image)}" class="card-img-top" alt="Афиша мероприятия ${safeTitle}">
                <div class="card-body d-flex flex-column">
                    <span class="badge text-bg-light align-self-start mb-2" aria-label="Тип мероприятия: ${typeText}">${typeText}</span>
                    <h3 class="h5 card-title" id="event-title-${escapeHtml(event.id)}">${safeTitle}</h3>
                    <p class="text-muted mb-3" aria-label="Город и дата">${metaText}</p>
                    <a href="event.html?id=${encodeURIComponent(event.id)}" class="btn btn-primary mt-auto" aria-label="Подробнее о мероприятии ${safeTitle}">Подробнее</a>
                </div>
            </article>
        </div>
    `;
}

async function renderEvents() {
    const container = document.getElementById("eventsContainer");
    if (!container) return;

    updateEventsBusyState(true);
    updateFilterStatus("Список мероприятий загружается.");
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-info mb-0">Загрузка мероприятий...</div>
        </div>
    `;

    try {
        const events = await loadEvents();
        if (!Array.isArray(events) || events.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-secondary mb-0">Мероприятий пока нет.</div>
                </div>
            `;
            updateEventsBusyState(false);
            updateFilterStatus("Мероприятий пока нет.");
            return;
        }

        container.innerHTML = events.map(buildEventCard).join("");
        updateFilterStatus(`Показано мероприятий: ${events.length}.`);
        updateEventsBusyState(false);
    } catch (error) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger mb-0">Не удалось загрузить мероприятия: ${escapeHtml(error.message)}</div>
            </div>
        `;
        updateFilterStatus(`Не удалось загрузить мероприятия: ${error.message}`);
        updateEventsBusyState(false);
    }
}

function filterEvents() {
    const searchInput = document.getElementById("searchInput");
    const typeFilter = document.getElementById("typeFilter");
    const cityFilter = document.getElementById("cityFilter");
    if (!searchInput || !typeFilter || !cityFilter) return;

    const searchValue = searchInput.value.toLowerCase().trim();
    const typeValue = typeFilter.value;
    const cityValue = cityFilter.value.toLowerCase().trim();

    const cards = document.querySelectorAll(".event-card");

    cards.forEach((card) => {
        const eventTitle = card.dataset.title || "";
        const eventType = card.dataset.type || "";
        const eventCity = card.dataset.city || "";

        const matchesSearch = !searchValue || eventTitle.includes(searchValue);
        const matchesType = typeValue === "all" || eventType === typeValue;
        const matchesCity = !cityValue || eventCity.includes(cityValue);

        const isVisible = matchesSearch && matchesType && matchesCity;
        card.style.display = isVisible ? "block" : "none";
        card.hidden = !isVisible;
        if (!isVisible) {
            card.setAttribute("aria-hidden", "true");
        } else {
            card.removeAttribute("aria-hidden");
        }
    });

    const visibleCards = Array.from(cards).filter((card) => !card.hidden).length;
    updateFilterStatus(`Найдено мероприятий: ${visibleCards}.`);
}

function openAddEventModal() {
    const modalElement = document.getElementById("addEventModal");
    if (!modalElement || !window.bootstrap) return;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function initCreateEventForm() {
    const form = document.getElementById("createEventForm");
    if (!form) return;
    form.addEventListener("submit", createEvent);
}

async function createEvent(event) {
    if (event) event.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "organizer") {
        showToast("Создавать мероприятия может только организатор");
        return false;
    }

    const title = document.getElementById("eventTitle")?.value.trim();
    const type = document.getElementById("eventType")?.value;
    const city = document.getElementById("eventCity")?.value.trim();
    const date = document.getElementById("eventDate")?.value.trim();
    const place = document.getElementById("eventPlace")?.value.trim();
    const image = document.getElementById("eventImage")?.value.trim();
    const description = document.getElementById("eventDescription")?.value.trim();

    if (!title || !type || !city || !date || !place || !image || !description) {
        showToast("Заполните все поля формы");
        return false;
    }

    try {
        await apiRequest("/660/events", {
            method: "POST",
            body: JSON.stringify({
                title,
                type,
                city: city.toLowerCase(),
                cityLabel: city,
                date,
                place,
                image,
                description,
                creatorId: currentUser.id,
                userId: currentUser.id,
                isDefault: false,
            }),
        });

        const form = document.getElementById("createEventForm");
        if (form) form.reset();

        const modalElement = document.getElementById("addEventModal");
        if (modalElement && window.bootstrap) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }

        await renderOrganizerEvents();
        await renderEvents();
        showToast("Мероприятие успешно создано");
    } catch (error) {
        showToast(`Не удалось создать мероприятие: ${error.message}`);
    }

    return false;
}

async function renderOrganizerEvents() {
    const container = document.getElementById("organizerEventsList");
    if (!container) return;

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "organizer") {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
        <div class="card p-4 border-0 shadow-sm">
            <p class="mb-0 text-muted">Загрузка мероприятий...</p>
        </div>
    `;

    try {
        const events = await apiRequest(`/660/events?userId=${encodeURIComponent(currentUser.id)}&_sort=id&_order=desc`);

        if (!events.length) {
            container.innerHTML = `
                <div class="card p-4 border-0 shadow-sm">
                    <h5 class="mb-2">Пока нет мероприятий</h5>
                    <p class="mb-0 text-muted">Нажмите «Добавить мероприятие» и заполните форму.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = events.map((eventItem) => `
            <div class="card border-0 shadow-sm p-3 mb-3">
                <div class="d-flex justify-content-between gap-3 flex-wrap">
                    <div>
                        <h5 class="mb-1">${escapeHtml(eventItem.title)}</h5>
                        <p class="mb-1 text-muted">${escapeHtml(typeLabel(eventItem.type))}</p>
                        <p class="mb-1">${escapeHtml(eventItem.cityLabel || eventItem.city)} • ${escapeHtml(eventItem.date)} • ${escapeHtml(eventItem.place)}</p>
                        <p class="mb-3">${escapeHtml(eventItem.description)}</p>
                        <button type="button" class="btn btn-danger btn-sm" onclick="deleteCustomEvent('${eventItem.id}')" aria-label="Удалить мероприятие ${escapeHtml(eventItem.title)}">Удалить</button>
                    </div>
                    <img src="${escapeHtml(eventItem.image)}" alt="${escapeHtml(eventItem.title)}" class="organizer-event-thumb">
                </div>
            </div>
        `).join("");
    } catch (error) {
        container.innerHTML = `
            <div class="alert alert-danger mb-0">Не удалось загрузить мероприятия: ${escapeHtml(error.message)}</div>
        `;
    }
}

async function deleteCustomEvent(eventId) {
    try {
        await apiRequest(`/660/events/${encodeURIComponent(eventId)}`, {
            method: "DELETE",
        });

        await renderOrganizerEvents();
        await renderEvents();
        showToast("Мероприятие удалено");
    } catch (error) {
        showToast(`Не удалось удалить мероприятие: ${error.message}`);
    }
}

async function initEventPage() {
    const image = document.getElementById("eventHeroImage");
    const title = document.getElementById("eventPageTitle");
    const meta = document.getElementById("eventPageMeta");
    const description = document.getElementById("eventPageDescription");
    const type = document.getElementById("eventPageType");
    const buyButton = document.getElementById("buyTicketButton");

    if (!image || !title || !meta || !description || !type || !buyButton) return;

    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");

    if (!eventId) {
        title.textContent = "Мероприятие не найдено";
        meta.textContent = "В ссылке отсутствует идентификатор события.";
        description.textContent = "";
        buyButton.style.display = "none";
        return;
    }

    try {
        const currentEvent = await loadEventById(eventId);
        image.src = currentEvent.image;
        image.alt = `Афиша мероприятия ${currentEvent.title}`;
        title.textContent = currentEvent.title;
        type.textContent = typeLabel(currentEvent.type);
        meta.textContent = `${currentEvent.cityLabel || currentEvent.city} • ${currentEvent.date} • ${currentEvent.place}`;
        description.textContent = currentEvent.description;
        buyButton.setAttribute("data-event-id", currentEvent.id);
        buyButton.setAttribute("aria-label", `Купить билет на мероприятие ${currentEvent.title}`);
    } catch (error) {
        title.textContent = "Мероприятие не найдено";
        meta.textContent = "Проверьте ссылку на событие.";
        description.textContent = "";
        buyButton.style.display = "none";
    }
}

function buyTicketFromPage() {
    const button = document.getElementById("buyTicketButton");
    if (!button) return;
    const eventId = button.getAttribute("data-event-id");
    buyTicket(eventId);
}

async function buyTicket(eventId) {
    const user = getCurrentUser();
    if (!user) {
        showToast("Чтобы купить билет, сначала войдите в аккаунт");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 900);
        return;
    }

    try {
        await apiRequest("/tickets", {
            method: "POST",
            body: JSON.stringify({
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}` ,
                userId: user.id,
                eventId: Number(eventId) || eventId,
                refunded: false,
            }),
        });

        showToast("Билет успешно куплен");
    } catch (error) {
        showToast(`Не удалось купить билет: ${error.message}`);
    }
}

async function refundTicket(ticketId) {
    const user = getCurrentUser();
    if (!user) {
        showToast("Сначала войдите в аккаунт");
        return;
    }

    try {
        const matchedTickets = await apiRequest(`/tickets?id=${encodeURIComponent(ticketId)}&userId=${encodeURIComponent(user.id)}`);
        const ticketToRefund = Array.isArray(matchedTickets) ? matchedTickets.find((ticket) => !ticket.refunded) || matchedTickets[0] : null;

        if (!ticketToRefund) {
            showToast("Выбранный билет не найден");
            return;
        }

        await apiRequest(`/tickets/${encodeURIComponent(ticketToRefund.id)}`, {
            method: "PATCH",
            body: JSON.stringify({ refunded: true }),
        });

        await renderProfile();
        showToast("Удалён только выбранный билет");
    } catch (error) {
        showToast(`Не удалось вернуть билет: ${error.message}`);
    }
}

async function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("registerName")?.value.trim();
    const email = document.getElementById("registerEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("registerPassword")?.value.trim();
    const role = document.getElementById("registerRole")?.value || "user";

    if (!name || !email || !password) {
        showToast("Заполните все поля");
        return;
    }

    try {
        await apiRequest("/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password, role }),
        });

        const loginResult = await apiRequest("/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        saveAuthData({
            accessToken: loginResult.accessToken,
            user: loginResult.user,
        });

        window.location.href = "profile.html";
    } catch (error) {
        showToast(`Не удалось зарегистрироваться: ${error.message}`);
    }
}

async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("loginPassword")?.value.trim();

    if (!email || !password) {
        showToast("Заполните все поля");
        return;
    }

    try {
        const loginResult = await apiRequest("/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        saveAuthData({
            accessToken: loginResult.accessToken,
            user: loginResult.user,
        });

        window.location.href = "profile.html";
    } catch (error) {
        showToast("Неверный email или пароль");
    }
}

async function renderProfile() {
    const info = document.getElementById("profileInfo");
    const ticketsContainer = document.getElementById("ticketsContainer");
    const organizerSection = document.getElementById("organizerSection");
    if (!info || !ticketsContainer) return;

    const user = getCurrentUser();

    if (!user) {
        info.innerHTML = `
            <div class="alert alert-warning mb-0">
                Вы не вошли в аккаунт. <a href="login.html" class="alert-link">Войти</a>
            </div>
        `;
        ticketsContainer.innerHTML = "";
        if (organizerSection) organizerSection.style.display = "none";
        return;
    }

    const roleBadge = user.role === "organizer"
        ? '<span class="badge bg-warning text-dark ms-2">Организатор</span>'
        : '<span class="badge bg-secondary ms-2">Пользователь</span>';

    info.innerHTML = `
        <div class="card border-0 shadow-sm p-4">
            <h4 class="mb-2">${escapeHtml(user.name)} ${roleBadge}</h4>
            <p class="mb-0 text-muted">${escapeHtml(user.email)}</p>
        </div>
    `;

    if (organizerSection) {
        organizerSection.style.display = user.role === "organizer" ? "block" : "none";
    }

    ticketsContainer.innerHTML = `
        <div class="card border-0 shadow-sm p-4">
            <p class="mb-0 text-muted">Загрузка билетов...</p>
        </div>
    `;

    try {
        const allTickets = await apiRequest(`/tickets?userId=${encodeURIComponent(user.id)}&_sort=id&_order=desc`);
        const tickets = Array.isArray(allTickets) ? allTickets.filter((ticket) => !ticket.refunded) : [];

        if (!tickets.length) {
            ticketsContainer.innerHTML = `
                <div class="card border-0 shadow-sm p-4">
                    <p class="mb-0 text-muted">У вас пока нет купленных билетов.</p>
                </div>
            `;
        } else {
            const allEvents = await loadEvents();
            const eventMap = new Map(allEvents.map((item) => [String(item.id), item]));

            ticketsContainer.innerHTML = tickets.map((ticket) => {
                const eventItem = eventMap.get(String(ticket.eventId));
                if (!eventItem) {
                    return `
                        <div class="card border-0 shadow-sm p-3 mb-3">
                            <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                                <div>
                                    <h5 class="mb-1">Мероприятие недоступно</h5>
                                    <p class="mb-0 text-muted">Билет #${escapeHtml(ticket.id)} остался в истории, но само мероприятие уже удалено.</p>
                                </div>
                                <button type="button" class="btn btn-danger" onclick="refundTicket('${ticket.id}')" aria-label="Вернуть билет ${escapeHtml(ticket.id)}">Вернуть билет</button>
                            </div>
                        </div>
                    `;
                }

                return `
                    <div class="card border-0 shadow-sm p-3 mb-3">
                        <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                            <div>
                                <h5 class="mb-1">${escapeHtml(eventItem.title)}</h5>
                                <p class="mb-1 text-muted">${escapeHtml(typeLabel(eventItem.type))}</p>
                                <p class="mb-1">${escapeHtml(eventItem.cityLabel || eventItem.city)} • ${escapeHtml(eventItem.date)} • ${escapeHtml(eventItem.place)}</p>
                                <p class="mb-0 text-muted">Номер билета: ${escapeHtml(ticket.id)}</p>
                            </div>
                            <button type="button" class="btn btn-danger" onclick="refundTicket('${ticket.id}')" aria-label="Вернуть билет ${escapeHtml(ticket.id)}">Вернуть билет</button>
                        </div>
                    </div>
                `;
            }).join("");
        }
    } catch (error) {
        ticketsContainer.innerHTML = `
            <div class="alert alert-danger mb-0">Не удалось загрузить билеты: ${escapeHtml(error.message)}</div>
        `;
    }

    await renderOrganizerEvents();
}

document.addEventListener("DOMContentLoaded", async function() {
    applyTheme();

    const currentPageMain = document.querySelector("main");
    if (currentPageMain) currentPageMain.focus();
    renderAuthButtons();
    initCreateEventForm();

    if (typeof SYSTEM_THEME_MEDIA.addEventListener === "function") {
        SYSTEM_THEME_MEDIA.addEventListener("change", () => {
            if (getStoredThemePreference() === "system") applyTheme("system");
        });
    } else if (typeof SYSTEM_THEME_MEDIA.addListener === "function") {
        SYSTEM_THEME_MEDIA.addListener(() => {
            if (getStoredThemePreference() === "system") applyTheme("system");
        });
    }

    await renderEvents();
    await renderProfile();
    await initEventPage();
});
