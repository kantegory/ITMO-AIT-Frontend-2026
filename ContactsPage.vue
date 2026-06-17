<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const success = ref('')

const sendMessage = () => {
  success.value = 'Сообщение отправлено!'
  name.value = ''
  email.value = ''
  message.value = ''
}
</script>

<template>
  <div class="container mt-5" style="max-width: 600px;">
    <h1 class="mb-4">Контакты</h1>

    <p class="mb-4">
      Свяжитесь с нами, если у вас есть вопросы или предложения.
    </p>

    <form @submit.prevent="sendMessage">
      <div class="mb-3">
        <label class="form-label">Имя</label>
        <input v-model="name" type="text" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Сообщение</label>
        <textarea v-model="message" class="form-control" rows="4" required></textarea>
      </div>

      <button class="btn btn-primary w-100">
        Отправить
      </button>
    </form>

    <p v-if="success" class="text-success mt-3">
      {{ success }}
    </p>
  </div>
</template>