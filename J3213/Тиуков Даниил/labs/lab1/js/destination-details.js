document.addEventListener("DOMContentLoaded", () => {
    const page = document.getElementById("destinationDetailsPage");
    if (!page) {
        return;
    }

    const destinationId = new URLSearchParams(window.location.search).get("id");
    const destination = TravelAppData.getDestinationById(destinationId);
    const content = document.getElementById("destinationContent");
    const errorState = document.getElementById("destinationError");

    if (!destination) {
        content.classList.add("d-none");
        errorState.classList.remove("d-none");
        return;
    }

    const routeModal = new bootstrap.Modal(document.getElementById("addToRouteModal"));
    const routeForm = document.getElementById("addToRouteForm");
    const reviewForm = document.getElementById("reviewForm");

    renderDestination(destination);
    populateRouteSelect();
    renderReviews();

    document.getElementById("saveFavoriteButton").addEventListener("click", () => {
        TravelApp.addArrayItem(
            TravelApp.storageKeys.favorites,
            destination.id,
            (entry, item) => Number(entry) === Number(item)
        );
        TravelApp.showToast("Направление добавлено в избранное", "success");
        updateFavoriteButton();
    });

    document.getElementById("openRouteModalButton").addEventListener("click", () => {
        routeForm.reset();
        document.getElementById("newRouteFields").classList.add("d-none");
        routeModal.show();
    });

    document.getElementById("toggleNewRoute").addEventListener("click", () => {
        document.getElementById("newRouteFields").classList.toggle("d-none");
    });

    routeForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const selectedRouteId = document.getElementById("existingRoute").value;
        const newRouteName = document.getElementById("newRouteName").value.trim();
        const newRouteDuration = document.getElementById("newRouteDuration").value.trim();
        const newRouteBudget = document.getElementById("newRouteBudget").value;
        const routes = TravelApp.getStorage(TravelApp.storageKeys.routes, []);

        if (selectedRouteId) {
            const index = routes.findIndex((route) => route.id === selectedRouteId);
            if (index >= 0) {
                routes[index] = {
                    ...routes[index],
                    destinationId: destination.id,
                    description: `${routes[index].description} • Добавлено направление: ${destination.name}`
                };
            }
            TravelApp.setStorage(TravelApp.storageKeys.routes, routes);
            TravelApp.showToast("Направление добавлено в существующий маршрут", "success");
            routeModal.hide();
            return;
        }

        if (!newRouteName || !newRouteDuration || !newRouteBudget) {
            TravelApp.showToast("Выберите маршрут или заполните поля нового маршрута", "error");
            return;
        }

        routes.push({
            id: TravelApp.generateId("route"),
            name: newRouteName,
            duration: newRouteDuration,
            budget: newRouteBudget,
            destinationId: destination.id,
            description: `Маршрут для поездки в ${destination.name}. ${destination.shortDescription}`
        });
        TravelApp.setStorage(TravelApp.storageKeys.routes, routes);
        populateRouteSelect();
        routeModal.hide();
        TravelApp.showToast("Новый маршрут создан", "success");
    });

    reviewForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const author = document.getElementById("reviewAuthor").value.trim();
        const rating = Number(document.getElementById("reviewRating").value);
        const text = document.getElementById("reviewText").value.trim();

        if (!author || !rating || !text) {
            TravelApp.showToast("Заполните все поля отзыва", "error");
            return;
        }

        const reviews = getStoredReviews();
        reviews.unshift({
            id: TravelApp.generateId("review"),
            name: author,
            rating,
            text,
            date: new Date().toISOString()
        });
        TravelApp.setStorage(getReviewsKey(), reviews);
        reviewForm.reset();
        renderReviews();
        TravelApp.showToast("Отзыв добавлен", "success");
    });

    document.getElementById("shareButton").addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            TravelApp.showToast("Ссылка скопирована", "success");
        } catch (error) {
            TravelApp.showToast("Скопируйте адрес страницы вручную", "info");
        }
    });

    function renderDestination(currentDestination) {
        document.getElementById("destinationHeroImage").src = currentDestination.image;
        document.getElementById("destinationHeroImage").alt = currentDestination.name;
        document.getElementById("destinationName").textContent = currentDestination.name;
        document.getElementById("destinationDescription").textContent = currentDestination.description;
        document.getElementById("destinationType").textContent = TravelAppData.labelMaps.type[currentDestination.type];
        document.getElementById("destinationBudget").textContent = TravelAppData.labelMaps.budget[currentDestination.budget];
        document.getElementById("destinationDuration").textContent = `${currentDestination.duration} дн.`;
        document.getElementById("destinationRating").textContent = currentDestination.rating.toFixed(1);
        document.getElementById("destinationLocation").textContent = currentDestination.location;
        document.getElementById("destinationSeason").textContent = currentDestination.bestSeason;
        document.getElementById("destinationWeather").textContent = currentDestination.weather;
        document.getElementById("destinationWeatherCard").textContent = currentDestination.weather;
        document.getElementById("destinationMap").src = `https://maps.google.com/maps?q=${encodeURIComponent(currentDestination.mapQuery)}&t=&z=10&ie=UTF8&iwloc=&output=embed`;

        document.getElementById("highlightsList").innerHTML = currentDestination.highlights.map((item) => `
            <li><i class="bi bi-check-circle-fill"></i><span>${TravelApp.escapeHtml(item)}</span></li>
        `).join("");

        document.getElementById("tipsList").innerHTML = currentDestination.tips.map((item) => `
            <li><i class="bi bi-compass-fill"></i><span>${TravelApp.escapeHtml(item)}</span></li>
        `).join("");

        document.getElementById("itineraryAccordion").innerHTML = currentDestination.itinerary.map((step, index) => `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${step.day}">
                    <button class="accordion-button ${index > 0 ? "collapsed" : ""}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${step.day}" aria-expanded="${index === 0 ? "true" : "false"}">
                        День ${step.day}: ${TravelApp.escapeHtml(step.title)}
                    </button>
                </h2>
                <div id="collapse-${step.day}" class="accordion-collapse collapse ${index === 0 ? "show" : ""}" data-bs-parent="#itineraryAccordion">
                    <div class="accordion-body">${TravelApp.escapeHtml(step.text)}</div>
                </div>
            </div>
        `).join("");

        updateFavoriteButton();
    }

    function updateFavoriteButton() {
        const favorites = TravelApp.getStorage(TravelApp.storageKeys.favorites, []);
        const isFavorite = favorites.some((id) => Number(id) === Number(destination.id));
        const button = document.getElementById("saveFavoriteButton");
        button.disabled = isFavorite;
        button.textContent = isFavorite ? "Уже в избранном" : "Сохранить в избранное";
    }

    function getReviewsKey() {
        return `tripplannerDestinationReviews-${destination.id}`;
    }

    function getStoredReviews() {
        const key = getReviewsKey();
        const stored = TravelApp.getStorage(key, null);
        if (stored) {
            return stored;
        }
        TravelApp.setStorage(key, destination.reviews);
        return destination.reviews;
    }

    function renderReviews() {
        const reviews = getStoredReviews();
        document.getElementById("reviewsList").innerHTML = reviews.map((review) => `
            <article class="review-card mb-3">
                <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                    <div>
                        <h3 class="h5 mb-1">${TravelApp.escapeHtml(review.name)}</h3>
                        <p class="text-secondary mb-0">${TravelApp.escapeHtml(TravelApp.formatDate(review.date))}</p>
                    </div>
                    <div class="review-rating">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
                </div>
                <p class="mb-0">${TravelApp.escapeHtml(review.text)}</p>
            </article>
        `).join("");
    }

    function populateRouteSelect() {
        const routes = TravelApp.getStorage(TravelApp.storageKeys.routes, []);
        document.getElementById("existingRoute").innerHTML = `
            <option value="">Создать новый маршрут</option>
            ${routes.map((route) => `<option value="${route.id}">${TravelApp.escapeHtml(route.name)}</option>`).join("")}
        `;
    }
});
