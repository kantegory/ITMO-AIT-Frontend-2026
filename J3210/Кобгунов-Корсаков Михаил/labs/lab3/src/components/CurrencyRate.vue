<script setup>
import { onMounted, ref } from 'vue';
import { useApi } from '../composables/useApi';

const { getCurrencyRates } = useApi();
const text = ref('Загрузка курсов валют...');

onMounted(async () => {
  try {
    const data = await getCurrencyRates();
    text.value = `Курсы валют ЦБ: USD — ${data.Valute.USD.Value.toFixed(2)} ₽, EUR — ${data.Valute.EUR.Value.toFixed(2)} ₽`;
  } catch (e) {
    text.value = 'Не удалось загрузить курсы валют';
  }
});
</script>

<template>
  <div class="alert alert-info mb-4" role="status" aria-live="polite">
    {{ text }}
  </div>
</template>
