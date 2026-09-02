<script setup>
import { Plus, X } from '@lucide/vue'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  projects: { type: Array, required: true },
})

const emit = defineEmits(['close', 'create'])
const title = ref('')
const project = ref('Мобильное приложение')
const priority = ref('Средний')
const time = ref('Сегодня')
const canSubmit = computed(() => title.value.trim().length >= 3)

function resetForm() {
  title.value = ''
  project.value = props.projects[0]?.name ?? 'Digital Lab'
  priority.value = 'Средний'
  time.value = 'Сегодня'
}

function submit() {
  if (!canSubmit.value) return
  emit('create', {
    title: title.value.trim(),
    project: project.value,
    priority: priority.value,
    time: time.value,
  })
  resetForm()
}

watch(() => props.open, (open) => {
  if (!open) resetForm()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
        <section class="task-modal" role="dialog" aria-modal="true" aria-labelledby="newTaskTitle">
          <header><div><small>Т‑Пульс</small><h2 id="newTaskTitle">Новая задача</h2></div><button class="small-icon-button" type="button" aria-label="Закрыть" @click="$emit('close')"><X /></button></header>
          <form @submit.prevent="submit">
            <label for="taskTitle">Название задачи</label>
            <input id="taskTitle" v-model="title" type="text" maxlength="80" placeholder="Например, подготовить презентацию" autofocus required />

            <div class="form-grid">
              <div><label for="taskProject">Проект</label><select id="taskProject" v-model="project"><option v-for="item in projects" :key="item.id" :value="item.name">{{ item.name }}</option></select></div>
              <div><label for="taskPriority">Приоритет</label><select id="taskPriority" v-model="priority"><option>Высокий</option><option>Средний</option><option>Низкий</option></select></div>
            </div>

            <label for="taskTime">Срок</label>
            <input id="taskTime" v-model="time" type="text" maxlength="24" />

            <div class="modal-actions"><button class="secondary-button" type="button" @click="$emit('close')">Отмена</button><button class="primary-button" type="submit" :disabled="!canSubmit"><Plus />Добавить задачу</button></div>
          </form>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
