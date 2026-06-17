export const API_URL = "http://localhost:3000";

export async function fetchAllItems() {
    try {
        const response = await fetch(`${API_URL}/items`);
        if (!response.ok) throw new Error("Network error");
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch API data:", error);
        return [];
    }
}
