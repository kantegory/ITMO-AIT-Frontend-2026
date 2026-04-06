let cbrRatesCache = null;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatCompactMoney(value, currency = 'RUB', maximumFractionDigits = 2) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits
  }).format(Number(value || 0));
}

function formatPercentChange(value) {
  const numeric = Number(value || 0);
  const sign = numeric > 0 ? '+' : '';
  return `${sign}${numeric.toFixed(2)}%`;
}

function getCbrPerUnitRate(charCode) {
  if (!cbrRatesCache) return null;
  if (charCode === 'RUB') return 1;

  const item = cbrRatesCache.Valute?.[charCode];
  if (!item) return null;

  return Number(item.Value) / Number(item.Nominal || 1);
}

function getCbrPreviousPerUnitRate(charCode) {
  if (!cbrRatesCache) return null;
  if (charCode === 'RUB') return 1;

  const item = cbrRatesCache.Valute?.[charCode];
  if (!item) return null;

  return Number(item.Previous) / Number(item.Nominal || 1);
}

function renderCurrencyCards(container, items, updatedAt) {
  if (!container) return;

  container.innerHTML = items.map((item) => {
    const delta = item.rate - item.previousRate;
    const deltaClass = delta >= 0 ? 'text-success' : 'text-danger';
    const deltaPrefix = delta >= 0 ? '+' : '';

    return `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>
          <div class="fw-semibold">${escapeHtml(item.label)}</div>
          <div class="text-secondary small">1 ${escapeHtml(item.code)} = ${item.rate.toFixed(4)} RUB</div>
        </div>
        <div class="text-end">
          <div class="small text-secondary">${escapeHtml(updatedAt)}</div>
          <div class="small ${deltaClass}">${deltaPrefix}${delta.toFixed(4)} RUB</div>
        </div>
      </div>
    `;
  }).join('');
}

function updateCurrencyArchiveInfo() {
  const select = document.getElementById('archiveCurrencySelect');
  const result = document.getElementById('currencyArchiveResult');

  if (!select || !result || !cbrRatesCache) return;

  const code = select.value;
  const current = getCbrPerUnitRate(code);
  const previous = getCbrPreviousPerUnitRate(code);

  if (current == null || previous == null) {
    result.innerHTML = '<span class="text-secondary">Нет данных для выбранной валюты.</span>';
    return;
  }

  const delta = current - previous;
  const deltaClass = delta >= 0 ? 'text-success' : 'text-danger';
  const deltaPrefix = delta >= 0 ? '+' : '';

  result.innerHTML = `
    <div class="small text-secondary mb-1">Сравнение с предыдущей датой</div>
    <div class="fw-semibold">Сегодня: ${current.toFixed(4)} RUB</div>
    <div class="fw-semibold">Предыдущий курс: ${previous.toFixed(4)} RUB</div>
    <div class="${deltaClass}">Изменение: ${deltaPrefix}${delta.toFixed(4)} RUB</div>
  `;
}

function convertCurrency() {
  const amountInput = document.getElementById('currencyAmount');
  const fromSelect = document.getElementById('currencyFrom');
  const toSelect = document.getElementById('currencyTo');
  const result = document.getElementById('currencyConvertResult');

  if (!amountInput || !fromSelect || !toSelect || !result || !cbrRatesCache) return;

  const amount = Number(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || amount <= 0) {
    result.innerHTML = '<span class="text-secondary">Введите сумму больше нуля.</span>';
    return;
  }

  const fromRate = getCbrPerUnitRate(from);
  const toRate = getCbrPerUnitRate(to);

  if (fromRate == null || toRate == null) {
    result.innerHTML = '<span class="text-secondary">Не удалось выполнить конвертацию.</span>';
    return;
  }

  const rubValue = amount * fromRate;
  const converted = rubValue / toRate;

  result.innerHTML = `
    <div class="fw-semibold">${amount.toLocaleString('ru-RU')} ${escapeHtml(from)} = ${converted.toLocaleString('ru-RU', {
      maximumFractionDigits: 4
    })} ${escapeHtml(to)}</div>
  `;
}

async function loadCbrRates() {
  const status = document.getElementById('ecbStatus');
  const list = document.getElementById('ecbRatesList');

  if (!status || !list) return;

  status.textContent = 'Загрузка курсов...';
  list.innerHTML = '';

  try {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    if (!response.ok) {
      throw new Error(`CBR error ${response.status}`);
    }

    const data = await response.json();
    cbrRatesCache = data;

    const valute = data.Valute || {};
    const updatedAt = data.Date ? new Date(data.Date).toLocaleString('ru-RU') : '—';

    const wanted = [
      { code: 'USD', label: 'Доллар США' },
      { code: 'EUR', label: 'Евро' },
      { code: 'KZT', label: 'Казахстанский тенге' },
      { code: 'BYN', label: 'Белорусский рубль' }
    ];

    const items = wanted
      .map((item) => {
        const raw = valute[item.code];
        if (!raw) return null;

        return {
          code: item.code,
          label: item.label,
          rate: Number(raw.Value) / Number(raw.Nominal || 1),
          previousRate: Number(raw.Previous) / Number(raw.Nominal || 1)
        };
      })
      .filter(Boolean);

    if (!items.length) {
      status.textContent = 'Нет данных по валютам.';
      return;
    }

    renderCurrencyCards(list, items, updatedAt);
    updateCurrencyArchiveInfo();
    convertCurrency();

    status.textContent = 'Курсы валют обновлены.';
  } catch (error) {
    console.error(error);
    status.textContent = 'Не удалось загрузить курсы валют.';
  }
}

async function loadCryptoPrices() {
  const status = document.getElementById('cryptoStatus');
  const list = document.getElementById('cryptoPricesList');

  if (!status || !list) return;

  status.textContent = 'Загрузка крипторынка...';
  list.innerHTML = '';

  try {
    const endpoint =
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,toncoin&vs_currencies=rub,usd&include_24hr_change=true';

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`CoinGecko error ${response.status}`);
    }

    const data = await response.json();

    const coins = [
      { key: 'bitcoin', label: 'Bitcoin', ticker: 'BTC' },
      { key: 'ethereum', label: 'Ethereum', ticker: 'ETH' },
      { key: 'toncoin', label: 'Toncoin', ticker: 'TON' }
    ];

    list.innerHTML = coins.map((coin) => {
      const item = data[coin.key] || {};
      const change = Number(item.rub_24h_change || 0);
      const changeClass = change >= 0 ? 'text-success' : 'text-danger';

      return `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
          <div>
            <div class="fw-semibold">${escapeHtml(coin.label)} <span class="text-secondary small">${escapeHtml(coin.ticker)}</span></div>
            <div class="text-secondary small">
              ${formatCompactMoney(item.rub, 'RUB', 0)} · ${formatCompactMoney(item.usd, 'USD', 2)}
            </div>
          </div>
          <div class="fw-semibold ${changeClass}">
            ${formatPercentChange(change)}
          </div>
        </div>
      `;
    }).join('');

    status.textContent = 'Криптовалютные цены обновлены.';
  } catch (error) {
    console.error(error);
    status.textContent = 'Не удалось загрузить цены криптовалют.';
  }
}

function getMoexBlockValue(block, field) {
  if (!block || !Array.isArray(block.columns) || !Array.isArray(block.data) || !block.data.length) {
    return null;
  }

  const index = block.columns.indexOf(field);
  if (index === -1) return null;

  return block.data[0][index];
}

async function fetchMoexSecurity({ engine, market, board, security }) {
  const boardPart = board ? `/boards/${board}` : '';
  const url =
    `https://iss.moex.com/iss/engines/${engine}/markets/${market}${boardPart}/securities/${security}.json?iss.meta=off&iss.only=securities,marketdata`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`MOEX error ${response.status}`);
  }

  const data = await response.json();

  const shortName =
    getMoexBlockValue(data.securities, 'SHORTNAME') ||
    getMoexBlockValue(data.securities, 'SECNAME') ||
    security;

  const price =
    getMoexBlockValue(data.marketdata, 'LAST') ??
    getMoexBlockValue(data.marketdata, 'LCLOSEPRICE') ??
    getMoexBlockValue(data.marketdata, 'PREVPRICE') ??
    getMoexBlockValue(data.securities, 'PREVPRICE');

  const changePercent =
    getMoexBlockValue(data.marketdata, 'LASTCHANGEPRCNT') ??
    getMoexBlockValue(data.marketdata, 'CHANGEPRCNT') ??
    0;

  return {
    security,
    shortName,
    price: Number(price || 0),
    changePercent: Number(changePercent || 0)
  };
}

async function loadMoexMarket() {
  const status = document.getElementById('moexStatus');
  const list = document.getElementById('moexList');

  if (!status || !list) return;

  status.textContent = 'Загрузка данных MOEX...';
  list.innerHTML = '';

  try {
    const instruments = [
      { engine: 'stock', market: 'index', board: '', security: 'IMOEX' },
      { engine: 'stock', market: 'shares', board: 'TQBR', security: 'SBER' },
      { engine: 'stock', market: 'shares', board: 'TQBR', security: 'GAZP' },
      { engine: 'stock', market: 'shares', board: 'TQBR', security: 'LKOH' }
    ];

    const rows = await Promise.all(instruments.map(fetchMoexSecurity));

    list.innerHTML = rows.map((item) => {
      const changeClass = item.changePercent >= 0 ? 'text-success' : 'text-danger';
      const sign = item.changePercent >= 0 ? '+' : '';

      return `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
          <div>
            <div class="fw-semibold">${escapeHtml(item.security)}</div>
            <div class="text-secondary small">${escapeHtml(item.shortName)}</div>
          </div>
          <div class="text-end">
            <div class="fw-semibold">${item.price ? item.price.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) : '—'}</div>
            <div class="small ${changeClass}">${sign}${item.changePercent.toFixed(2)}%</div>
          </div>
        </div>
      `;
    }).join('');

    status.textContent = 'Данные MOEX обновлены.';
  } catch (error) {
    console.error(error);
    status.textContent = 'Не удалось загрузить данные MOEX.';
  }
}

function initMarketWidgets() {
  const ecbRefreshBtn = document.getElementById('refreshEcbBtn');
  const cryptoRefreshBtn = document.getElementById('refreshCryptoBtn');
  const moexRefreshBtn = document.getElementById('refreshMoexBtn');
  const convertBtn = document.getElementById('convertCurrencyBtn');
  const archiveSelect = document.getElementById('archiveCurrencySelect');

  const hasAnyMarketBlock =
    document.getElementById('ecbRatesList') ||
    document.getElementById('cryptoPricesList') ||
    document.getElementById('moexList');

  if (!hasAnyMarketBlock) return;

  ecbRefreshBtn?.addEventListener('click', loadCbrRates);
  cryptoRefreshBtn?.addEventListener('click', loadCryptoPrices);
  moexRefreshBtn?.addEventListener('click', loadMoexMarket);
  convertBtn?.addEventListener('click', convertCurrency);
  archiveSelect?.addEventListener('change', updateCurrencyArchiveInfo);

  loadCbrRates();
  loadCryptoPrices();
  loadMoexMarket();
}