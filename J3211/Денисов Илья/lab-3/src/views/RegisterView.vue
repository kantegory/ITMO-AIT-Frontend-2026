<script setup>
import { reactive } from 'vue';
import AuthCard from '../components/AuthCard.vue';
import FormAlert from '../components/FormAlert.vue';
import { useAuth } from '../composables/useAuth';

const form = reactive({
  name: '',
  surname: '',
  email: '',
  password: '',
  repeatPassword: ''
});

const { authLoading, authError, register, clearAuthError } = useAuth();

async function submitRegister() {
  const success = await register({
    name: form.name.trim(),
    surname: form.surname.trim(),
    email: form.email.trim(),
    password: form.password.trim(),
    repeatPassword: form.repeatPassword.trim()
  });

  if (!success) {
    form.password = '';
    form.repeatPassword = '';
  }
}
</script>

<template>
  <AuthCard title="Регистрация" width="30rem">
    <form novalidate @submit.prevent="submitRegister">
      <FormAlert :message="authError" />

      <div class="form-floating mb-3">
        <input id="floatingName" v-model="form.name" type="text" class="form-control" placeholder="Your Name" autocomplete="given-name" required @input="clearAuthError" />
        <label for="floatingName">Имя</label>
      </div>

      <div class="form-floating mb-3">
        <input id="floatingSurname" v-model="form.surname" type="text" class="form-control" placeholder="Your Surname" autocomplete="family-name" required @input="clearAuthError" />
        <label for="floatingSurname">Фамилия</label>
      </div>

      <div class="form-floating mb-3">
        <input id="floatingInputRegister" v-model="form.email" type="email" class="form-control" placeholder="name@example.com" autocomplete="email" required @input="clearAuthError" />
        <label for="floatingInputRegister">Email</label>
      </div>

      <div class="form-floating mb-3">
        <input id="floatingPasswordRegister" v-model="form.password" type="password" class="form-control" placeholder="Password" autocomplete="new-password" required @input="clearAuthError" />
        <label for="floatingPasswordRegister">Пароль</label>
      </div>

      <div class="form-floating mb-4">
        <input id="floatingPasswordRepeatRegister" v-model="form.repeatPassword" type="password" class="form-control" placeholder="Repeat password" autocomplete="new-password" required @input="clearAuthError" />
        <label for="floatingPasswordRepeatRegister">Повторите пароль</label>
      </div>

      <button type="submit" class="btn btn-outline-primary w-100" :disabled="authLoading">
        {{ authLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
    </form>
  </AuthCard>
</template>
