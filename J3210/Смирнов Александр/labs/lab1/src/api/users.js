import http from "./http";

export async function findUserByCredentials(email, password) {
    const { data } = await http.get("/users", {
        params: { email, password }
    });

    return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function findUserByEmail(email) {
    const { data } = await http.get("/users", {
        params: { email }
    });

    return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function createUser(payload) {
    const { data } = await http.post("/users", payload);
    return data;
}
