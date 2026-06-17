<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import ProviderCard from '@/components/ProviderCard.vue';
import { useAuth } from '@/composables/useAuth';
import { useFinanceHelpers } from '@/composables/useFinanceHelpers';
import { apiRequest, normalizeErrorMessage } from '@/services/api';

const auth = useAuth();
const helpers = useFinanceHelpers();

const providers = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const form = reactive({
  id: '',
  name: '',
  login: '',
  token: '',
});

const connectedProviders = computed(() =>
  providers.value
    .filter((item) => item.status === 'connected')
    .sort((left, right) => String(right.lastSync || '').localeCompare(String(left.lastSync || ''))),
);

function resetForm() {
  form.id = '';
  form.name = '';
  form.login = '';
  form.token = '';
}

function onManageProvider(provider) {
  form.id = String(provider.id);
  form.name = provider.name || '';
  form.login = provider.login || '';
  form.token = '';
  successMessage.value = '';
}

async function loadProviders() {
  if (!auth.user.value?.id || !auth.token.value) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const data = await apiRequest('/providers', {
      token: auth.token.value,
      params: {
        userId: auth.user.value.id,
        _sort: 'name',
        _order: 'asc',
      },
    });

    providers.value = Array.isArray(data) ? data : [];
  } catch (error) {
    errorMessage.value = normalizeErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
}

async function saveProvider() {
  errorMessage.value = '';
  successMessage.value = '';

  const name = form.name.trim();
  const login = form.login.trim();
  const token = form.token.trim();

  if (name.length < 2) {
    errorMessage.value = 'Введите название провайдера.';
    return;
  }

  if (login.length < 3) {
    errorMessage.value = 'Введите логин (минимум 3 символа).';
    return;
  }

  if (token.length < 6) {
    errorMessage.value = 'Введите API-токен (минимум 6 символов).';
    return;
  }

  const payload = {
    userId: auth.user.value.id,
    name,
    login,
    status: 'connected',
    lastSync: helpers.toIsoDate(new Date()),
  };

  try {
    if (form.id) {
      await apiRequest(`/providers/${form.id}`, {
        method: 'PATCH',
        token: auth.token.value,
        body: payload,
      });
    } else {
      const existing = providers.value.find((item) => String(item.name).toLowerCase() === name.toLowerCase());

      if (existing) {
        await apiRequest(`/providers/${existing.id}`, {
          method: 'PATCH',
          token: auth.token.value,
          body: payload,
        });
      } else {
        await apiRequest('/providers', {
          method: 'POST',
          token: auth.token.value,
          body: payload,
        });
      }
    }

    successMessage.value = 'Провайдер успешно подключен/обновлен.';
    resetForm();
    await loadProviders();
  } catch (error) {
    errorMessage.value = normalizeErrorMessage(error);
  }
}

onMounted(() => {
  void loadProviders();
});
</script>

<template>
  <section class="glass-card hero-panel mb-4 reveal">
    <h1 class="page-title">Интеграции с платежными аккаунтами</h1>
    <p class="page-subtitle mb-0">
      Подключайте банковские сервисы и кошельки, чтобы автоматически импортировать операции и обновлять журнал синхронизации.
    </p>
  </section>

  <div v-if="errorMessage" class="alert alert-danger mb-4" role="status">{{ errorMessage }}</div>
  <div v-if="successMessage" class="alert alert-success mb-4" role="status">{{ successMessage }}</div>

  <section class="row g-4 align-items-start">
    <div class="col-lg-8 reveal delay-1">
      <article class="glass-card p-3 p-md-4 mb-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h2 class="section-title h5 mb-0">Доступные провайдеры</h2>
          <button class="btn btn-sm btn-outline-secondary" type="button" @click="resetForm">Подключить новый</button>
        </div>

        <div v-if="isLoading" class="text-muted-custom">Загрузка провайдеров...</div>

        <div v-else-if="providers.length" class="integrations-grid">
          <ProviderCard v-for="provider in providers" :key="provider.id" :provider="provider" @manage="onManageProvider" />
        </div>

        <p v-else class="text-muted-custom mb-0">Провайдеры пока не подключены.</p>
      </article>

      <article class="glass-card p-3 p-md-4">
        <h2 class="section-title h5 mb-3">Журнал синхронизации</h2>

        <div v-if="connectedProviders.length">
          <div v-for="provider in connectedProviders" :key="provider.id" class="soft-panel p-3 mb-2">
            <div class="d-flex justify-content-between gap-2">
              <span>{{ provider.name }}</span>
              <span class="text-muted-custom">{{ provider.lastSync ? helpers.formatDate(provider.lastSync) : 'нет данных' }}</span>
            </div>
            <small class="text-muted-custom">Логин: {{ provider.login || 'не указан' }}</small>
          </div>
        </div>

        <div v-else class="soft-panel p-3">
          <small class="text-muted-custom">Подключенных провайдеров пока нет.</small>
        </div>
      </article>
    </div>

    <div class="col-lg-4 reveal delay-2">
      <article class="glass-card p-3 p-md-4 mb-4">
        <h2 class="section-title h5 mb-3">Подключение провайдера</h2>

        <div class="mb-3">
          <label class="form-label" for="providerName">Провайдер</label>
          <input id="providerName" v-model.trim="form.name" type="text" class="form-control" placeholder="Например: Tinkoff API" />
        </div>

        <div class="mb-3">
          <label class="form-label" for="providerLogin">Логин</label>
          <input id="providerLogin" v-model.trim="form.login" type="text" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label" for="providerToken">API-токен</label>
          <input id="providerToken" v-model="form.token" type="password" class="form-control" />
        </div>

        <button class="btn btn-accent w-100" type="button" @click="saveProvider">Сохранить</button>
      </article>

      <article class="glass-card p-3 p-md-4">
        <h2 class="section-title h5 mb-3">Правила импорта</h2>
        <ul class="mb-0 ps-3 d-grid gap-2">
          <li>Автоматически распознавать MCC и выставлять категорию операции.</li>
          <li>Группировать похожие траты для отчетов.</li>
          <li>Маркировать переводы между своими счетами как «перевод».</li>
        </ul>
      </article>
    </div>
  </section>
</template>
