<template>
  <main id="main-content" class="page-section" tabindex="-1">
    <div class="container">
      <section class="page-banner">
        <div>
          <span class="section-label">Интеграции</span>
          <h1 class="section-title mt-3">Банки и правила</h1>
          <p class="page-banner__copy">
            Подключайте источники операций, импортируйте демо-транзакции и сохраняйте правила автокатегоризации через API.
          </p>
        </div>
      </section>

      <div v-if="loading" class="alert alert-light border" role="status">Загружаем интеграции из API...</div>
      <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

      <template v-else>
        <section class="row g-4">
          <div class="col-xl-7">
            <div class="content-card h-100">
              <div class="content-card__head">
                <div>
                  <span class="section-label">Банки</span>
                  <h2 class="h3 mt-2 mb-0">Подключенные аккаунты</h2>
                </div>
              </div>
              <div class="row g-3 mt-1" role="list" aria-label="Список интеграций">
                <IntegrationCard
                  v-for="integration in integrations"
                  :key="integration.id"
                  :integration="integration"
                  @import="activeIntegration = $event"
                />
              </div>
            </div>
          </div>

          <div class="col-xl-5">
            <div class="content-card h-100">
              <span class="section-label">Автокатегоризация</span>
              <h2 class="h3 mt-2 mb-3">Новое правило</h2>
              <RuleForm :accounts="accounts" @created="prependRule" />
              <div class="integration-card--accent mt-4">
                <h3 class="h5">Сохраненные правила</h3>
                <ul class="mb-0 ps-3">
                  <li v-for="rule in rules" :key="rule.id || rule.keyword" class="py-1">
                    {{ rule.keyword }} → {{ rule.category }}{{ rule.notify ? " • с уведомлением" : "" }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </main>

  <ImportModal
    :integration="activeIntegration"
    @close="activeIntegration = null"
    @imported="replaceIntegration"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import ImportModal from "@/components/integrations/ImportModal.vue";
import IntegrationCard from "@/components/integrations/IntegrationCard.vue";
import RuleForm from "@/components/integrations/RuleForm.vue";
import { useFinanceData } from "@/composables/useFinanceData";

const {
  accounts,
  integrations,
  rules,
  loading,
  error,
  loadIntegrationsData,
} = useFinanceData();
const activeIntegration = ref(null);

function replaceIntegration(patchedIntegration) {
  integrations.value = integrations.value.map((item) => (
    item.id === patchedIntegration.id ? patchedIntegration : item
  ));
}

function prependRule(createdRule) {
  rules.value = [createdRule, ...rules.value];
}

onMounted(loadIntegrationsData);
</script>
