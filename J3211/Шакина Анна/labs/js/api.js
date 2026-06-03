(function () {
    const http = axios.create({
        baseURL: "http://localhost:3000"
    });

    http.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    function send(method, url, data, config) {
        return http({ method, url, data, ...config }).then((response) => response.data);
    }

    window.SchoolApi = {
        http,
        login(email, password) {
            return send("post", "/login", { email, password });
        },
        register(payload) {
            return send("post", "/register", payload);
        },
        getEvents() {
            return send("get", "/events");
        },
        getEventById(id) {
            return send("get", `/events/${id}`);
        },
        getUsers() {
            return send("get", "/users");
        },
        getUserById(id) {
            return send("get", `/users/${id}`);
        },
        getRegistrations(params) {
            return send("get", "/registrations", null, { params });
        },
        createRegistration(payload) {
            return send("post", "/registrations", payload);
        },
        updateRegistration(id, payload) {
            return send("patch", `/registrations/${id}`, payload);
        },
        deleteRegistration(id) {
            return send("delete", `/registrations/${id}`);
        },
        createUser(payload) {
            return send("post", "/users", payload);
        },
        updateUser(id, payload) {
            return send("patch", `/users/${id}`, payload);
        },
        deleteUser(id) {
            return send("delete", `/users/${id}`);
        },
        createEvent(payload) {
            return send("post", "/events", payload);
        },
        updateEvent(id, payload) {
            return send("patch", `/events/${id}`, payload);
        },
        deleteEvent(id) {
            return send("delete", `/events/${id}`);
        }
    };
})();
