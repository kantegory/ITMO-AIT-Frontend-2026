<template>
  <AppShell title="Артефакт-стор">
    <template #actions>
      <button class="btn-sm" @click="showCreate = true">
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

    <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
      <div class="panel" style="width:420px;margin:auto">
        <div class="phead">Новый артефакт</div>
        <div v-if="createError" class="err-msg">{{ createError }}</div>
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
          <button class="btn-sm" @click="showCreate = false">Отмена</button>
          <button class="btn-accent" @click="doCreate" :disabled="creating">
            {{ creating ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script>
import AppShell from '@/layouts/AppShell.vue'
import { mapState, mapActions } from 'pinia'
import { useArtifactsStore } from '@/stores/artifacts'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ArtifactsPage',
  components: { AppShell },

  data() {
    return {
      showCreate: false,
      creating: false,
      createError: '',
      newArt: { name: '', type: 'model', size: '' }
    }
  },

  computed: {
    ...mapState(useArtifactsStore, ['artifacts']),
    ...mapState(useAuthStore, ['user'])
  },

  methods: {
    ...mapActions(useArtifactsStore, ['loadArtifacts', 'createArtifact', 'deleteArtifact']),
    async doDelete(id) {
      if (!confirm('Удалить артефакт?')) return
      await this.deleteArtifact(id)
    },
    async doCreate() {
      this.createError = ''
      if (!this.newArt.name) { this.createError = 'Введите имя файла'; return }
      this.creating = true
      try {
        await this.createArtifact({
          ...this.newArt,
          date: new Date().toISOString().slice(0, 10),
          owner: this.user?.name || 'unknown'
        })
        this.showCreate = false
        this.newArt = { name: '', type: 'model', size: '' }
      } catch (e) {
        this.createError = 'Ошибка сохранения'
      } finally {
        this.creating = false
      }
    }
  },

  mounted() { this.loadArtifacts() }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center; z-index: 500;
}
</style>
