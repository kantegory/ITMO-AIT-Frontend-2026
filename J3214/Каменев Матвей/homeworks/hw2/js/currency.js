const SYMBOLS = { RUB: '₽', USD: '$', EUR: '€' };

const rates = { RUB: 1, USD: null, EUR: null };

function storageGet() { try { return localStorage.getItem('currency'); } catch { return null; } }
function storageSet(v) { try { localStorage.setItem('currency', v); } catch { /* */ } }

function formatPrice(rub, currency, suffix) {
    const symbol = SYMBOLS[currency];
    if (currency === 'RUB') {
        const formatted = rub.toLocaleString('ru-RU', { maximumFractionDigits: 0 });
        return suffix ? `${formatted} ${symbol} ${suffix}` : `${formatted} ${symbol}`;
    }
    const converted = (rub * rates[currency]).toFixed(2);
    return suffix ? `${symbol}${converted} ${suffix}` : `${symbol}${converted}`;
}

function updatePrices(currency) {
    document.querySelectorAll('[data-price-rub]').forEach((el) => {
        const rub = parseFloat(el.dataset.priceRub);
        const suffix = el.dataset.priceSuffix || '';
        el.textContent = formatPrice(rub, currency, suffix);
    });
}

function setCurrency(currency) {
    storageSet(currency);
    updatePrices(currency);
    document.querySelectorAll('input[name="currency"]').forEach((input) => {
        input.checked = input.value === currency;
    });
}

document.querySelectorAll('input[name="currency"][value="USD"], input[name="currency"][value="EUR"]')
    .forEach((el) => { el.disabled = true; });

document.querySelectorAll('input[name="currency"]').forEach((input) => {
    input.addEventListener('change', () => setCurrency(input.value));
});

fetch('https://open.er-api.com/v6/latest/RUB')
    .then((r) => r.json())
    .then((data) => {
        rates.USD = data.rates.USD;
        rates.EUR = data.rates.EUR;
        document.querySelectorAll('input[name="currency"][value="USD"], input[name="currency"][value="EUR"]')
            .forEach((el) => { el.disabled = false; });
        setCurrency(storageGet() || 'RUB');
    });
