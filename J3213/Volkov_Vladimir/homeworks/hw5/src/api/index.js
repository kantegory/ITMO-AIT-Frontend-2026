import instance from '@/api/instance'
import UsersApi from '@/api/users'
import FinanceApi from '@/api/finance'

export const usersApi = new UsersApi(instance)
export const financeApi = new FinanceApi(instance)
