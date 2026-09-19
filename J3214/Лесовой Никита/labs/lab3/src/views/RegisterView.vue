<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import BaseLayout from "../layouts/BaseLayout.vue";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const { error, isLoading } = storeToRefs(authStore);
const form = reactive({ firstName: "", lastName: "", city: "", email: "", password: "" });

async function submit() {
  const success = await authStore.register(form);
  if (success) router.push("/profile");
}
</script>

<template>
  <BaseLayout>
    <section class="auth-section">
      <form class="auth-card auth-card-wide" @submit.prevent="submit">
        <p class="eyebrow text-primary">Новый путешественник</p>
        <h1>Регистрация</h1>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label" for="first-name">Имя</label>
            <input id="first-name" v-model="form.firstName" class="form-control" required>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="last-name">Фамилия</label>
            <input id="last-name" v-model="form.lastName" class="form-control" required>
          </div>
          <div class="col-12">
            <label class="form-label" for="city">Город</label>
            <input id="city" v-model="form.city" class="form-control" required>
          </div>
          <div class="col-12">
            <label class="form-label" for="register-email">Электронная почта</label>
            <input id="register-email" v-model="form.email" class="form-control" type="email" required>
          </div>
          <div class="col-12">
            <label class="form-label" for="register-password">Пароль</label>
            <input id="register-password" v-model="form.password" class="form-control" type="password" minlength="6" required>
          </div>
        </div>

        <button class="btn btn-primary w-100 mt-4" type="submit" :disabled="isLoading">
          {{ isLoading ? "Создаём аккаунт…" : "Зарегистрироваться" }}
        </button>
        <p class="text-center mt-3 mb-0">Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink></p>
      </form>
    </section>
  </BaseLayout>
</template>
