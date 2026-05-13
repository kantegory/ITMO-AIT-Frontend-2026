<template>
  <base-layout class="auth-page">
    <div class="custom-card mx-auto mt-5">
      <h2 class="text-cold-beige fw-bold text-center mb-4">Создать аккаунт</h2>
      
      <form @submit.prevent="register">
          <label class="form-label text-cold-beige" for="regName">Ваше Имя</label>
          <input type="text" id="regName" v-model="form.name" class="custom-input" required autocomplete="name">

          <label class="form-label text-cold-beige" for="regEmail">Email</label>
          <input type="email" id="regEmail" v-model="form.email" class="custom-input" placeholder="name@example.com" required autocomplete="email">

          <label class="form-label text-cold-beige" for="regPass">Пароль</label>
          <input type="password" id="regPass" v-model="form.password" class="custom-input" placeholder="Придумайте пароль" required autocomplete="new-password">

          <label class="form-label text-cold-beige" for="regPassConfirm">Повторите пароль</label>
          <input type="password" id="regPassConfirm" v-model="form.passwordConfirm" class="custom-input" placeholder="Введите пароль еще раз" required autocomplete="new-password">
          
          <button type="submit" class="btn-custom" aria-label="Зарегистрироваться в сервисе">Зарегистрироваться</button>
          
          <div class="text-center mt-4">
              <span class="text-muted" style="font-size: 0.9rem;">Уже есть аккаунт?</span>
              <router-link to="/login" class="link-custom ms-1" aria-label="Перейти на страницу входа">Войти</router-link>
          </div>
      </form>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'

export default {
  name: 'RegisterPage',
  components: { BaseLayout },
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
      }
    }
  },
  methods: {
    register() {
      console.log('Регистрация...', this.form);
    }
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  min-height: 80vh;
}
</style>