
import { Auth } from './auth.js';
import { EventsAPI, ReviewsAPI, TicketsAPI } from './api.js';

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
    initForms();
    initDynamicContent();
    initEventListeners();
});

// === ОБРАБОТЧИКИ ФОРМ ===
function initForms() {
    // Форма входа
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;

            try {
                await Auth.login({ email, password });
                window.location.href = 'profile.html';
            } catch (error) {
                showAlert(error.message, 'danger');
            }
        });
    }

    // Форма регистрации
    const registerForm = document.querySelector('#register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('firstName')?.value;
            const lastName = document.getElementById('lastName')?.value;
            const email = document.getElementById('email')?.value;
            const phone = document.getElementById('phone')?.value;
            const password = document.getElementById('password')?.value;
            const confirmPassword = document.getElementById('confirmPassword')?.value;

            if (password !== confirmPassword) {
                showAlert('Пароли не совпадают', 'danger');
                return;
            }

            try {
                await Auth.register({
                    email,
                    password,
                    firstName,
                    lastName,
                    phone,
                    role: 'user'
                });
                window.location.href = 'profile.html';
            } catch (error) {
                showAlert(error.message, 'danger');
            }
        });
    }

    // Форма добавления отзыва
    const reviewForm = document.querySelector('#review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!Auth.isAuthenticated()) {
                showAlert('Необходимо войти в систему', 'warning');
                return;
            }

            const eventId = reviewForm.dataset.eventId;
            const rating = reviewForm.querySelector('[name="rating"]:checked')?.value;
            const text = reviewForm.querySelector('[name="text"]')?.value;
            const user = Auth.getCurrentUser();

            try {
                await ReviewsAPI.create({
                    eventId,
                    userId: user.id,
                    userName: `${user.firstName} ${user.lastName}`,
                    userAvatar: user.avatar || 'https://placebear.com/70/50',
                    rating: parseFloat(rating),
                    text,
                    createdAt: new Date().toISOString()
                });

                // Закрываем модальное окно и обновляем отзывы
                const modal = bootstrap.Modal.getInstance(document.getElementById('addReviewModal'));
                modal?.hide();
                reviewForm.reset();
                loadReviews(eventId);
                showAlert('Отзыв успешно добавлен!', 'success');
            } catch (error) {
                showAlert(error.message, 'danger');
            }
        });
    }

    // Форма создания события (для организатора)
    const createEventForm = document.querySelector('#create-event-form');
    if (createEventForm) {
        createEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!Auth.hasRole('organizer')) {
                showAlert('Доступ только для организаторов', 'danger');
                return;
            }

            const organizer = Auth.getCurrentUser();
            const eventData = {
                title: document.getElementById('event-title')?.value,
                description: document.getElementById('event-description')?.value,
                longDescription: document.getElementById('event-long-description')?.value,
                type: document.getElementById('event-type')?.value,
                ageRestriction: document.getElementById('event-age')?.value,
                duration: parseInt(document.getElementById('event-duration')?.value),
                poster: document.getElementById('event-poster')?.value,
                venue: {
                    name: document.getElementById('venue-name')?.value,
                    address: document.getElementById('venue-address')?.value,
                    metro: document.getElementById('venue-metro')?.value
                },
                organizerId: organizer.id,
                dates: [],
                prices: {},
                createdAt: new Date().toISOString()
            };

            try {
                await EventsAPI.create(eventData);
                const modal = bootstrap.Modal.getInstance(document.getElementById('createEventModal'));
                modal?.hide();
                createEventForm.reset();
                showAlert('Событие успешно создано!', 'success');
                loadOrganizerEvents();
            } catch (error) {
                showAlert(error.message, 'danger');
            }
        });
    }
}

// === ДИНАМИЧЕСКИЙ КОНТЕНТ ===
function initDynamicContent() {
    // Загрузка событий на главной
    if (document.getElementById('events-list')) {
        loadEventsList();
    }

    // Загрузка деталей события
    if (document.getElementById('event-detail')) {
        const eventId = new URLSearchParams(window.location.search).get('id') || '1';
        loadEventDetail(eventId);
        loadReviews(eventId);
    }

    // Загрузка профиля пользователя
    if (document.getElementById('user-tickets')) {
        loadUserTickets();
    }

    // Загрузка панели организатора
    if (document.getElementById('organizer-events')) {
        loadOrganizerEvents();
    }
}

// === ЗАГРУЗКА СОБЫТИЙ ===
async function loadEventsList(filters = {}) {
    const container = document.getElementById('events-list');
    if (!container) return;

    try {
        container.innerHTML = '<div class="text-center py-5">Загрузка...</div>';
        const events = await EventsAPI.getAll(filters);

        if (events.length === 0) {
            container.innerHTML = '<p class="text-muted">События не найдены</p>';
            return;
        }

        container.innerHTML = events.map(event => createEventCard(event)).join('');
    } catch (error) {
        container.innerHTML = `<p class="text-danger">Ошибка загрузки: ${error.message}</p>`;
    }
}

// === ЗАГРУЗКА ДЕТАЛЕЙ СОБЫТИЯ ===
async function loadEventDetail(eventId) {
    const container = document.getElementById('event-detail');
    if (!container) return;

    try {
        const event = await EventsAPI.getById(eventId);

        // Заполняем базовую информацию
        document.querySelector('.event-title')?.textContent = event.title;
        document.querySelector('.event-description')?.textContent = event.description;
        document.querySelector('.event-poster')?.src = event.poster;
        document.querySelector('.event-venue')?.textContent = event.venue.name;

        // Заполняем даты
        const dateSelect = document.getElementById('event-date-select');
        if (dateSelect && event.dates) {
            dateSelect.innerHTML = event.dates
                .filter(d => d.available)
                .map(date => {
                    const dt = new Date(date.datetime);
                    return `<option value="${date.id}">${dt.toLocaleDateString('ru-RU', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    })}, ${dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</option>`;
                }).join('');
        }

        // Заполняем цены
        const pricesList = document.getElementById('prices-list');
        if (pricesList && event.prices) {
            pricesList.innerHTML = Object.values(event.prices).map(price => `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    ${price.name}
                    <span class="badge bg-primary rounded-pill fs-6">${price.price.toLocaleString('ru-RU')} ₽</span>
                </div>
            `).join('');
        }

    } catch (error) {
        container.innerHTML = `<p class="text-danger">Ошибка: ${error.message}</p>`;
    }
}

// === ЗАГРУЗКА ОТЗЫВОВ ===
async function loadReviews(eventId) {
    const container = document.getElementById('reviews-list');
    if (!container) return;

    try {
        const reviews = await ReviewsAPI.getByEventId(eventId);

        if (reviews.length === 0) {
            container.innerHTML = '<p class="text-muted">Отзывов пока нет</p>';
            return;
        }

        container.innerHTML = reviews.map(review => `
            <div class="review-item mb-3">
                <div class="d-flex">
                    <img src="${review.userAvatar}" class="rounded-circle me-3" alt="Аватар ${review.userName}">
                    <div>
                        <h4 class="fs-6 mb-0">${review.userName} <small class="text-muted">· ${formatDate(review.createdAt)}</small></h4>
                        <div class="text-warning mb-2" aria-label="Рейтинг: ${review.rating} из 5">
                            ${renderStars(review.rating)}
                        </div>
                        <p class="mb-0">${review.text}</p>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        container.innerHTML = `<p class="text-danger">Ошибка загрузки отзывов</p>`;
    }
}

// === ЗАГРУЗКА БИЛЕТОВ ПОЛЬЗОВАТЕЛЯ ===
async function loadUserTickets() {
    const container = document.getElementById('user-tickets');
    if (!container) return;

    const user = Auth.getCurrentUser();
    if (!user) {
        container.innerHTML = '<p class="text-muted"><a href="login.html">Войдите</a>, чтобы увидеть свои билеты</p>';
        return;
    }

    try {
        const tickets = await TicketsAPI.getByUserId(user.id);

        if (tickets.length === 0) {
            container.innerHTML = '<p class="text-muted">У вас пока нет билетов</p>';
            return;
        }

        container.innerHTML = tickets.map(ticket => `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h3 class="fs-6">${ticket.event?.title || 'Событие'}</h3>
                    <small class="text-muted">
                        ${new Date(ticket.event?.dates?.find(d => d.id === ticket.eventDateId)?.datetime || ticket.purchasedAt)
            .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                        ${ticket.row ? `, Ряд ${ticket.row}, Место ${ticket.seat}` : ''}
                    </small>
                </div>
                <span class="badge bg-${ticket.status === 'active' ? 'success' : 'secondary'}">
                    ${ticket.status === 'active' ? 'Активен' : 'Возвращён'}
                </span>
            </div>
        `).join('');

    } catch (error) {
        container.innerHTML = `<p class="text-danger">Ошибка загрузки билетов</p>`;
    }
}

// === ЗАГРУЗКА СОБЫТИЙ ОРГАНИЗАТОРА ===
async function loadOrganizerEvents() {
    const container = document.getElementById('organizer-events');
    if (!container) return;

    const user = Auth.getCurrentUser();
    if (!user || user.role !== 'organizer') {
        container.innerHTML = '<p class="text-muted">Доступ только для организаторов</p>';
        return;
    }

    try {
        const events = await EventsAPI.getAll({ organizerId: user.id });

        if (events.length === 0) {
            container.innerHTML = '<p class="text-muted">У вас пока нет мероприятий</p>';
            return;
        }

        // Генерация таблицы (упрощённая)
        container.innerHTML = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Событие</th>
                        <th>Дата</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    ${events.map(event => `
                        <tr>
                            <td>${event.title}</td>
                            <td>${event.dates?.[0]?.datetime ? new Date(event.dates[0].datetime).toLocaleDateString('ru-RU') : '-'}</td>
                            <td><span class="badge bg-success">Активно</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

    } catch (error) {
        container.innerHTML = `<p class="text-danger">Ошибка загрузки</p>`;
    }
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
function createEventCard(event) {
    const date = event.dates?.[0]?.datetime ? new Date(event.dates[0].datetime) : null;
    return `
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="${event.poster}" class="card-img-top" alt="Афиша ${event.title}">
                <div class="card-body">
                    <h3 class="card-title h5">${event.title}</h3>
                    <p class="card-text text-muted">
                        <svg class="icon" aria-hidden="true" width="12" height="12">
                            <use href="images/sprite.svg#icon-map-pin"></use>
                        </svg> ${event.venue?.name || 'Место не указано'}
                    </p>
                    <p class="card-text"><small class="text-muted">
                        <svg class="icon" aria-hidden="true" width="12" height="12">
                            <use href="images/sprite.svg#icon-calendar"></use>
                        </svg> ${date ? date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : 'Дата не указана'}
                    </small></p>
                    <a href="event.html?id=${event.id}" class="btn btn-primary">Подробнее</a>
                </div>
            </div>
        </div>
    `;
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    let stars = '';
    for (let i = 0; i < full; i++) {
        stars += '<svg class="icon rating-star" width="16" height="16"><use href="images/sprite.svg#icon-star"></use></svg>';
    }
    if (half) {
        stars += '<svg class="icon rating-star" width="16" height="16"><use href="images/sprite.svg#icon-star-half"></use></svg>';
    }
    for (let i = 0; i < empty; i++) {
        stars += '<svg class="icon rating-star" width="16" height="16"><use href="images/sprite.svg#icon-star-empty"></use></svg>';
    }
    return stars;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 24 * 60 * 60 * 1000) {
        return 'сегодня';
    } else if (diff < 48 * 60 * 60 * 1000) {
        return 'вчера';
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (24 * 60 * 60 * 1000))} дней назад`;
    }
    return date.toLocaleDateString('ru-RU');
}

function showAlert(message, type = 'info') {
    // Простая реализация через Bootstrap alerts
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    // Автоудаление через 5 секунд
    setTimeout(() => alertDiv.remove(), 5000);
}

function initEventListeners() {
    // Поиск событий
    const searchForm = document.querySelector('form[role="search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('search-event')?.value;
            const type = document.getElementById('event-type')?.value;
            loadEventsList({ _q: query, type: type !== 'Тип' ? type : undefined });
        });
    }

    // Переключение темы (уже есть в theme.js, но можно добавить синхронизацию)
    document.addEventListener('theme:changed', (e) => {
        console.log('Theme changed:', e.detail);
    });
}