(function () {
    if (!getCurrentUser()) return;

    const grid = document.getElementById('annotations-grid');
    const counter = document.getElementById('stat-annotations');

    function renderCard(annotation) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <article class="card order-card h-100">
                <img class="card-img-top order-card-cover" alt="">
                <div class="card-body d-flex flex-column">
                    <h3 class="card-title h5"></h3>
                    <p class="order-card-type text-muted mb-2"></p>
                    <p class="card-text flex-grow-1"></p>
                    <p class="order-card-price fw-semibold mb-3"></p>
                    <a class="btn btn-primary mt-auto">Продолжить</a>
                </div>
            </article>
        `;

        col.querySelector('img').src = annotation.cover;
        col.querySelector('.card-title').textContent = annotation.title;
        col.querySelector('.order-card-type').textContent = annotation.type;
        col.querySelector('.card-text').textContent = annotation.description;
        col.querySelector('a').href = annotation.link;

        const price = col.querySelector('.order-card-price');
        if (annotation.priceRub === null) {
            price.textContent = 'Бесплатно';
        } else {
            price.dataset.priceRub = annotation.priceRub;
            price.dataset.priceSuffix = annotation.priceSuffix;
            price.textContent = `${annotation.priceRub} ₽ ${annotation.priceSuffix}`;
        }

        return col;
    }

    function showMessage(html) {
        grid.innerHTML = `<div class="col-12"><p class="text-muted mb-0">${html}</p></div>`;
    }

    async function loadAnnotations() {
        showMessage('Загрузка...');

        let annotations;
        try {
            annotations = await getMyAnnotations();
        } catch {
            showMessage('Не удалось загрузить аннотации: сервер недоступен');
            return;
        }

        counter.textContent = annotations.length;

        if (annotations.length === 0) {
            showMessage('Вы ещё не приняли ни одного заказа. <a href="index.html">Выбрать заказ</a>');
            return;
        }

        grid.replaceChildren(...annotations.map(renderCard));

        if (rates.USD) updatePrices(storageGet() || 'RUB');
    }

    loadAnnotations();
})();
