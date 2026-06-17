import { defineStore } from 'pinia'

function formatPercentChange(value) {
  const numeric = Number(value || 0)
  const sign = numeric > 0 ? '+' : ''
  return `${sign}${numeric.toFixed(2)}%`
}

function normalizeCurrencyItem(raw, label) {
  return {
    code: raw.CharCode,
    label,
    rate: Number(raw.Value) / Number(raw.Nominal || 1),
    previousRate: Number(raw.Previous) / Number(raw.Nominal || 1)
  }
}

function getMoexBlockValue(block, field) {
  if (!block || !Array.isArray(block.columns) || !Array.isArray(block.data) || !block.data.length) {
    return null
  }

  const index = block.columns.indexOf(field)
  if (index === -1) return null

  return block.data[0][index]
}

export const useMarketsStore = defineStore('markets', {
  state: () => ({
    cbrRatesCache: null,
    currenciesStatus: 'Ожидание загрузки...',
    currencyItems: [],
    cryptoStatus: 'Ожидание загрузки...',
    cryptoItems: [],
    moexStatus: 'Ожидание загрузки...',
    moexItems: []
  }),
  getters: {
    getRateByCode: (state) => (code) => {
      if (!state.cbrRatesCache) return null
      if (code === 'RUB') return 1

      const item = state.cbrRatesCache.Valute?.[code]
      if (!item) return null

      return Number(item.Value) / Number(item.Nominal || 1)
    },
    getPreviousRateByCode: (state) => (code) => {
      if (!state.cbrRatesCache) return null
      if (code === 'RUB') return 1

      const item = state.cbrRatesCache.Valute?.[code]
      if (!item) return null

      return Number(item.Previous) / Number(item.Nominal || 1)
    }
  },
  actions: {
    async loadCbrRates() {
      this.currenciesStatus = 'Загрузка курсов...'
      this.currencyItems = []

      try {
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        if (!response.ok) {
          throw new Error(`CBR error ${response.status}`)
        }

        const data = await response.json()
        this.cbrRatesCache = data

        const valute = data.Valute || {}
        const wanted = [
          { code: 'USD', label: 'Доллар США' },
          { code: 'EUR', label: 'Евро' },
          { code: 'KZT', label: 'Казахстанский тенге' },
          { code: 'BYN', label: 'Белорусский рубль' }
        ]

        this.currencyItems = wanted
          .map((item) => {
            const raw = valute[item.code]
            return raw ? normalizeCurrencyItem(raw, item.label) : null
          })
          .filter(Boolean)

        this.currenciesStatus = this.currencyItems.length
          ? 'Курсы валют обновлены.'
          : 'Нет данных по валютам.'
      } catch (error) {
        console.error(error)
        this.currenciesStatus = 'Не удалось загрузить курсы валют.'
      }
    },
    async loadCryptoPrices() {
      this.cryptoStatus = 'Загрузка крипторынка...'
      this.cryptoItems = []

      try {
        const endpoint =
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,toncoin&vs_currencies=rub,usd&include_24hr_change=true'

        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error(`CoinGecko error ${response.status}`)
        }

        const data = await response.json()

        const coins = [
          { key: 'bitcoin', label: 'Bitcoin', ticker: 'BTC' },
          { key: 'ethereum', label: 'Ethereum', ticker: 'ETH' },
          { key: 'toncoin', label: 'Toncoin', ticker: 'TON' }
        ]

        this.cryptoItems = coins.map((coin) => {
          const item = data[coin.key] || {}
          const change = Number(item.rub_24h_change || 0)

          return {
            ...coin,
            rub: Number(item.rub || 0),
            usd: Number(item.usd || 0),
            change,
            changeLabel: formatPercentChange(change)
          }
        })

        this.cryptoStatus = 'Криптовалютные цены обновлены.'
      } catch (error) {
        console.error(error)
        this.cryptoStatus = 'Не удалось загрузить цены криптовалют.'
      }
    },
    async loadMoexMarket() {
      this.moexStatus = 'Загрузка данных MOEX...'
      this.moexItems = []

      try {
        const instruments = [
          { engine: 'stock', market: 'index', board: '', security: 'IMOEX' },
          { engine: 'stock', market: 'shares', board: 'TQBR', security: 'SBER' },
          { engine: 'stock', market: 'shares', board: 'TQBR', security: 'GAZP' },
          { engine: 'stock', market: 'shares', board: 'TQBR', security: 'LKOH' }
        ]

        const rows = await Promise.all(
          instruments.map(async ({ engine, market, board, security }) => {
            const boardPart = board ? `/boards/${board}` : ''
            const url = `https://iss.moex.com/iss/engines/${engine}/markets/${market}${boardPart}/securities/${security}.json?iss.meta=off&iss.only=securities,marketdata`

            const response = await fetch(url)
            if (!response.ok) {
              throw new Error(`MOEX error ${response.status}`)
            }

            const data = await response.json()

            const shortName =
              getMoexBlockValue(data.securities, 'SHORTNAME') ||
              getMoexBlockValue(data.securities, 'SECNAME') ||
              security

            const price =
              getMoexBlockValue(data.marketdata, 'LAST') ??
              getMoexBlockValue(data.marketdata, 'LCLOSEPRICE') ??
              getMoexBlockValue(data.marketdata, 'PREVPRICE') ??
              getMoexBlockValue(data.securities, 'PREVPRICE')

            const changePercent =
              getMoexBlockValue(data.marketdata, 'LASTCHANGEPRCNT') ??
              getMoexBlockValue(data.marketdata, 'CHANGEPRCNT') ??
              0

            return {
              security,
              shortName,
              price: Number(price || 0),
              changePercent: Number(changePercent || 0),
              changeLabel: formatPercentChange(changePercent || 0)
            }
          })
        )

        this.moexItems = rows
        this.moexStatus = 'Данные MOEX обновлены.'
      } catch (error) {
        console.error(error)
        this.moexStatus = 'Не удалось загрузить данные MOEX.'
      }
    },
    async refreshAll() {
      await Promise.allSettled([this.loadCbrRates(), this.loadCryptoPrices(), this.loadMoexMarket()])
    }
  },
  persist: false
})
