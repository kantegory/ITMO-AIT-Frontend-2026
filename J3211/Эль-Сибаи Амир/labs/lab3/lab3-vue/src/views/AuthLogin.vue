<template>
  <main class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card p-4">
          <h2 class="text-center mb-4">Sign In</h2>
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" id="email" placeholder="example@mail.com" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter password" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">Sign In</button>
          </form>
          <div class="text-center mt-3">
            <router-link to="/register">No account? Register</router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/instance'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { injectIcons } from '@/composables/useIcons'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  injectIcons()
})

const login = async () => {
  try {
    const users = (await api.get('/users')).data
    const user = users.find(u => u.email === email.value && u.password === password.value)

    if (user) {
      auth.login(user)
      router.push('/dashboard')
    } else {
      alert('Invalid email or password!')
    }
  } catch (error) {
    alert('Server connection error!')
  }
}
</script>
