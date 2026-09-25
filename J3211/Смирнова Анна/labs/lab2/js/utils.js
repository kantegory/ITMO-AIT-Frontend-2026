function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(d.setDate(diff)).setHours(0,0,0,0);
}

function getEndOfWeek(date) {
    const start = new Date(getStartOfWeek(date));
    return new Date(start.setDate(start.getDate() + 6)).setHours(23,59,59,999);
}

function formatChartLabel(value) {
    if (value === 0) return null;
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
    return value;
}

function getCategoriesByType(type) {
    return categories.filter(c => c.type === type).map(c => c.name);
}