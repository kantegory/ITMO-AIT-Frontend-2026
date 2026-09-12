import { emptyListOnForbidden } from '@/api/helpers'

class AnnotationsApi {
  constructor(instance) {
    this.API = instance
  }

  getMy = async (userId, params = {}) => {
    return this.API({
      url: '/600/annotations',
      params: { userId, _expand: 'order', ...params },
    }).catch(emptyListOnForbidden)
  }

  create = async (data) => {
    return this.API({
      method: 'POST',
      url: '/600/annotations',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export default AnnotationsApi
