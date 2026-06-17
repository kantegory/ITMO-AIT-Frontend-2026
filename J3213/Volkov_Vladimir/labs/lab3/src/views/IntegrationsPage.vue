<template>
  <BaseLayout>
    <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div>
        <h2 class="section-title mb-2">Интеграция с платёжными аккаунтами</h2>
        <p class="section-subtitle mb-0">
          Импорт операций и автоматическая обработка для подключённых источников данных.
        </p>
      </div>
      <button class="btn btn-primary rounded-pill px-4" type="button" @click="handleImport">
        Импортировать транзакции
      </button>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="rule-card d-flex flex-column h-100">
          <h3 class="h5 fw-bold">Банковская карта</h3>
          <p class="text-secondary mb-3">Источник операций для синхронизации расходов и поступлений.</p>
          <span class="badge text-bg-success rounded-pill mt-auto align-self-start">Подключено</span>
        </div>
      </div>
      <div class="col-md-4">
        <div class="rule-card d-flex flex-column h-100">
          <h3 class="h5 fw-bold">Платёжный аккаунт</h3>
          <p class="text-secondary mb-3">Можно загрузить демонстрационный набор операций в личный кабинет.</p>
          <span class="badge text-bg-primary rounded-pill mt-auto align-self-start">Готово к импорту</span>
        </div>
      </div>
      <div class="col-md-4">
        <div class="rule-card d-flex flex-column h-100">
          <h3 class="h5 fw-bold">Автоправила</h3>
          <p class="text-secondary mb-3">Правила помогают автоматически назначать категории и сценарии обработки.</p>
          <span class="badge text-bg-warning rounded-pill mt-auto align-self-start">Настраивается</span>
        </div>
      </div>
    </div>

    <div v-if="importStatus" class="page-card mb-4">
      <div class="forecast-pill">{{ importStatus }}</div>
    </div>

    <div class="row g-4">
      <div class="col-lg-5">
        <div class="page-card h-100">
          <h3 class="h5 fw-bold mb-3">Новое правило обработки</h3>
          <form @submit.prevent="submitRule">
            <div class="mb-3">
              <label class="form-label" for="ruleCondition">Если</label>
              <input
                id="ruleCondition"
                v-model.trim="newRule.condition"
                class="form-control rounded-4"
                type="text"
                placeholder="Например, описание содержит «market»"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label" for="ruleAction">Тогда</label>
              <input
                id="ruleAction"
                v-model.trim="newRule.action"
                class="form-control rounded-4"
                type="text"
                placeholder="Например, присвоить категорию «Продукты»"
                required
              />
            </div>
            <button class="btn btn-primary rounded-pill px-4" type="submit">Сохранить правило</button>
          </form>
        </div>
      </div>

      <div class="col-lg-7">
        <div class="page-card h-100">
          <h3 class="h5 fw-bold mb-3">Сохранённые правила обработки</h3>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <caption class="visually-hidden">Таблица правил обработки транзакций</caption>
              <thead>
                <tr>
                  <th scope="col">Условие</th>
                  <th scope="col">Что сделать</th>
                  <th scope="col">Источник</th>
                  <th scope="col">Статус</th>
                </tr>
              </thead>
              <tbody v-if="financeStore.rules.length">
                <tr v-for="rule in financeStore.rules" :key="rule.id">
                  <td>{{ rule.condition }}</td>
                  <td>{{ rule.action }}</td>
                  <td>{{ rule.source }}</td>
                  <td><span class="badge text-bg-success rounded-pill">{{ rule.status }}</span></td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="4" class="text-center text-secondary">Пока нет сохранённых правил обработки</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useFinanceStore } from '@/stores/finance'
import { useToast } from '@/composables/useToast'
import { useUserFinanceData } from '@/composables/useUserFinanceData'

const authStore = useAuthStore()
const financeStore = useFinanceStore()
const { showToast } = useToast()

const importStatus = ref('')

const newRule = reactive({
  condition: '',
  action: ''
})

async function handleImport() {
  try {
    const message = await financeStore.importTransactions(authStore.user.id)
    importStatus.value = message
    showToast('Импорт транзакций выполнен')
  } catch (error) {
    showToast(error.message || 'Ошибка импорта')
  }
}

async function submitRule() {
  try {
    await financeStore.createRule(
      {
        userId: authStore.user.id,
        condition: newRule.condition,
        action: newRule.action,
        source: 'Пользовательское',
        status: 'Активно'
      },
      authStore.user.id
    )

    newRule.condition = ''
    newRule.action = ''
    showToast('Правило добавлено')
  } catch (error) {
    showToast(error.message || 'Ошибка при добавлении правила')
  }
}

useUserFinanceData()
</script>
