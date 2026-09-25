import instance from '@/api/instance'
import ModelsApi from '@/api/models'
import DatasetsApi from '@/api/datasets'
import UsersApi from '@/api/users'
import CommentsApi from '@/api/comments'

const modelsApi = new ModelsApi(instance)
const datasetsApi = new DatasetsApi(instance)
const usersApi = new UsersApi(instance)
const commentsApi = new CommentsApi(instance)

export { modelsApi, datasetsApi, usersApi, commentsApi }
