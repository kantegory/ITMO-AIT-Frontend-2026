// Отображение направлений
function renderDestinations(filteredDestinations) {
    const grid = document.getElementById('destinationsGrid');
    
    if (filteredDestinations.length === 0) {
        grid.innerHTML = `
            <div class="col-12">
                <div class="no-results">
                    <i class="bi bi-search" style="font-size: 3rem;"></i>
                    <h5 class="mt-3">Ничего не найдено</h5>
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

// Карточка направления
function createDestinationCard(dest) {
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
    
    let typeIcon = 'bi-geo-alt';
    if (dest.type === 'Город') typeIcon = 'bi-building';
    else if (dest.type === 'Природа') typeIcon = 'bi-tree';
    else if (dest.type === 'Смешанный') typeIcon = 'bi-arrow-repeat';
    
    return `
        <div class="col-lg-6 col-xl-3 col-md-6 destination-item" 
                data-type="${dest.type}" 
                data-budget="${dest.budget}" 
                data-duration="${dest.duration}">
            <div class="card destination-card">
                <div class="destination-img" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url('${dest.image}');">
                    <span class="destination-badge">
                        <i class="bi ${typeIcon}"></i> ${dest.type}
                    </span>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${dest.name}</h5>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-light text-dark">
                            <i class="bi bi-calendar3"></i> ${dest.duration}
                        </span>
                        <span class="rating-stars">
                            ${stars} <span class="text-muted">${dest.rating}</span>
                        </span>
                    </div>
                    <p class="card-text text-muted small mb-2">${dest.description}</p>
                    <div class="mb-2 small">
                        ${tags}
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="price-tag">${dest.price}</span>
                        <div>
                            <a href="destination.html?id=${dest.id}" class="btn btn-sm btn-outline-success me-1">
                                <i class="bi bi-eye"></i> Смотреть
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Фильтрация
function filterDestinations() {
    const typeFilter = document.querySelector('input[name="typeFilter"]:checked')?.value || 'all';
    const budgetFilter = document.getElementById('budgetFilter').value;
    const durationFilter = document.getElementById('durationFilter').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    
    let filtered = destinations.filter(dest => {
        if (typeFilter !== 'all' && dest.type !== typeFilter) {
            return false;
        }
        
        if (budgetFilter !== 'all' && dest.budget !== budgetFilter) {
            return false;
        }
        
        if (durationFilter !== 'all' && dest.duration !== durationFilter) {
            return false;
        }
        
        if (searchQuery) {
            const searchable = `${dest.name} ${dest.description} ${dest.tags.join(' ')}`.toLowerCase();
            if (!searchable.includes(searchQuery)) {
                return false;
            }
        }
        return true;
    });
    renderDestinations(filtered);
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('typeAll').checked = true;
    document.getElementById('budgetFilter').value = 'all';
    document.getElementById('durationFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    
    filterDestinations();
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    renderDestinations(destinations);
    
    document.querySelectorAll('input[name="typeFilter"]').forEach(radio => {
        radio.addEventListener('change', filterDestinations);
    });
    
    document.getElementById('budgetFilter').addEventListener('change', filterDestinations);
    document.getElementById('durationFilter').addEventListener('change', filterDestinations);
});