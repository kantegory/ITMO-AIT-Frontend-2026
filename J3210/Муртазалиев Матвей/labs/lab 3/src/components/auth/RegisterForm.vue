<template>
  <form class="row g-3 mt-1" @submit.prevent="submit">
    <div class="col-md-6">
      <label class="form-label" for="firstName">Имя</label>
      <input id="firstName" v-model.trim="form.firstName" class="form-control form-control-lg" type="text" placeholder="Матвей" autocomplete="given-name" required />
    </div>
    <div class="col-md-6">
      <label class="form-label" for="lastName">Фамилия</label>
      <input id="lastName" v-model.trim="form.lastName" class="form-control form-control-lg" type="text" placeholder="Муртазалиев" autocomplete="family-name" required />
    </div>
    <div class="col-12">
      <label class="form-label" for="registerEmail">Email</label>
      <input id="registerEmail" v-model.trim="form.email" class="form-control form-control-lg" type="email" placeholder="you@example.com" autocomplete="email" inputmode="email" required />
    </div>
    <div class="col-12">
      <label class="form-label" for="registerPassword">Пароль</label>
      <input
        id="registerPassword"
        v-model="form.password"
        class="form-control form-control-lg"
        type="password"
        placeholder="Не менее 8 символов"
        autocomplete="new-password"
        aria-describedby="register-password-hint password-strength-text"
        required
      />
      <small id="register-password-hint" class="text-secondary d-block mt-2">Пароль минимум 8 символов.</small>
      <div class="password-strength mt-3">
        <div class="password-strength__bar">
          <span role="progressbar" aria-label="Надежность пароля" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="strength.percent" :style="{ width: `${strength.percent}%` }"></span>
        </div>
        <small id="password-strength-text" class="text-secondary" aria-live="polite">{{ strength.label }}</small>
      </div>
    </div>
    <div class="col-12">
      <fieldset class="border-0 p-0 m-0">
        <legend class="form-label mb-2">Тариф</legend>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="plan-card">
              <input v-model="form.plan" type="radio" name="plan" value="Starter" />
              <span class="plan-card__body">
                <span class="plan-card__title">Starter</span>
                <span class="plan-card__price">Бесплатно</span>
                <span class="plan-card__copy">Один банк и ручное ведение бюджета</span>
              </span>
            </label>
          </div>
          <div class="col-md-6">
            <label class="plan-card">
              <input v-model="form.plan" type="radio" name="plan" value="Pro" />
              <span class="plan-card__body">
                <span class="plan-card__title">Pro</span>
                <span class="plan-card__price">₽ 399 / месяц</span>
                <span class="plan-card__copy">Прогнозы, отчёты и правила автокатегоризации</span>
              </span>
            </label>
          </div>
        </div>
      </fieldset>
    </div>
    <div class="col-12">
      <div class="form-check">
        <input id="agreeTerms" class="form-check-input" type="checkbox" checked required />
        <label class="form-check-label" for="agreeTerms">
          Я согласен с условиями обработки данных и пользовательским соглашением
        </label>
      </div>
    </div>
    <div class="col-12">
      <button class="btn btn-accent btn-lg w-100" type="submit" :disabled="isBusy">
        {{ isBusy ? "Создаем аккаунт..." : "Зарегистрироваться" }}
      </button>
    </div>
    <div v-if="message" class="col-12">
      <div class="alert alert-danger mb-0" role="alert" aria-live="assertive">{{ message }}</div>
    </div>
    <div class="col-12">
      <div class="alert alert-light border mb-0">
        Уже зарегистрированы?
        <RouterLink class="fw-semibold link-dark text-decoration-none" to="/login">Перейти ко входу</RouterLink>
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const auth = useAuth();
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  plan: "Starter",
});
const isBusy = ref(false);
const message = ref("");

const strength = computed(() => {
  const password = form.password.trim();

  if (password.length >= 12) return { percent: 100, label: "Сильный пароль" };
  if (password.length >= 8) return { percent: 70, label: "Средний пароль" };
  if (password.length > 0) return { percent: 35, label: "Слабый пароль" };
  return { percent: 0, label: "Укажите пароль" };
});

async function submit() {
  message.value = "";
  isBusy.value = true;

  try {
    await auth.register({ ...form });
    await router.push("/dashboard");
  } catch (error) {
    message.value = error.message || "Регистрация не удалась.";
  } finally {
    isBusy.value = false;
  }
}
</script>
