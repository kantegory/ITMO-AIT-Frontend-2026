<script setup>
import { ref } from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');

const emit = defineEmits(['submit']);

const handleSubmit = () => {
  console.log('Signup attempt:', { 
    username: username.value, 
    email: email.value, 
    password: password.value 
  });
  emit('submit', { 
    username: username.value, 
    email: email.value, 
    password: password.value 
  });
};
</script>

<template>
  <div class="modal fade" id="signupModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header border-bottom-0">
          <h1 class="fw-bold mb-0 fs-2">Sign up</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body p-5 pt-0">
          <form @submit.prevent="handleSubmit">
            <div class="form-floating mb-3">
              <input v-model="username" type="text" class="form-control rounded-3" id="signupUsername" placeholder="Username" required>
              <label for="signupUsername">Username</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="email" type="email" class="form-control rounded-3" id="signupEmail" placeholder="name@example.com" required>
              <label for="signupEmail">Email</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="password" type="password" class="form-control rounded-3" id="signupPassword" placeholder="Password" required>
              <label for="signupPassword">Password</label>
            </div>
            <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">
              Sign up
            </button>
            <small class="text-body-secondary d-block text-center">
              By clicking Sign up, you agree to the terms of use.
            </small>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>