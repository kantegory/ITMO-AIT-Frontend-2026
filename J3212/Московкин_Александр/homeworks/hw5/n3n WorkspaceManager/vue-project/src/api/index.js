import instance from './instance'
import WorkspacesApi from './workspaces'

const workspacesApi = new WorkspacesApi(instance)

export { workspacesApi }