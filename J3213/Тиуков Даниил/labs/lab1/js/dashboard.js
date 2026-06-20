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

    renderProfile(getDashboardUser());
    renderRouteDestinationOptions();
    renderRoutes();
    renderNotes();
    renderFavorites();
    renderStats();

    document.getElementById("logoutButton")?.addEventListener("click", () => {
        TravelApp.clearCurrentUser();
        TravelApp.removeStorage("tripplannerRememberMe");
        TravelApp.syncAuthNavigation();
        TravelApp.showToast("Вы вышли из профиля", "info");

        window.setTimeout(() => {
            window.location.href = "index.html";
        }, 500);
    });

    profileForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const firstName = document.getElementById("profileFirstName").value.trim();
        const lastName = document.getElementById("profileLastName").value.trim();
        const preference = document.getElementById("profilePreferenceSelect").value;

        if (!firstName || !lastName || !preference) {
            TravelApp.showToast("Заполните все поля профиля", "error");
            return;
        }

        const nextUser = { ...getDashboardUser(), firstName, lastName, preference };
        TravelApp.setCurrentUser(nextUser);

        const registeredUser = TravelApp.getStorage(TravelApp.storageKeys.registeredUser, null);
        if (registeredUser) {
            TravelApp.setStorage(TravelApp.storageKeys.registeredUser, { ...registeredUser, firstName, lastName, preference });
        }

        renderProfile(nextUser);
        TravelApp.showToast("Профиль обновлён", "success");
        bootstrap.Modal.getInstance(document.getElementById("profileModal"))?.hide();
    });

    routeForm?.addEventListener("submit", (event) => {
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

        const routes = TravelApp.getStorage(TravelApp.storageKeys.routes, []);
        routes.push({
            id: TravelApp.generateId("route"),
            name,
            duration,
            budget,
            description,
            destinationId: destinationId || null
        });
        TravelApp.setStorage(TravelApp.storageKeys.routes, routes);

        routeForm.reset();
        renderRoutes();
        renderStats();
        TravelApp.showToast("Маршрут добавлен", "success");
        routeModal?.hide();
    });

    noteForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const noteId = document.getElementById("noteId").value;
        const title = document.getElementById("noteTitle").value.trim();
        const text = document.getElementById("noteText").value.trim();

        if (!title || !text) {
            TravelApp.showToast("Заполните заголовок и текст заметки", "error");
            return;
        }

        const notes = TravelApp.getStorage(TravelApp.storageKeys.notes, []);
        const currentUser = getDashboardUser();

        if (noteId) {
            const index = notes.findIndex((note) => note.id === noteId);
            if (index >= 0) {
                notes[index] = { ...notes[index], title, text, date: new Date().toISOString() };
            }
            TravelApp.showToast("Заметка обновлена", "success");
        } else {
            notes.unshift({
                id: TravelApp.generateId("note"),
                title,
                text,
                date: new Date().toISOString(),
                author: `${currentUser.firstName} ${currentUser.lastName}`.trim()
            });
            TravelApp.showToast("Заметка добавлена", "success");
        }

        TravelApp.setStorage(TravelApp.storageKeys.notes, notes);
        noteForm.reset();
        document.getElementById("noteId").value = "";
        document.getElementById("noteSubmitLabel").textContent = "Добавить заметку";
        renderNotes();
        renderStats();
    });

    root.addEventListener("click", (event) => {
        const deleteRouteButton = event.target.closest("[data-route-delete]");
        const editNoteButton = event.target.closest("[data-note-edit]");
        const deleteNoteButton = event.target.closest("[data-note-delete]");
        const removeFavoriteButton = event.target.closest("[data-favorite-remove]");

        if (deleteRouteButton) {
            const routeId = deleteRouteButton.dataset.routeDelete;
            TravelApp.removeArrayItem(TravelApp.storageKeys.routes, (route) => route.id === routeId);
            renderRoutes();
            renderStats();
            TravelApp.showToast("Маршрут удалён", "info");
        }

        if (editNoteButton) {
            const noteId = editNoteButton.dataset.noteEdit;
            const note = TravelApp.getStorage(TravelApp.storageKeys.notes, []).find((item) => item.id === noteId);
            if (note) {
                document.getElementById("noteId").value = note.id;
                document.getElementById("noteTitle").value = note.title;
                document.getElementById("noteText").value = note.text;
                document.getElementById("noteSubmitLabel").textContent = "Сохранить изменения";
                noteForm.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }

        if (deleteNoteButton) {
            const noteId = deleteNoteButton.dataset.noteDelete;
            TravelApp.removeArrayItem(TravelApp.storageKeys.notes, (note) => note.id === noteId);
            renderNotes();
            renderStats();
            TravelApp.showToast("Заметка удалена", "info");
        }

        if (removeFavoriteButton) {
            const destinationId = Number(removeFavoriteButton.dataset.favoriteRemove);
            TravelApp.removeArrayItem(TravelApp.storageKeys.favorites, (id) => Number(id) === destinationId);
            renderFavorites();
            renderStats();
            TravelApp.showToast("Направление удалено из избранного", "info");
        }
    });
});

function getDashboardUser() {
    return TravelApp.getCurrentUser() || {
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
    document.getElementById("routesCount").textContent = TravelApp.getStorage(TravelApp.storageKeys.routes, []).length;
    document.getElementById("notesCount").textContent = TravelApp.getStorage(TravelApp.storageKeys.notes, []).length;
    document.getElementById("favoritesCount").textContent = TravelApp.getStorage(TravelApp.storageKeys.favorites, []).length;
}

function renderRouteDestinationOptions() {
    const select = document.getElementById("routeDestination");
    if (!select) {
        return;
    }
    select.innerHTML = `<option value="">Выберите направление</option>${TravelAppData.destinations.map((destination) => `
        <option value="${destination.id}">${TravelApp.escapeHtml(destination.name)}</option>
    `).join("")}`;
}

function renderRoutes() {
    const routes = TravelApp.getStorage(TravelApp.storageKeys.routes, []);
    const container = document.getElementById("routesList");
    const empty = document.getElementById("routesEmpty");

    if (!routes.length) {
        container.innerHTML = "";
        empty.classList.remove("d-none");
        return;
    }

    empty.classList.add("d-none");
    container.innerHTML = routes.map((route) => {
        const destination = route.destinationId ? TravelAppData.getDestinationById(route.destinationId) : null;
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
    const notes = TravelApp.getStorage(TravelApp.storageKeys.notes, []);
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
    const favoriteIds = TravelApp.getStorage(TravelApp.storageKeys.favorites, []);
    const favorites = favoriteIds.map((id) => TravelAppData.getDestinationById(id)).filter(Boolean);
    const container = document.getElementById("favoritesList");
    const empty = document.getElementById("favoritesEmpty");

    if (!favorites.length) {
        container.innerHTML = "";
        empty.classList.remove("d-none");
        return;
    }

    empty.classList.add("d-none");
    container.innerHTML = favorites.map((destination) => `
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
