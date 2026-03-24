function getDestinationId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

async function loadDestination() {
    const id = getDestinationId();
    
    try {
        const destination = await api.get(`/destinations/${id}`);
        if (!destination) {
            showNotification('Направление не найдено', true);
            setTimeout(() => {
                window.location.href = 'search.html';
            }, 1500);
            return;
        }
        renderDestinationPage(destination);
        document.title = `FlyingOwl - ${destination.name}`;
    } catch (error) {
        console.error('Ошибка загрузки направления:', error);
        showNotification('Ошибка загрузки направления', true);
        setTimeout(() => {
            window.location.href = 'search.html';
        }, 1500);
    }
}

function renderDestinationPage(dest) {
    const content = document.getElementById('destinationContent');
    
    const fullStars = Math.floor(dest.rating);
    const hasHalf = dest.rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="bi bi-star-fill" aria-hidden="true"></i>';
        } else if (i === fullStars && hasHalf) {
            stars += '<i class="bi bi-star-half" aria-hidden="true"></i>';
        } else {
            stars += '<i class="bi bi-star" aria-hidden="true"></i>';
        }
    }

    const tags = dest.tags.map(tag => 
        `<span class="badge bg-light text-dark me-1">#${tag}</span>`
    ).join('');

    const attractionsHtml = dest.attractions.map(attr => `
        <div class="attraction-item d-flex align-items-center" role="listitem">
            <div class="me-3" aria-hidden="true">
                <div style="width: 60px; height: 60px; border-radius: 10px; background-image: url('${attr.image}'); background-size: cover; background-position: center;"></div>
            </div>
            <div>
                <h3 class="h6 mb-1">${attr.name}</h3>
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
                                <span class="rating-large me-2" aria-label="Рейтинг: ${dest.rating} из 5">${stars}</span>
                                <span class="fs-4 fw-bold me-2" aria-hidden="true">${dest.rating}</span>
                                <span class="text-white-50">(${dest.reviews} отзывов)</span>
                            </div>
                            <div class="d-flex flex-wrap gap-3">
                                <span class="badge bg-white text-dark p-2">
                                    <i class="bi bi-calendar3" aria-hidden="true"></i> ${dest.duration}
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
                    <button class="btn btn-success me-2" onclick="openAddRouteModal('${dest.id}', '${dest.name.replace(/'/g, "\\'")}', '${dest.attractions[0]?.name || ''}, ${dest.attractions[1]?.name || ''}', '${dest.description.replace(/'/g, "\\'")}', '${dest.duration}', '${dest.budget}', '${dest.type}')"
                            aria-label="Добавить маршрут в личный кабинет">
                        <i class="bi bi-map" aria-hidden="true"></i> Добавить в маршруты
                    </button>
                </div>
            </div>

            <div class="row g-4 mb-5">
                <div class="col-lg-8">
                    <section class="card info-card mb-4" aria-labelledby="aboutHeading">
                        <div class="card-header">
                            <h2 id="aboutHeading" class="h5 mb-0"><i class="bi bi-info-circle" aria-hidden="true"></i> О направлении</h2>
                        </div>
                        <div class="card-body">
                            <p class="card-text">${dest.fullDescription || dest.description}</p>
                            <div class="mt-3">
                                ${tags}
                            </div>
                        </div>
                    </section>

                    <section class="card info-card mb-4" aria-labelledby="attractionsHeading">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h2 id="attractionsHeading" class="h5 mb-0"><i class="bi bi-camera" aria-hidden="true"></i> Достопримечательности</h2>
                            <span class="badge bg-success">${dest.attractions.length}+ мест</span>
                        </div>
                        <div class="card-body p-0">
                            <div role="list" aria-label="Список достопримечательностей">
                                ${attractionsHtml}
                            </div>
                        </div>
                    </section>
                </div>

                <div class="col-lg-4">
                    <aside class="card info-card mb-4" aria-labelledby="quickInfoHeading">
                        <div class="card-header">
                            <h2 id="quickInfoHeading" class="h5 mb-0"><i class="bi bi-clock-history" aria-hidden="true"></i> Быстрая информация</h2>
                        </div>
                        <div class="card-body">
                            <div class="quick-info-item text-center">
                                <div class="quick-info-icon" aria-hidden="true">
                                    <i class="bi bi-cash-coin"></i>
                                </div>
                                <h3 class="h6">Стоимость</h3>
                                <div class="price-large">${dest.price}</div>
                            </div>
                            <hr>
                            <div class="row g-3">
                                <div class="col-6">
                                    <div class="quick-info-icon small" aria-hidden="true">
                                        <i class="bi bi-calendar-check"></i>
                                    </div>
                                    <h3 class="h6 small">Лучший сезон</h3>
                                    <p class="fw-bold">${dest.bestSeason}</p>
                                </div>
                                <div class="col-6">
                                    <div class="quick-info-icon small" aria-hidden="true">
                                        <i class="bi bi-translate"></i>
                                    </div>
                                    <h3 class="h6 small">Язык</h3>
                                    <p class="fw-bold">${dest.language}</p>
                                </div>
                                <div class="col-6">
                                    <div class="quick-info-icon small" aria-hidden="true">
                                        <i class="bi bi-currency-exchange"></i>
                                    </div>
                                    <h3 class="h6 small">Валюта</h3>
                                    <p class="fw-bold">${dest.currency}</p>
                                </div>
                                <div class="col-6">
                                    <div class="quick-info-icon small" aria-hidden="true">
                                        <i class="bi bi-clock"></i>
                                    </div>
                                    <h3 class="h6 small">Часовой пояс</h3>
                                    <p class="fw-bold">${dest.timezone}</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    `;
    content.innerHTML = html;
}

function openAddRouteModal(destinationId, destinationName, attractions, description, duration, budget, type) {
    document.getElementById('routeTitle').value = destinationName;
    document.getElementById('routePoints').value = attractions;
    document.getElementById('routeType').value = type;
    document.getElementById('routeDescription').value = description;
    document.getElementById('routeDuration').value = duration;
    document.getElementById('routeBudget').value = budget;
    document.getElementById('routeDestinationId').value = destinationId;
    
    const modal = new bootstrap.Modal(document.getElementById('addRouteModal'));
    modal.show();
}

async function saveRouteFromDestination() {
    const destinationId = parseInt(document.getElementById('routeDestinationId').value);
    const title = document.getElementById('routeTitle').value;
    const points = document.getElementById('routePoints').value;
    const type = document.getElementById('routeType').value;
    const duration = document.getElementById('routeDuration').value;
    const budget = document.getElementById('routeBudget').value;
    const description = document.getElementById('routeDescription').value;

    const currentUser = api.getCurrentUser();
    if (!currentUser) {
        showNotification('Необходимо авторизоваться', true);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    try {
        const allRoutes = await api.authGet('/routes');
        const existingRoute = allRoutes.find(r => r.destinationId === destinationId && r.userId === currentUser.id);

        if (existingRoute) {
            showNotification('Этот маршрут уже есть в вашем личном кабинете!', true);
            return;
        }

        const newRoute = {
            id: Date.now().toString(),
            destinationId,
            title,
            points,
            duration,
            budget,
            type,
            description,
            userId: currentUser.id,
            savedAt: new Date().toISOString()
        };

        await api.authPost('/routes', newRoute);        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addRouteModal'));
        modal.hide();
        
        showNotification('Маршрут добавлен в личный кабинет!');
    } catch (error) {
        console.error('Ошибка при сохранении маршрута:', error);
        showNotification('Ошибка при сохранении маршрута: ' + error.message, true);
    }
}

document.addEventListener('DOMContentLoaded', loadDestination);