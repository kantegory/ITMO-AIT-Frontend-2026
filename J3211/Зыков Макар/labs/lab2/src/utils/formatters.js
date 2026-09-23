export function formatCurrency(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function formatCompactCurrency(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(Number(value || 0));
}

export function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

export function formatTime(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatEventDateTime(value) {
  if (!value) return "-";
  return `${formatDate(value)} в ${formatTime(value)}`;
}

export function shortText(value, maxLength = 110) {
  const safeValue = String(value || "").trim();

  if (safeValue.length <= maxLength) {
    return safeValue;
  }

  return `${safeValue.slice(0, maxLength).trim()}...`;
}

export function matchesDateRange(date, period, today = new Date()) {
  if (period === "all") {
    return true;
  }

  const normalizedToday = new Date(today);
  normalizedToday.setHours(0, 0, 0, 0);

  const diff = new Date(date) - normalizedToday;
  const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (period === "week") {
    return daysDiff >= 0 && daysDiff <= 7;
  }

  if (period === "month") {
    return daysDiff >= 0 && daysDiff <= 31;
  }

  return true;
}

export function getBadgeClassByType(type) {
  const classes = {
    concert: "text-bg-primary",
    theater: "text-bg-danger",
    festival: "text-bg-warning",
    sport: "text-bg-success"
  };

  return classes[type] || "text-bg-secondary";
}

export function getReturnStatusLabel(status) {
  return status === "completed" ? "Возврат завершён" : "В обработке";
}

export function getProgressBarClass(value) {
  if (value >= 80) return "bg-success";
  if (value >= 45) return "bg-primary";
  return "bg-warning text-dark";
}
