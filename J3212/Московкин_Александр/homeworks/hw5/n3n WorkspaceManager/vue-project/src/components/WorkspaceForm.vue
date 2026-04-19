<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  type: 'Automation',
  description: '',
  status: 'active',
  nodes: 3
})

function submitForm() {
  emit('submit', { ...form })

  form.name = ''
  form.type = 'Automation'
  form.description = ''
  form.status = 'active'
  form.nodes = 3
}
</script>

<template>
  <form class="card border-0 shadow-sm" @submit.prevent="submitForm">
    <div class="card-body">
      <h2 class="h5 mb-4">Создать рабочее пространство</h2>

      <div class="mb-3">
        <label for="workspace-name" class="form-label">Название</label>
        <input
          id="workspace-name"
          v-model="form.name"
          type="text"
          class="form-control"
          placeholder="Например, Marketing Automation"
          required
        >
      </div>

      <div class="mb-3">
        <label for="workspace-type" class="form-label">Тип</label>
        <select id="workspace-type" v-model="form.type" class="form-select">
          <option>Automation</option>
          <option>Analytics</option>
          <option>Support</option>
          <option>Internal</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="workspace-description" class="form-label">Описание</label>
        <textarea
          id="workspace-description"
          v-model="form.description"
          class="form-control"
          rows="4"
          placeholder="Коротко опишите назначение рабочего пространства"
          required
        ></textarea>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="workspace-status" class="form-label">Статус</label>
          <select id="workspace-status" v-model="form.status" class="form-select">
            <option value="active">active</option>
            <option value="draft">draft</option>
          </select>
        </div>

        <div class="col-md-6 mb-3">
          <label for="workspace-nodes" class="form-label">Количество узлов</label>
          <input
            id="workspace-nodes"
            v-model.number="form.nodes"
            type="number"
            min="1"
            class="form-control"
          >
        </div>
      </div>

      <button type="submit" class="btn btn-danger">
        Создать workspace
      </button>
    </div>
  </form>
</template>