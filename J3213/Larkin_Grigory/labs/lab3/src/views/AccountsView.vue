<script setup>
import { ref, onMounted } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'
import AccountCard from '../components/AccountCard.vue'
import { useAccounts } from '../composables/useAccounts'

const { accounts, loading, error, fetchAccounts, addAccount } = useAccounts()

const newName = ref('')
const newMask = ref('')
const newBalance = ref('')
const formError = ref('')
const saving = ref(false)

onMounted(fetchAccounts)

async function save() {
  formError.value = ''
  if (!newName.value || !newMask.value) {
    formError.value = 'Заполните название и последние 4 цифры'
    return
  }
  saving.value = true
  try {
    await addAccount(newName.value, newMask.value, newBalance.value)
    newName.value = ''
    newMask.value = ''
    newBalance.value = ''
    bootstrap.Modal.getInstance(document.getElementById('addAccountModal')).hide()
  } catch (e) {
    formError.value = e.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AppNavbar />
  <main class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h4 mb-0">Счета</h1>
      <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addAccountModal">
        + Добавить счёт
      </button>
    </div>

    <div v-if="loading" class="text-muted">Загрузка...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else>
      <div v-if="accounts.length === 0" class="text-muted">Счетов пока нет. Добавьте первый счёт.</div>
      <div v-else class="row g-3">
        <AccountCard v-for="a in accounts" :key="a.id" :account="a" />
      </div>
    </div>
  </main>

  <div class="modal fade" id="addAccountModal" tabindex="-1" aria-labelledby="addAccountModalLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addAccountModalLabel">Добавить счёт</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
          <div class="mb-3">
            <label class="form-label" for="acc-name">Название счёта</label>
            <input v-model="newName" type="text" class="form-control" id="acc-name" placeholder="Сбербанк — дебетовая">
          </div>
          <div class="mb-3">
            <label class="form-label" for="acc-mask">Последние 4 цифры</label>
            <input v-model="newMask" type="text" class="form-control" id="acc-mask" placeholder="1234" maxlength="4">
          </div>
          <div class="mb-3">
            <label class="form-label" for="acc-balance">Начальный баланс (₽)</label>
            <input v-model="newBalance" type="number" class="form-control" id="acc-balance" placeholder="0">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn btn-primary" :disabled="saving" @click="save">
            {{ saving ? 'Сохраняем...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
