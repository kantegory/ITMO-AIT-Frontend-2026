<template>
  <div class="modal fade" id="addMoneyModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow" style="border-radius: 20px;">
        <div class="modal-body p-4">
          <h2 class="mb-4 fw-bold h5">Новая операция</h2>
          <select v-model="form.type" class="form-select mb-3">
            <option value="plus">Доход (+)</option>
            <option value="minus">Расход (-)</option>
          </select>
          <input v-model="form.cat" type="text" class="form-control mb-3" placeholder="Категория">
          <input v-model="form.date" type="date" class="form-control mb-3">
          <input v-model="form.sum" type="number" class="form-control mb-4" placeholder="Сумма">
          <button @click="handleSave" class="btn btn-success w-100 fw-bold py-2" data-bs-dismiss="modal">Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const emit = defineEmits(['save'])
const form = ref({type: 'minus', cat: '', date: '', sum: null})

const handleSave = () => {
  if (!form.value.cat || !form.value.sum) return
  emit('save', {...form.value})
  form.value = {type: 'minus', cat: '', date: '', sum: null}
}
</script>