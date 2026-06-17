import { api } from './http'

function normalizeId(value) {
  if (value === null || value === undefined || value === '') {
    return value
  }

  return String(value).match(/^[0-9]+$/) ? Number(value) : value
}

function isFilled(value) {
  return value !== undefined && value !== null && String(value).trim() !== '' && value !== 'all'
}

function unwrapResponse(data) {
  if (Array.isArray(data)) {
    return data
  }

  return data.data || []
}

function uniqueById(items) {
  const map = new Map()

  items.forEach((item) => {
    map.set(String(item.id), item)
  })

  return [...map.values()]
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => {
    return new Date(b.date || 0) - new Date(a.date || 0)
  })
}

function buildBaseParams(userId, filters = {}) {
  const params = {
    userId: normalizeId(userId),
  }

  if (isFilled(filters.category)) {
    params.category = filters.category
  }

  if (isFilled(filters.accountId)) {
    params.accountId = normalizeId(filters.accountId)
  }

  if (isFilled(filters.dateFrom)) {
    params['date:gte'] = filters.dateFrom
  }

  if (isFilled(filters.dateTo)) {
    params['date:lte'] = filters.dateTo
  }

  if (filters.sort) {
    params._sort = filters.sort
  }

  return params
}

async function requestTransactions(params) {
  const { data } = await api.get('/transactions', {
    params,
  })

  return unwrapResponse(data)
}

export async function getTransactions(userId, filters = {}) {
  const baseParams = buildBaseParams(userId, filters)

  const search = isFilled(filters.search)
    ? String(filters.search).trim()
    : ''

  if (!search) {
    return requestTransactions(baseParams)
  }

  const [byDescription, byCategory] = await Promise.all([
    requestTransactions({
      ...baseParams,
      'description:contains': search,
    }),

    requestTransactions({
      ...baseParams,
      'category:contains': search,
    }),
  ])

  return sortByDateDesc(uniqueById([...byDescription, ...byCategory]))
}

export async function createTransaction(transaction) {
  const { data } = await api.post('/transactions', transaction)
  return data
}
