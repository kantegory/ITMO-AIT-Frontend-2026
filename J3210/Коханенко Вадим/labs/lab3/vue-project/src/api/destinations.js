class DestinationsApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({ url: '/destinations' })
  }

  getOne = async (id) => {
    return this.API({ url: `/destinations/${id}` })
  }
}

export default DestinationsApi