window.TarelkaApi = (() => {
  const BASE_URL = window.location.protocol.startsWith('http') ? window.location.origin : 'http://localhost:3000';
  const EXCHANGE_BASE_URL = 'https://api.frankfurter.dev/v2';

  async function parseResponse(response) {
    const text = await response.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return text; }
  }

  function extractError(payload, fallback = 'Не удалось выполнить запрос.') {
    if (!payload) return fallback;
    if (typeof payload === 'string') return payload;
    return payload.message || payload.error || payload.msg || fallback;
  }

  async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, options);
    const payload = await parseResponse(response);
    if (!response.ok) {
      throw new Error(extractError(payload, `Ошибка HTTP ${response.status}`));
    }
    return payload;
  }

  async function requestExternal(url, options = {}) {
    const response = await fetch(url, options);
    const payload = await parseResponse(response);
    if (!response.ok) {
      throw new Error(extractError(payload, `Ошибка HTTP ${response.status}`));
    }
    return payload;
  }

  async function fetchExchangeRates(baseCurrency = 'EUR', quotes = ['USD', 'RUB']) {
    const filteredQuotes = [...new Set(quotes.filter((quote) => quote && quote !== baseCurrency))];
    if (!filteredQuotes.length) return [];
    const params = new URLSearchParams({ base: baseCurrency, quotes: filteredQuotes.join(',') });
    return requestExternal(`${EXCHANGE_BASE_URL}/rates?${params.toString()}`);
  }

  return { BASE_URL, request, requestExternal, fetchExchangeRates };
})();
