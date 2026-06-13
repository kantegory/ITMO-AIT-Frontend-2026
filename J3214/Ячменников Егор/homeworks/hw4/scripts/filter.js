document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost:3000';
    const container = document.getElementById('events-container');
    const filterForm = document.getElementById('filter-form');
    
    if (!container) return;

    const pageDefaultType = container.getAttribute('data-type');

    async function fetchAndRenderEvents() {
        try {
            const serverParams = {};
            if (pageDefaultType) {
                serverParams.type = pageDefaultType;
            } else {
                const typeSelect = document.getElementById('filter-type');
                if (typeSelect && typeSelect.value && typeSelect.value !== 'Все типы') {
                    serverParams.type = typeSelect.value;
                }
            }

            const response = await axios.get(`${API_BASE}/events`, { params: serverParams });
            let events = response.data;

            const dateInput = document.getElementById('filter-date');
            if (dateInput && dateInput.value) {
                events = events.filter(event => event.dateRaw === dateInput.value);
            }

            const placeInput = document.getElementById('filter-place');
            if (placeInput && placeInput.value.trim() !== '') {
                const searchString = placeInput.value.trim().toLowerCase();
                events = events.filter(event => {
                    return event.place && event.place.toLowerCase().includes(searchString);
                });
            }

            container.innerHTML = '';

            if (events.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center text-muted py-5">
                        <h5>По вашему запросу ничего не найдено</h5>
                    </div>
                `;
                return;
            }

            const now = new Date();

            events.forEach(event => {
                if (new Date(event.dateRaw) >= now) {
                    const cardHtml = `
                        <div class="col">
                            <div class="card h-100 event-card shadow-sm">
                                <img src="${event.image}" class="card-img-top" alt="${event.title}">
                                <div class="card-body">
                                    <h3 class="card-title">${event.title}</h3>
                                    <p class="text-muted mb-1">${event.date}</p>
                                    <p class="card-text text-secondary">${event.faceDescription}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="fw-bold fs-5">от ${event.price} ₽</span>
                                        <a href="event.html?id=${event.id}" class="btn btn-outline-primary" aria-label="Купить билет на ${event.title}">Купить билет</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    container.insertAdjacentHTML('beforeend', cardHtml);
                }
            });

        } catch (error) {
            console.error('Ошибка при обработке мероприятий:', error);
            container.innerHTML = `<div class="col-12 alert alert-danger text-center">Ошибка загрузки данных.</div>`;
        }
    }

    fetchAndRenderEvents();

    const resetBtn = document.getElementById('btn-reset');

    if (resetBtn && filterForm) {
        resetBtn.addEventListener('click', () => {
            filterForm.reset();

            fetchAndRenderEvents(); 
        });
    }

    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            fetchAndRenderEvents();
        });
    }
});