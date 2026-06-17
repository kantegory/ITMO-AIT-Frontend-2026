import { cbrApi } from './http'

export async function getDailyRates() {
  const { data } = await cbrApi.get('/daily_json.js')

  return {
    USD: data.Valute.USD,
    EUR: data.Valute.EUR,
  }
}
