<template>
  <div id="createProjectModal" ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="createProjectTitle" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="createProjectTitle" class="modal-title h5">Новый проект</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть" />
        </div>

        <form @submit.prevent="submit">
          <div class="modal-body">
            <div class="mb-3">
              <label for="newProjName" class="form-label">Название</label>
              <input id="newProjName" v-model.trim="form.name" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label for="newProjDesc" class="form-label">Описание</label>
              <textarea id="newProjDesc" v-model.trim="form.description" class="form-control" rows="3" />
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="newProjStatus" class="form-label">Статус</label>
                <select id="newProjStatus" v-model="form.status" class="form-select">
                  <option value="Новый">Новый</option>
                  <option value="В процессе">В процессе</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="newProjPriority" class="form-label">Приоритет</label>
                <select id="newProjPriority" v-model="form.priority" class="form-select">
                  <option value="Низкий">Низкий</option>
                  <option value="Средний">Средний</option>
                  <option value="Высокий">Высокий</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label for="newProjDeadline" class="form-label">Дедлайн</label>
              <input id="newProjDeadline" v-model="form.deadline" type="date" class="form-control" />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="submit" class="btn btn-outline-black" :disabled="loading">
              {{ loading ? 'Создание...' : 'Создать' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps({ loading: { type: Boolean, default: false } })
const emit = defineEmits(['create'])
const modalElement = ref(null)

const form = reactive({
  name: '',
  description: '',
  status: 'Новый',
  priority: 'Низкий',
  deadline: '',
})

function reset() {
  form.name = ''
  form.description = ''
  form.status = 'Новый'
  form.priority = 'Низкий'
  form.deadline = ''
}

function submit() {
  if (!form.name || props.loading) return
  emit('create', { ...form })
}

function close() {
  if (!modalElement.value) return
  Modal.getOrCreateInstance(modalElement.value).hide()
  reset()
}

defineExpose({ close })
</script>
