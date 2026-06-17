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

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import AppShell from '@/layouts/AppShell.vue'
import { useExperimentsStore } from '@/stores/experiments'
import { useArtifactsStore } from '@/stores/artifacts'

const route = useRoute()
const experimentsStore = useExperimentsStore()
const artifactsStore = useArtifactsStore()

const { experiments } = storeToRefs(experimentsStore)
const { artifacts }   = storeToRefs(artifactsStore)

const experiment  = computed(() => experiments.value.find(e => String(e.id) === String(route.params.id)))
const expArtifacts = computed(() => artifacts.value.filter(a => String(a.expId) === String(route.params.id)))

async function doDeleteArtifact(id) {
  if (!confirm('Удалить артефакт?')) return
  await artifactsStore.deleteArtifact(id)
}

onMounted(() => {
  experimentsStore.loadExperiments()
  artifactsStore.loadArtifacts()
})
</script>
