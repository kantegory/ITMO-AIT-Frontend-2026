import { defineStore } from 'pinia'
import { financeApi } from '@/api'
import { sameUserId } from '@/utils'

function roundMoney(value) {
  return Number(Number(value || 0).toFixed(2))
}

function normalizeTransactionAmount(value) {
  return roundMoney(Math.abs(Number(value || 0)))
}

function normalizeTransaction(item) {
  return {
    ...item,
    amount: normalizeTransactionAmount(item.amount)
  }
}

function getSafeBalance(value) {
  return roundMoney(Math.max(0, Number(value || 0)))
}

function getTransactionsDelta(transactions) {
  return transactions.reduce((sum, item) => {
    const amount = normalizeTransactionAmount(item.amount)
    return item.type === 'income' ? sum + amount : sum - amount
  }, 0)
}

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    accounts: [],
    budgets: [],
    transactions: [],
    rules: [],
    loading: false
  }),
  getters: {
    mainAccount: (state) => state.accounts.find((item) => item.kind === 'main') || null,
    savingsAccount: (state) => state.accounts.find((item) => item.kind === 'savings') || null
  },
  actions: {
    async ensureUserFinancialData(userId) {
      const [allAccounts, allBudgets] = await Promise.all([
        financeApi.getAccounts(),
        financeApi.getBudgets()
      ])

      const userAccounts = allAccounts.filter((item) => sameUserId(item.userId, userId))
      const userBudgets = allBudgets.filter((item) => sameUserId(item.userId, userId))

      const hasMain = userAccounts.some((item) => item.kind === 'main')
      const hasSavings = userAccounts.some((item) => item.kind === 'savings')

      if (!hasMain) {
        await financeApi.createAccount({
          userId,
          kind: 'main',
          title: 'Основной счёт',
          balance: 15000,
          baseBalance: 15000,
          number: 'Карта • **** 4591'
        })
      }

      if (!hasSavings) {
        await financeApi.createAccount({
          userId,
          kind: 'savings',
          title: 'Сбережения',
          balance: 5000,
          baseBalance: 5000,
          number: 'Накопительный счёт'
        })
      }

      if (!userBudgets.length) {
        const defaultBudgets = [
          { userId, category: 'Продукты', spent: 18500, limit: 22000, color: 'bg-success' },
          { userId, category: 'Развлечения', spent: 9200, limit: 10000, color: 'bg-warning' },
          { userId, category: 'Транспорт', spent: 5800, limit: 8000, color: 'bg-primary' }
        ]

        await Promise.all(defaultBudgets.map((item) => financeApi.createBudget(item)))
      }
    },
    async syncAccountBalances(userAccounts, userTransactions) {
      let updated = false
      const userMainAccount = userAccounts.find((item) => item.kind === 'main')
      const userSavingsAccount = userAccounts.find((item) => item.kind === 'savings')

      if (userMainAccount) {
        const baseBalance = roundMoney(
          userMainAccount.baseBalance != null ? userMainAccount.baseBalance : userMainAccount.balance
        )
        const transactionDelta = roundMoney(getTransactionsDelta(userTransactions))
        const nextBalance = getSafeBalance(baseBalance + transactionDelta)

        const patch = {}

        if (userMainAccount.baseBalance == null) {
          patch.baseBalance = baseBalance
        }

        if (roundMoney(userMainAccount.balance) !== nextBalance) {
          patch.balance = nextBalance
        }

        if (Object.keys(patch).length) {
          await financeApi.patchAccount(userMainAccount.id, patch)
          updated = true
        }
      }

      if (userSavingsAccount && userSavingsAccount.baseBalance == null) {
        await financeApi.patchAccount(userSavingsAccount.id, {
          baseBalance: roundMoney(userSavingsAccount.balance)
        })
        updated = true
      }

      return updated
    },
    async loadAll(userId) {
      this.loading = true

      try {
        await this.ensureUserFinancialData(userId)

        let [allAccounts, allBudgets, allTransactions, allRules] = await Promise.all([
          financeApi.getAccounts(),
          financeApi.getBudgets(),
          financeApi.getTransactions(),
          financeApi.getRules()
        ])

        let userAccounts = allAccounts.filter((item) => sameUserId(item.userId, userId))
        const userBudgets = allBudgets.filter((item) => sameUserId(item.userId, userId))
        const userTransactions = allTransactions
          .filter((item) => sameUserId(item.userId, userId))
          .map((item) => normalizeTransaction(item))
          .sort((a, b) => b.date.localeCompare(a.date))
        const userRules = allRules.filter((item) => sameUserId(item.userId, userId))

        const balancesWereUpdated = await this.syncAccountBalances(userAccounts, userTransactions)

        if (balancesWereUpdated) {
          allAccounts = await financeApi.getAccounts()
          userAccounts = allAccounts.filter((item) => sameUserId(item.userId, userId))
        }

        this.accounts = userAccounts
        this.budgets = userBudgets
        this.transactions = userTransactions
        this.rules = userRules
      } finally {
        this.loading = false
      }
    },
    async patchAccountState(account, nextBalance) {
      const safeNextBalance = getSafeBalance(nextBalance)
      const currentBalance = getSafeBalance(account.balance)
      const baseBalance = roundMoney(account.baseBalance != null ? account.baseBalance : currentBalance)
      const delta = roundMoney(safeNextBalance - currentBalance)

      await financeApi.patchAccount(account.id, {
        balance: safeNextBalance,
        baseBalance: roundMoney(baseBalance + delta)
      })
    },
    async depositToMain(amount, userId) {
      if (!this.mainAccount) throw new Error('Основной счёт не найден')

      await this.patchAccountState(this.mainAccount, Number(this.mainAccount.balance) + amount)
      await this.loadAll(userId)
    },
    async moveToSavings(amount, userId) {
      if (!this.mainAccount || !this.savingsAccount) {
        throw new Error('Счета пользователя не найдены')
      }

      if (Number(this.mainAccount.balance) < amount) {
        throw new Error('Недостаточно средств на основном счёте')
      }

      await this.patchAccountState(this.mainAccount, Number(this.mainAccount.balance) - amount)
      await this.patchAccountState(this.savingsAccount, Number(this.savingsAccount.balance) + amount)

      await this.loadAll(userId)
    },
    async withdrawFromSavings(amount, userId) {
      if (!this.mainAccount || !this.savingsAccount) {
        throw new Error('Счета пользователя не найдены')
      }

      if (Number(this.savingsAccount.balance) < amount) {
        throw new Error('Недостаточно средств на счёте сбережений')
      }

      await this.patchAccountState(this.savingsAccount, Number(this.savingsAccount.balance) - amount)
      await this.patchAccountState(this.mainAccount, Number(this.mainAccount.balance) + amount)

      await this.loadAll(userId)
    },
    async createTransaction(data, userId) {
      const normalizedAmount = normalizeTransactionAmount(data.amount)

      if (!normalizedAmount) {
        throw new Error('Сумма должна быть больше нуля')
      }

      if (data.type === 'expense') {
        if (!this.mainAccount) throw new Error('Основной счёт не найден')

        const currentBalance = getSafeBalance(this.mainAccount.balance)

        if (normalizedAmount > currentBalance) {
          throw new Error('Недостаточно средств на основном счёте')
        }
      }

      await financeApi.createTransaction({
        ...data,
        amount: normalizedAmount
      })
      await this.loadAll(userId)
    },
    async deleteTransaction(transactionId, userId) {
      const targetTransaction = this.transactions.find((item) => String(item.id) === String(transactionId))

      if (targetTransaction?.type === 'income') {
        if (!this.mainAccount) throw new Error('Основной счёт не найден')

        const currentBalance = getSafeBalance(this.mainAccount.balance)
        const incomeAmount = normalizeTransactionAmount(targetTransaction.amount)

        if (incomeAmount > currentBalance) {
          throw new Error('Нельзя удалить этот доход: на счёте недостаточно средств')
        }
      }

      await financeApi.deleteTransaction(transactionId)
      await this.loadAll(userId)
    },
    async importTransactions(userId) {
      const importBatch = [
        {
          userId,
          date: '2026-03-11',
          category: 'Продукты',
          description: 'Market Import',
          type: 'expense',
          amount: 1210,
          source: 'integration',
          importSource: 'payment-account',
          imported: true
        },
        {
          userId,
          date: '2026-03-11',
          category: 'Транспорт',
          description: 'Metro Card',
          type: 'expense',
          amount: 240,
          source: 'integration',
          importSource: 'payment-account',
          imported: true
        }
      ]

      const importTotal = importBatch.reduce((sum, item) => sum + normalizeTransactionAmount(item.amount), 0)

      if (!this.mainAccount) throw new Error('Основной счёт не найден')
      if (importTotal > getSafeBalance(this.mainAccount.balance)) {
        throw new Error('Недостаточно средств на основном счёте для импорта операций')
      }

      await Promise.all(importBatch.map((item) => financeApi.createTransaction(item)))
      await this.loadAll(userId)
      return 'Импорт выполнен. Загружены демонстрационные транзакции из платёжного аккаунта.'
    },
    async createRule(data, userId) {
      await financeApi.createRule(data)
      await this.loadAll(userId)
    }
  }
})
