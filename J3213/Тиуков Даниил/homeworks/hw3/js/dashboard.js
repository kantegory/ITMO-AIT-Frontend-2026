document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("dashboardPage");
    if (!root) {
        return;
    }

    if (!TravelApp.isAuthenticated()) {
        window.location.href = "login.html";
        return;
    }

    const profileForm = document.getElementById("profileForm");
    const routeForm = document.getElementById("routeForm");
    const noteForm = document.getElementById("noteForm");
    const routeModalElement = document.getElementById("routeModal");
    const routeModal = routeModalElement ? new bootstrap.Modal(routeModalElement) : null;

    let destinations = [];
    let routes = [];
    let notes = [];
    let favorites = [];

    loadDashboardData();

    async function loadDashboardData() {
        try {
            const [dests, rts, nts, favs] = await Promise.all([
                TravelApi.getDestinations(),
                TravelApi.getRoutes(),
                TravelApi.getNotes(),
                TravelApi.getFavorites()
            ]);

            destinations = dests;
            routes = rts;
            notes = nts;
            favorites = favs;

            renderProfile(getDashboardUser());
            renderRouteDestinationOptions();
            renderRoutes();
            renderNotes();
            renderFavorites();
            renderStats();
        } catch (error) {
            console.error("Ошибка загрузки данных дашборда:", error);
            TravelApp.showToast("Ошибка загрузки данных. Проверьте соединение с сервером.", "error");
        }
    }

    function getDestinationById(id) {
        return destinations.find((d) => d.id === Number(id)) || null;
    }

    document.getElementById("logoutButton")?.addEventListener("click", () => {
        TravelApp.clearCurrentUser();
        TravelApp.syncAuthNavigation();
        TravelApp.showToast("Вы вышли из профиля", "info");

        window.setTimeout(() => {
            window.location.href = "index.html";
        }, 500);
    });

    profileForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const firstName = document.getElementById("profileFirstName").value.trim();
        const lastName = document.getElementById("profileLastName").value.trim();
        const preference = document.getElementById("profilePreferenceSelect").value;

        if (!firstName || !lastName || !preference) {
            TravelApp.showToast("Заполните все поля профиля", "error");
            return;
        }

        const currentUser = getDashboardUser();

        try {
            const updatedUser = await TravelApi.patch(`/users/${currentUser.id}`, {firstName, lastName, preference});
            TravelApp.setCurrentUser(updatedUser);
            renderProfile(updatedUser);
            TravelApp.showToast("Профиль обновлён", "success");
            bootstrap.Modal.getInstance(document.getElementById("profileModal"))?.hide();
        } catch (error) {
            TravelApp.showToast("Ошибка обновления профиля", "error");
            console.error("Ошибка:", error);
        }
    });

    routeForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("routeName").value.trim();
        const duration = document.getElementById("routeDuration").value.trim();
        const budget = document.getElementById("routeBudget").value;
        const description = document.getElementById("routeDescription").value.trim();
        const destinationId = Number(document.getElementById("routeDestination").value || 0);

        if (!name || !duration || !budget || !description) {
            TravelApp.showToast("Заполните все поля маршрута", "error");
            return;
        }

        try {
            const route = await TravelApi.addRoute({
                name,
                duration,
                budget,
                description,
                destinationId: destinationId || null
            });

            routes.push(route);
            routeForm.reset();
            renderRoutes();
            renderStats();
            TravelApp.showToast("Маршрут добавлен", "success");
            routeModal?.hide();
        } catch (error) {
            TravelApp.showToast("Ошибка при добавлении маршрута", "error");
            console.error("Ошибка:", error);
        }
    });

    noteForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const noteId = document.getElementById("noteId").value;
        const title = document.getElementById("noteTitle").value.trim();
        const text = document.getElementById("noteText").value.trim();

        if (!title || !text) {
            TravelApp.showToast("Заполните заголовок и текст заметки", "error");
            return;
        }

        const currentUser = getDashboardUser();

        try {
            if (noteId) {
                const updated = await TravelApi.updateNote(Number(noteId), { title, text, date: new Date().toISOString() });
                const index = notes.findIndex((n) => n.id === Number(noteId));
                if (index >= 0) {
                    notes[index] = updated;
                }
                TravelApp.showToast("Заметка обновлена", "success");
            } else {
                const note = await TravelApi.addNote({
                    title,
                    text,
                    date: new Date().toISOString(),
                    author: `${currentUser.firstName} ${currentUser.lastName}`.trim()
                });
                notes.unshift(note);
                TravelApp.showToast("Заметка добавлена", "success");
            }

            noteForm.reset();
            document.getElementById("noteId").value = "";
            document.getElementById("noteSubmitLabel").textContent = "Добавить заметку";
            renderNotes();
            renderStats();
        } catch (error) {
            TravelApp.showToast("Ошибка при сохранении заметки", "error");
            console.error("Ошибка:", error);
        }
    });

    root.addEventListener("click", async (event) => {
        const deleteRouteButton = event.target.closest("[data-route-delete]");
        const editNoteButton = event.target.closest("[data-note-edit]");
        const deleteNoteButton = event.target.closest("[data-note-delete]");
        const removeFavoriteButton = event.target.closest("[data-favorite-remove]");

        if (deleteRouteButton) {
            const routeId = Number(deleteRouteButton.dataset.routeDelete);
            try {
                await TravelApi.deleteRoute(routeId);
                routes = routes.filter((r) => r.id !== routeId);
                renderRoutes();
                renderStats();
                TravelApp.showToast("Маршрут удалён", "info");
            } catch (error) {
                TravelApp.showToast("Ошибка при удалении маршрута", "error");
                console.error("Ошибка:", error);
            }
        }

        if (editNoteButton) {
            const noteId = Number(editNoteButton.dataset.noteEdit);
            const note = notes.find((n) => n.id === noteId);
            if (note) {
                document.getElementById("noteId").value = note.id;
                document.getElementById("noteTitle").value = note.title;
                document.getElementById("noteText").value = note.text;
                document.getElementById("noteSubmitLabel").textContent = "Сохранить изменения";
                noteForm.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }

        if (deleteNoteButton) {
            const noteId = Number(deleteNoteButton.dataset.noteDelete);
            try {
                await TravelApi.deleteNote(noteId);
                notes = notes.filter((n) => n.id !== noteId);
                renderNotes();
                renderStats();
                TravelApp.showToast("Заметка удалена", "info");
            } catch (error) {
                TravelApp.showToast("Ошибка при удалении заметки", "error");
                console.error("Ошибка:", error);
            }
        }

        if (removeFavoriteButton) {
            const favId = Number(removeFavoriteButton.dataset.favoriteRemove);
            const fav = favorites.find((f) => f.destinationId === favId);
            if (!fav) {
                return;
            }
            try {
                await TravelApi.deleteFavorite(fav.id);
                favorites = favorites.filter((f) => f.id !== fav.id);
                renderFavorites();
                renderStats();
                TravelApp.showToast("Направление удалено из избранного", "info");
            } catch (error) {
                TravelApp.showToast("Ошибка при удалении из избранного", "error");
                console.error("Ошибка:", error);
            }
        }
    });

    function getDashboardUser() {
        return TravelApp.getCurrentUser() || {
            id: 0,
            firstName: "Demo",
            lastName: "Traveler",
            email: "demo@tripplanner.local",
            preference: "mixed"
        };
    }

    function renderProfile(user) {
        const fullName = `${user.firstName} ${user.lastName}`.trim();
        document.getElementById("profileName").textContent = fullName;
        document.getElementById("profileEmail").textContent = user.email;
        document.getElementById("profilePreference").textContent = TravelAppData.labelMaps.type[user.preference] || "Смешанный";
        document.getElementById("profileAvatar").textContent = `${user.firstName?.[0] || "T"}${user.lastName?.[0] || "P"}`.toUpperCase();
        document.getElementById("profileFirstName").value = user.firstName || "";
        document.getElementById("profileLastName").value = user.lastName || "";
        document.getElementById("profilePreferenceSelect").value = user.preference || "mixed";
    }

    function renderStats() {
        document.getElementById("routesCount").textContent = routes.length;
        document.getElementById("notesCount").textContent = notes.length;
        document.getElementById("favoritesCount").textContent = favorites.length;
    }

    function renderRouteDestinationOptions() {
        const select = document.getElementById("routeDestination");
        if (!select) {
            return;
        }
        select.innerHTML = `<option value="">Выберите направление</option>${destinations.map((d) => `
            <option value="${d.id}">${TravelApp.escapeHtml(d.name)}</option>
        `).join("")}`;
    }

    function renderRoutes() {
        const container = document.getElementById("routesList");
        const empty = document.getElementById("routesEmpty");

        if (!routes.length) {
            container.innerHTML = "";
            empty.classList.remove("d-none");
            return;
        }

        empty.classList.add("d-none");
        container.innerHTML = routes.map((route) => {
            const destination = route.destinationId ? getDestinationById(route.destinationId) : null;
            const openHref = destination ? `destination-details.html?id=${destination.id}` : "destinations.html";
            return `
                <div class="col-lg-6">
                    <article class="route-card">
                        <div class="d-flex justify-content-between align-items-start gap-3">
                            <div>
                                <h3 class="h5 mb-2">${TravelApp.escapeHtml(route.name)}</h3>
                                <p class="text-secondary mb-0">${TravelApp.escapeHtml(route.description)}</p>
                            </div>
                            <span class="badge text-bg-light">${TravelApp.escapeHtml(route.duration)}</span>
                        </div>
                        <div class="card-meta">
                            <span class="badge badge-budget">${TravelApp.escapeHtml(TravelAppData.labelMaps.budget[route.budget] || route.budget)}</span>
                            <span class="badge badge-soft">${TravelApp.escapeHtml(destination?.name || "Свободный маршрут")}</span>
                        </div>
                        <div class="d-flex flex-wrap gap-2">
                            <a class="btn btn-sm btn-primary" href="${openHref}">Открыть</a>
                            <button type="button" class="btn btn-sm btn-outline-danger" data-route-delete="${route.id}">Удалить</button>
                        </div>
                    </article>
                </div>
            `;
        }).join("");
    }

    function renderNotes() {
        const container = document.getElementById("notesList");
        const empty = document.getElementById("notesEmpty");

        if (!notes.length) {
            container.innerHTML = "";
            empty.classList.remove("d-none");
            return;
        }

        empty.classList.add("d-none");
        container.innerHTML = notes.map((note) => `
            <div class="col-lg-6">
                <article class="note-card">
                    <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                        <div>
                            <h3 class="h5 mb-1">${TravelApp.escapeHtml(note.title)}</h3>
                            <p class="text-secondary mb-0">${TravelApp.escapeHtml(note.author || "Пользователь")} • ${TravelApp.escapeHtml(TravelApp.formatDate(note.date))}</p>
                        </div>
                    </div>
                    <p class="mb-3">${TravelApp.escapeHtml(note.text)}</p>
                    <div class="d-flex flex-wrap gap-2">
                        <button type="button" class="btn btn-sm btn-outline-primary" data-note-edit="${note.id}">Редактировать</button>
                        <button type="button" class="btn btn-sm btn-outline-danger" data-note-delete="${note.id}">Удалить</button>
                    </div>
                </article>
            </div>
        `).join("");
    }

    function renderFavorites() {
        const favDestinations = favorites.map((fav) => getDestinationById(fav.destinationId)).filter(Boolean);
        const container = document.getElementById("favoritesList");
        const empty = document.getElementById("favoritesEmpty");

        if (!favDestinations.length) {
            container.innerHTML = "";
            empty.classList.remove("d-none");
            return;
        }

        empty.classList.add("d-none");
        container.innerHTML = favDestinations.map((destination) => `
            <div class="col-lg-4 col-md-6">
                <article class="favorite-card">
                    <img src="${destination.image}" alt="${TravelApp.escapeHtml(destination.name)}" class="favorite-image">
                    <div class="card-meta mt-0">
                        <span class="badge ${destination.type === "city" ? "badge-city" : "badge-nature"}">${TravelApp.escapeHtml(TravelAppData.labelMaps.type[destination.type])}</span>
                        <span class="badge badge-budget">${TravelApp.escapeHtml(TravelAppData.labelMaps.budget[destination.budget])}</span>
                    </div>
                    <h3 class="h5">${TravelApp.escapeHtml(destination.name)}</h3>
                    <p class="text-secondary">${TravelApp.escapeHtml(destination.shortDescription)}</p>
                    <div class="d-flex flex-wrap gap-2">
                        <a class="btn btn-sm btn-primary" href="destination-details.html?id=${destination.id}">Подробнее</a>
                        <button type="button" class="btn btn-sm btn-outline-danger" data-favorite-remove="${destination.id}">Удалить</button>
                    </div>
                </article>
            </div>
        `).join("");
    }
});
