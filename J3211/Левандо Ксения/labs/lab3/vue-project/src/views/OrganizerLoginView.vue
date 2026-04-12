<script setup>
import Navbar from "@/components/Navbar.vue";
import { ref } from "vue";
import authApi from "@/api/auth";
import { useRouter } from "vue-router";
import Footer from "@/components/Footer.vue";
import AppModal from "@/components/AppModal.vue";
import { useModal } from "@/composables/useModal";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();

// login
const email = ref("");
const password = ref("");
// register
const regEmail = ref("");
const regPassword = ref("");
const regName = ref("");

const {
  modal,
  showModal
} = useModal();
const { loginOrganizer: authLoginOrganizer } = useAuth();
// login
const loginOrganizer = async (e) => {
  e.preventDefault();
  try {
    const result = await authApi.loginOrganizer({ email: email.value, password: password.value });
    authLoginOrganizer(result.organizer);
    showModal("Success", `Welcome ${result.organizer.name}!`, "success");
    setTimeout(() => router.push("/organizer-dashboard"), 1000);
  } catch (err) {
    showModal("Error", err.message, "error");
  }
};

// register
const registerOrganizer = async (e) => {
  e.preventDefault();
  try {
    const result = await authApi.registerOrganizer({
      email: regEmail.value,
      password: regPassword.value,
      name: regName.value
    });
    showModal("Success", `Organizer ${result.organizer.name} registered!`, "success");
    regEmail.value = "";
    regPassword.value = "";
    regName.value = "";
  } catch (err) {
    showModal("Error", err.message, "error");
  }
};
</script>

<template>
  <div class="vh-100 d-flex flex-column">

    <main class="flex-grow-1 container my-5">
      <div class="row">
        <!-- Register -->
        <div class="col-md-6">
          <h3>Register as Organizer</h3>
          <form @submit="registerOrganizer">
            <input v-model="regName" type="text" placeholder="Full Name" class="form-control mb-2" required>
            <input v-model="regEmail" type="email" placeholder="Email" class="form-control mb-2" required>
            <input v-model="regPassword" type="password" placeholder="Password" class="form-control mb-2" required>
            <button type="submit" class="btn btn-success">Register</button>
          </form>
        </div>

        <!-- Login -->
        <div class="col-md-6">
          <h3>Login as Organizer</h3>
          <form @submit="loginOrganizer">
            <input v-model="email" type="email" placeholder="Email" class="form-control mb-2" required>
            <input v-model="password" type="password" placeholder="Password" class="form-control mb-2" required>
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
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