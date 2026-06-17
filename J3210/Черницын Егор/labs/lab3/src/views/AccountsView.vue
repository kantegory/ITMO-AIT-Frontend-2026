<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Modal } from 'bootstrap'

import AppHeader from '@/components/AppHeader.vue'
import AccountCard from '@/components/AccountCard.vue'

import { createAccount, getAccounts, patchAccount } from '@/api/accounts'
import { createTransaction, getTransactions } from '@/api/transactions'
import { normalizeId, useAuth } from '@/composables/useAuth'

const { userId } = useAuth()

const accounts = ref([])
const transactions = ref([])

const accountForm = reactive({
  name: '',
  type: 'Дебетовая карта',
  balance: '',
  currency: '₽ RUB',
})

const transactionForm = reactive({
  description: '',
  category: '',
  date: '',
  accountId: '',
  type: 'expense',
  amount: '',
})

const categories = computed(() => {
  return [...new Set(transactions.value.map((transaction) => transaction.category))].filter(Boolean)
})

async function loadAccounts() {
  try {
    const [loadedAccounts, loadedTransactions] = await Promise.all([
      getAccounts(userId.value),
      getTransactions(userId.value),
    ])

    accounts.value = loadedAccounts
    transactions.value = loadedTransactions
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}

function resetAccountForm() {
  accountForm.name = ''
  accountForm.type = 'Дебетовая карта'
  accountForm.balance = ''
  accountForm.currency = '₽ RUB'
}

function resetTransactionForm() {
  transactionForm.description = ''
  transactionForm.category = ''
  transactionForm.date = ''
  transactionForm.accountId = ''
  transactionForm.type = 'expense'
  transactionForm.amount = ''
}

async function saveAccount() {
  const newAccount = {
    userId: normalizeId(userId.value),
    name: accountForm.name,
    balance: Number(accountForm.balance),
    currency: accountForm.currency.split(' ')[0],
  }

  try {
    await createAccount(newAccount)

    const modalElement = document.getElementById('addAccountModal')
    const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement)

    modalInstance.hide()
    resetAccountForm()
    await loadAccounts()
  } catch (error) {
    console.error('Ошибка:', error)
  }
}

function openTransactionModal(accountId) {
  resetTransactionForm()

  transactionForm.accountId = accountId
  transactionForm.date = new Date().toISOString().slice(0, 10)

  const modalElement = document.getElementById('addTransactionModal')
  const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement)

  modalInstance.show()
}

async function saveTransaction() {
  const account = accounts.value.find((item) => String(item.id) === String(transactionForm.accountId))

  if (!account) {
    alert('Счёт не найден.')
    return
  }

  const amount = Number(transactionForm.amount)

  const newTransaction = {
    userId: normalizeId(userId.value),
    accountId: normalizeId(transactionForm.accountId),
    type: transactionForm.type,
    amount,
    currency: account.currency,
    category: transactionForm.category,
    description: transactionForm.description,
    date: transactionForm.date,
  }

  try {
    await createTransaction(newTransaction)

    const newBalance =
      transactionForm.type === 'expense'
        ? Number(account.balance) - amount
        : Number(account.balance) + amount

    await patchAccount(account.id, {
      balance: newBalance,
    })

    const modalElement = document.getElementById('addTransactionModal')
    const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement)

    modalInstance.hide()
    resetTransactionForm()
    await loadAccounts()
  } catch (error) {
    console.error('Ошибка:', error)
    alert('Ошибка при сохранении транзакции.')
  }
}

onMounted(() => {
  document.body.className = ''
  loadAccounts()
})
</script>

<template>
  <AppHeader active="accounts" nav-class="navbar navbar-expand-lg shadow-sm" />

  <main>
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Мои счета</h3>

        <button
          id="saveAccountBtn"
          class="btn btn-custom rounded-pill px-4"
          data-bs-toggle="modal"
          data-bs-target="#addAccountModal"
        >
          + Добавить счёт
        </button>
      </div>

      <div id="accountsContainer" class="row g-4">
        <AccountCard
          v-for="(account, index) in accounts"
          :key="account.id"
          :account="account"
          :index="index"
          @add-transaction="openTransactionModal"
        />
      </div>
    </div>
  </main>

  <div id="addAccountModal" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow-lg">
        <div class="modal-header border-bottom-0 pb-0 pt-4 px-4">
          <h5 class="modal-title fw-bold">Новый счет</h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>

        <div class="modal-body p-4">
          <form id="addAccountForm" @submit.prevent="saveAccount">
            <div class="mb-3">
              <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                Название
              </label>

              <input
                id="newAccName"
                v-model="accountForm.name"
                type="text"
                class="form-control border-0"
                placeholder="Например: Заначка"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                Тип счета
              </label>

              <select id="newAccType" v-model="accountForm.type" class="form-select border-0">
                <option>Дебетовая карта</option>
                <option>Кредитная карта</option>
                <option>Накопительный счет</option>
                <option>Наличные</option>
              </select>
            </div>

            <div class="row g-2 mb-4">
              <div class="col-8">
                <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                  Начальный баланс
                </label>

                <input
                  id="newAccBalance"
                  v-model="accountForm.balance"
                  type="number"
                  class="form-control form-control-lg border-0"
                  placeholder="0.00"
                  required
                />
              </div>

              <div class="col-4">
                <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                  Валюта
                </label>

                <select id="newAccCurr" v-model="accountForm.currency" class="form-select border-0">
                  <option>₽ RUB</option>
                  <option>$ USD</option>
                  <option>€ EUR</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn btn-custom w-100 py-3 mb-3">
              Сохранить счет
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div id="addTransactionModal" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow-lg">
        <div class="modal-header border-bottom-0 pb-0 pt-4 px-4">
          <h5 class="modal-title fw-bold ">Новая транзакция</h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>

        <div class="modal-body p-4">
          <form id="addTransactionForm" @submit.prevent="saveTransaction">
            <div class="mb-3">
              <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                Описание
              </label>

              <input
                id="newTransDesc"
                v-model="transactionForm.description"
                type="text"
                class="form-control border-0"
                placeholder="Например: поход в вольчек"
                required
              />
            </div>

            <div class="row g-2 mb-3">
              <div class="col-6">
                <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                  Категория
                </label>

                <input
                  id="newTransCategory"
                  v-model="transactionForm.category"
                  type="text"
                  list="categoryList"
                  class="form-control border-0"
                  placeholder="Выберите или введите..."
                  autocomplete="off"
                  required
                />

                <datalist id="categoryList">
                  <option v-for="category in categories" :key="category" :value="category"></option>
                </datalist>
              </div>

              <div class="col-6">
                <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                  Дата
                </label>

                <input
                  id="newTransDate"
                  v-model="transactionForm.date"
                  type="date"
                  class="form-control border-0"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                Счёт
              </label>

              <select
                id="newTransAccount"
                v-model="transactionForm.accountId"
                class="form-select border-0"
                required
              >
                <option v-for="account in accounts" :key="account.id" :value="account.id">
                  {{ account.name }} ({{ account.balance }} ₽)
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                Операция
              </label>

              <select
                id="newTransType"
                v-model="transactionForm.type"
                class="form-select border-0"
                required
              >
                <option value="expense">Расход</option>
                <option value="income">Доход</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="form-label text-muted small fw-bold text-uppercase mb-1 letter-spacing-1">
                Сумма (₽)
              </label>

              <input
                id="newTransAmount"
                v-model="transactionForm.amount"
                type="number"
                class="form-control form-control-lg border-0"
                placeholder="0.00"
                required
              />
            </div>

            <button type="submit" class="btn btn-custom w-100 py-3 rounded-pill fw-bold">
              Сохранить транзакцию
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
