<template>
  <BaseLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="dashboard-block">
            <h2 class="block-title">&gt; ТЕКУЩИЙ_БАЛАНС</h2>
            <div class="balance-value">
              <svg class="icon" style="font-size: 40px; margin-right: 10px; color: var(--border-color);">
                <use :href="'/sprite.svg#icon-money'"></use>
              </svg>
              <span>{{ financeStore.totalBalance.toFixed(2) }} RUB</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <div class="dashboard-block">
            <h2 class="block-title">&gt; МОИ_СЧЕТА</h2>
            <table class="terminal-table">
              <caption class="visually-hidden">Список ваших банковских счетов</caption>
              <thead>
              <tr>
                <th scope="col">НАЗВАНИЕ</th>
                <th scope="col">БАЛАНС</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="financeStore.accounts.length === 0">
                <td colspan="2" style="text-align:center;">[ СЧЕТА_НЕ_СОЗДАНЫ ]</td>
              </tr>
              <AccountRow
                  v-for="acc in financeStore.accounts"
                  :key="acc.id"
                  :name="acc.name"
                  :balance="acc.balance"
              />
              </tbody>
            </table>
            <button class="terminal-btn" @click="isAccModalOpen = true">[ + НОВЫЙ_СЧЁТ ]</button>
          </div>
        </div>

        <div class="col-md-8">
          <div class="dashboard-block">
            <h2 class="block-title">&gt; ПОСЛЕДНИЕ_ТРАНЗАКЦИИ</h2>
            <table class="terminal-table">
              <caption class="visually-hidden">Последние операции</caption>
              <thead>
              <tr>
                <th scope="col">ДАТА</th>
                <th scope="col">СЧЁТ</th>
                <th scope="col">ОПИСАНИЕ</th>
                <th scope="col">КАТЕГОРИЯ</th>
                <th scope="col">СУММА</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="financeStore.transactions.length === 0">
                <td colspan="5" style="text-align:center;">[ ОПЕРАЦИЙ_НЕТ ]</td>
              </tr>
              <TransactionRow
                  v-for="tx in recentTransactions"
                  :key="tx.id"
                  :tx="tx"
              />
              </tbody>
            </table>
            <button class="terminal-btn" @click="openTxModal">[ + ДОБАВИТЬ_ТРАНЗАКЦИЮ ]</button>
          </div>
        </div>
      </div>

      <div class="dashboard-block mt-3" v-if="rates">
        <h2 class="block-title">&gt; КУРСЫ_ВАЛЮТ</h2>
        <div class="row g-2 mb-2" v-if="rates.USD">
          <div class="col-12">
            <CurrencyCard
                code="USD"
                :name="rates.USD.Name"
                :value="rates.USD.Value"
            />
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div v-for="code in ['EUR', 'CNY', 'GBP']" :key="code" class="col-md-4">
            <CurrencyCard
                v-if="rates[code]"
                :code="code"
                :name="rates[code].Name"
                :value="rates[code].Value"
            />
          </div>
        </div>

        <div class="row g-2">
          <div v-for="code in ['TRY', 'KZT', 'BYN', 'AED']" :key="code" class="col-md-3">
            <CurrencyCard
                v-if="rates[code]"
                :code="code"
                :name="rates[code].Name"
                :value="rates[code].Value"
            />
          </div>
        </div>
      </div>

      <div class="modal-overlay" :class="{ 'active': isTxModalOpen }" role="dialog" aria-modal="true">
        <div class="terminal-box">
          <button class="close-btn" @click="isTxModalOpen = false" aria-label="Закрыть окно">[ X ]</button>
          <h2 class="terminal-title">[ НОВАЯ_ТРАНЗАКЦИЯ ]</h2>
          <form @submit.prevent="submitTxForm">
            <div class="tx-type-selector">
              <button type="button" class="tx-type-btn" :class="{ active: txForm.type === 'expense' }"
                      @click="txForm.type = 'expense'">РАСХОД
              </button>
              <button type="button" class="tx-type-btn" :class="{ active: txForm.type === 'income' }"
                      @click="txForm.type = 'income'">ДОХОД
              </button>
            </div>

            <div class="input-group">
              <label class="input-prefix" for="txAccount">&gt; СЧЁТ:</label>
              <select id="txAccount" v-model="txForm.account" class="terminal-input" required>
                <option v-for="acc in financeStore.accounts" :key="acc.id" :value="acc.name">{{ acc.name }}</option>
              </select>
            </div>

            <div class="input-group">
              <label class="input-prefix" for="txDesc">&gt; ОПИСАНИЕ:</label>
              <input type="text" id="txDesc" v-model="txForm.desc" @input="checkRules" class="terminal-input"
                     placeholder="ТАКСИ" autocomplete="off" required>
            </div>

            <div class="input-group">
              <label class="input-prefix" for="txDate">&gt; ДАТА:</label>
              <input type="date" id="txDate" v-model="txForm.date" class="terminal-input" :max="today" required>
            </div>

            <div class="input-group">
              <label class="input-prefix" for="txCategory">&gt; КАТЕГОРИЯ:</label>
              <select id="txCategory" v-model="txForm.category" class="terminal-input">
                <option value="РАЗНОЕ" selected>[ РАЗНОЕ ]</option>
                <option v-for="cat in financeStore.categories" :key="cat.id" :value="cat.name || cat">{{
                    cat.name || cat
                  }}
                </option>
              </select>
            </div>

            <div class="input-group">
              <label class="input-prefix" for="txSum">&gt; СУММА:</label>
              <input type="number" id="txSum" step="0.01" v-model="txForm.sum" class="terminal-input"
                     :class="txForm.type === 'income' ? 'input-income' : 'input-expense'" placeholder="0.00" required>
            </div>
            <button type="submit" class="terminal-btn">[ СОХРАНИТЬ_ТРАНЗАКЦИЮ ]</button>
          </form>
        </div>
      </div>

      <div class="modal-overlay" :class="{ 'active': isAccModalOpen }" role="dialog" aria-modal="true">
        <div class="terminal-box">
          <button class="close-btn" @click="isAccModalOpen = false" aria-label="Закрыть окно">[ X ]</button>
          <h2 class="terminal-title">[ РЕГИСТРАЦИЯ_СЧЁТА ]</h2>
          <form @submit.prevent="submitAccForm">
            <div class="input-group">
              <label class="input-prefix" for="newAccName">&gt; НАЗВАНИЕ:</label>
              <input type="text" id="newAccName" v-model="accForm.name" class="terminal-input" placeholder="КАРТА"
                     required>
            </div>
            <div class="input-group">
              <label class="input-prefix" for="newAccBalance">&gt; БАЛАНС:</label>
              <input type="number" id="newAccBalance" step="0.01" v-model="accForm.balance" class="terminal-input"
                     placeholder="0.00" required>
            </div>
            <button type="submit" class="terminal-btn">[ СОЗДАТЬ_СЧЁТ ]</button>
          </form>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>


<script setup>
import {ref, onMounted, computed} from 'vue'
import BaseLayout from '../layouts/BaseLayout.vue'
import {useFinanceStore} from '../stores/finance'
import {financeApi} from '../api'
import {useExchangeRates} from '../composables/useExchangeRates'
import {useAuth} from '../composables/useAuth'
import AccountRow from "@/components/AccountRow.vue";
import TransactionRow from "@/components/TransactionRow.vue";
import CurrencyCard from "@/components/CurrencyCard.vue";

const financeStore = useFinanceStore()

const {rates, fetchRates} = useExchangeRates()
const {userId} = useAuth()

const today = new Date().toISOString().split('T')[0]

onMounted(async () => {
  await financeStore.loadAllData(userId.value)
  await fetchRates()
})

const recentTransactions = computed(() => {
  return [...financeStore.transactions].reverse().slice(0, 5)
})

const isAccModalOpen = ref(false)
const accForm = ref({name: '', balance: ''})

const submitAccForm = async () => {
  const newAcc = {
    userId: Number(userId.value),
    name: accForm.value.name.trim().toUpperCase(),
    balance: parseFloat(accForm.value.balance) || 0
  }
  await financeApi.createAccount(newAcc)
  await financeStore.loadAllData(userId.value)
  isAccModalOpen.value = false
  accForm.value = {name: '', balance: ''}
}

const isTxModalOpen = ref(false)
const txForm = ref({
  type: 'expense',
  account: '',
  desc: '',
  date: '',
  category: 'РАЗНОЕ',
  sum: ''
})

const openTxModal = () => {
  if (financeStore.accounts.length === 0) {
    alert('ОШИБКА: СНАЧАЛА СОЗДАЙТЕ СЧЁТ!')
    return
  }
  txForm.value.date = ''
  txForm.value.account = financeStore.accounts[0].name
  isTxModalOpen.value = true
}

const checkRules = () => {
  const val = (txForm.value.desc || '').toUpperCase()
  const found = financeStore.rules.find(r => val.includes(r.triggerWord.toUpperCase()))
  if (found) {
    txForm.value.category = found.category
  }
}

const submitTxForm = async () => {
  if (txForm.value.date > today) {
    alert("ОШИБКА: НЕЛЬЗЯ ВЫБИРАТЬ БУДУЩУЮ ДАТУ!")
    return
  }

  const sum = parseFloat(txForm.value.sum)
  const targetAcc = financeStore.accounts.find(acc => acc.name === txForm.value.account)

  if (targetAcc && !isNaN(sum)) {
    const finalSum = (txForm.value.type === 'income') ? sum : -sum
    const newTx = {
      userId: Number(userId.value),
      account: txForm.value.account,
      date: txForm.value.date,
      desc: (txForm.value.desc || '').trim().toUpperCase() || '-',
      category: txForm.value.category,
      sum: finalSum
    }

    await financeApi.createTransaction(newTx)
    await financeApi.updateAccount(targetAcc.id, {balance: targetAcc.balance + finalSum})
    await financeStore.loadAllData(userId.value)

    isTxModalOpen.value = false
    txForm.value = {
      type: 'expense',
      account: financeStore.accounts[0].name,
      desc: '',
      date: '',
      category: 'РАЗНОЕ',
      sum: ''
    }
  }
}
</script>