<template>
  <form class="row g-3" @submit.prevent="submit">
    <div class="col-md-6">
      <label class="form-label" for="ruleKeyword">Ключевое слово</label>
      <input id="ruleKeyword" v-model.trim="form.keyword" class="form-control" type="text" placeholder="Spotify" required />
    </div>
    <div class="col-md-6">
      <label class="form-label" for="ruleCategory">Категория</label>
      <select id="ruleCategory" v-model="form.category" class="form-select">
        <option>Подписки</option>
        <option>Транспорт</option>
        <option>Еда</option>
        <option>Дом</option>
      </select>
    </div>
    <div class="col-md-6">
      <label class="form-label" for="ruleAccount">Счет</label>
      <select id="ruleAccount" v-model="form.accountName" class="form-select">
        <option>Все счета</option>
        <option v-for="account in accounts" :key="account.id">{{ account.name }}</option>
      </select>
    </div>
    <div class="col-md-6 d-flex align-items-end">
      <div class="form-check">
        <input id="ruleNotify" v-model="form.notify" class="form-check-input" type="checkbox" />
        <label class="form-check-label" for="ruleNotify">Уведомлять о срабатывании</label>
      </div>
    </div>
    <div class="col-12">
      <button class="btn btn-accent" type="submit" :disabled="isBusy">
        {{ isBusy ? "Сохраняем..." : "Сохранить правило" }}
      </button>
    </div>
    <div v-if="message.text" class="col-12">
      <div class="alert mb-0" :class="message.type === 'success' ? 'alert-success' : 'alert-danger'" role="alert" aria-live="assertive">
        {{ message.text }}
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useApi } from "@/composables/useApi";
import { useAuth } from "@/composables/useAuth";

const emit = defineEmits(["created"]);

defineProps({
  accounts: {
    type: Array,
    required: true,
  },
});

const { apiRequest } = useApi();
const auth = useAuth();
const form = reactive({
  keyword: "",
  category: "Подписки",
  accountName: "Все счета",
  notify: true,
});
const isBusy = ref(false);
const message = reactive({
  text: "",
  type: "danger",
});

async function submit() {
  message.text = "";
  isBusy.value = true;

  try {
    const currentSession = await auth.ensureSession();
    const createdRule = await apiRequest("/rules", {
      method: "POST",
      body: {
        userId: currentSession.user.id,
        keyword: form.keyword,
        category: form.category,
        accountName: form.accountName,
        notify: form.notify,
      },
    });

    form.keyword = "";
    form.category = "Подписки";
    form.accountName = "Все счета";
    form.notify = true;
    message.type = "success";
    message.text = "Правило сохранено.";
    emit("created", createdRule);
  } catch (error) {
    message.type = "danger";
    message.text = error.message || "Не удалось сохранить правило.";
  } finally {
    isBusy.value = false;
  }
}
</script>

