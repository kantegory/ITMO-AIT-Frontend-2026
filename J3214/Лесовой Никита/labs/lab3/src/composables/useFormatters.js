const weatherDescriptions = {
  0: "Ясно",
  1: "Преимущественно ясно",
  2: "Переменная облачность",
  3: "Пасмурно",
  45: "Туман",
  48: "Туман с изморозью",
  51: "Лёгкая морось",
  53: "Морось",
  55: "Сильная морось",
  61: "Небольшой дождь",
  63: "Дождь",
  65: "Сильный дождь",
  71: "Небольшой снег",
  73: "Снег",
  75: "Сильный снег",
  80: "Небольшой ливень",
  81: "Ливень",
  82: "Сильный ливень",
  95: "Гроза"
};

export function useFormatters() {
  function formatPrice(value) {
    return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short"
    }).format(new Date(`${value}T12:00:00`));
  }

  function formatDays(value) {
    const lastDigit = value % 10;
    const lastTwoDigits = value % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) return `${value} день`;
    if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
      return `${value} дня`;
    }
    return `${value} дней`;
  }

  function weatherText(code) {
    return weatherDescriptions[code] || "Погода без осадков";
  }

  return { formatPrice, formatDate, formatDays, weatherText };
}
