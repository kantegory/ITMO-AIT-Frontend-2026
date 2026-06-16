<template>
  <div class="modal fade" id="regModal" tabindex="-1" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content text-white" style="background-color: #1e293b;">
        <div class="modal-header border-secondary">
          <h5 class="modal-title">Create Account</h5>
          <button @click="$emit('close')" type="button" class="btn-close btn-close-white"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleRegister">
            <div class="row mb-3">
              <div class="col">
                <label class="form-label">First Name</label>
                <input v-model="firstName" type="text" class="form-control bg-transparent text-white border-secondary" required>
              </div>
              <div class="col">
                <label class="form-label">Last Name</label>
                <input v-model="lastName" type="text" class="form-control bg-transparent text-white border-secondary" required>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control bg-transparent text-white border-secondary" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control bg-transparent text-white border-secondary" required>
            </div>
            <button type="submit" class="btn btn-info w-100">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const modalRef = ref(null)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')

const handleRegister = async () => {
  const result = await authStore.register({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value
  })
  
  if (result.success) {
    const modalElement = modalRef.value
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement)
    modalInstance.hide()
  } else {
    alert(result.message)
  }
}
</script>
