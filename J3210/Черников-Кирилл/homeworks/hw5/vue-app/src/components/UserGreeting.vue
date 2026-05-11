<template>
  <div class="card">
    <span class="badge">Компонент: пропсы</span>
    <h3>Приветствие</h3>
    <p>Привет, <strong class="greeting-name">{{ name }}</strong>!</p>
    <div class="role-tag">{{ role }}</div>
    <div class="greeting-select">
      <label for="role-select">Сменить роль:&nbsp;</label>
      <select id="role-select" :value="role" @change="$emit('update:role', $event.target.value)">
        <option>Исполнитель</option>
        <option>Валидатор</option>
        <option>Менеджер</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  role: { type: String, required: true },
})
defineEmits(['update:role'])
</script>
