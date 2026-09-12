import axios from 'axios'

const ratesInstance = axios.create({
  baseURL: 'https://open.er-api.com/v6',
})

class RatesApi {
  constructor(instance) {
    this.API = instance
  }

  getLatest = async (base) => {
    return this.API({
      url: `/latest/${base}`,
    })
  }
}

export { ratesInstance }

export default RatesApi
