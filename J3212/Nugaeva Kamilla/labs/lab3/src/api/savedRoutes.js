class SavedRoutesApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/savedRoutes',
      method: 'GET',
    })
  }

  getByUserId = async (userId) => {
    return this.API({
      url: '/savedRoutes',
      method: 'GET',
      params: {
        userId,
      },
    })
  }

  create = async (data) => {
    return this.API({
      url: '/savedRoutes',
      method: 'POST',
      data,
    })
  }

  delete = async (routeId) => {
    return this.API({
      url: `/savedRoutes/${routeId}`,
      method: 'DELETE',
    })
  }

  clearByUserId = async (userId) => {
    const response = await this.getByUserId(userId)
    const routes = Array.isArray(response.data) ? response.data : []

    await Promise.all(routes.map((route) => this.delete(route.id)))
  }
}

export default SavedRoutesApi