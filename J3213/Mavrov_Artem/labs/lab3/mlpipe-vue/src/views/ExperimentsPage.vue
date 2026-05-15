<template>
  <AppShell title="Эксперименты">
    <template #actions>
      <button class="btn-sm" @click="modal.open()">
        <svg class="svg-icon me-1" aria-hidden="true"><use href="#icon-plus-lg"></use></svg>
        Новый
      </button>
    </template>

    <div class="panel">
      <div class="phead">Эксперименты</div>

      <div class="filter-bar mb-3">
        <input v-model="search" class="finput sm" placeholder="Поиск по имени..." />
        <select v-model="extraFilter" class="finput sm">
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="archived">Архив</option>
        </select>
        <button class="btn-sm" @click="apply">
          <svg class="svg-icon me-1" aria-hidden="true"><use href="#icon-funnel"></use></svg>
          Найти
        </button>
        <button class="btn-sm" @click="reset">Сброс</button>
      </div>

      <table class="t">
        <thead>
          <tr>
            <th scope="col">Имя</th>
            <th scope="col">Дата</th>
            <th scope="col">Теги</th>
            <th scope="col">Запусков</th>
            <th scope="col">Лучшая метрика</th>
            <th scope="col">Статус</th>
            <th scope="col"><span class="visually-hidden">Действия</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exp in filtered" :key="exp.id">
            <td>
              <router-link :to="'/experiments/' + exp.id" style="color:var(--acc)">
                {{ exp.name }}
              </router-link>
            </td>
            <td>{{ exp.date }}</td>
            <td>
              <span v-for="tag in exp.tags.split(',')" :key="tag" class="tag-chip">{{ tag.trim() }}</span>
            </td>
            <td>{{ exp.runs }}</td>
            <td><span style="font-family:monospace">{{ exp.best }}</span></td>
            <td>
              <span :class="exp.status === 'active' ? 'bs-ok' : 'bs-arch'" class="badge-status">
                {{ exp.status === 'active' ? 'Активен' : 'Архив' }}
              </span>
            </td>
            <td>
              <router-link :to="'/experiments/' + exp.id" class="btn-xs">Открыть</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.isOpen.value" class="modal-overlay" @click.self="modal.close()">
      <div class="panel" style="width:420px;margin:auto">
        <div class="phead">Новый эксперимент</div>
        <div v-if="createAction.error.value" class="err-msg">{{ createAction.error.value }}</div>
        <div class="mb-2">
          <label class="flabel">Название</label>
          <input v-model="newExp.name" class="finput" placeholder="my-experiment" />
        </div>
        <div class="mb-2">
          <label class="flabel">Теги (через запятую)</label>
          <input v-model="newExp.tags" class="finput" placeholder="pytorch,nlp" />
        </div>
        <div class="mb-3">
          <label class="flabel">Статус</label>
          <select v-model="newExp.status" class="finput">
            <option value="active">Активен</option>
            <option value="archived">Архив</option>
          </select>
        </div>
        <div style="display:flex;gap:.5rem;justify-content:flex-end">
          <button class="btn-sm" @click="modal.close()">Отмена</button>
          <button class="btn-accent" @click="doCreate" :disabled="createAction.loading.value">
            {{ createAction.loading.value ? 'Создание...' : 'Создать' }}
          </button>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppShell from '@/layouts/AppShell.vue'
import { useExperimentsStore } from '@/stores/experiments'
import { useAuthStore } from '@/stores/auth'
import { useModal } from '@/composables/useModal'
import { useAsyncAction } from '@/composables/useAsyncAction'
import { useListFilter } from '@/composables/useListFilter'

const experimentsStore = useExperimentsStore()
const authStore = useAuthStore()
const { experiments } = storeToRefs(experimentsStore)
const { user } = storeToRefs(authStore)

const modal = useModal()
const createAction = useAsyncAction()

const { search, extraFilter, filtered, apply, reset } = useListFilter(
  experiments,
  (exp, s, status) => {
    const matchName   = !s      || exp.name.toLowerCase().includes(s.toLowerCase())
    const matchStatus = !status || exp.status === status
    return matchName && matchStatus
  }
)

const newExp = reactive({ name: '', tags: '', status: 'active' })

async function doCreate() {
  if (!newExp.name) { createAction.error.value = 'Введите название'; return }
  await createAction.execute(async () => {
    await experimentsStore.createExperiment({
      ...newExp,
      date:  new Date().toISOString().slice(0, 10),
      runs:  0,
      best:  '—',
      owner: user.value?.name || 'unknown'
    })
    modal.close()
    Object.assign(newExp, { name: '', tags: '', status: 'active' })
  })
}

onMounted(() => experimentsStore.loadExperiments())
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center; z-index: 500;
}
</style>
