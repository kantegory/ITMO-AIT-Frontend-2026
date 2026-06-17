export function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = String(text ?? "");
    return div.innerHTML;
}

export function parseDownloads(str) {
    if (!str) return 0;
    const value = String(str).toUpperCase();
    if (value.endsWith("K")) return parseFloat(value) * 1000;
    if (value.endsWith("M")) return parseFloat(value) * 1000000;
    return parseInt(value, 10) || 0;
}

export function formatDownloads(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(".0", "")}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace(".0", "")}K`;
    return String(num);
}

export function getInitials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
