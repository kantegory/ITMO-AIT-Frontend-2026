export function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("ru-RU").replace(/\u00a0/g, " ")} ₽`;
}

export function formatLongDate(value) {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(value) {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export function formatDate(date) {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatLastSync(lastSyncAt, status) {
  if (!lastSyncAt) {
    return status === "inactive" ? "Ручной импорт по необходимости" : "Синхронизации пока не было";
  }

  const date = new Date(lastSyncAt);
  const now = new Date();
  const sameDay = formatDate(date) === formatDate(now);
  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (sameDay) {
    return `Последняя синхронизация: сегодня в ${time}`;
  }

  return `Последняя синхронизация: ${date.toLocaleDateString("ru-RU")} в ${time}`;
}
