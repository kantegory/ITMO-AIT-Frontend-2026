document.addEventListener("DOMContentLoaded", () => {
    const auth = window.SchoolAuth;
    const api = window.SchoolApi;
    const carouselInner = document.getElementById("carouselInner");
    const carouselIndicators = document.getElementById("carouselIndicators");
    const eventSearch = document.getElementById("eventSearch");
    const goalDropdownButton = document.getElementById("goalDropdownButton");
    const placeDropdownButton = document.getElementById("placeDropdownButton");
    const goalOptions = document.querySelectorAll(".goal-option");
    const placeOptions = document.querySelectorAll(".place-option");
    const resetFilters = document.getElementById("resetFilters");
    const eventsGrid = document.getElementById("eventsGrid");
    const eventsCounter = document.getElementById("eventsCounter");
    const eventsEmpty = document.getElementById("eventsEmpty");

    if (
        !auth ||
        !api ||
        !carouselInner ||
        !carouselIndicators ||
        !eventSearch ||
        !goalDropdownButton ||
        !placeDropdownButton ||
        !goalOptions.length ||
        !placeOptions.length ||
        !resetFilters ||
        !eventsGrid ||
        !eventsCounter ||
        !eventsEmpty
    ) {
        return;
    }

    let selectedGoal = "all";
    let selectedPlace = "all";
    let allEvents = [];

    init();

    async function init() {
        try {
            allEvents = sortByDate((await api.getEvents()).map((event) => auth.normalizeEvent(event)).filter(Boolean));
        } catch {
            allEvents = [];
        }

        renderCarousel(getTopEvents(allEvents));
        renderEvents(allEvents);
        bindFilters();
    }

    function bindFilters() {
        eventSearch.addEventListener("input", applyFilters);

        goalOptions.forEach((option) => {
            option.addEventListener("click", () => {
                selectedGoal = option.dataset.value;
                goalDropdownButton.textContent = option.textContent;
                setActiveOption(goalOptions, option);
                applyFilters();
            });
        });

        placeOptions.forEach((option) => {
            option.addEventListener("click", () => {
                selectedPlace = option.dataset.value;
                placeDropdownButton.textContent = option.textContent;
                setActiveOption(placeOptions, option);
                applyFilters();
            });
        });

        resetFilters.addEventListener("click", () => {
            eventSearch.value = "";
            selectedGoal = "all";
            selectedPlace = "all";
            goalDropdownButton.textContent = "Все категории";
            placeDropdownButton.textContent = "Все места";
            clearActiveOptions(goalOptions);
            clearActiveOptions(placeOptions);

            const defaultGoal = document.querySelector('.goal-option[data-value="all"]');
            const defaultPlace = document.querySelector('.place-option[data-value="all"]');

            if (defaultGoal) {
                defaultGoal.classList.add("active-option");
            }

            if (defaultPlace) {
                defaultPlace.classList.add("active-option");
            }

            applyFilters();
        });

        const defaultGoal = document.querySelector('.goal-option[data-value="all"]');
        const defaultPlace = document.querySelector('.place-option[data-value="all"]');

        if (defaultGoal) {
            defaultGoal.classList.add("active-option");
        }

        if (defaultPlace) {
            defaultPlace.classList.add("active-option");
        }
    }

    function applyFilters() {
        const searchValue = eventSearch.value.trim().toLowerCase();
        renderEvents(
            sortByDate(
                allEvents.filter((event) => {
                    const haystack = `${event.title} ${event.description}`.toLowerCase();
                    return (
                        (!searchValue || haystack.includes(searchValue)) &&
                        (selectedGoal === "all" || event.goal === selectedGoal) &&
                        (selectedPlace === "all" || event.place === selectedPlace)
                    );
                })
            )
        );
    }

    function renderCarousel(eventsToRender) {
        carouselIndicators.innerHTML = "";
        carouselInner.innerHTML = "";

        eventsToRender.forEach((event, index) => {
            const isActive = index === 0 ? "active" : "";

            carouselIndicators.insertAdjacentHTML(
                "beforeend",
                `
                    <button type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="${index}"
                            class="${isActive}"
                            ${index === 0 ? 'aria-current="true"' : ""}
                            aria-label="Слайд ${index + 1}"></button>
                `
            );

            carouselInner.insertAdjacentHTML(
                "beforeend",
                `
                    <div class="carousel-item ${isActive}">
                        <a class="carousel-slide-link" href="event.html?id=${encodeURIComponent(event.id)}" aria-label="Открыть мероприятие ${escapeHtml(event.title)}">
                            <img src="${escapeHtml(event.image)}" class="d-block w-100" alt="${escapeHtml(event.title)}">
                            <div class="carousel-caption">
                                <div class="carousel-caption-card">
                                    <h2>${escapeHtml(event.title)}</h2>
                                </div>
                            </div>
                        </a>
                    </div>
                `
            );
        });
    }

    function renderEvents(eventsToRender) {
        eventsGrid.innerHTML = "";

        if (!eventsToRender.length) {
            eventsEmpty.classList.remove("d-none");
            eventsCounter.textContent = "Показано мероприятий: 0";
            return;
        }

        eventsEmpty.classList.add("d-none");
        eventsCounter.textContent = `Показано мероприятий: ${eventsToRender.length}`;

        eventsToRender.forEach((event) => {
            eventsGrid.insertAdjacentHTML(
                "beforeend",
                `
                    <div class="col-12 col-md-6 col-xl-4">
                        <a class="event-card-link" href="event.html?id=${encodeURIComponent(event.id)}">
                            <article class="event-card-custom">
                                <div class="event-card-image-wrap">
                                    <img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}" class="event-card-image">
                                    <span class="badge text-bg-light border rounded-pill goal-badge position-absolute top-0 start-0 m-3">${escapeHtml(auth.getGoalLabel(event.goal))}</span>
                                </div>
                                <div class="event-card-body">
                                    <h3 class="event-card-title">${escapeHtml(event.title)}</h3>
                                    <p class="event-card-text">${escapeHtml(event.description)}</p>
                                    <div class="event-card-meta">
                                        <span class="event-meta-pill">${escapeHtml(auth.getPlaceLabel(event.place))}</span>
                                        <span class="event-meta-pill">${escapeHtml(auth.formatDate(event.date))}</span>
                                    </div>
                                </div>
                            </article>
                        </a>
                    </div>
                `
            );
        });
    }

    function getTopEvents(events) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = events
            .filter((event) => event.date && event.title && event.image && new Date(event.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);

        return upcoming.length ? upcoming : events.slice(0, 3);
    }

    function sortByDate(events) {
        return [...events].sort((a, b) => {
            if (!a.date && !b.date) {
                return 0;
            }
            if (!a.date) {
                return 1;
            }
            if (!b.date) {
                return -1;
            }

            return new Date(a.date) - new Date(b.date);
        });
    }

    function setActiveOption(optionList, activeOption) {
        optionList.forEach((item) => item.classList.remove("active-option"));
        activeOption.classList.add("active-option");
    }

    function clearActiveOptions(optionList) {
        optionList.forEach((item) => item.classList.remove("active-option"));
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
