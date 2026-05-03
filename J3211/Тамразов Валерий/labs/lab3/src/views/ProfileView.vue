<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { fetchUserPipelines, fetchUserArtifacts, fetchUserPolicies } from '../api/profile';
import StatusBadge from '../components/StatusBadge.vue';

const { user } = useAuth();

const pipelines = ref([]);
const artifacts = ref([]);
const policies = ref([]);

const stats = computed(() => ({
  pipelines: pipelines.value.length,
  runs: pipelines.value.reduce((sum, p) => sum + (p.stepsDone || 0), 0),
  artifacts: artifacts.value.length,
  policies: policies.value.length
}));

onMounted(async () => {
  if (!user.value?.id) return;
  const [pipelinesRes, artifactsRes, policiesRes] = await Promise.all([
    fetchUserPipelines(user.value.id),
    fetchUserArtifacts(user.value.id),
    fetchUserPolicies(user.value.id)
  ]);
  pipelines.value = Array.isArray(pipelinesRes.data) ? pipelinesRes.data : [];
  artifacts.value = Array.isArray(artifactsRes.data) ? artifactsRes.data : [];
  policies.value = Array.isArray(policiesRes.data) ? policiesRes.data : [];
});
</script>

<template>
  <main>
    <div class="profile-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="profile-avatar">
              <i class="bi bi-person-fill"></i>
            </div>
          </div>
          <div class="col">
            <h3 class="mb-1">{{ user?.firstName }} {{ user?.lastName }}</h3>
            <p class="mb-0" style="color: var(--text-secondary);">
              {{ user?.role }} · {{ user?.company }} · {{ user?.email }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="number">{{ stats.pipelines }}</div>
            <div class="label">Пайплайнов</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="number">{{ stats.runs }}</div>
            <div class="label">Запусков</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="number">{{ stats.artifacts }}</div>
            <div class="label">Артефактов</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="number">{{ stats.policies }}</div>
            <div class="label">Политики</div>
          </div>
        </div>
      </div>

      <h4 class="mb-3">Мои пайплайны</h4>
      <p v-if="pipelines.length === 0" class="text-muted">У вас пока нет пайплайнов</p>
      <div v-for="p in pipelines" :key="p.id" class="pipeline-card">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">
              <RouterLink :to="`/pipelines/${p.id}`" class="text-decoration-none">{{ p.name }}</RouterLink>
            </h6>
            <small class="text-muted">Последний запуск: {{ p.lastRun }} · {{ p.env }}</small>
          </div>
          <StatusBadge :status="p.status" />
        </div>
      </div>

      <h4 class="mb-3 mt-5">Артефакты</h4>
      <p v-if="artifacts.length === 0" class="text-muted">Нет артефактов</p>
      <div v-else class="table-responsive">
        <table class="table">
          <thead>
            <tr><th>Название</th><th>Тип</th><th>Размер</th><th>Версия</th><th>Дата</th></tr>
          </thead>
          <tbody>
            <tr v-for="a in artifacts" :key="a.id">
              <td>{{ a.name }}</td>
              <td>{{ a.type }}</td>
              <td>{{ a.size }}</td>
              <td>{{ a.version || '—' }}</td>
              <td>{{ a.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 class="mb-3 mt-5">Политики</h4>
      <p v-if="policies.length === 0" class="text-muted">Нет политик</p>
      <div v-for="pol in policies" :key="pol.id" class="pipeline-card">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">{{ pol.name }}</h6>
            <small class="text-muted">{{ pol.description }}</small>
          </div>
          <span :class="['badge', pol.status === 'active' ? 'bg-success' : 'bg-warning']">
            {{ pol.status === 'active' ? 'Активна' : 'На паузе' }}
          </span>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.profile-avatar {
  width: 64px;
  height: 64px;
  background: var(--accent-dim);
  border: 1px solid var(--accent);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-avatar i {
  font-size: 1.8rem;
  color: var(--accent);
}
</style>
