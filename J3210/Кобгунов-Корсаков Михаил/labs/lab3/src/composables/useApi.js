import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

export function useApi() {
  async function getCurrencyRates() {
    const response = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
    return response.data;
  }

  return {
    api,
    getCurrencyRates
  };
}
