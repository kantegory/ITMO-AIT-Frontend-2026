<template>
  <AppShell title="Эксперименты">
    <template #actions>
      <button class="btn-sm" @click="showCreate = true">
        <svg class="svg-icon me-1" aria-hidden="true"><use href="#icon-plus-lg"></use></svg>
        Новый
      </button>
    </template>

    <div class="panel">
      <div class="phead">Эксперименты</div>

      <div class="filter-bar mb-3">
        <input v-model="search" class="finput sm" placeholder="Поиск по имени..." />
        <select v-model="statusFilter" class="finput sm">
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="archived">Архив</option>
        </select>
        <button class="btn-sm" @click="applyFilter">
          <svg class="svg-icon me-1" aria-hidden="true"><use href="#icon-funnel"></use></svg>
          Найти
        </button>
        <button class="btn-sm" @click="resetFilter">Сброс</button>
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

    <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
      <div class="panel" style="width:420px;margin:auto">
        <div class="phead">Новый эксперимент</div>
        <div v-if="createError" class="err-msg">{{ createError }}</div>
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
import { useExperimentsStore } from '@/stores/experiments'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ExperimentsPage',
  components: { AppShell },

  data() {
    return {
      search: '',
      statusFilter: '',
      activeSearch: '',
      activeStatus: '',
      showCreate: false,
      creating: false,
      createError: '',
      newExp: { name: '', tags: '', status: 'active' }
    }
  },

  computed: {
    ...mapState(useExperimentsStore, ['experiments']),
    ...mapState(useAuthStore, ['user']),
    filtered() {
      return this.experiments.filter(e => {
        const matchName = !this.activeSearch || e.name.toLowerCase().includes(this.activeSearch.toLowerCase())
        const matchStatus = !this.activeStatus || e.status === this.activeStatus
        return matchName && matchStatus
      })
    }
  },

  methods: {
    ...mapActions(useExperimentsStore, ['loadExperiments', 'createExperiment']),
    applyFilter() { this.activeSearch = this.search; this.activeStatus = this.statusFilter },
    resetFilter() { this.search = ''; this.statusFilter = ''; this.activeSearch = ''; this.activeStatus = '' },
    async doCreate() {
      this.createError = ''
      if (!this.newExp.name) { this.createError = 'Введите название'; return }
      this.creating = true
      try {
        await this.createExperiment({
          ...this.newExp,
          date: new Date().toISOString().slice(0, 10),
          runs: 0,
          best: '—',
          owner: this.user?.name || 'unknown'
        })
        this.showCreate = false
        this.newExp = { name: '', tags: '', status: 'active' }
      } catch (e) {
        this.createError = 'Ошибка создания'
      } finally {
        this.creating = false
      }
    }
  },

  mounted() { this.loadExperiments() }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center; z-index: 500;
}
</style>
