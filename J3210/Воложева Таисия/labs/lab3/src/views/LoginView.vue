<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const errorMessage = ref("");
const loading = ref(false);

const email = ref("");
const password = ref("");

const pigeonId = ref("");
const smsCodeInput = ref("");
const isVerifyingPin = ref(false); // Переключатель между вводом ID и PIN
const generatedCode = ref(null);
const tempPigeonUser = ref(null);

const saveSessionAndRedirect = (user) => {
  auth.setUser(user);
  router.push(user.role === "organizer" ? "/organizer" : "/personal");
};

const handleLogin = async () => {
  errorMessage.value = "";
  loading.value = true;
  try {
    const res = await axios.get("http://localhost:3000/users");
    const user = res.data.find((u) => u.email.toLowerCase() === email.value.toLowerCase());
    if (user && user.password === password.value) {
      saveSessionAndRedirect(user);
    } else {
      throw new Error("Неверный логин или пароль");
    }
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
};

const initiatePigeonLogin = async () => {
  if (!pigeonId.value.trim()) return;

  errorMessage.value = "";
  loading.value = true;
  try {
    const res = await axios.get("http://localhost:3000/users");
    const user = res.data.find((u) => u.pigeonId === pigeonId.value.trim());

    if (user) {
      tempPigeonUser.value = user;
      generatedCode.value = Math.floor(100000 + Math.random() * 900000).toString();
      alert(`🕊️ ПИН-код на пейджер голубя: ${generatedCode.value}`);
      isVerifyingPin.value = true; // Переключаемся на ввод кода
    } else {
      throw new Error("Голубь с таким ID не найден");
    }
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
};

const verifyPinAndLogin = () => {
  if (smsCodeInput.value === generatedCode.value && tempPigeonUser.value) {
    saveSessionAndRedirect(tempPigeonUser.value);
  } else {
    errorMessage.value = "Неверный ПИН-код. Попробуйте еще раз.";
    smsCodeInput.value = "";
  }
};

const resetPigeonAuth = () => {
  isVerifyingPin.value = false;
  pigeonId.value = "";
  smsCodeInput.value = "";
  errorMessage.value = "";
};
</script>

<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-8 col-lg-5">
      <section class="event-card p-4 p-xl-5 shadow-sm rounded-4 bg-white border">
        <div class="text-center mb-4">
          <div class="icon-container mb-3">
            <svg
              viewBox="0 0 16 16"
              style="width: 70px; height: 70px; fill: var(--rose)"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"
              />
            </svg>
          </div>
          <h1 class="h3 fw-bold" style="color: var(--rose)">Авторизация</h1>
        </div>

        <div v-if="errorMessage" class="alert alert-danger small py-2 mb-4" role="alert">
          {{ errorMessage }}
        </div>

        <div class="pigeon-auth-zone p-3 rounded-4 mb-4" :class="{ 'verify-mode': isVerifyingPin }">
          <div v-if="!isVerifyingPin">
            <label class="form-label fw-bold small mb-2 text-rose-dark"
              >Быстрый вход по ID 🕊️</label
            >
            <div class="input-group">
              <input
                v-model="pigeonId"
                type="text"
                class="form-control border-0 shadow-none ps-3 pigeon-input"
                placeholder="PIGEON-XXXX"
                @keyup.enter="initiatePigeonLogin"
              />
              <button
                @click="initiatePigeonLogin"
                class="btn btn-rose px-4"
                type="button"
                :disabled="loading"
              >
                {{ loading ? "..." : "Далее" }}
              </button>
            </div>
          </div>

          <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <label class="form-label fw-bold small mb-0 text-rose-dark">Введите ПИН-код 🔒</label>
              <button
                @click="resetPigeonAuth"
                class="btn btn-link btn-sm text-decoration-none p-0 text-muted"
              >
                Отмена
              </button>
            </div>
            <div class="input-group">
              <input
                v-model="smsCodeInput"
                type="text"
                maxlength="6"
                class="form-control border-0 shadow-none ps-3 text-center pin-input"
                placeholder="000000"
                @keyup.enter="verifyPinAndLogin"
              />
              <button @click="verifyPinAndLogin" class="btn btn-rose px-4" type="button">
                Войти
              </button>
            </div>
          </div>
        </div>

        <div class="divider mb-4 text-center text-muted position-relative">
          <span class="bg-white px-3 position-relative small" style="z-index: 1"
            >или через почту</span
          >
          <hr class="position-absolute w-100" style="top: 50%; margin: 0; opacity: 0.1" />
        </div>

        <form @submit.prevent="handleLogin" :disabled="isVerifyingPin">
          <div class="mb-3">
            <input
              v-model="email"
              type="email"
              class="form-control form-control-lg rounded-pill border-2 px-4 shadow-none"
              placeholder="Email"
              required
              :disabled="isVerifyingPin"
            />
          </div>
          <div class="mb-4">
            <input
              v-model="password"
              type="password"
              class="form-control form-control-lg rounded-pill border-2 px-4 shadow-none"
              placeholder="Пароль"
              required
              :disabled="isVerifyingPin"
            />
          </div>
          <button
            type="submit"
            class="btn btn-outline-rose w-100 py-2 fw-bold rounded-pill"
            :disabled="loading || isVerifyingPin"
          >
            Войти в аккаунт
          </button>
        </form>

        <p class="text-center mt-4 mb-0 small text-muted">
          Нет аккаунта?
          <router-link
            to="/register"
            class="text-decoration-none fw-bold"
            style="color: var(--rose)"
            >Создать профиль</router-link
          >
        </p>
      </section>
    </div>
  </div>
</template>
