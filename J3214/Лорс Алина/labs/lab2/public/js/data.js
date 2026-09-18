window.TarelkaData = (() => {
  const currencySymbols = { EUR: '€', RUB: '₽' };
  const categories = {
    expense: ['Продукты', 'Транспорт', 'Кафе', 'Жильё', 'Подписки', 'Здоровье', 'Образование', 'Развлечения', 'Путешествия'],
    income: ['Зарплата', 'Фриланс', 'Кэшбек', 'Инвестиции', 'Подарок'],
    transfer: ['Перевод']
  };
  const accountTypes = { card: 'Банковская карта', savings: 'Накопительный счёт', cash: 'Наличные', investment: 'Инвестиционный счёт' };
  const integrationsCatalog = [
    { service: 'Т‑Банк', icon: 'credit-card-2-front', description: 'Импорт карт и выписок Т‑Банка' },
    { service: 'СПБ Банк', icon: 'bank', description: 'Синхронизация счетов и операций СПБ Банка' }
  ];

  function relativeDate(offsetDays = 0, start = '2026-03-10') {
    const date = new Date(`${start}T12:00:00`);
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().slice(0, 10);
  }

  function createDemoSeed(userId, currency = 'EUR', monthlyGoal = 30000) {
    const accounts = [
      { id: crypto.randomUUID(), userId, name: 'Основная карта', type: 'card', currency, initialBalance: 18500 },
      { id: crypto.randomUUID(), userId, name: 'Накопительный счёт', type: 'savings', currency, initialBalance: 42000 },
      { id: crypto.randomUUID(), userId, name: 'Наличные', type: 'cash', currency, initialBalance: 3200 },
      { id: crypto.randomUUID(), userId, name: 'Инвестиционный счёт', type: 'investment', currency, initialBalance: 26500 }
    ];

    const budgets = [
      { id: crypto.randomUUID(), userId, category: 'Продукты', limit: Math.round(monthlyGoal * 0.25), period: 'monthly' },
      { id: crypto.randomUUID(), userId, category: 'Транспорт', limit: Math.round(monthlyGoal * 0.12), period: 'monthly' },
      { id: crypto.randomUUID(), userId, category: 'Кафе', limit: Math.round(monthlyGoal * 0.1), period: 'monthly' },
      { id: crypto.randomUUID(), userId, category: 'Развлечения', limit: Math.round(monthlyGoal * 0.08), period: 'monthly' },
      { id: crypto.randomUUID(), userId, category: 'Жильё', limit: Math.round(monthlyGoal * 0.3), period: 'monthly' }
    ];

    const transactions = [
      { id: crypto.randomUUID(), userId, accountId: accounts[0].id, date: relativeDate(0), description: 'Зарплата за март', category: 'Зарплата', amount: 32000, type: 'income', status: 'completed' },
      { id: crypto.randomUUID(), userId, accountId: accounts[0].id, date: relativeDate(1), description: 'Покупка продуктов', category: 'Продукты', amount: 1250, type: 'expense', status: 'completed' },
      { id: crypto.randomUUID(), userId, accountId: accounts[0].id, date: relativeDate(2), description: 'Метро и автобус', category: 'Транспорт', amount: 390, type: 'expense', status: 'completed' },
      { id: crypto.randomUUID(), userId, accountId: accounts[1].id, date: relativeDate(3), description: 'Перевод в накопления', category: 'Перевод', amount: 2500, type: 'transfer_in', status: 'completed' }
    ];

    const integrations = integrationsCatalog.map((item, index) => ({
      id: crypto.randomUUID(), userId, service: item.service, icon: item.icon, description: item.description,
      connected: index < 2, tokenPreview: index < 2 ? '••••••demo' : '', lastSync: index < 2 ? `${relativeDate(-(index + 1))}T09:3${index}:00` : ''
    }));

    const importRules = [
      { id: crypto.randomUUID(), userId, conditionType: 'keyword', keyword: 'Uber', threshold: null, actionType: 'category', actionValue: 'Транспорт' },
      { id: crypto.randomUUID(), userId, conditionType: 'keyword', keyword: 'ATB', threshold: null, actionType: 'category', actionValue: 'Продукты' },
      { id: crypto.randomUUID(), userId, conditionType: 'amount', keyword: '', threshold: 10000, actionType: 'label', actionValue: 'Крупный расход' }
    ];

    const imports = [{ id: crypto.randomUUID(), userId, format: 'csv', importedCount: 4, sourceName: 'march_statement.csv', importedAt: `${relativeDate(3)}T11:24:00` }];

    return { accounts, budgets, transactions, integrations, importRules, imports };
  }

  const sampleImportCsv = `date,description,amount,type,category,status
2026-03-10,Salary payout,32000,income,Зарплата,completed
2026-03-11,Grocery store,1250,expense,Продукты,completed
2026-03-12,Metro top up,390,expense,Транспорт,completed
2026-03-13,Savings transfer,2500,transfer_in,Перевод,completed`;

  return { currencySymbols, categories, accountTypes, integrationsCatalog, sampleImportCsv, createDemoSeed };
})();
