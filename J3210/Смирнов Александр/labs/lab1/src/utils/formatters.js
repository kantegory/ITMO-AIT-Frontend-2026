export function parseDownloads(value) {
    if (!value) return 0;
    const normalized = String(value).trim().toUpperCase();
    if (normalized.endsWith("K")) return Math.round(parseFloat(normalized) * 1000);
    if (normalized.endsWith("M")) return Math.round(parseFloat(normalized) * 1000000);

    const parsed = Number.parseInt(normalized, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatDownloads(value) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(".0", "")}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1).replace(".0", "")}K`;
    return String(value);
}

export function getInitials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "SU";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
