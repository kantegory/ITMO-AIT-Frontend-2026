(() => {
    const BASE_URL = "http://localhost:3000";

    const Api = {
        async request(endpoint, options = {}) {
            const url = `${BASE_URL}${endpoint}`;
            const config = {
                headers: { "Content-Type": "application/json" },
                ...options
            };

            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            if (response.status === 204) {
                return null;
            }

            return response.json();
        },

        get(endpoint) {
            return this.request(endpoint, { method: "GET" });
        },

        post(endpoint, body) {
            return this.request(endpoint, {
                method: "POST",
                body: JSON.stringify(body)
            });
        },

        put(endpoint, body) {
            return this.request(endpoint, {
                method: "PUT",
                body: JSON.stringify(body)
            });
        },

        patch(endpoint, body) {
            return this.request(endpoint, {
                method: "PATCH",
                body: JSON.stringify(body)
            });
        },

        delete(endpoint) {
            return this.request(endpoint, { method: "DELETE" });
        },

        // --- Auth ---

        async login(email, password) {
            const users = await this.get(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
            if (!users.length) {
                return null;
            }
            return users[0];
        },

        async register(userData) {
            const existing = await this.get(`/users?email=${encodeURIComponent(userData.email)}`);
            if (existing.length) {
                throw new Error("Пользователь с таким email уже зарегистрирован.");
            }
            return this.post("/users", userData);
        },

        // --- Destinations ---

        getDestinations() {
            return this.get("/destinations");
        },

        getDestinationById(id) {
            return this.get(`/destinations/${id}`);
        },

        // --- Reviews ---

        getReviewsByDestination(destinationId) {
            return this.get(`/reviews?destinationId=${destinationId}`);
        },

        addReview(review) {
            return this.post("/reviews", review);
        },

        // --- Routes ---

        getRoutes() {
            return this.get("/routes");
        },

        addRoute(route) {
            return this.post("/routes", route);
        },

        updateRoute(id, data) {
            return this.patch(`/routes/${id}`, data);
        },

        deleteRoute(id) {
            return this.delete(`/routes/${id}`);
        },

        // --- Notes ---

        getNotes() {
            return this.get("/notes");
        },

        addNote(note) {
            return this.post("/notes", note);
        },

        updateNote(id, data) {
            return this.patch(`/notes/${id}`, data);
        },

        deleteNote(id) {
            return this.delete(`/notes/${id}`);
        },

        // --- Favorites ---

        getFavorites() {
            return this.get("/favorites");
        },

        addFavorite(favorite) {
            return this.post("/favorites", favorite);
        },

        deleteFavorite(id) {
            return this.delete(`/favorites/${id}`);
        },

        // --- Collaboration: Participants ---

        getParticipants() {
            return this.get("/participants");
        },

        addParticipant(participant) {
            return this.post("/participants", participant);
        },

        // --- Collaboration: Stages ---

        getStages() {
            return this.get("/stages");
        },

        addStage(stage) {
            return this.post("/stages", stage);
        },

        updateStage(id, data) {
            return this.patch(`/stages/${id}`, data);
        },

        deleteStage(id) {
            return this.delete(`/stages/${id}`);
        },

        // --- Collaboration: Shared Notes ---

        getSharedNotes() {
            return this.get("/shared-notes");
        },

        addSharedNote(note) {
            return this.post("/shared-notes", note);
        },

        deleteSharedNote(id) {
            return this.delete(`/shared-notes/${id}`);
        },

        // --- Collaboration: Ideas ---

        getIdeas() {
            return this.get("/ideas");
        },

        addIdea(idea) {
            return this.post("/ideas", idea);
        },

        updateIdea(id, data) {
            return this.patch(`/ideas/${id}`, data);
        }
    };

    window.TravelApi = Api;
})();
