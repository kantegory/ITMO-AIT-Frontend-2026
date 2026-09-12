import { emptyListOnForbidden } from '@/api/helpers'

class ProjectsApi {
  constructor(instance) {
    this.API = instance
  }

  getMy = async (userId) => {
    return this.API({
      url: '/600/projects',
      params: { userId, _expand: 'order' },
    }).catch(emptyListOnForbidden)
  }

  getMyById = async (userId, id) => {
    return this.API({
      url: '/600/projects',
      params: { userId, id, _expand: 'order' },
    }).catch(emptyListOnForbidden)
  }
}

export default ProjectsApi
