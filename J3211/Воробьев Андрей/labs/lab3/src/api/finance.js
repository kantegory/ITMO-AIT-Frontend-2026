import instance from '@/api/instance'

function getDefaultNotificationSettings() {
  return {
    largeExpenses: false,
    suspiciousTransactions: false,
    financialLiteracy: false,
    weeklySummary: true
  }
}

async function requestJson(path, options = {}) {
  const response = await instance.request({
    url: path,
    ...options
  })
  return response.data
}

export async function loginUser(email, password) {
  const users = await requestJson('/users', {
    params: { email, password }
  })

  if (!users.length) {
    throw new Error('Неверный email или пароль.')
  }

  return users[0]
}

export async function registerUser(email, password) {
  const existed = await requestJson('/users', {
    params: { email }
  })

  if (existed.length) {
    throw new Error('Пользователь с таким email уже существует.')
  }

  return requestJson('/users', {
    method: 'POST',
    data: { email, password, notificationSettings: getDefaultNotificationSettings() }
  })
}

export async function findUserByEmail(email) {
  const users = await requestJson('/users', {
    params: { email }
  })
  return users.length ? users[0] : null
}

export async function getAccountsByUser(userId) {
  return requestJson('/accounts', {
    params: { userId }
  })
}

export async function createAccount({ userId, accountName, type }) {
  const existed = await requestJson('/accounts', {
    params: {
      userId,
      name: accountName
    }
  })

  if (existed.length) {
    throw new Error('Счёт с таким названием уже существует.')
  }

  return requestJson('/accounts', {
    method: 'POST',
    data: {
      userId,
      name: accountName,
      type,
      balance: 0
    }
  })
}

export async function getTransactionsByUser(userId) {
  return requestJson('/transactions', {
    params: { userId }
  })
}

export async function getTransactionsByFilter(userId, filters) {
  const params = { userId }

  if (filters.period && filters.period !== 'Весь период') {
    params.period = filters.period
  }

  if (filters.category && filters.category !== 'Все категории') {
    params.category = filters.category
  }

  if (filters.account && filters.account !== 'Все счета') {
    const accounts = await getAccountsByUser(userId)
    const account = accounts.find((acc) => acc.name === filters.account)
    if (account) {
      params.accountId = account.id
    }
  }

  return requestJson('/transactions', { params })
}

export async function createTransaction({ userId, accountId, date, category, comment, amount }) {
  const dateObj = new Date(date)
  const period = dateObj.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
  const formattedPeriod = period.charAt(0).toUpperCase() + period.slice(1)

  return requestJson('/transactions', {
    method: 'POST',
    data: {
      userId,
      accountId,
      date,
      period: formattedPeriod,
      category,
      comment: comment || '',
      amount
    }
  })
}

export async function getCategories() {
  return requestJson('/categories')
}

export async function getUserNotificationSettings(userId) {
  const user = await requestJson(`/users/${userId}`)
  return user.notificationSettings
}

export async function updateUserNotificationSettings(userId, notificationSettings) {
  return requestJson(`/users/${userId}`, {
    method: 'PATCH',
    data: { notificationSettings }
  })
}
