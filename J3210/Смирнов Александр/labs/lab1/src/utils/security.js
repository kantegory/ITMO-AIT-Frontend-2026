function toHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function hashPassword(password) {
    const normalized = String(password || "");
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return toHex(hashBuffer);
}

export function isStrongPassword(password) {
    const value = String(password || "");
    const hasMinLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);

    return hasMinLength && hasUppercase && hasLowercase && hasDigit;
}