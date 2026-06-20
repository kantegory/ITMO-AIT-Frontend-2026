document.addEventListener("DOMContentLoaded", () => {
    const page = document.getElementById("destinationDetailsPage");
    if (!page) {
        return;
    }

    const destinationId = new URLSearchParams(window.location.search).get("id");
    const content = document.getElementById("destinationContent");
    const errorState = document.getElementById("destinationError");

    let destination = null;
    let reviews = [];
    let routes = [];
    let favorites = [];

    loadDestination();

    async function loadDestination() {
        try {
            destination = await TravelApi.getDestinationById(destinationId);

            if (!destination) {
                content.classList.add("d-none");
                errorState.classList.remove("d-none");
                return;
            }

            const [fetchedReviews, fetchedRoutes, fetchedFavorites] = await Promise.all([
                TravelApi.getReviewsByDestination(destination.id),
                TravelApi.getRoutes(),
                TravelApi.getFavorites()
            ]);

            reviews = fetchedReviews;
            routes = fetchedRoutes;
            favorites = fetchedFavorites;

            initPage();
        } catch (error) {
            console.error("Ошибка загрузки направления:", error);
            content.classList.add("d-none");
            errorState.classList.remove("d-none");
        }
    }

    function initPage() {
        const routeModal = new bootstrap.Modal(document.getElementById("addToRouteModal"));
        const routeForm = document.getElementById("addToRouteForm");
        const reviewForm = document.getElementById("reviewForm");

        renderDestination();
        populateRouteSelect();
        renderReviews();

        document.getElementById("saveFavoriteButton").addEventListener("click", async () => {
            try {
                const favorite = await TravelApi.addFavorite({ destinationId: destination.id });
                favorites.push(favorite);
                updateFavoriteButton();
                TravelApp.showToast("Направление добавлено в избранное", "success");
            } catch (error) {
                TravelApp.showToast("Не удалось добавить в избранное", "error");
                console.error("Ошибка:", error);
            }
        });

        document.getElementById("openRouteModalButton").addEventListener("click", () => {
            routeForm.reset();
            document.getElementById("newRouteFields").classList.add("d-none");
            routeModal.show();
        });

        document.getElementById("toggleNewRoute").addEventListener("click", () => {
            document.getElementById("newRouteFields").classList.toggle("d-none");
        });

        routeForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const selectedRouteId = document.getElementById("existingRoute").value;
            const newRouteName = document.getElementById("newRouteName").value.trim();
            const newRouteDuration = document.getElementById("newRouteDuration").value.trim();
            const newRouteBudget = document.getElementById("newRouteBudget").value;

            try {
                if (selectedRouteId) {
                    const existingRoute = routes.find((r) => String(r.id) === selectedRouteId);
                    if (existingRoute) {
                        await TravelApi.updateRoute(existingRoute.id, {
                            destinationId: destination.id,
                            description: `${existingRoute.description} • Добавлено направление: ${destination.name}`
                        });
                    }
                    TravelApp.showToast("Направление добавлено в существующий маршрут", "success");
                    routeModal.hide();
                    routes = await TravelApi.getRoutes();
                    populateRouteSelect();
                    return;
                }

                if (!newRouteName || !newRouteDuration || !newRouteBudget) {
                    TravelApp.showToast("Выберите маршрут или заполните поля нового маршрута", "error");
                    return;
                }

                const newRoute = await TravelApi.addRoute({
                    name: newRouteName,
                    duration: newRouteDuration,
                    budget: newRouteBudget,
                    destinationId: destination.id,
                    description: `Маршрут для поездки в ${destination.name}. ${destination.shortDescription}`
                });

                routes.push(newRoute);
                populateRouteSelect();
                routeModal.hide();
                TravelApp.showToast("Новый маршрут создан", "success");
            } catch (error) {
                TravelApp.showToast("Ошибка при сохранении маршрута", "error");
                console.error("Ошибка:", error);
            }
        });

        reviewForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const author = document.getElementById("reviewAuthor").value.trim();
            const rating = Number(document.getElementById("reviewRating").value);
            const text = document.getElementById("reviewText").value.trim();

            if (!author || !rating || !text) {
                TravelApp.showToast("Заполните все поля отзыва", "error");
                return;
            }

            try {
                const review = await TravelApi.addReview({
                    destinationId: destination.id,
                    name: author,
                    rating,
                    text,
                    date: new Date().toISOString()
                });

                reviews.unshift(review);
                reviewForm.reset();
                renderReviews();
                TravelApp.showToast("Отзыв добавлен", "success");
            } catch (error) {
                TravelApp.showToast("Ошибка при добавлении отзыва", "error");
                console.error("Ошибка:", error);
            }
        });

        document.getElementById("shareButton").addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(window.location.href);
                TravelApp.showToast("Ссылка скопирована", "success");
            } catch (error) {
                TravelApp.showToast("Скопируйте адрес страницы вручную", "info");
            }
        });
    }

    function renderDestination() {
        document.getElementById("destinationHeroImage").src = destination.image;
        document.getElementById("destinationHeroImage").alt = destination.name;
        document.getElementById("destinationName").textContent = destination.name;
        document.getElementById("destinationDescription").textContent = destination.description;
        document.getElementById("destinationType").textContent = TravelAppData.labelMaps.type[destination.type];
        document.getElementById("destinationBudget").textContent = TravelAppData.labelMaps.budget[destination.budget];
        document.getElementById("destinationDuration").textContent = `${destination.duration} дн.`;
        document.getElementById("destinationRating").textContent = destination.rating.toFixed(1);
        document.getElementById("destinationLocation").textContent = destination.location;
        document.getElementById("destinationSeason").textContent = destination.bestSeason;
        document.getElementById("destinationWeather").textContent = destination.weather;
        document.getElementById("destinationWeatherCard").textContent = destination.weather;
        document.getElementById("destinationMap").src = `https://maps.google.com/maps?q=${encodeURIComponent(destination.mapQuery)}&t=&z=10&ie=UTF8&iwloc=&output=embed`;

        document.getElementById("highlightsList").innerHTML = destination.highlights.map((item) => `
            <li><svg class="icon" aria-hidden="true"><use href="images/icons.svg#icon-check-circle-fill"></use></svg><span>${TravelApp.escapeHtml(item)}</span></li>
        `).join("");

        document.getElementById("tipsList").innerHTML = destination.tips.map((item) => `
            <li><svg class="icon" aria-hidden="true"><use href="images/icons.svg#icon-compass-fill"></use></svg><span>${TravelApp.escapeHtml(item)}</span></li>
        `).join("");

        document.getElementById("itineraryAccordion").innerHTML = destination.itinerary.map((step, index) => `
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
        const isFavorite = favorites.some((fav) => fav.destinationId === destination.id);
        const button = document.getElementById("saveFavoriteButton");
        button.disabled = isFavorite;
        button.textContent = isFavorite ? "Уже в избранном" : "Сохранить в избранное";
    }

    function renderReviews() {
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
        document.getElementById("existingRoute").innerHTML = `
            <option value="">Создать новый маршрут</option>
            ${routes.map((route) => `<option value="${route.id}">${TravelApp.escapeHtml(route.name)}</option>`).join("")}
        `;
    }
});
