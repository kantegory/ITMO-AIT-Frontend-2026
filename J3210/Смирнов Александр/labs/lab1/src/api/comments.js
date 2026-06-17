import http from "./http";

export async function getCommentsByItem(itemId) {
    const { data } = await http.get("/comments");
    if (!Array.isArray(data)) return [];
    return data.filter((c) => String(c.itemId) === String(itemId));
}

export async function getCommentById(id) {
    const { data } = await http.get(`/comments/${id}`);
    return data;
}

export async function createComment(payload) {
    const { data } = await http.post("/comments", payload);
    return data;
}
