<script setup>
import Navbar from "@/components/Navbar.vue";
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authApi from '@/api/auth'
import Footer from "@/components/Footer.vue"
import AppModal from "@/components/AppModal.vue";
import { useModal } from "@/composables/useModal";

const router = useRouter()
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const name = ref('')
const terms = ref(false)


const {
  modal,
  showModal
} = useModal();

const register = async (e) => {
  e.preventDefault()

  if (!terms.value) {
    showModal("Error", "You must agree to the Terms of Service", 'error')
    return
  }

  if (password.value !== repeatPassword.value) {
    showModal("Error", "Passwords do not match", 'error')
    return
  }

  try {
    const { user } = await authApi.register({ email: email.value, password: password.value, name: name.value })
    localStorage.setItem('auth', 'true')
    localStorage.setItem('user', JSON.stringify(user))
    showModal('Success', `Welcome, ${user.name}!`, "success")
    setTimeout(() => router.push('/'), 1500)
  } catch (err) {
    showModal('Error', err.message, 'error')
  }
}
</script>

<template>
  <div class="vh-100 d-flex flex-column">
     <main>
      <section class="vh-100">
        <div class="container h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-lg-10">
              <div class="card shadow" style="border-radius: 20px;">
                <div class="card-body p-5">
                  <div class="row">

                    <!-- Form -->
                    <div class="col-md-6">
                      <h2 class="text-center mb-4">Sign up</h2>

                      <form @submit="register">
                        <div class="form-floating mb-3">
                          <input v-model="name" type="text" class="form-control" required>
                          <label>Your Name</label>
                        </div>

                        <div class="form-floating mb-3">
                          <input v-model="email" type="email" class="form-control" required>
                          <label>Your Email</label>
                        </div>

                        <div class="form-floating mb-3">
                          <input v-model="password" type="password" class="form-control" required>
                          <label>Password</label>
                        </div>

                        <div class="form-floating mb-3">
                          <input v-model="repeatPassword" type="password" class="form-control" required>
                          <label>Repeat password</label>
                        </div>

                        <div class="form-check mb-4">
                          <input v-model="terms" class="form-check-input" type="checkbox" id="terms">
                          <label class="form-check-label" for="terms">
                            I agree to Terms of service
                          </label>
                        </div>

                        <button class="btn btn-primary w-100" type="submit">
                          Register
                        </button>
                      </form>

                      <p class="text-center mt-3">
                        Already have an account? <router-link to="/login">Login</router-link>
                      </p>
                    </div>

                    <!-- Image -->
                    <div class="col-md-6 d-flex align-items-center">
                      <img src="/assets/draw1.webp" class="img-fluid" alt="image">
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