<template>
  <div>
    <AppNavbar />
    <main class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 fw-bold mb-0">Управление командой</h1>
        <button class="btn btn-primary" @click="showInviteModal">Пригласить аннотатора</button>
      </div>
      <div class="card border-0 shadow-sm mb-5">
        <div class="card-body p-0 table-responsive">
          <table class="table table-hover mb-0 align-middle">
            <thead class="table-light">
            <tr>
              <th class="px-4 py-3">Пользователь</th>
              <th class="py-3">Роль</th>
              <th class="py-3">Размечено за неделю</th>
              <th class="py-3">Точность</th>
              <th class="px-4 py-3 text-end">Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="workers.length === 0">
              <td colspan="5" class="text-center text-muted py-4">В команде пока никого нет. Пригласите первого аннотатора!</td>
            </tr>
            <tr v-for="w in workers" :key="w.id">
              <td class="px-4 py-3 fw-medium">{{ w.name }} <span class="text-muted small">({{ w.email }})</span></td>
              <td><span :class="['badge', w.role === 'Менеджер' ? 'bg-secondary' : 'bg-info text-dark']">{{ w.role }}</span></td>
              <td>{{ w.filesDone || 0 }} файлов</td>
              <td class="text-success fw-bold">{{ w.accuracy || 100 }}%</td>
              <td class="px-4 py-3 text-end"><button class="btn btn-sm btn-light text-muted">Ред.</button></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h4 class="fw-bold mb-3">Справочник платформы (FAQ)</h4>
      <div class="accordion shadow-sm mb-5" id="faqAccordion">
        <div class="accordion-item border-0">
          <h2 class="accordion-header">
            <button class="accordion-button fw-medium" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true">
              Как добавить новых участников в проект
            </button>
          </h2>
          <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
            <div class="accordion-body text-muted">
              Вы можете нажать кнопку "Пригласить аннотатора" в правом верхнем углу и отправить приглашение на email. После регистрации они появятся в вашей команде.
            </div>
          </div>
        </div>
        <div class="accordion-item border-0 border-top">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed fw-medium" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
              Как считается метрика точности (Quality Score)
            </button>
          </h2>
          <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
            <div class="accordion-body text-muted">
              Точность рассчитывается на основе консенсус-разметки: система периодически дает одну и ту же картинку нескольким разметчикам и сравнивает пересечение BBox-ов (IoU).
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="modal fade" id="inviteModal" ref="modalRef" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: var(--lf-radius-lg);">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Пригласить в команду</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="inviteWorker">
              <div class="mb-3">
                <label class="form-label">Email адрес</label>
                <input v-model="inviteEmail" type="email" class="form-control" placeholder="colleague@example.com" required>
              </div>
              <div class="mb-4">
                <label class="form-label">Роль</label>
                <select v-model="inviteRole" class="form-select">
                  <option value="Разметчик">Разметчик (Только выполнение задач)</option>
                  <option value="Менеджер">Менеджер (Управление проектами)</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100">Отправить приглашение</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import AppNavbar from '../components/AppNavbar.vue'
import * as bootstrap from 'bootstrap'

const authStore = useAuthStore()
const workers = ref([])
const inviteEmail = ref('')
const inviteRole = ref('Разметчик')
const modalRef = ref(null)

const loadWorkers = async () => {
  const { data } = await axios.get(`/workers?ownerId=${authStore.user.id}`)
  workers.value = data
}

let modalInstance = null

const showInviteModal = () => {
  modalInstance.show()
}

const inviteWorker = async () => {
  const newWorker = {
    ownerId: authStore.user.id,
    name: "Новый Участник",
    email: inviteEmail.value.trim(),
    role: inviteRole.value,
    filesDone: 0,
    accuracy: 100
  }
  await axios.post('/workers', newWorker)
  inviteEmail.value = ''
  inviteRole.value = 'Разметчик'

  modalInstance.hide()

  loadWorkers()
}

onMounted(() => {
  modalInstance = new bootstrap.Modal(modalRef.value)
  loadWorkers()
})
</script>