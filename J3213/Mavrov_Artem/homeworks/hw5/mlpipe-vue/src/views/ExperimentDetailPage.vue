<template>
  <AppShell :title="experiment ? experiment.name : 'Эксперимент'">
    <template #actions>
      <router-link to="/experiments" class="btn-sm">
        <svg class="svg-icon me-1" aria-hidden="true"><use href="#icon-arrow-left"></use></svg>
        К экспериментам
      </router-link>
    </template>

    <div v-if="!experiment" style="color:var(--muted)">Загрузка...</div>

    <template v-else>
      <div class="row g-3 mb-3">
        <div class="col-6 col-lg-3">
          <div class="kpi"><div class="kpi-v">{{ experiment.runs }}</div><div class="kpi-l">Запусков</div></div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="kpi"><div class="kpi-v" style="font-size:1.1rem">{{ experiment.best }}</div><div class="kpi-l">Лучшая метрика</div></div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="kpi"><div class="kpi-v" style="font-size:1.1rem">{{ experiment.date }}</div><div class="kpi-l">Дата</div></div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="kpi">
            <div class="kpi-v">
              <span :class="experiment.status === 'active' ? 'bs-ok' : 'bs-arch'" class="badge-status">
                {{ experiment.status === 'active' ? 'Активен' : 'Архив' }}
              </span>
            </div>
            <div class="kpi-l">Статус</div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="phead">Теги</div>
        <span v-for="tag in experiment.tags.split(',')" :key="tag" class="tag-chip">{{ tag.trim() }}</span>
      </div>

      <div class="panel">
        <div class="phead">Артефакты эксперимента</div>
        <table class="t">
          <thead>
            <tr>
              <th scope="col">Имя</th>
              <th scope="col">Тип</th>
              <th scope="col">Размер</th>
              <th scope="col">Дата</th>
              <th scope="col"><span class="visually-hidden">Действия</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="expArtifacts.length === 0">
              <td colspan="5" style="color:var(--muted);text-align:center">Нет артефактов</td>
            </tr>
            <tr v-for="art in expArtifacts" :key="art.id">
              <td>{{ art.name }}</td>
              <td><span class="tag-chip">{{ art.type }}</span></td>
              <td>{{ art.size }}</td>
              <td>{{ art.date }}</td>
              <td>
                <button class="btn-xs danger" @click="doDeleteArtifact(art.id)">Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </AppShell>
</template>

<script>
import AppShell from '@/layouts/AppShell.vue'
import { mapState, mapActions } from 'pinia'
import { useExperimentsStore } from '@/stores/experiments'
import { useArtifactsStore } from '@/stores/artifacts'

export default {
  name: 'ExperimentDetailPage',
  components: { AppShell },

  computed: {
    ...mapState(useExperimentsStore, ['experiments']),
    ...mapState(useArtifactsStore, ['artifacts']),
    experiment() {
      return this.experiments.find(e => String(e.id) === String(this.$route.params.id))
    },
    expArtifacts() {
      return this.artifacts.filter(a => String(a.expId) === String(this.$route.params.id))
    }
  },

  methods: {
    ...mapActions(useExperimentsStore, ['loadExperiments']),
    ...mapActions(useArtifactsStore, ['loadArtifacts', 'deleteArtifact']),
    async doDeleteArtifact(id) {
      if (!confirm('Удалить артефакт?')) return
      await this.deleteArtifact(id)
    }
  },

  mounted() {
    this.loadExperiments()
    this.loadArtifacts()
  }
}
</script>
