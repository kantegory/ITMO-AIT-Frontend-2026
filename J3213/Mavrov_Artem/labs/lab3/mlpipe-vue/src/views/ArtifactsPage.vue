<template>
  <AppShell title="Артефакт-стор">
    <template #actions>
      <button class="btn-sm" @click="modal.open()">
        <svg class="svg-icon me-1" aria-hidden="true"><use href="#icon-cloud-upload"></use></svg>
        Загрузить
      </button>
    </template>

    <div class="panel">
      <div class="phead">Артефакты</div>
      <table class="t">
        <thead>
          <tr>
            <th scope="col">Имя</th>
            <th scope="col">Тип</th>
            <th scope="col">Размер</th>
            <th scope="col">Дата</th>
            <th scope="col">Владелец</th>
            <th scope="col"><span class="visually-hidden">Действия</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="art in artifacts" :key="art.id">
            <td>{{ art.name }}</td>
            <td><span class="tag-chip">{{ art.type }}</span></td>
            <td>{{ art.size }}</td>
            <td>{{ art.date }}</td>
            <td>{{ art.owner }}</td>
            <td>
              <button class="btn-xs danger" @click="doDelete(art.id)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.isOpen.value" class="modal-overlay" @click.self="modal.close()">
      <div class="panel" style="width:420px;margin:auto">
        <div class="phead">Новый артефакт</div>
        <div v-if="createAction.error.value" class="err-msg">{{ createAction.error.value }}</div>
        <div class="mb-2">
          <label class="flabel">Имя файла</label>
          <input v-model="newArt.name" class="finput" placeholder="model.pkl" />
        </div>
        <div class="mb-2">
          <label class="flabel">Тип</label>
          <select v-model="newArt.type" class="finput">
            <option value="model">model</option>
            <option value="dataset">dataset</option>
            <option value="plot">plot</option>
            <option value="config">config</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="flabel">Размер</label>
          <input v-model="newArt.size" class="finput" placeholder="4.2 MB" />
        </div>
        <div style="display:flex;gap:.5rem;justify-content:flex-end">
          <button class="btn-sm" @click="modal.close()">Отмена</button>
          <button class="btn-accent" @click="doCreate" :disabled="createAction.loading.value">
            {{ createAction.loading.value ? 'Сохранение...' : 'Сохранить' }}
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
import { useArtifactsStore } from '@/stores/artifacts'
import { useAuthStore } from '@/stores/auth'
import { useModal } from '@/composables/useModal'
import { useAsyncAction } from '@/composables/useAsyncAction'

const artifactsStore = useArtifactsStore()
const authStore = useAuthStore()
const { artifacts } = storeToRefs(artifactsStore)
const { user } = storeToRefs(authStore)

const modal = useModal()
const createAction = useAsyncAction()

const newArt = reactive({ name: '', type: 'model', size: '' })

async function doDelete(id) {
  if (!confirm('Удалить артефакт?')) return
  await artifactsStore.deleteArtifact(id)
}

async function doCreate() {
  if (!newArt.name) { createAction.error.value = 'Введите имя файла'; return }
  await createAction.execute(async () => {
    await artifactsStore.createArtifact({
      ...newArt,
      date:  new Date().toISOString().slice(0, 10),
      owner: user.value?.name || 'unknown'
    })
    modal.close()
    Object.assign(newArt, { name: '', type: 'model', size: '' })
  })
}

onMounted(() => artifactsStore.loadArtifacts())
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center; z-index: 500;
}
</style>
