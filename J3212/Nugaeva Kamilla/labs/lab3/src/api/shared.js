class SharedApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/sharedItems',
      method: 'GET',
      params: {
        _sort: 'id',
        _order: 'desc',
      },
    })
  }

  create = async (data) => {
    return this.API({
      url: '/sharedItems',
      method: 'POST',
      data,
    })
  }

  delete = async (itemId) => {
    return this.API({
      url: `/sharedItems/${itemId}`,
      method: 'DELETE',
    })
  }

  clearAll = async () => {
    const response = await this.getAll()
    const items = Array.isArray(response.data) ? response.data : []

    await Promise.all(items.map((item) => this.delete(item.id)))
  }
}

export default SharedApi