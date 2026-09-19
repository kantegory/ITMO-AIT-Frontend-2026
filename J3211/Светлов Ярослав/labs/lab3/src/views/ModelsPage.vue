<template>
  <h1 class="h3 mb-3" tabindex="-1">Модели и версии</h1><p>Деплой имитируется сохранением статуса Production.</p>
  <RequestState :loading="loading" :error="error" />
  <RequestState :loading="saving" :error="saveError" />
  <p v-if="success" class="alert alert-success" role="status">{{ success }}</p>
  <template v-if="!loading && !error">
    <ModelTable :models="models" editable :saving="saving" @save="saveStage" />
    <h2 class="h5 mt-4">Добавить версию</h2>
    <p v-if="!experiments.length">Для добавления версии нужен собственный эксперимент.</p>
    <form v-else class="row g-3" @submit.prevent="add">
      <div class="col-sm-6 col-lg-4"><label for="model-name" class="form-label">Название модели</label><input id="model-name" v-model="form.name" class="form-control" maxlength="100" required></div>
      <div class="col-sm-6 col-lg-2"><label for="model-version" class="form-label">Версия</label><input id="model-version" v-model="form.version" class="form-control" pattern="[0-9]+\.[0-9]+\.[0-9]+" placeholder="1.0.0" title="Три числа через точку, например 1.0.0" required></div>
      <div class="col-lg-4"><label for="model-experiment" class="form-label">Эксперимент</label><select id="model-experiment" v-model="form.linkedExperimentId" class="form-select" required><option value="">Выберите эксперимент</option><option v-for="item in experiments" :key="item.id" :value="item.id">{{ item.name }}</option></select></div>
      <div class="col-lg-2 d-flex align-items-end"><button class="btn btn-primary" :disabled="saving">Добавить</button></div>
    </form>
  </template>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../api';
import { useAuth } from '../composables/useAuth';
import { useRequest } from '../composables/useRequest';
import RequestState from '../components/RequestState.vue';
import ModelTable from '../components/ModelTable.vue';
const { user } = useAuth();
const { loading, error, run } = useRequest();
const { loading: saving, error: saveError, run: write } = useRequest();
const models = ref([]), experiments = ref([]), success = ref('');
const form = reactive({ name: '', version: '', linkedExperimentId: '' });
onMounted(() => run(() => Promise.all([api.get('/models'), api.get('/experiments', { params: { userId: user.value.id } })]), ([versions, runs]) => { models.value = versions.data; experiments.value = runs.data; }));
function add() {
  if (saving.value) return;
  success.value = '';
  write(() => api.post('/models', { ...form, userId: user.value.id }), response => {
    models.value.push(response.data);
    Object.keys(form).forEach(key => { form[key] = ''; });
    success.value = 'Версия добавлена со статусом Staging.';
  });
}
function saveStage(id, stage) {
  if (saving.value) return;
  success.value = '';
  write(() => api.patch('/models/' + id, { stage }), response => {
    models.value = models.value.map(item => item.id === id ? response.data : item);
    success.value = 'Статус сохранён.';
  });
}
</script>
