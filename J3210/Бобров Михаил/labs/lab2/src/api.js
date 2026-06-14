const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function request(path, options = {}) {
    const params = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    };

    if (params.body && typeof params.body !== "string") {
        params.body = JSON.stringify(params.body);
    }

    const response = await fetch(`${API_URL}${path}`, params);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.status === 204 ? null : response.json();
}
