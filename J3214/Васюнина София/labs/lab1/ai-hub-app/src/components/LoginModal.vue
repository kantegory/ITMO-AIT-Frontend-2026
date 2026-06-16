<template>
  <div class="modal fade" id="loginModal" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content text-white" style="background-color: #1e293b;">
        <div class="modal-header border-secondary">
          <h5 class="modal-title">Вход</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control bg-transparent text-white border-secondary" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Пароль</label>
              <input v-model="password" type="password" class="form-control bg-transparent text-white border-secondary" required>
            </div>
            <button type="submit" class="btn btn-info w-100">Войти</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const modalRef = ref(null);

const handleLogin = async () => {
  const result = await authStore.login({ email: email.value, password: password.value });
  if (result.success) {
    const modal = bootstrap.Modal.getInstance(modalRef.value);
    modal.hide();
  } else {
    alert(result.message);
  }
};
</script>