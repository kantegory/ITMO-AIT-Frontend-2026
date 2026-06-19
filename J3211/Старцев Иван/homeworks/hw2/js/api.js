(() => {
    const client = window.axios.create({
        baseURL: "http://127.0.0.1:3000"
    });

    window.api = {
        getCourses: async () => (await client.get("/courses")).data,
        getCourse: async (id) => (await client.get(`/courses/${id}`)).data,
        createCourse: async (course) => (await client.post("/courses", course)).data,
        updateCourse: async (id, course) => (await client.patch(`/courses/${id}`, course)).data,
        getUsers: async () => (await client.get("/users")).data,
        getUser: async (id) => (await client.get(`/users/${id}`)).data,
        updateUser: async (id, user) => (await client.patch(`/users/${id}`, user)).data,
        login: async (data) => (await client.post("/login", data)).data,
        signup: async (data) => (await client.post("/signup", data)).data
    };
})();
