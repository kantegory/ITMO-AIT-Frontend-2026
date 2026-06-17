<template>
  <AppShell title="Модели">
    <template #actions>
      <button class="btn-sm" @click="modal.open()">
        <svg class="svg-icon me-1" aria-hidden="true"><use href="#icon-plus-lg"></use></svg>
        Новая модель
      </button>
    </template>

    <div class="panel">
      <div class="phead">Реестр моделей</div>
      <table class="t">
        <thead>
          <tr>
            <th scope="col">Имя</th>
            <th scope="col">Версия</th>
            <th scope="col">Фреймворк</th>
            <th scope="col">Метрики</th>
            <th scope="col">Стадия</th>
            <th scope="col">Деплой</th>
            <th scope="col"><span class="visually-hidden">Действия</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in models" :key="m.id">
            <td>{{ m.name }}</td>
            <td><span style="font-family:monospace">{{ m.ver }}</span></td>
            <td>{{ m.fw }}</td>
            <td><span style="font-family:monospace;font-size:.78rem">{{ m.metrics }}</span></td>
            <td><span :class="'stage-' + m.stage">{{ m.stage }}</span></td>
            <td>
              <span :class="m.deployed ? 'dep-on' : 'dep-off'">
                {{ m.deployed ? 'Да' : 'Нет' }}
              </span>
            </td>
            <td>
              <button class="btn-xs" @click="toggleDeploy(m)">
                {{ m.deployed ? 'Отозвать' : 'Деплой' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.isOpen.value" class="modal-overlay" @click.self="modal.close()">
      <div class="panel" style="width:420px;margin:auto">
        <div class="phead">Новая модель</div>
        <div v-if="createAction.error.value" class="err-msg">{{ createAction.error.value }}</div>
        <div class="mb-2">
          <label class="flabel">Название</label>
          <input v-model="newModel.name" class="finput" placeholder="my-model" />
        </div>
        <div class="mb-2">
          <label class="flabel">Версия</label>
          <input v-model="newModel.ver" class="finput" placeholder="v1.0" />
        </div>
        <div class="mb-2">
          <label class="flabel">Фреймворк</label>
          <input v-model="newModel.fw" class="finput" placeholder="PyTorch" />
        </div>
        <div class="mb-3">
          <label class="flabel">Стадия</label>
          <select v-model="newModel.stage" class="finput">
            <option value="dev">dev</option>
            <option value="staging">staging</option>
            <option value="prod">prod</option>
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
import { useModelsStore } from '@/stores/models'
import { useAuthStore } from '@/stores/auth'
import { useModal } from '@/composables/useModal'
import { useAsyncAction } from '@/composables/useAsyncAction'

const modelsStore = useModelsStore()
const authStore = useAuthStore()
const { models } = storeToRefs(modelsStore)
const { user } = storeToRefs(authStore)

const modal = useModal()
const createAction = useAsyncAction()

const newModel = reactive({ name: '', ver: 'v1.0', fw: '', stage: 'dev', metrics: '', deployed: false })

async function toggleDeploy(m) {
  await modelsStore.updateModel(m.id, { deployed: !m.deployed, stage: !m.deployed ? 'prod' : 'staging' })
}

async function doCreate() {
  if (!newModel.name) { createAction.error.value = 'Введите название'; return }
  await createAction.execute(async () => {
    await modelsStore.createModel({ ...newModel, owner: user.value?.name || 'unknown' })
    modal.close()
    Object.assign(newModel, { name: '', ver: 'v1.0', fw: '', stage: 'dev', metrics: '', deployed: false })
  })
}

onMounted(() => modelsStore.loadModels())
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center; z-index: 500;
}
</style>
