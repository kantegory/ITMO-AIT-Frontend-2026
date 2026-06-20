document.addEventListener("DOMContentLoaded", () => {
    const page = document.getElementById("destinationsPage");
    if (!page) {
        return;
    }

    const state = {
        destinations: [],
        favorites: [],
        query: "",
        type: "all",
        budget: "any",
        duration: "any",
        sort: "rating-desc",
        currentPage: 1,
        perPage: 6
    };

    const elements = {
        search: document.getElementById("searchDestination"),
        type: document.getElementById("filterType"),
        budget: document.getElementById("filterBudget"),
        duration: document.getElementById("filterDuration"),
        reset: document.getElementById("resetFilters"),
        grid: document.getElementById("destinationsGrid"),
        empty: document.getElementById("destinationsEmpty"),
        count: document.getElementById("resultsCount"),
        pagination: document.getElementById("pagination"),
        sortLabel: document.getElementById("sortDropdownLabel"),
        sortItems: Array.from(document.querySelectorAll("[data-sort]"))
    };

    bindEvents();
    setSort("rating-desc", "Сначала лучшие");
    loadData();

    async function loadData() {
        try {
            const [destinations, favorites] = await Promise.all([
                TravelApi.getDestinations(),
                TravelApi.getFavorites()
            ]);
            state.destinations = destinations;
            state.favorites = favorites;
            render();
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
            elements.grid.innerHTML = "";
            elements.empty.classList.remove("d-none");
            elements.empty.textContent = "Не удалось загрузить направления. Проверьте соединение с сервером.";
        }
    }

    function bindEvents() {
        elements.search.addEventListener("input", () => {
            state.query = elements.search.value.trim().toLowerCase();
            state.currentPage = 1;
            render();
        });

        elements.type.addEventListener("change", () => {
            state.type = elements.type.value;
            state.currentPage = 1;
            render();
        });

        elements.budget.addEventListener("change", () => {
            state.budget = elements.budget.value;
            state.currentPage = 1;
            render();
        });

        elements.duration.addEventListener("change", () => {
            state.duration = elements.duration.value;
            state.currentPage = 1;
            render();
        });

        elements.reset.addEventListener("click", () => {
            elements.search.value = "";
            elements.type.value = "all";
            elements.budget.value = "any";
            elements.duration.value = "any";
            state.query = "";
            state.type = "all";
            state.budget = "any";
            state.duration = "any";
            state.currentPage = 1;
            setSort("rating-desc", "Сначала лучшие");
            render();
        });

        elements.sortItems.forEach((item) => {
            item.addEventListener("click", (event) => {
                event.preventDefault();
                setSort(item.dataset.sort, item.textContent.trim());
                state.currentPage = 1;
                render();
            });
        });

        page.addEventListener("click", async (event) => {
            const saveButton = event.target.closest("[data-save-destination]");
            const pageButton = event.target.closest("[data-page-number]");

            if (saveButton) {
                const destinationId = Number(saveButton.dataset.saveDestination);
                const alreadySaved = state.favorites.some((fav) => fav.destinationId === destinationId);
                if (alreadySaved) {
                    return;
                }

                try {
                    const favorite = await TravelApi.addFavorite({ destinationId });
                    state.favorites.push(favorite);
                    updateSaveButtons();
                    TravelApp.showToast("Направление сохранено в избранное", "success");
                } catch (error) {
                    TravelApp.showToast("Не удалось сохранить в избранное", "error");
                    console.error("Ошибка сохранения в избранное:", error);
                }
            }

            if (pageButton) {
                event.preventDefault();
                state.currentPage = Number(pageButton.dataset.pageNumber);
                render();
            }
        });
    }

    function setSort(sort, label) {
        state.sort = sort;
        elements.sortLabel.textContent = label;
        elements.sortItems.forEach((item) => {
            item.classList.toggle("active", item.dataset.sort === sort);
        });
    }

    function getFilteredDestinations() {
        const budgetRank = { low: 1, medium: 2, high: 3 };
        const filtered = state.destinations.filter((destination) => {
            const matchesQuery = destination.name.toLowerCase().includes(state.query);
            const matchesType = state.type === "all" || destination.type === state.type;
            const matchesBudget = state.budget === "any" || destination.budget === state.budget;
            const matchesDuration = state.duration === "any" || destination.durationCategory === state.duration;
            return matchesQuery && matchesType && matchesBudget && matchesDuration;
        });

        filtered.sort((left, right) => {
            switch (state.sort) {
                case "rating-asc":
                    return left.rating - right.rating;
                case "budget-asc":
                    return budgetRank[left.budget] - budgetRank[right.budget];
                case "budget-desc":
                    return budgetRank[right.budget] - budgetRank[left.budget];
                case "duration-asc":
                    return left.duration - right.duration;
                case "duration-desc":
                    return right.duration - left.duration;
                case "rating-desc":
                default:
                    return right.rating - left.rating;
            }
        });

        return filtered;
    }

    function render() {
        const filtered = getFilteredDestinations();
        const pageCount = Math.max(1, Math.ceil(filtered.length / state.perPage));
        state.currentPage = Math.min(state.currentPage, pageCount);
        const start = (state.currentPage - 1) * state.perPage;
        const visibleDestinations = filtered.slice(start, start + state.perPage);

        elements.count.textContent = `Найдено направлений: ${filtered.length}`;

        if (!visibleDestinations.length) {
            elements.grid.innerHTML = "";
            elements.empty.classList.remove("d-none");
            elements.pagination.innerHTML = "";
            return;
        }

        elements.empty.classList.add("d-none");
        elements.grid.innerHTML = visibleDestinations.map((destination) => {
            const typeClass = destination.type === "city" ? "badge-city" : "badge-nature";
            const isFavorite = state.favorites.some((fav) => fav.destinationId === destination.id);

            return `
                <article class="destination-card card border-0">
                    <img src="${destination.image}" class="card-img-top" alt="${TravelApp.escapeHtml(destination.name)}">
                    <div class="card-body d-flex flex-column">
                        <div class="card-meta mt-0">
                            <span class="badge ${typeClass}">${TravelApp.escapeHtml(TravelAppData.labelMaps.type[destination.type])}</span>
                            <span class="badge badge-budget">${TravelApp.escapeHtml(TravelAppData.labelMaps.budget[destination.budget])}</span>
                            <span class="badge badge-soft">${TravelApp.escapeHtml(String(destination.duration))} дн.</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-start gap-3">
                            <h3 class="h4 mb-2">${TravelApp.escapeHtml(destination.name)}</h3>
                            <span class="text-warning fw-bold">${destination.rating.toFixed(1)} <svg class="icon" aria-hidden="true"><use href="images/icons.svg#icon-star-fill"></use></svg></span>
                        </div>
                        <p class="text-secondary flex-grow-1">${TravelApp.escapeHtml(destination.shortDescription)}</p>
                        <div class="d-flex flex-wrap gap-2 mt-3">
                            <a class="btn btn-primary btn-sm" href="destination-details.html?id=${destination.id}">Подробнее</a>
                            <button type="button" class="btn btn-outline-primary btn-sm" data-save-destination="${destination.id}" ${isFavorite ? "disabled" : ""}>
                                ${isFavorite ? "Сохранено" : "Сохранить"}
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join("");

        renderPagination(pageCount);
        updateSaveButtons();
    }

    function renderPagination(pageCount) {
        if (pageCount <= 1) {
            elements.pagination.innerHTML = "";
            return;
        }

        let items = "";
        for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
            items += `
                <li class="page-item ${pageNumber === state.currentPage ? "active" : ""}">
                    <a class="page-link" href="#" data-page-number="${pageNumber}">${pageNumber}</a>
                </li>
            `;
        }
        elements.pagination.innerHTML = items;
    }

    function updateSaveButtons() {
        document.querySelectorAll("[data-save-destination]").forEach((button) => {
            const isFavorite = state.favorites.some((fav) => fav.destinationId === Number(button.dataset.saveDestination));
            button.disabled = isFavorite;
            button.textContent = isFavorite ? "Сохранено" : "Сохранить";
        });
    }
});
