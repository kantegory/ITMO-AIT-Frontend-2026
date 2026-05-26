<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:role'])
</script>

<template>
  <div class="greeting-card">
    <div class="avatar">{{ name[0] }}</div>
    <p class="card-label">Пользователь</p>
    <h2>С возвращением, {{ name }}!</h2>

    <label class="role-label" for="role">Роль</label>
    <input
      id="role"
      class="role-input"
      :value="role"
      @input="emit('update:role', $event.target.value)"
    />
  </div>
</template>
