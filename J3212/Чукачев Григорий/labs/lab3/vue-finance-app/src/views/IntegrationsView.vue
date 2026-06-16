<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const banks = ref([])
const loadingBanks = ref(true)

const rules = ref([])
const loadingRules = ref(true)

const ruleKeyword = ref('')
const ruleCategory = ref('Выберите категорию...')

const notifyEmail = ref(true)
const notifyPush = ref(true)
const showSaveStatus = ref(false)

const loadBanks = async () => {
  await new Promise(resolve => setTimeout(resolve, 600))
  banks.value = [
    { id: 1, name: "СберБанк", domain: "sberbank.ru", status: "available", info: "Не подключен" },
    { id: 2, name: "Т-Банк", domain: "tbank.ru", status: "available", info: "Не подключен" },
    { id: 3, name: "ВТБ", domain: "vtb.ru", status: "available", info: "Не подключен" },
    { id: 4, name: "Альфа-Банк", domain: "alfabank.ru", status: "available", info: "Не подключен" },
    { id: 5, name: "Газпромбанк", domain: "gazprombank.ru", status: "available", info: "Не подключен" }
  ]
  loadingBanks.value = false
}

const toggleBank = (bank) => {
  if (bank.status === 'connected') {
    bank.status = 'available'
    bank.info = 'Не подключен'
  } else {
    bank.status = 'connected'
    bank.info = 'Подключен'
  }
}

const loadRules = async () => {
  try {
    const response = await axios.get('http://localhost:3000/rules')
    rules.value = response.data
  } catch (error) {
    console.error("Ошибка загрузки правил:", error)
  } finally {
    loadingRules.value = false
  }
}

const saveRule = async () => {
  if (!ruleKeyword.value || ruleCategory.value === "Выберите категорию...") {
    alert("Заполните все поля!")
    return
  }

  const newRule = { keyword: ruleKeyword.value, category: ruleCategory.value }

  try {
    const response = await axios.post('http://localhost:3000/rules', newRule)
    if (response.status === 201 || response.status === 200) {
      ruleKeyword.value = ''
      ruleCategory.value = 'Выберите категорию...'
      loadRules()
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteRule = async (id) => {
  if (confirm("Точно удалить это правило автоматизации?")) {
    try {
      await axios.delete(`http://localhost:3000/rules/${id}`)
      loadRules()
    } catch (error) {
      console.error(error)
    }
  }
}

const triggerSaveStatus = () => {
  showSaveStatus.value = true
  setTimeout(() => {
    showSaveStatus.value = false
  }, 1500)
}

watch(notifyEmail, (newValue) => {
  localStorage.setItem('notifyEmail', newValue)
  triggerSaveStatus()
})

watch(notifyPush, (newValue) => {
  localStorage.setItem('notifyPush', newValue)
  triggerSaveStatus()
})

onMounted(() => {
  const savedEmail = localStorage.getItem("notifyEmail")
  const savedPush = localStorage.getItem("notifyPush")

  if (savedEmail !== null) notifyEmail.value = savedEmail === "true"
  if (savedPush !== null) notifyPush.value = savedPush === "true"

  loadBanks()
  loadRules()
})
</script>

<template>
  <main class="container mt-4">
    <h1 class="mb-4 text-success fw-bold h2"><i class="bi bi-plug me-2"></i> Интеграции и настройки</h1>

    <div class="row">
      <div class="col-md-6">
        <section class="card shadow-sm mb-4" style="border-radius: 15px;">
          <div class="card-body">
            <h2 class="card-title mb-4 h5"><i class="bi bi-bank me-2"></i> Подключенные банки</h2>

            <div>
              <div v-if="loadingBanks" class="text-center text-muted py-3">
                <div class="spinner-border spinner-border-sm text-success" role="status"></div> Загрузка списка банков...
              </div>
              <div v-else v-for="bank in banks" :key="bank.id" class="d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm" style="transition: 0.2s;">
                <div class="d-flex align-items-center">
                  <img :src="`https://www.google.com/s2/favicons?domain=${bank.domain}&sz=64`" :alt="bank.name" width="40" height="40" class="rounded-circle me-3 border">
                  <div>
                    <h6 class="mb-0 fw-bold">{{ bank.name }}</h6>
                    <small class="text-muted">{{ bank.info }}</small>
                  </div>
                </div>
                <button
                  class="btn btn-sm"
                  :class="bank.status === 'connected' ? 'btn-outline-danger' : 'btn-success'"
                  @click="toggleBank(bank)"
                >
                  {{ bank.status === 'connected' ? 'Отключить' : 'Подключить' }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="card shadow-sm mb-4" style="border-radius: 15px;">
          <div class="card-body">
            <h2 class="card-title mb-3 h5"><i class="bi bi-file-earmark-arrow-up me-2"></i> Ручной импорт выписки</h2>
            <p class="small text-muted">Загрузите файл в формате .CSV или .XLSX, скачанный из вашего онлайн-банка.</p>

            <div class="mb-3">
              <input class="form-control" type="file">
            </div>
            <button class="btn btn-success w-100"><i class="bi bi-upload me-1"></i> Загрузить и распознать</button>
          </div>
        </section>
      </div>

      <div class="col-md-6">
        <section class="card shadow-sm mb-4" style="border-radius: 15px;">
          <div class="card-body">
            <h2 class="card-title mb-3 h5"><i class="bi bi-robot me-2"></i> Правила автоматизации</h2>
            <p class="small text-muted">Система будет автоматически распределять транзакции по категориям на основе этих правил.</p>

            <div class="list-group">
              <div v-if="loadingRules" class="text-center text-muted py-3">
                <div class="spinner-border spinner-border-sm text-success" role="status"></div> Загрузка правил...
              </div>
              <div v-else-if="rules.length === 0" class="text-center text-muted py-3">
                Правил пока нет
              </div>
              <div v-else v-for="rule in rules" :key="rule.id" class="list-group-item d-flex justify-content-between align-items-center py-3">
                <div>
                  <h6 class="mb-1 fw-bold">{{ rule.keyword }} <i class="bi bi-arrow-right mx-1 text-muted"></i> {{ rule.category }}</h6>
                  <small class="text-muted">Сохраненное правило</small>
                </div>
                <div class="d-flex align-items-center">
                  <div class="form-check form-switch me-3">
                    <input class="form-check-input" type="checkbox" checked style="transform: scale(1.3);">
                  </div>
                  <button @click="deleteRule(rule.id)" class="btn btn-sm btn-outline-danger border-0" title="Удалить правило">
                    <i class="bi bi-trash fs-5"></i>
                  </button>
                </div>
              </div>
            </div>

            <button class="btn btn-outline-success mt-4 w-100 fw-bold" data-bs-toggle="modal" data-bs-target="#RuleModal">
              <i class="bi bi-plus-lg me-1"></i> Создать новое правило
            </button>
          </div>
        </section>

        <section class="card shadow-sm" style="border-radius: 15px;">
          <div class="card-body">
            <h2 class="card-title mb-3 h5 d-flex align-items-center">
              <i class="bi bi-bell me-2"></i> Уведомления
              <span class="badge bg-success ms-auto" :style="{ opacity: showSaveStatus ? 1 : 0, transition: '0.3s' }">Сохранено</span>
            </h2>

            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 class="mb-0 h6">Еженедельный отчет</h3>
                <small class="text-muted">Сводка расходов на Email</small>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" style="transform: scale(1.2);" v-model="notifyEmail">
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h3 class="mb-0 h6">Превышение лимита</h3>
                <small class="text-muted">Push-уведомление при перерасходе</small>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" style="transform: scale(1.2);" v-model="notifyPush">
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <div class="modal fade" id="RuleModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" style="border-radius: 15px;">
          <header class="modal-header bg-success text-white" style="border-radius: 15px 15px 0 0;">
            <h2 class="modal-title h5"><i class="bi bi-robot me-2"></i> Новое правило</h2>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </header>
          <div class="modal-body">
            <form @submit.prevent="saveRule">
              <div class="mb-3">
                <label class="form-label fw-bold">Если в названии транзакции есть слово:</label>
                <input type="text" class="form-control" placeholder="Например: АЗС" required v-model="ruleKeyword">
              </div>

              <div class="mb-4">
                <label class="form-label fw-bold">То автоматически назначить категорию:</label>
                <select class="form-select" required v-model="ruleCategory">
                  <option>Выберите категорию...</option>
                  <option>Продукты</option>
                  <option>Транспорт</option>
                  <option>Развлечения</option>
                  <option>Зарплата</option>
                  <option>Разное</option>
                </select>
              </div>
              <footer class="modal-footer px-0 pb-0 border-0 mt-4">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button type="submit" class="btn btn-success" data-bs-dismiss="modal">Сохранить правило</button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
