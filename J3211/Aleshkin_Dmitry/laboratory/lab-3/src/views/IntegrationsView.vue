<template>
  <main class="container">
    <DemoBanner :is-demo="finance.isDemo.value" />
    <BaseAlert :message="notice.message || finance.error.value" :type="notice.type" />

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h1>Интеграция с платёжными аккаунтами</h1>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <div class="info-box">
          <h2>Подключённые банки</h2>
          <BankTable :banks="finance.banks.value" />
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <div class="info-box">
          <h2>Правила импорта</h2>

          <RuleForm
            :categories="finance.categories"
            :disabled="finance.isDemo.value"
            @submit="submitRule"
          />

          <RulesList
            :rules="finance.rules.value"
            :disabled="finance.isDemo.value"
            @remove="removeRule"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, watchEffect } from 'vue';
import BankTable from '../components/BankTable.vue';
import BaseAlert from '../components/BaseAlert.vue';
import DemoBanner from '../components/DemoBanner.vue';
import RuleForm from '../components/RuleForm.vue';
import RulesList from '../components/RulesList.vue';
import { useFinanceManager } from '../composables/useFinanceManager.js';

const finance = useFinanceManager();

const notice = reactive({
  message: '',
  type: 'info',
});

watchEffect(() => {
  if (finance.isDemo.value) {
    notice.message = 'В демо-режиме интеграции доступны только для просмотра.';
    notice.type = 'info';
  }
});

async function submitRule(payload) {
  if (!payload.value?.trim()) {
    notice.message = 'Заполните значение для правила.';
    notice.type = 'warning';
    return;
  }

  try {
    await finance.addRule({
      ...payload,
      userId: finance.currentUser.value.id,
    });

    notice.message = 'Правило добавлено.';
    notice.type = 'success';
  } catch (error) {
    notice.message = error.message;
    notice.type = 'danger';
  }
}

async function removeRule(id) {
  try {
    await finance.deleteRule(id);
    notice.message = 'Правило удалено.';
    notice.type = 'success';
  } catch (error) {
    notice.message = error.message;
    notice.type = 'danger';
  }
}
</script>