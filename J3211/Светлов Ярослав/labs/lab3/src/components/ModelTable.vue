<template>
  <p v-if="!models.length">Моделей пока нет.</p>
  <div v-else class="table-responsive" tabindex="0" role="region" aria-label="Версии моделей">
    <table class="table table-striped"><caption class="visually-hidden">Модели и версии</caption>
      <thead><tr><th scope="col">Модель</th><th scope="col">Версия</th><th scope="col">Эксперимент и артефакты</th><th scope="col">Статус</th></tr></thead>
      <tbody><tr v-for="model in models" :key="model.id">
        <td>{{ model.name }}<small v-if="model.userId !== user?.id"><br>Другой пользователь</small></td><td>{{ model.version }}</td>
        <td><RouterLink :to="'/experiments/' + model.linkedExperimentId">{{ model.linkedExperimentId }}</RouterLink></td>
        <td><form v-if="editable && model.userId === user?.id" class="d-flex gap-2 align-items-end" @submit.prevent="$emit('save', model.id, $event.target.elements.stage.value)">
          <label>Статус<select name="stage" class="form-select form-select-sm" :value="model.stage" :aria-label="'Статус ' + model.name + ' ' + model.version">
            <option v-for="stage in ['Staging', 'Production', 'Archived']" :key="stage">{{ stage }}</option>
          </select></label>
          <button class="btn btn-sm btn-outline-primary" :disabled="saving" :aria-label="'Сохранить статус ' + model.name + ' ' + model.version">Сохранить</button>
        </form><span v-else>{{ model.stage }}</span></td>
      </tr></tbody>
    </table>
  </div>
</template>
<script setup>
import { useAuth } from '../composables/useAuth';
defineProps({ models: { type: Array, required: true }, editable: Boolean, saving: Boolean });
defineEmits(['save']);
const { user } = useAuth();
</script>
