class PlacesApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/places',
      method: 'GET',
      params: {
        _sort: 'title',
        _order: 'asc',
      },
    })
  }

  getByKey = async (placeKey) => {
    const response = await this.API({
      url: '/places',
      method: 'GET',
      params: {
        key: placeKey,
      },
    })

    const place = Array.isArray(response.data) ? response.data[0] : null

    return {
      data: place || null,
    }
  }

  getFiltered = async (filters) => {
    const params = {
      _sort: 'title',
      _order: 'asc',
    }

    if (filters.type && filters.type !== 'all') {
      params.type = filters.type
    }

    if (filters.budget) {
      params.budget_lte = Number(filters.budget)
    }

    if (filters.days === '1-3') {
      params.days_gte = 1
      params.days_lte = 3
    }

    if (filters.days === '4-7') {
      params.days_gte = 4
      params.days_lte = 7
    }

    if (filters.days === '8+') {
      params.days_gte = 8
    }

    return this.API({
      url: '/places',
      method: 'GET',
      params,
    })
  }
}

export default PlacesApi