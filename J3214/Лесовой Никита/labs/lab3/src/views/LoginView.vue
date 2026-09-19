<script setup>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import BaseLayout from "../layouts/BaseLayout.vue";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { error, isLoading } = storeToRefs(authStore);
const form = reactive({ email: "nikita@example.com", password: "123456" });

async function submit() {
  const success = await authStore.login(form.email, form.password);
  if (success) router.push(route.query.redirect || "/profile");
}
</script>

<template>
  <BaseLayout>
    <section class="auth-section">
      <form class="auth-card" @submit.prevent="submit">
        <p class="eyebrow text-primary">Личный кабинет</p>
        <h1>Вход</h1>
        <p class="text-secondary">Тестовые данные уже заполнены.</p>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div class="mb-3">
          <label class="form-label" for="email">Электронная почта</label>
          <input id="email" v-model="form.email" class="form-control" type="email" required>
        </div>
        <div class="mb-4">
          <label class="form-label" for="password">Пароль</label>
          <input id="password" v-model="form.password" class="form-control" type="password" required>
        </div>
        <button class="btn btn-primary w-100" type="submit" :disabled="isLoading">
          {{ isLoading ? "Входим…" : "Войти" }}
        </button>
        <p class="text-center mt-3 mb-0">
          Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
        </p>
      </form>
    </section>
  </BaseLayout>
</template>
