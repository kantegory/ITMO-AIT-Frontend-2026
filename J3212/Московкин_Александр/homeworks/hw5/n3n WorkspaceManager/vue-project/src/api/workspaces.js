import api from './instance'

class WorkspacesApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async (params = {}) => {
    return this.API({
      method: 'GET',
      url: '/workspaces',
      params
    })
  }

  getById = async (id) => {
    return this.API({
      method: 'GET',
      url: `/workspaces/${id}`
    })
  }

  createWorkspace = async (data) => {
    return this.API({
      method: 'POST',
      url: '/workspaces',
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  updateWorkspace = async (id, data) => {
    return this.API({
      method: 'PATCH',
      url: `/workspaces/${id}`,
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteWorkspace = async (id) => {
    return this.API({
      method: 'DELETE',
      url: `/workspaces/${id}`
    })
  }
}

export default new WorkspacesApi(api)