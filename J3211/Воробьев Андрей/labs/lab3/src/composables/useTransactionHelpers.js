import { computed } from 'vue'

export function useAccountsById(accountsRef) {
  const accountsById = computed(() =>
    accountsRef.value.reduce((acc, account) => {
      acc[account.id] = account.name
      return acc
    }, {})
  )

  return { accountsById }
}

export function useSortedTransactions(transactionsRef) {
  const sortedTransactions = computed(() => transactionsRef.value.slice().sort((a, b) => new Date(b.date) - new Date(a.date)))

  return { sortedTransactions }
}
