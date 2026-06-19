import { api } from './http'

export async function getUserById(userId) {
  const { data } = await api.get(`/users/${encodeURIComponent(String(userId))}`)
  return data
}

export async function getOrganizerUsers() {
  const { data } = await api.get('/users', {
    params: {
      accountType: 'organizer',
    },
  })

  return Array.isArray(data) ? data : []
}

export async function updateUser(user) {
  const payload = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    accountType: user.accountType,
    tickets: Array.isArray(user.tickets) ? user.tickets : [],
    refunds: Array.isArray(user.refunds) ? user.refunds : [],
    organizerEvents: Array.isArray(user.organizerEvents) ? user.organizerEvents : [],
  }

  const { data } = await api.patch(`/users/${encodeURIComponent(String(user.id))}`, payload)
  return data
}
