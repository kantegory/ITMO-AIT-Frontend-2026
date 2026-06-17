<template>
  <NavBar />
  <main class="container">
    <div class="page-header">
      <h1 class="page-title">Пайплайны CI/CD</h1>
      <span class="pipeline-count">{{ filteredPipelines.length }} из {{ pipelines.length }}</span>
    </div>

    <div class="layout">
      <aside class="sidebar">
        <PipelineFilter
          v-model:search="searchQuery"
          v-model:status="statusFilter"
          v-model:env="envFilter"
        />
      </aside>

      <section class="content">
        <PipelineCard
          v-for="pipeline in filteredPipelines"
          :key="pipeline.id"
          :pipeline="pipeline"
        />
        <p v-if="filteredPipelines.length === 0" class="empty-msg">
          Пайплайны не найдены
        </p>
      </section>
    </div>
  </main>
</template>

<script>
import NavBar from './components/NavBar.vue'
import PipelineCard from './components/PipelineCard.vue'
import PipelineFilter from './components/PipelineFilter.vue'

export default {
  name: 'App',
  components: { NavBar, PipelineCard, PipelineFilter },
  data() {
    return {
      searchQuery: '',
      statusFilter: 'all',
      envFilter: 'all',
      pipelines: [
        { id: 1, name: 'fraud-detection-model', status: 'success', env: 'production', strategy: 'bluegreen', stepsTotal: 4, stepsDone: 4, duration: '12м 34с', lastRun: '2 часа назад', ownerName: 'Тамразов В.' },
        { id: 2, name: 'recommendation-engine-v2', status: 'running', env: 'staging', strategy: 'canary', stepsTotal: 4, stepsDone: 2, duration: '', lastRun: '5 часов назад', ownerName: 'Тамразов В.' },
        { id: 3, name: 'text-classifier-bert', status: 'failed', env: 'development', strategy: 'rolling', stepsTotal: 4, stepsDone: 2, duration: '', lastRun: 'вчера', ownerName: 'Иванов А.' },
        { id: 4, name: 'image-segmentation-unet', status: 'success', env: 'staging', strategy: 'bluegreen', stepsTotal: 4, stepsDone: 4, duration: '8м 15с', lastRun: '3 дня назад', ownerName: 'Петров С.' },
        { id: 5, name: 'anomaly-detector-lstm', status: 'pending', env: 'production', strategy: 'canary', stepsTotal: 4, stepsDone: 0, duration: '', lastRun: 'ожидает одобрения', ownerName: 'Иванов А.' },
        { id: 6, name: 'speech-recognition-whisper', status: 'success', env: 'development', strategy: 'rolling', stepsTotal: 4, stepsDone: 4, duration: '15м 42с', lastRun: '4 дня назад', ownerName: 'Петров С.' }
      ]
    }
  },
  computed: {
    filteredPipelines() {
      return this.pipelines.filter(p => {
        var matchSearch = p.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) !== -1
        var matchStatus = this.statusFilter === 'all' || p.status === this.statusFilter
        var matchEnv = this.envFilter === 'all' || p.env === this.envFilter
        return matchSearch && matchStatus && matchEnv
      })
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: #0b0e14;
  color: #e6edf3;
  font-family: 'IBM Plex Sans', sans-serif;
}

.container {
  padding: 24px 32px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.4rem;
  font-weight: 700;
}

.pipeline-count {
  color: #586069;
  font-size: 0.85rem;
}

.layout {
  display: grid;
  grid-template-columns: 25% 1fr;
  gap: 20px;
  align-items: start;
}

.empty-msg {
  color: #586069;
  text-align: center;
  padding: 40px 0;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
