import http from "./http";

export async function getUserNotifications(userId) {
    const { data } = await http.get("/notifications", {
        params: { userId }
    });

    return Array.isArray(data) ? data : [];
}

export async function createNotification(payload) {
    const { data } = await http.post("/notifications", payload);
    return data;
}

export async function deleteNotification(id) {
    await http.delete(`/notifications/${id}`);
}
