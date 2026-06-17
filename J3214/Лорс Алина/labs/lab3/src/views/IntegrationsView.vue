<template>
  <AppLayout title="Интеграции" subtitle="Синхронизация и внешние API">
    <PageHeader
      kicker="Интеграции"
      title="Подключённые сервисы"
      description="Здесь показана работа с API: локальный JSON Server Auth для данных приложения и внешний API курсов валют через axios."
    >
      <button class="btn btn-outline-primary" type="button" @click="loadRates(currency)">
        <IconSprite name="currency-exchange" /> Обновить курсы
      </button>
    </PageHeader>

    <section class="row g-4 mb-4">
      <div v-for="item in integrations" :key="item.id" class="col-md-6">
        <article class="integration-card card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between gap-3">
              <div class="d-flex gap-3">
                <span class="integration-icon"><IconSprite :name="item.icon" /></span>
                <div>
                  <h2 class="h5 mb-1">{{ item.service }}</h2>
                  <p class="text-secondary mb-2">{{ item.description }}</p>
                  <div class="small text-secondary">
                    {{ item.connected ? `Последняя синхронизация: ${formatDateTime(item.lastSync)}` : 'Сервис пока не подключён' }}
                  </div>
                </div>
              </div>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  :id="`integration-${item.id}`"
                  :checked="item.connected"
                  @change="handleToggle(item, $event.target.checked)"
                />
                <label class="form-check-label visually-hidden" :for="`integration-${item.id}`">Подключить {{ item.service }}</label>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="row g-4">
      <div class="col-xl-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h2 class="h5 mb-3">Внешнее API курсов валют</h2>
            <p class="text-secondary">Запрос выполняется через отдельный composable <code>useExchangeRates</code> и axios.</p>
            <div v-if="rates?.items?.length" class="d-grid gap-2">
              <div v-for="rate in rates.items" :key="rate.quote" class="d-flex justify-content-between border rounded-4 p-3">
                <span>1 {{ rates.base }} → {{ rate.quote }}</span>
                <strong>{{ rate.rate }}</strong>
              </div>
            </div>
            <p v-else-if="ratesError" class="alert alert-warning mb-0">{{ ratesError }}</p>
            <p v-else class="text-secondary mb-0">Нажмите «Обновить курсы», чтобы выполнить внешний API-запрос.</p>
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h2 class="h5 mb-3">История импортов</h2>
            <div v-if="imports.length" class="list-group list-group-flush">
              <div v-for="item in imports" :key="item.id" class="list-group-item px-0 d-flex justify-content-between gap-3">
                <div>
                  <strong>{{ item.sourceName }}</strong>
                  <div class="small text-secondary">{{ item.format.toUpperCase() }} · {{ formatDateTime(item.importedAt) }}</div>
                </div>
                <span class="badge text-bg-light align-self-start">{{ item.importedCount }} операций</span>
              </div>
            </div>
            <p v-else class="text-secondary mb-0">Импортов пока нет.</p>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import PageHeader from '../components/PageHeader.vue';
import IconSprite from '../components/IconSprite.vue';
import { useFinance } from '../composables/useFinance';
import { useExchangeRates } from '../composables/useExchangeRates';
import { useToast } from '../composables/useToast';

const { integrations, imports, currency, syncData, toggleIntegration } = useFinance();
const { rates, error: ratesError, loadRates } = useExchangeRates();
const { showToast } = useToast();

onMounted(syncData);

async function handleToggle(item, connected) {
  await toggleIntegration(item.id, connected);
  showToast(connected ? 'Интеграция подключена' : 'Интеграция отключена');
}

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
}
</script>
