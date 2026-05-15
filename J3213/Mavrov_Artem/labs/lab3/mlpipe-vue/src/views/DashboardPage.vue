<template>
  <AppShell title="Дашборд">
    <div class="row g-3 mb-3">
      <div class="col-6 col-lg-3">
        <div class="kpi">
          <div class="kpi-v">{{ experiments.length }}</div>
          <div class="kpi-l">Экспериментов</div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="kpi">
          <div class="kpi-v">{{ models.length }}</div>
          <div class="kpi-l">Моделей</div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="kpi">
          <div class="kpi-v">{{ deployedCount }}</div>
          <div class="kpi-l">В продакшне</div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="kpi">
          <div class="kpi-v">{{ artifacts.length }}</div>
          <div class="kpi-l">Артефактов</div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="phead">Последние эксперименты</div>
      <table class="t">
        <thead>
          <tr>
            <th scope="col">Имя</th>
            <th scope="col">Дата</th>
            <th scope="col">Статус</th>
            <th scope="col">Лучшая метрика</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exp in recentExperiments" :key="exp.id">
            <td>
              <router-link :to="'/experiments/' + exp.id" style="color:var(--acc)">
                {{ exp.name }}
              </router-link>
            </td>
            <td>{{ exp.date }}</td>
            <td>
              <span :class="exp.status === 'active' ? 'bs-ok' : 'bs-arch'" class="badge-status">
                {{ exp.status === 'active' ? 'Активен' : 'Архив' }}
              </span>
            </td>
            <td><span style="font-family:monospace">{{ exp.best }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppShell>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppShell from '@/layouts/AppShell.vue'
import { useExperimentsStore } from '@/stores/experiments'
import { useModelsStore } from '@/stores/models'
import { useArtifactsStore } from '@/stores/artifacts'

const experimentsStore = useExperimentsStore()
const modelsStore = useModelsStore()
const artifactsStore = useArtifactsStore()

const { experiments } = storeToRefs(experimentsStore)
const { models }      = storeToRefs(modelsStore)
const { artifacts }   = storeToRefs(artifactsStore)

const deployedCount    = computed(() => models.value.filter(m => m.deployed).length)
const recentExperiments = computed(() => experiments.value.slice(0, 5))

onMounted(() => {
  experimentsStore.loadExperiments()
  modelsStore.loadModels()
  artifactsStore.loadArtifacts()
})
</script>
