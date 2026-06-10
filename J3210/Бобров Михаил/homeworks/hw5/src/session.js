import { reactive } from "vue";
import { request } from "./api.js";

export const session = reactive({
    id: localStorage.getItem("user") || "",
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || ""
});

export function isAuthenticated() {
    return Boolean(session.id);
}

function saveSession(user) {
    session.id = String(user.id);
    session.name = user.name;
    session.email = user.email;
    localStorage.setItem("user", session.id);
    localStorage.setItem("userName", session.name);
    localStorage.setItem("userEmail", session.email);
}

export async function login(email, password) {
    const users = await request(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    if (!users[0]) throw new Error("Неверный email или пароль");
    saveSession(users[0]);
}

export async function register(name, email, password) {
    const users = await request(`/users?email=${encodeURIComponent(email)}`);
    if (users.length) throw new Error("Пользователь с таким email уже существует");
    const user = await request("/users", { method: "POST", body: { name, email, password } });
    saveSession(user);
}

export function logout() {
    session.id = "";
    session.name = "";
    session.email = "";
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
}

export async function saveProfile(name, email) {
    await request(`/users/${session.id}`, { method: "PATCH", body: { name, email } });
    session.name = name;
    session.email = email;
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
}

export async function deleteAccount() {
    await request(`/users/${session.id}`, { method: "DELETE" });
    localStorage.clear();
    logout();
}
