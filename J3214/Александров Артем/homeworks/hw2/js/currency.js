// модуль работы с внешним API курсов валют

// адрес открытого внешнего API
const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest/USD';

// валюты, которые хотим отобразить на дашборде
const TARGET_CURRENCIES = [
    { code: 'RUB', name: 'Российский рубль', symbol: '₽', flag: '🇷🇺' },
    { code: 'EUR', name: 'Евро', symbol: '€', flag: '🇪🇺' },
    { code: 'CNY', name: 'Китайский юань', symbol: '¥', flag: '🇨🇳' },
    { code: 'GBP', name: 'Фунт стерлингов', symbol: '£', flag: '🇬🇧' }
];

// функция получения курсов валют
async function fetchCurrencyRates() {
    try {
        const response = await fetch(CURRENCY_API_URL);
        if (!response.ok) throw new Error(`open API error: ${response.status}`);
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('error when accessing the external courses API:', error);

        return null;
    }
}


//  функция отрисовки полученных курсов в HTML
async function renderCurrencyRates() {
    const container = document.querySelector('#currencyRatesContainer');
    const lastUpdateEl = document.querySelector('#ratesLastUpdate');

    if (!container) return;

    const apiData = await fetchCurrencyRates();

    // если произошла ошибка запроса
    if (!apiData || !apiData.rates) {
        container.innerHTML = `
        <div class="col-12 text-center text-danger py-3">
            <i class="bi bi-exclamation-triangle fs-4 d-block mb-1"></i>
            Не удалось загрузить данные из внешнего API
        </div>
        `;
        return;
    }

  // формируем HTML-карточки для выбранных валют
    const ratesHtml = TARGET_CURRENCIES.map(curr => {
        const rate = apiData.rates[curr.code];
        const formattedRate = rate ? rate.toFixed(2) : 'N/A';

        return `
        <div class="col-6 col-md-3">
            <div class="p-3 bg-light rounded-3 text-center border-0 h-100 d-flex flex-column justify-content-center">
            <div class="fs-4 mb-1">${curr.flag}</div>
            <div class="fw-bold text-dark" style="font-size: 15px;">1 USD</div>
            <div class="fw-bold" style="color: #0f43c4; font-size: 30px;">${formattedRate} ${curr.symbol}</div>
            <div class="text-muted" style="font-size: 11px;">${curr.name}</div>
            </div>
        </div>
        `;
    }).join('');

    // вставляем готовый HTML в контейнер
    container.innerHTML = ratesHtml;

    // обновляем время последнего изменения
    if (lastUpdateEl) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastUpdateEl.textContent = `Обновлено: ${timeStr}`;
    }
}

// вешаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    renderCurrencyRates();

    // добавляем обработчик на кнопку "обновить"
    const refreshBtn = document.querySelector('#refreshRatesBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
        const container = document.querySelector('#currencyRatesContainer');
        if (container) {
            container.innerHTML = `
            <div class="col-12 text-center py-4">
                <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
            </div>
            `;
        }
        renderCurrencyRates();
        });
    }
});