import { emptyListOnForbidden } from '@/api/helpers'

class ResultsApi {
  constructor(instance) {
    this.API = instance
  }

  getMy = async (userId, orderId) => {
    return this.API({
      url: '/600/results',
      params: { userId, orderId },
    }).catch(emptyListOnForbidden)
  }

  create = async (data) => {
    return this.API({
      method: 'POST',
      url: '/600/results',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export default ResultsApi
