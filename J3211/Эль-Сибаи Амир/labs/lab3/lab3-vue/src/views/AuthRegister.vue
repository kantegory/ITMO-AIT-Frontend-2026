<template>
  <main class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card p-4">
          <h2 class="text-center mb-4">Register</h2>
          <form @submit.prevent="register">
            <div class="mb-3">
              <label for="firstName" class="form-label">First Name</label>
              <input v-model="form.firstName" type="text" class="form-control" id="firstName" placeholder="Amir" required />
            </div>
            <div class="mb-3">
              <label for="lastName" class="form-label">Last Name</label>
              <input v-model="form.lastName" type="text" class="form-control" id="lastName" placeholder="Elsebaie" required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" id="email" placeholder="example@mail.com" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input v-model="form.password" type="password" class="form-control" id="password" placeholder="Enter password" required />
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input v-model="form.confirmPassword" type="password" class="form-control" id="confirmPassword" placeholder="Repeat password" required />
            </div>
            <div class="mb-3">
              <label for="accountType" class="form-label">Account Type</label>
              <select v-model="form.role" class="form-select" id="accountType">
                <option value="fan">Fan (buy tickets)</option>
                <option value="organizer">Organizer (sell tickets)</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary w-100">Register</button>
          </form>
          <div class="text-center mt-3">
            <router-link to="/login">Already have an account? Sign In</router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/instance'
import { injectIcons } from '@/composables/useIcons'

const router = useRouter()
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'fan'
})

onMounted(() => {
  injectIcons()
})

const register = async () => {
  if (form.password !== form.confirmPassword) {
    alert('Passwords do not match!')
    return
  }

  const newUser = {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    password: form.password,
    role: form.role
  }

  try {
    await api.post('/users', newUser)
    alert('Registration successful! Please Sign In.')
    router.push('/login')
  } catch (err) {
    alert('Registration failed. Check server connection.')
  }
}
</script>
