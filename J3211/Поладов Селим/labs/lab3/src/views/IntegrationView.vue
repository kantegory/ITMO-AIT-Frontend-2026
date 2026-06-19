<template>
  <AppLayout title="Интеграция с платёжными аккаунтами">
    <div v-if="toast" class="alert alert-success mb-3 py-2">Транзакция успешно добавлена</div>

    <div class="content-card mb-4">
      <h3 class="mb-3">Импорт транзакций</h3>
      <p class="text-muted small mb-3">Подключите банк или загрузите выписку, чтобы автоматически учитывать операции.</p>
      <div class="row g-3">
        <div class="col-md-4">
          <div class="integration-card h-100">
            <div class="mb-2">📄</div>
            <div class="fw-medium">Выгрузка из файла</div>
            <div class="small text-muted mb-2">CSV, Excel, QIF</div>
            <input id="importFile" type="file" class="form-control d-none" />
            <label for="importFile" class="btn btn-outline-secondary btn-sm">Выбрать файл</label>
          </div>
        </div>
        <div class="col-md-4">
          <div class="integration-card h-100">
            <div class="mb-2">🏦</div>
            <div class="fw-medium">Подключить банк</div>
            <div class="small text-muted mb-2">Сбер, Олег Т-Банк, ВТБ и др.</div>
            <button type="button" class="btn btn-primary btn-sm" @click="bankModal = true">Подключить</button>
          </div>
        </div>
        <div class="col-md-4">
          <div class="integration-card h-100">
            <div class="mb-2">📋</div>
            <div class="fw-medium">Ручной ввод</div>
            <div class="small text-muted mb-2">Добавить операцию вручную</div>
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="manualModal = true">Добавить</button>
          </div>
        </div>
      </div>
    </div>

    <div class="content-card mb-4">
      <h3 class="mb-3">Подключённые банки</h3>
      <BanksList :banks="banks" :loading="loadingBanks" @remove="removeBank" />
    </div>

    <div class="content-card">
      <h3 class="mb-3">Настройка правил</h3>
      <p class="text-muted small mb-3">Создайте правила для автоматической категоризации и учёта транзакций.</p>
      <RulesTable :rules="rules" :loading="loadingRules" @remove="removeRule" />
      <div class="mt-3">
        <button type="button" class="btn btn-primary" @click="ruleModal = true">+ Добавить правило</button>
      </div>
    </div>

    <BankConnectModal v-model="bankModal" @submit="connectBank" />
    <ManualTransactionModal v-model="manualModal" @submit="addTransaction" />
    <RuleModal v-model="ruleModal" @submit="addRule" />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import BanksList from '../components/BanksList.vue'
import RulesTable from '../components/RulesTable.vue'
import BankConnectModal from '../components/BankConnectModal.vue'
import ManualTransactionModal from '../components/ManualTransactionModal.vue'
import RuleModal from '../components/RuleModal.vue'
import { banksApi, rulesApi, transactionsApi } from '../api/resources.js'
import { useAuth } from '../composables/useAuth.js'

const { user } = useAuth()

const banks = ref([])
const loadingBanks = ref(true)
const rules = ref([])
const loadingRules = ref(true)

const bankModal = ref(false)
const manualModal = ref(false)
const ruleModal = ref(false)
const toast = ref(false)

async function loadBanks() {
  loadingBanks.value = true
  banks.value = await banksApi.list({ userId: user.value.id })
  loadingBanks.value = false
}

async function loadRules() {
  loadingRules.value = true
  rules.value = await rulesApi.list({ userId: user.value.id })
  loadingRules.value = false
}

async function connectBank(name) {
  await banksApi.create({ userId: user.value.id, name, connectedAt: new Date().toISOString() })
  loadBanks()
}

async function removeBank(id) {
  await banksApi.remove(id)
  loadBanks()
}

async function addRule(rule) {
  await rulesApi.create({ ...rule, userId: user.value.id, action: 'Присвоить категорию' })
  loadRules()
}

async function removeRule(id) {
  await rulesApi.remove(id)
  loadRules()
}

async function addTransaction(data) {
  const amount = data.category === 'Доход' ? Number(data.amount) : -Number(data.amount)
  await transactionsApi.create({
    userId: user.value.id,
    name: data.name,
    counterparty: data.counterparty || 'Ручной ввод',
    category: data.category,
    amount,
    date: new Date().toISOString(),
    accountId: 1
  })
  toast.value = true
  setTimeout(() => { toast.value = false }, 3000)
}

onMounted(() => {
  loadBanks()
  loadRules()
})
</script>
