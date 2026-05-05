<script setup>
import { reactive } from 'vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { createAccount } from '@/api/finance'
import { useModalFeedback } from '@/composables/useModalFeedback'

const authStore = useAuthStore()
const { showError, showInfo } = useModalFeedback()

const manualForm = reactive({
  accountName: ''
})

const apiForm = reactive({
  accountName: '',
  apiKey: ''
})

async function submitManualAccount() {
  try {
    await createAccount({
      userId: authStore.user.id,
      accountName: manualForm.accountName,
      type: 'manual'
    })
    showInfo('Уведомление', `Счёт ${manualForm.accountName} создан.`)
    manualForm.accountName = ''
  } catch (error) {
    showError(error)
  }
}

async function submitApiAccount() {
  try {
    await createAccount({
      userId: authStore.user.id,
      accountName: apiForm.accountName,
      type: 'api'
    })
    showInfo('Уведомление', `Счёт ${apiForm.accountName} подключен по API.`)
    apiForm.accountName = ''
    apiForm.apiKey = ''
  } catch (error) {
    showError(error)
  }
}
</script>

<template>
  <BaseLayout>
    <main class="container mt-4">
      <div class="text-center mb-5">
        <h1 class="fw-bold">Подключение нового счёта</h1>
        <p class="text-muted">Выберите способ учета</p>
      </div>

      <div class="row g-4">
        <div class="col-12 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 id="manual-account-form-title" class="card-title text-center mb-4">Ручной учёт</h2>
              <p class="text-muted text-center">Вы сами заносите все операции.</p>
              <form aria-labelledby="manual-account-form-title" @submit.prevent="submitManualAccount">
                <div class="mb-3">
                  <label for="manualAccountName" class="form-label">Название счёта</label>
                  <input
                    id="manualAccountName"
                    v-model="manualForm.accountName"
                    type="text"
                    class="form-control"
                    autocomplete="organization"
                    required
                  />
                </div>
                <div class="d-grid mt-4">
                  <button type="submit" class="btn btn-primary btn-custom">Создать счёт</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 id="api-account-form-title" class="card-title text-center mb-4">Автоматизация</h2>
              <p class="text-muted text-center">Безопасный импорт транзакций из вашего банка.</p>
              <form aria-labelledby="api-account-form-title" @submit.prevent="submitApiAccount">
                <div class="mb-3">
                  <label for="apiAccountName" class="form-label">Название счёта</label>
                  <input
                    id="apiAccountName"
                    v-model="apiForm.accountName"
                    type="text"
                    class="form-control"
                    autocomplete="organization"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="apiKey" class="form-label">API ключ</label>
                  <input id="apiKey" v-model="apiForm.apiKey" type="password" class="form-control" autocomplete="off" required />
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary btn-custom">Подключить по API</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  </BaseLayout>
</template>
