<script setup>
import Navbar from "@/components/Navbar.vue";
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authApi from '@/api/auth'
import Footer from "@/components/Footer.vue";
import AppModal from "@/components/AppModal.vue";
import { useModal } from "@/composables/useModal";
import { useAuth } from "@/composables/useAuth";
const router = useRouter()

const email = ref('')
const password = ref('')
const {
  modal,
  showModal
} = useModal();
const { login: authLogin } = useAuth();

const login = async (e) => {
  e.preventDefault()
  try {
    const { user } = await authApi.login({ email: email.value, password: password.value })
    authLogin(user)
    showModal('Success', `Welcome back, ${user.name}!`, "success")
    
    setTimeout(() => router.push('/'), 1500)
  } catch (err) {
    showModal('Error', err.message, "error")
  }
}
</script>

<template>
  <div class="vh-100 d-flex flex-column">

    <main class="flex-grow-1">
      <section class="vh-100">
        <div class="container h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-lg-10">
              <div class="card shadow" style="border-radius: 20px;">
                <div class="card-body p-5">
                  <div class="row">
                    <div class="col-md-6">
                      <h2 class="text-center mb-4">Log in</h2>
                      <form @submit="login">
                        <div class="form-floating mb-3">
                          <input v-model="email" type="email" class="form-control" required>
                          <label>Email address</label>
                        </div>
                        <div class="form-floating mb-3">
                          <input v-model="password" type="password" class="form-control" required>
                          <label>Password</label>
                        </div>
                        <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button class="btn btn-primary btn-lg" type="submit">Login</button>
                        </div>
                      </form>
                      <p class="text-center">
                        Don't have an account? <router-link to="/register">Register</router-link>
                      </p>
                      <p class="text-center mt-3">
                        If you are an organizer, <router-link to="/organizer-login">click here</router-link>
                      </p>
                    </div>
                    <div class="col-md-6 d-flex align-items-center">
                      <img src="/assets/draw1.webp" class="img-fluid" alt="login">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
      <AppModal
  :show="modal.show"
  :title="modal.title"
  :message="modal.message"
  :type="modal.type"
  @close="modal.show = false"
/>
  </div>
</template>
