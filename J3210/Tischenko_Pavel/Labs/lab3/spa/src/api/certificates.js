class CertificatesApi {
  constructor(instance) {
    this.API = instance
  }

  listByUserId = async (userId) => {
    return this.API({
      url: '/certificates',
      method: 'GET',
      params: { userId }
    })
  }

  getOne = async (id) => {
    return this.API({
      url: `/certificates/${encodeURIComponent(id)}`,
      method: 'GET'
    })
  }

  create = async (payload) => {
    return this.API({
      url: '/certificates',
      method: 'POST',
      data: payload
    })
  }
}

export default CertificatesApi
