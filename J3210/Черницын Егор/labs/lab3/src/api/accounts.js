import { api } from './http'

export async function getAccounts(userId) {
  const { data } = await api.get('/accounts', {
    params: {
      userId,
    },
  })

  return data
}

export async function createAccount(account) {
  const { data } = await api.post('/accounts', account)
  return data
}

export async function getAccount(accountId) {
  const { data } = await api.get(`/accounts/${accountId}`)
  return data
}

export async function patchAccount(accountId, payload) {
  const { data } = await api.patch(`/accounts/${accountId}`, payload)
  return data
}
