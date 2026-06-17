<template>
  <AppShell title="Модели">
    <template #actions>
      <button class="btn-sm" @click="showCreate = true">
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
            <td>
              <span :class="'stage-' + m.stage">{{ m.stage }}</span>
            </td>
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

    <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
      <div class="panel" style="width:420px;margin:auto">
        <div class="phead">Новая модель</div>
        <div v-if="createError" class="err-msg">{{ createError }}</div>
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
          <button class="btn-sm" @click="showCreate = false">Отмена</button>
          <button class="btn-accent" @click="doCreate" :disabled="creating">
            {{ creating ? 'Создание...' : 'Создать' }}
          </button>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script>
import AppShell from '@/layouts/AppShell.vue'
import { mapState, mapActions } from 'pinia'
import { useModelsStore } from '@/stores/models'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ModelsPage',
  components: { AppShell },

  data() {
    return {
      showCreate: false,
      creating: false,
      createError: '',
      newModel: { name: '', ver: 'v1.0', fw: '', stage: 'dev', metrics: '', deployed: false }
    }
  },

  computed: {
    ...mapState(useModelsStore, ['models']),
    ...mapState(useAuthStore, ['user'])
  },

  methods: {
    ...mapActions(useModelsStore, ['loadModels', 'createModel', 'updateModel']),
    async toggleDeploy(m) {
      await this.updateModel(m.id, { deployed: !m.deployed, stage: !m.deployed ? 'prod' : 'staging' })
    },
    async doCreate() {
      this.createError = ''
      if (!this.newModel.name) { this.createError = 'Введите название'; return }
      this.creating = true
      try {
        await this.createModel({ ...this.newModel, owner: this.user?.name || 'unknown' })
        this.showCreate = false
        this.newModel = { name: '', ver: 'v1.0', fw: '', stage: 'dev', metrics: '', deployed: false }
      } catch (e) {
        this.createError = 'Ошибка создания'
      } finally {
        this.creating = false
      }
    }
  },

  mounted() { this.loadModels() }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center; z-index: 500;
}
</style>
