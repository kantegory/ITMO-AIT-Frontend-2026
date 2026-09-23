<script setup>
import { reactive, watch } from 'vue'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()

const transactionForm = reactive({
  date: new Date().toISOString().split('T')[0],
  category: '',
  accountId: '',
  amount: '',
  comment: ''
})

const ruleForm = reactive({
  largeExpenses: false,
  suspiciousTransactions: false,
  financialLiteracy: false,
  weeklySummary: true
})

function closeModal() {
  modalStore.close()
}

function syncRuleState() {
  const current = modalStore.payload.settings || {}
  ruleForm.largeExpenses = Boolean(current.largeExpenses)
  ruleForm.suspiciousTransactions = Boolean(current.suspiciousTransactions)
  ruleForm.financialLiteracy = Boolean(current.financialLiteracy)
  ruleForm.weeklySummary = current.weeklySummary !== false
}

function submitTransaction() {
  modalStore.payload.onSubmit?.({
    date: transactionForm.date,
    category: transactionForm.category,
    accountId: Number(transactionForm.accountId),
    amount: Number(transactionForm.amount),
    comment: transactionForm.comment
  })
  closeModal()
}

function submitRules() {
  modalStore.payload.onSubmit?.({
    largeExpenses: ruleForm.largeExpenses,
    suspiciousTransactions: ruleForm.suspiciousTransactions,
    financialLiteracy: ruleForm.financialLiteracy,
    weeklySummary: ruleForm.weeklySummary
  })
  closeModal()
}

watch(
  () => modalStore.visible,
  (value) => {
    if (value && modalStore.kind === 'rule') {
      syncRuleState()
    }
  }
)

watch(
  () => modalStore.kind,
  (value) => {
    if (value === 'rule') {
      syncRuleState()
    }
    if (value === 'transaction') {
      transactionForm.date = new Date().toISOString().split('T')[0]
      transactionForm.category = ''
      transactionForm.accountId = ''
      transactionForm.amount = ''
      transactionForm.comment = ''
    }
  }
)
</script>

<template>
  <template v-if="modalStore.visible">
    <div class="modal-backdrop fade show" />
    <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <template v-if="modalStore.kind === 'info'">
            <div class="modal-header">
              <h5 id="mbe-modal-title" class="modal-title">{{ modalStore.payload.title }}</h5>
              <button type="button" class="btn-close" aria-label="Закрыть" @click="closeModal" />
            </div>
            <div class="modal-body">
              <p id="mbe-modal-description">{{ modalStore.payload.message }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary fw-semibold" @click="closeModal">OK</button>
            </div>
          </template>

          <template v-else-if="modalStore.kind === 'transaction'">
            <div class="modal-header">
              <h5 class="modal-title">Добавить транзакцию</h5>
              <button type="button" class="btn-close" aria-label="Закрыть" @click="closeModal" />
            </div>
            <form @submit.prevent="submitTransaction">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="transaction-date" class="form-label">Дата</label>
                  <input id="transaction-date" v-model="transactionForm.date" type="date" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="transaction-category" class="form-label">Категория</label>
                  <select id="transaction-category" v-model="transactionForm.category" class="form-select" required>
                    <option value="">Выберите категорию</option>
                    <option v-for="category in modalStore.payload.categories || []" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="transaction-account" class="form-label">Счёт</label>
                  <select id="transaction-account" v-model="transactionForm.accountId" class="form-select" required>
                    <option value="">Выберите счёт</option>
                    <option v-for="account in modalStore.payload.accounts || []" :key="account.id" :value="account.id">
                      {{ account.name }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="transaction-amount" class="form-label">Сумма</label>
                  <input
                    id="transaction-amount"
                    v-model="transactionForm.amount"
                    type="number"
                    class="form-control"
                    step="0.01"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="transaction-comment" class="form-label">Комментарий</label>
                  <input id="transaction-comment" v-model="transactionForm.comment" type="text" class="form-control" />
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" @click="closeModal">Отмена</button>
                <button type="submit" class="btn btn-primary">Добавить</button>
              </div>
            </form>
          </template>

          <template v-else>
            <div class="modal-header">
              <h5 class="modal-title">Настройки уведомлений</h5>
              <button type="button" class="btn-close" aria-label="Закрыть" @click="closeModal" />
            </div>
            <form @submit.prevent="submitRules">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-check">
                      <input id="largeExpenses" v-model="ruleForm.largeExpenses" class="form-check-input" type="checkbox" />
                      <label class="form-check-label" for="largeExpenses">Уведомлять о больших расходах</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check">
                      <input
                        id="suspiciousTransactions"
                        v-model="ruleForm.suspiciousTransactions"
                        class="form-check-input"
                        type="checkbox"
                      />
                      <label class="form-check-label" for="suspiciousTransactions">Уведомлять о подозрительных транзакциях</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check">
                      <input
                        id="financialLiteracy"
                        v-model="ruleForm.financialLiteracy"
                        class="form-check-input"
                        type="checkbox"
                      />
                      <label class="form-check-label" for="financialLiteracy">Напоминать о финансовой грамотности</label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check">
                      <input id="weeklySummary" v-model="ruleForm.weeklySummary" class="form-check-input" type="checkbox" />
                      <label class="form-check-label" for="weeklySummary">Присылать еженедельную сводку</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" @click="closeModal">Отмена</button>
                <button type="submit" class="btn btn-primary">Сохранить</button>
              </div>
            </form>
          </template>
        </div>
      </div>
    </div>
  </template>
</template>
