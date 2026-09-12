import instance from '@/api/instance'
import AuthApi from '@/api/auth'
import OrdersApi from '@/api/orders'
import AnnotationsApi from '@/api/annotations'
import ProfilesApi from '@/api/profiles'
import ProjectsApi from '@/api/projects'
import DatapointsApi from '@/api/datapoints'
import ResultsApi from '@/api/results'
import RatesApi, { ratesInstance } from '@/api/rates'

const authApi = new AuthApi(instance)
const ordersApi = new OrdersApi(instance)
const annotationsApi = new AnnotationsApi(instance)
const profilesApi = new ProfilesApi(instance)
const projectsApi = new ProjectsApi(instance)
const datapointsApi = new DatapointsApi(instance)
const resultsApi = new ResultsApi(instance)
const ratesApi = new RatesApi(ratesInstance)

export {
  authApi,
  ordersApi,
  annotationsApi,
  profilesApi,
  projectsApi,
  datapointsApi,
  resultsApi,
  ratesApi,
}
