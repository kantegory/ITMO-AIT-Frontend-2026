// Загрузка направления
function getDestinationId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

function loadDestination() {
    const id = getDestinationId();
    const destination = destinations.find(d => d.id === id) || destinations[0];
    
    if (!destination) {
        window.location.href = 'search.html';
        return;
    }
    renderDestinationPage(destination);
}

// Отрисовка странички
function renderDestinationPage(dest) {
    const content = document.getElementById('destinationContent');
    
    const fullStars = Math.floor(dest.rating);
    const hasHalf = dest.rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="bi bi-star-fill"></i>';
        } else if (i === fullStars && hasHalf) {
            stars += '<i class="bi bi-star-half"></i>';
        } else {
            stars += '<i class="bi bi-star"></i>';
        }
    }

    const tags = dest.tags.map(tag => 
        `<span class="badge bg-light text-dark me-1">#${tag}</span>`
    ).join('');

    const attractionsHtml = dest.attractions.map(attr => `
        <div class="attraction-item d-flex align-items-center">
            <div class="me-3">
                <div style="width: 60px; height: 60px; border-radius: 10px; background-image: url('${attr.image}'); background-size: cover; background-position: center;"></div>
            </div>
            <div>
                <h6 class="mb-1">${attr.name}</h6>
                <p class="text-muted small mb-0">${attr.description}</p>
            </div>
        </div>
    `).join('');

    const html = `
        <div class="destination-hero" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('${dest.image}');">
            <div class="destination-hero-overlay">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8">
                            <h1 class="destination-title">${dest.name}</h1>
                            <div class="d-flex align-items-center mb-3">
                                <span class="rating-large me-2">${stars}</span>
                                <span class="fs-4 fw-bold me-2">${dest.rating}</spanv>
                                <span class="text-white-50">(${dest.reviews} отзывов)</span>
                            </div>
                            <div class="d-flex gap-3">
                                <span class="badge bg-white text-dark p-2">
                                    <i class="bi bi-calendar3"></i> ${dest.duration}
                                </span>
                                <span class="badge bg-white text-dark p-2">
                                    ${dest.budget} бюджет
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mt-4">
            <div class="row mb-4">
                <div class="col-12 d-flex justify-content-end">
                    <button class="btn btn-success me-2" onclick="openAddRouteModal('${dest.name}', '${dest.attractions[0].name}, ${dest.attractions[1].name}', '${dest.description}', '${dest.duration}', '${dest.budget}', '${dest.type}')">
                        <i class="bi bi-map"></i> Добавить в маршруты
                    </button>
                </div>
            </div>

            <div class="row g-4 mb-5">
                <div class="col-lg-8">
                    <div class="card info-card mb-4">
                        <div class="card-header">
                            <i class="bi bi-info-circle"></i> О направлении
                        </div>
                        <div class="card-body">
                            <p class="card-text">${dest.fullDescription || dest.description}</p>
                            <div class="mt-3">
                                ${tags}
                            </div>
                        </div>
                    </div>

                    <div class="card info-card mb-4">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-camera"></i> Достопримечательности</span>
                            <span class="badge bg-success">${dest.attractions.length}+ мест</span>
                        </div>
                        <div class="card-body p-0">
                            ${attractionsHtml}
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card info-card mb-4">
                        <div class="card-header">
                            <i class="bi bi-clock-history"></i> Быстрая информация
                        </div>
                        <div class="card-body">
                            <div class="quick-info-item">
                                <div class="quick-info-icon">
                                    <i class="bi bi-cash-coin"></i>
                                </div>
                                <h6>Стоимость</h6>
                                <div class="price-large">${dest.price}</div>
                            </div>
                            <hr>
                            <div class="row g-3">
                                <div class="col-6">
                                    <div class="quick-info-icon small">
                                        <i class="bi bi-calendar-check"></i>
                                    </div>
                                    <h6 class="small">Лучший сезон</h6>
                                    <p class="fw-bold">${dest.bestSeason}</p>
                                </div>
                                <div class="col-6">
                                    <div class="quick-info-icon small">
                                        <i class="bi bi-translate"></i>
                                    </div>
                                    <h6 class="small">Язык</h6>
                                    <p class="fw-bold">${dest.language}</p>
                                </div>
                                <div class="col-6">
                                    <div class="quick-info-icon small">
                                        <i class="bi bi-currency-exchange"></i>
                                    </div>
                                    <h6 class="small">Валюта</h6>
                                    <p class="fw-bold">${dest.currency}</p>
                                </div>
                                <div class="col-6">
                                    <div class="quick-info-icon small">
                                        <i class="bi bi-clock"></i>
                                    </div>
                                    <h6 class="small">Часовой пояс</h6>
                                    <p class="fw-bold">${dest.timezone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    content.innerHTML = html;
}

// Модалка добавления маршрута
function openAddRouteModal(destinationName, attractions, description, duration, budget, type) {
    document.getElementById('routeTitle').value = destinationName;
    document.getElementById('routePoints').value = attractions;
    document.getElementById('routeType').value = type;
    document.getElementById('routeDescription').value = description;
    document.getElementById('routeDuration').value = duration;
    document.getElementById('routeBudget').value = budget;
    
    const modal = new bootstrap.Modal(document.getElementById('addRouteModal'));
    modal.show();
}

// Сохранение маршрута в ЛК
function saveRouteFromDestination() {
    const title = document.getElementById('routeTitle').value;
    const points = document.getElementById('routePoints').value;
    const type = document.getElementById('routeType').value;
    const duration = document.getElementById('routeDuration').value;
    const budget = document.getElementById('routeBudget').value;
    const description = document.getElementById('routeDescription').value;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let userRoutes = JSON.parse(localStorage.getItem(`travelRoutes_${currentUser.email}`) || '[]');
    const route = userRoutes.find(r => r.title === title);

    if (route) {
        alert(`Этот маршрут уже есть в вашем личном кабинете!`);
        return;
    } else {
        const newRoute = {
            title,
            points,
            duration,
            budget,
            type,
            description
        };

        userRoutes.unshift(newRoute);
        localStorage.setItem(`travelRoutes_${currentUser.email}`, JSON.stringify(userRoutes));
        alert(`Маршрут добавлен в личный кабинет!`);
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addRouteModal'));
    modal.hide();
}

// Инициализация
document.addEventListener('DOMContentLoaded', loadDestination);