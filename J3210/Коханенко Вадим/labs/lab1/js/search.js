let destinations = [];

async function loadDestinations() {
    try {
        destinations = await api.get('/destinations');
        renderDestinations(destinations);
    } catch (error) {
        console.error('Ошибка загрузки направлений:', error);
        showNotification('Ошибка загрузки данных. Попробуйте обновить страницу.', true);
        document.getElementById('destinationsGrid').innerHTML = `
            <div class="col-12">
                <div class="no-results">
                    <h3 class="mt-3">Ошибка загрузки данных</h3>
                    <p class="text-muted">Попробуйте обновить страницу</p>
                </div>
            </div>
        `;
    }
}

function renderDestinations(filteredDestinations) {
    const grid = document.getElementById('destinationsGrid');
    
    if (filteredDestinations.length === 0) {
        grid.innerHTML = `
            <div class="col-12">
                <div class="no-results">
                    <svg class="icon" aria-hidden="true"><use xlink:href="sprite.svg#icon-search"></use></svg>
                    <h3 class="mt-3">Ничего не найдено</h3>
                    <p class="text-muted">Попробуйте изменить параметры фильтрации</p>
                </div>
            </div>
        `;
        document.getElementById('resultsCount').textContent = 'Найдено: 0 направлений';
        return;
    }
    
    let html = '';
    filteredDestinations.forEach(dest => {
        html += createDestinationCard(dest);
    });
    
    grid.innerHTML = html;
    document.getElementById('resultsCount').textContent = `Найдено: ${filteredDestinations.length} направлений`;
}

function createDestinationCard(dest) {
    const fullStars = Math.floor(dest.rating);
    const hasHalf = dest.rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<svg class="icon" aria-hidden="true"><use xlink:href="sprite.svg#icon-star-fill"></use></svg>';
        } else if (i === fullStars && hasHalf) {
            stars += '<svg class="icon" aria-hidden="true"><use xlink:href="sprite.svg#icon-star-half"></use></svg>';
        } else {
            stars += '<svg class="icon" aria-hidden="true"><use xlink:href="sprite.svg#icon-star"></use></svg>';
        }
    }
    
    const tags = dest.tags.map(tag => 
        `<span class="badge bg-light text-dark me-1" aria-label="Тег: ${tag}">#${tag}</span>`
    ).join('');
    
    let typeIcon = 'bi-geo-alt';
    if (dest.type === 'Город') typeIcon = 'icon-building';
    else if (dest.type === 'Природа') typeIcon = 'icon-tree';
    else typeIcon = 'icon-arrow-repeat';
    
    return `
        <div class="col-lg-6 col-xl-3 col-md-6 destination-item" role="listitem"
                data-type="${dest.type}" 
                data-budget="${dest.budget}" 
                data-duration="${dest.duration}">
            <div class="card destination-card">
                <div class="destination-img" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url('${dest.image}');">
                    <span class="destination-badge">
                        <svg class="icon" aria-hidden="true"><use xlink:href="sprite.svg#${typeIcon}"></use></svg> ${dest.type}
                    </span>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h3 class="h5 card-title mb-0">${dest.name}</h3>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-light text-dark">
                            <svg class="icon" aria-hidden="true"><use xlink:href="sprite.svg#icon-calendar"></use></svg> ${dest.duration}
                        </span>
                        <span class="rating-stars" aria-label="Рейтинг: ${dest.rating} из 5">
                            ${stars} <span class="text-muted" aria-hidden="true">${dest.rating}</span>
                        </span>
                    </div>
                    <p class="card-text text-muted small mb-2">${dest.description.substring(0, 150)}${dest.description.length > 150 ? '…' : ''}</p>
                    <div class="mb-2 small">
                        ${tags}
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="price-tag">${dest.price}</span>
                        <div>
                            <a href="destination.html?id=${dest.id}" class="btn btn-sm btn-outline-success me-1"
                               aria-label="Подробнее о ${dest.name}">
                                <svg class="icon" aria-hidden="true"><use xlink:href="sprite.svg#icon-eye"></use></svg> Смотреть
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function filterDestinations() {
    const typeFilter = document.querySelector('input[name="typeFilter"]:checked')?.value || 'all';
    const budgetFilter = document.getElementById('budgetFilter').value;
    const durationFilter = document.getElementById('durationFilter').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    
    let filtered = destinations.filter(dest => {
        if (typeFilter !== 'all' && dest.type !== typeFilter) return false;
        if (budgetFilter !== 'all' && dest.budget !== budgetFilter) return false;
        if (durationFilter !== 'all' && dest.duration !== durationFilter) return false;

        if (searchQuery) {
            const searchable = `${dest.name} ${dest.description} ${dest.tags.join(' ')}`.toLowerCase();
            if (!searchable.includes(searchQuery)) return false;
        }
        return true;
    });

    renderDestinations(filtered);
}

function resetFilters() {
    document.getElementById('typeAll').checked = true;
    document.getElementById('budgetFilter').value = 'all';
    document.getElementById('durationFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    filterDestinations();
    showNotification('Фильтры сброшены');
}

document.addEventListener('DOMContentLoaded', function() {
    loadDestinations();
    
    document.querySelectorAll('input[name="typeFilter"]').forEach(radio => {
        radio.addEventListener('change', filterDestinations);
    });
    
    document.getElementById('budgetFilter').addEventListener('change', filterDestinations);
    document.getElementById('durationFilter').addEventListener('change', filterDestinations);
});