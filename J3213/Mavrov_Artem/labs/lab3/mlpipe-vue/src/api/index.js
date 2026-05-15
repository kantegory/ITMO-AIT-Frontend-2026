import instance from '@/api/instance'
import AuthApi from '@/api/auth'
import ExperimentsApi from '@/api/experiments'
import ModelsApi from '@/api/models'
import ArtifactsApi from '@/api/artifacts'

const authApi        = new AuthApi(instance)
const experimentsApi = new ExperimentsApi(instance)
const modelsApi      = new ModelsApi(instance)
const artifactsApi   = new ArtifactsApi(instance)

export { authApi, experimentsApi, modelsApi, artifactsApi }
