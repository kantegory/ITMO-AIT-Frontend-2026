class PlacesApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/places',
      method: 'GET',
    })
  }

  getByKey = async (placeKey) => {
    const response = await this.API({
      url: '/places',
      method: 'GET',
    })

    const place = Array.isArray(response.data)
      ? response.data.find((item) => item.key === placeKey)
      : null

    return { data: place }
  }
}

export default PlacesApi
