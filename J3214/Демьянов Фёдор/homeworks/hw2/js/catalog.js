document.addEventListener('DOMContentLoaded', async () => {
    const gridContainer = document.getElementById('missionsGrid');
    const noResults = document.getElementById('noResults');
    const findBtn = document.getElementById('findMissionBtn');
    const resetBtn = document.getElementById('resetFilterBtn');
    const destinationSelect = document.getElementById('destination');
    const durationSelect = document.getElementById('duration');
    const budgetSelect = document.getElementById('budget');
    const searchPanel = document.getElementById('searchPanel');
    const catalogSection = document.getElementById('catalog');

    // Базовые данные для динамического блока планет в Hero-секции
    const planetsInfo = {
        earth: {
            title: 'Орбитальная станция МКС-2',
            code: 'EXP-00 // ORBIT',
            gravity: '0.00 G (Невесомость)',
            duration: '3-5 суток',
            training: 'Класс I (3 дня)',
            badge: 'Околоземная орбита'
        },
        moon: {
            title: 'Орбитальная станция "Селена"',
            code: 'EXP-01 // LUNA',
            gravity: '0.16 G',
            duration: '7 суток',
            training: 'Класс II (14 дней)',
            badge: 'Флагман сезона'
        },
        mars: {
            title: 'Марсианский аванпост',
            code: 'EXP-04 // MARS',
            gravity: '0.38 G',
            duration: '180 суток',
            training: 'Класс IV (3 мес.)',
            badge: 'Дальний рубеж'
        },
        enceladus: {
            title: 'Гейзеры Энцелада',
            code: 'EXP-06 // SATURN',
            gravity: '0.011 G',
            duration: '360 суток',
            training: 'Класс V (1 год)',
            badge: 'Глубокий космос'
        }
    };

    // Интерактивная смена планеты в Hero
    destinationSelect?.addEventListener('change', () => {
        const selected = destinationSelect.value;
        const data = planetsInfo[selected];
        const targetPlanet = data ? selected : 'moon';
        const displayData = data || planetsInfo['moon'];

        document.querySelectorAll('.planet-img').forEach(img => {
            const isTarget = img.getAttribute('data-planet') === targetPlanet;
            img.classList.toggle('active', isTarget);
            img.setAttribute('aria-hidden', (!isTarget).toString());
        });

        document.getElementById('heroPlanetTitle').textContent = displayData.title;
        document.getElementById('heroPlanetCode').textContent = displayData.code;
        document.getElementById('heroPlanetGravity').textContent = displayData.gravity;
        document.getElementById('heroPlanetDuration').textContent = displayData.duration;
        document.getElementById('heroPlanetTraining').textContent = displayData.training;
        document.getElementById('heroPlanetBadge').textContent = displayData.badge;
    });

    // Свечение формы поиска при премиальных тарифах
    budgetSelect?.addEventListener('change', () => {
        searchPanel.classList.remove('glow-premium', 'glow-vip');
        if (budgetSelect.value === 'premium') {
            searchPanel.classList.add('glow-premium');
        } else if (budgetSelect.value === 'vip') {
            searchPanel.classList.add('glow-vip');
        }
    });

    // Генерация HTML-разметки одной карточки с атрибутами доступности
    function renderTourCard(tour) {
        return `
            <div class="col mission-card-item" 
                 data-destination="${tour.destination}" 
                 data-budget="${tour.budget}" 
                 data-duration="${tour.duration}">
                <article class="glass-panel h-100 p-4 d-flex flex-column justify-content-between" aria-label="Экспедиция: ${tour.title}">
                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="${tour.badgeClass} px-2 py-1 fs-7 rounded">${tour.badge}</span>
                            <span class="text-muted-custom fs-7" aria-label="Шифр экспедиции: ${tour.code}">${tour.code}</span>
                        </div>
                        <h3 class="text-main fs-5 mb-2">${tour.title}</h3>
                        <p class="text-muted-custom fs-7 mb-4">${tour.shortDesc}</p>

                        <div class="border-top border-secondary border-opacity-25 pt-3 mb-4">
                            <div class="d-flex justify-content-between fs-7 mb-2">
                                <span class="text-muted-custom">Дистанция:</span>
                                <span class="text-main">${tour.specs.distance}</span>
                            </div>
                            <div class="d-flex justify-content-between fs-7 mb-2">
                                <span class="text-muted-custom">Гравитация:</span>
                                <span class="text-main">${tour.specs.gravity}</span>
                            </div>
                            <div class="d-flex justify-content-between fs-7">
                                <span class="text-muted-custom">Длительность:</span>
                                <span class="text-main">${tour.durationText}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted-custom fs-7">Стоимость</span>
                            <span class="fs-5 fw-bold text-main">${tour.price.toLocaleString('ru-RU')} $</span>
                        </div>
                        <a href="tour.html?id=${tour.id}" class="btn btn-glass w-100 py-2 fs-7" aria-label="Подробнее об экспедиции ${tour.title}">Подробнее</a>
                    </div>
                </article>
            </div>
        `;
    }

    // Загрузка миссий с json-server
    async function loadMissions() {
        try {
            gridContainer.innerHTML = `
                <div class="col-12 text-center py-5" role="status">
                    <div class="spinner-border text-light mb-3" role="status">
                        <span class="visually-hidden">Установка связи с базой данных...</span>
                    </div>
                    <p class="text-muted-custom fs-7 letter-spacing-2 text-uppercase" aria-hidden="true">Установка связи с базой данных...</p>
                </div>
            `;

            const tours = await window.api.get('/tours');
            gridContainer.innerHTML = tours.map(renderTourCard).join('');
        } catch (error) {
            console.error('Ошибка загрузки туров:', error);
            gridContainer.innerHTML = `
                <div class="col-12 text-center py-5" role="alert">
                    <p class="text-danger mb-2">Ошибка подключения к бортовой сети (json-server не отвечает).</p>
                    <p class="text-muted-custom fs-7">Убедитесь, что сервер запущен командой npm run server</p>
                </div>
            `;
        }
    }

    // Фильтрация карточек
    function filterMissions() {
        const dest = destinationSelect.value;
        const dur = durationSelect.value;
        const bud = budgetSelect.value;
        const cards = document.querySelectorAll('.mission-card-item');
        let visibleCount = 0;

        cards.forEach(card => {
            const cardDest = card.getAttribute('data-destination');
            const cardDur = card.getAttribute('data-duration');
            const cardBud = card.getAttribute('data-budget');

            const matchDest = !dest || dest === cardDest;
            const matchDur = !dur || dur === cardDur;
            const matchBud = !bud || bud === cardBud;

            if (matchDest && matchDur && matchBud) {
                card.classList.remove('d-none');
                visibleCount++;
            } else {
                card.classList.add('d-none');
            }
        });

        if (visibleCount === 0) {
            noResults.classList.remove('d-none');
        } else {
            noResults.classList.add('d-none');
        }

        catalogSection.scrollIntoView({ behavior: 'smooth' });
    }

    findBtn?.addEventListener('click', filterMissions);

    resetBtn?.addEventListener('click', () => {
        destinationSelect.value = '';
        durationSelect.value = '';
        budgetSelect.value = '';
        searchPanel.classList.remove('glow-premium', 'glow-vip');
        destinationSelect.dispatchEvent(new Event('change'));
        document.querySelectorAll('.mission-card-item').forEach(card => card.classList.remove('d-none'));
        noResults.classList.add('d-none');
        catalogSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Первоначальный запрос данных
    await loadMissions();
});