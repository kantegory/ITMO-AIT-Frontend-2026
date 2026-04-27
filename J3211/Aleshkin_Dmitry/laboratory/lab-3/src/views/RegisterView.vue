<template>
  <main class="container main-block">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-5">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h1 class="text-center mb-4">Регистрация</h1>

            <BaseAlert :message="errorMessage" type="danger" />

            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="form-label">Имя</label>
                <input v-model.trim="form.name" type="text" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model.trim="form.email" type="email" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <input v-model="form.password" type="password" class="form-control" required />
              </div>

              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseAlert from '../components/BaseAlert.vue';
import { useFinanceManager } from '../composables/useFinanceManager.js';

const router = useRouter();
const finance = useFinanceManager();

const loading = ref(false);
const errorMessage = ref('');

const form = reactive({
  name: '',
  email: '',
  password: '',
});

async function submitForm() {
  loading.value = true;
  errorMessage.value = '';

  try {
    await finance.register(form);
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>