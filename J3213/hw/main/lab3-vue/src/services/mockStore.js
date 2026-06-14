const STORAGE_KEY = 'finance-manager-vue-demo-data'

const demoData = {
  users: [
    { id: 1, name: 'Demo User', email: 'demo@finance.local', password: 'demo123', currency: 'RUB' },
  ],
  accounts: [
    { id: 1, userId: 1, name: 'Основной счёт', type: 'Дебетовая карта', balance: 92140.34, currency: 'RUB' },
    { id: 2, userId: 1, name: 'Накопления', type: 'Сберегательный счёт', balance: 180500.00, currency: 'RUB' },
    { id: 3, userId: 1, name: 'Наличные', type: 'Кошелёк', balance: 5600.00, currency: 'RUB' },
  ],
  budgets: [
    { id: 1, userId: 1, category: 'Продукты', limit: 25000, spent: 18340 },
    { id: 2, userId: 1, category: 'Транспорт', limit: 7000, spent: 4120 },
    { id: 3, userId: 1, category: 'Развлечения', limit: 12000, spent: 9650 },
    { id: 4, userId: 1, category: 'Коммунальные', limit: 9000, spent: 7640 },
  ],
  transactions: [
    { id: 1, userId: 1, date: '2026-03-01', description: 'Зарплата за февраль', category: 'Доход', account: 'Основной счёт', type: 'income', amount: 120000 },
    { id: 2, userId: 1, date: '2026-03-02', description: 'Супермаркет', category: 'Продукты', account: 'Основной счёт', type: 'expense', amount: 3450.60 },
    { id: 3, userId: 1, date: '2026-03-03', description: 'Метро и автобус', category: 'Транспорт', account: 'Основной счёт', type: 'expense', amount: 280 },
    { id: 4, userId: 1, date: '2026-03-04', description: 'Кафе с друзьями', category: 'Развлечения', account: 'Основной счёт', type: 'expense', amount: 1760 },
    { id: 5, userId: 1, date: '2026-03-05', description: 'Коммунальные услуги', category: 'Коммунальные', account: 'Основной счёт', type: 'expense', amount: 5200 },
    { id: 6, userId: 1, date: '2026-03-06', description: 'Фриланс проект', category: 'Доход', account: 'Основной счёт', type: 'income', amount: 15000 },
    { id: 7, userId: 1, date: '2026-03-07', description: 'Кино и кофе', category: 'Развлечения', account: 'Основной счёт', type: 'expense', amount: 1240 },
    { id: 8, userId: 1, date: '2026-03-08', description: 'Аптека', category: 'Здоровье', account: 'Основной счёт', type: 'expense', amount: 890 },
    { id: 9, userId: 1, date: '2026-03-09', description: 'Перевод в накопления', category: 'Сбережения', account: 'Накопления', type: 'expense', amount: 10000 },
    { id: 10, userId: 1, date: '2026-03-10', description: 'Пополнение наличных', category: 'Наличные', account: 'Наличные', type: 'income', amount: 2000 },
    { id: 11, userId: 1, date: '2026-03-12', description: 'Супермаркет', category: 'Продукты', account: 'Основной счёт', type: 'expense', amount: 5210.15 },
    { id: 12, userId: 1, date: '2026-03-14', description: 'Такси', category: 'Транспорт', account: 'Основной счёт', type: 'expense', amount: 780 },
  ],
}

function getStore() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData))
    return structuredClone(demoData)
  }

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData))
    return structuredClone(demoData)
  }
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export async function fallbackGet(resource) {
  return getStore()[resource] ?? []
}

export async function fallbackPost(resource, payload) {
  const store = getStore()
  const collection = store[resource] || []
  const nextId = collection.length ? Math.max(...collection.map((item) => Number(item.id))) + 1 : 1
  const record = { id: nextId, ...payload }
  collection.push(record)
  store[resource] = collection
  saveStore(store)
  return record
}

export async function seedUserData(user) {
  const accounts = [
    { userId: user.id, name: 'Основной счёт', type: 'Дебетовая карта', balance: 50000, currency: user.currency || 'RUB' },
    { userId: user.id, name: 'Накопления', type: 'Сберегательный счёт', balance: 15000, currency: user.currency || 'RUB' },
  ]

  const budgets = [
    { userId: user.id, category: 'Продукты', limit: 15000, spent: 0 },
    { userId: user.id, category: 'Транспорт', limit: 5000, spent: 0 },
    { userId: user.id, category: 'Развлечения', limit: 8000, spent: 0 },
  ]

  for (const account of accounts) {
    await fallbackPost('accounts', account)
  }

  for (const budget of budgets) {
    await fallbackPost('budgets', budget)
  }
}
