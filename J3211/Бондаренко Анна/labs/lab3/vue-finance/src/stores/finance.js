import {defineStore} from 'pinia'
import {financeApi} from '../api'

export const useFinanceStore = defineStore('finance', {
    state: () => ({
        accounts: [],
        transactions: [],
        categories: [],
        rules: []
    }),
    getters: {
        totalBalance: (state) => {
            return state.accounts.reduce((sum, account) => sum + account.balance, 0)
        }
    },
    actions: {
        async loadAllData(userId) {
            if (!userId) return;
            try {
                const [accounts, transactions, categories, rules] = await Promise.all([
                    financeApi.getAccounts(userId),
                    financeApi.getTransactions(userId),
                    financeApi.getCategories(),
                    financeApi.getRules(userId)
                ]);
                this.accounts = accounts;
                this.transactions = transactions;
                this.categories = categories;
                this.rules = rules;
            } catch (error) {
                console.error("Ошибка загрузки:", error);
            }
        }
    }
})