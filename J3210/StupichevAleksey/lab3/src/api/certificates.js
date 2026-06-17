import instance from '@/api/instance'

class CertificatesApi {
  getByUser = async (userId) => {
    return instance.get('/certificates', {params: {userId}})
  }
}

export default new CertificatesApi()
