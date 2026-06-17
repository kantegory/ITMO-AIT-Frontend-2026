import http from "./http";
import { hashPassword } from "../utils/security";

export async function findUserByCredentials(email, password) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const { data } = await http.get("/users", {
        params: { email: normalizedEmail }
    });

    if (!Array.isArray(data) || data.length === 0) return null;

    const candidate = data[0];
    const hashedInputPassword = await hashPassword(password);
    const hasLegacyPasswordMatch = candidate.password && candidate.password === password;
    const hasHashMatch = candidate.passwordHash && candidate.passwordHash === hashedInputPassword;

    return hasLegacyPasswordMatch || hasHashMatch ? candidate : null;
}

export async function findUserByEmail(email) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const { data } = await http.get("/users", {
        params: { email: normalizedEmail }
    });

    return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function createUser(payload) {
    const { data } = await http.post("/users", payload);
    return data;
}
