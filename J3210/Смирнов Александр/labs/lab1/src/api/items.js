import http from "./http";

export async function getItems() {
    const { data } = await http.get("/items");
    return Array.isArray(data) ? data : [];
}

export async function getItemById(id) {
    const { data } = await http.get(`/items/${id}`);
    return data;
}

export async function patchItem(id, payload) {
    const { data } = await http.patch(`/items/${id}`, payload);
    return data;
}

export async function createItem(payload) {
    const { data } = await http.post("/items", payload);
    return data;
}
