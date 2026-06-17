<script setup>
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useSession } from "../composables/useSession";
import { fetchJson } from "../services/api";

const router = useRouter();
const { login } = useSession();

const formRef = ref(null);
const isSubmitting = ref(false);
const errorMessage = ref("");

const form = reactive({
  firstName: "",
  lastName: "",
  role: "user",
  phone: "",
  email: "",
  password: "",
  agreement: false
});

function resolveRedirectByRole(nextRole) {
  return nextRole === "organizer" ? "/cabinet/organizer" : "/cabinet/user";
}

async function submitRegister() {
  errorMessage.value = "";

  if (!formRef.value?.reportValidity()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetchJson("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        role: form.role,
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password
      })
    });

    login({
      token: response.token,
      user: response.user
    });

    router.push(resolveRedirectByRole(response.user.role));
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="container auth-layout d-flex align-items-center">
    <div class="row g-4 align-items-stretch w-100">
      <div class="col-lg-6">
        <section class="auth-panel p-4 p-xl-5">
          <h1 class="h3 fw-bold mb-3">Создание аккаунта</h1>
          <p class="text-secondary mb-4">
            Регистрация отправляет данные в mock API. Можно создать как аккаунт покупателя, так и аккаунт организатора.
          </p>

          <div v-if="errorMessage" class="alert alert-danger" role="status" aria-live="polite">
            {{ errorMessage }}
          </div>

          <form ref="formRef" novalidate @submit.prevent="submitRegister">
            <fieldset class="mb-0">
              <legend class="form-legend">Данные нового аккаунта</legend>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="firstName" class="form-label">Имя</label>
                  <input id="firstName" v-model="form.firstName" type="text" class="form-control" required autocomplete="given-name">
                </div>

                <div class="col-md-6">
                  <label for="lastName" class="form-label">Фамилия</label>
                  <input id="lastName" v-model="form.lastName" type="text" class="form-control" required autocomplete="family-name">
                </div>

                <div class="col-md-6">
                  <label for="registerRole" class="form-label">Роль</label>
                  <select id="registerRole" v-model="form.role" class="form-select" required>
                    <option value="user">Покупатель</option>
                    <option value="organizer">Организатор</option>
                  </select>
                  <div class="form-hint">Роль влияет на набор доступных страниц после входа.</div>
                </div>

                <div class="col-md-6">
                  <label for="registerPhone" class="form-label">Телефон</label>
                  <input
                    id="registerPhone"
                    v-model="form.phone"
                    type="tel"
                    class="form-control"
                    pattern="\+?[0-9\-\s]{10,16}"
                    required
                    placeholder="+7 999 111-22-33"
                    autocomplete="tel"
                  >
                  <div class="form-hint">Допустимы цифры, пробелы и дефисы.</div>
                </div>

                <div class="col-12">
                  <label for="registerEmail" class="form-label">Email</label>
                  <input
                    id="registerEmail"
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    required
                    placeholder="example@mail.com"
                    autocomplete="email"
                  >
                </div>

                <div class="col-12">
                  <label for="registerPassword" class="form-label">Пароль</label>
                  <input
                    id="registerPassword"
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    minlength="6"
                    required
                    autocomplete="new-password"
                  >
                  <div class="form-hint">Пароль должен содержать минимум 6 символов.</div>
                </div>
              </div>

              <div class="form-check mt-4 mb-4">
                <input id="agreement" v-model="form.agreement" class="form-check-input" type="checkbox" required>
                <label class="form-check-label" for="agreement">Я принимаю условия пользовательского соглашения</label>
              </div>
            </fieldset>

            <button type="submit" class="btn btn-primary w-100 py-2" :disabled="isSubmitting">
              {{ isSubmitting ? "Создаём аккаунт..." : "Зарегистрироваться" }}
            </button>
          </form>

          <p class="mt-4 mb-0">
            Уже есть аккаунт?
            <RouterLink :to="{ name: 'login' }">Войти</RouterLink>
          </p>
        </section>
      </div>

      <div class="col-lg-6 d-none d-lg-block">
        <section class="auth-side h-100 p-4 p-xl-5">
          <h2 class="fw-bold mb-3">После регистрации доступно</h2>
          <div class="d-grid gap-3">
            <div class="p-3 rounded-3 bg-white bg-opacity-10">Покупка билетов с выбором мест на схеме зала</div>
            <div class="p-3 rounded-3 bg-white bg-opacity-10">Возвраты из личного кабинета через API</div>
            <div class="p-3 rounded-3 bg-white bg-opacity-10">Создание событий и статистика для роли организатора</div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
