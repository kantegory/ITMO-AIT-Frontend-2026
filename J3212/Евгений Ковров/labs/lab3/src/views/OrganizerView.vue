<template>
  <section class="view-section organizer-view-section">
    <div class="organizer-heading">
      <div>
        <p class="eyebrow">Организатор</p>
        <h1>Кабинет организатора</h1>
        <p class="view-description">События, продажи, статусы и быстрые действия в одном месте.</p>
      </div>

      <button class="button-link organizer-heading__action" type="button" @click="openCreateForm">
        Создать событие
      </button>
    </div>

    <EventEditorForm
      v-if="isEditorVisible"
      v-model:form="eventForm"
      :mode="editorMode"
      :is-submitting="isSubmitting"
      :message="editorMessage"
      :message-type="editorMessageType"
      @submit="handleEventSubmit"
      @cancel="closeEditor"
    />

    <div class="organizer-layout">
      <aside class="organizer-sidebar">
        <section class="organizer-panel">
          <h2 class="organizer-panel__title">Сводка</h2>
          <div class="organizer-summary">
            <div class="organizer-summary__row">
              <span>Активных событий</span>
              <strong>{{ summary.activeEvents }}</strong>
            </div>
            <div class="organizer-summary__row">
              <span>Билетов продано</span>
              <strong>{{ summary.soldTickets }}</strong>
            </div>
            <div class="organizer-summary__row">
              <span>Возвраты</span>
              <strong>0</strong>
            </div>
          </div>

          <div class="organizer-summary__money">
            <span>Текущий баланс</span>
            <strong>{{ formatCurrency(summary.currentBalance) }}</strong>
            <small>Ожидает выплаты: {{ formatCurrency(summary.pendingPayout) }}</small>
          </div>
        </section>

        <section class="organizer-panel">
          <h2 class="organizer-panel__title">Быстрые настройки</h2>
          <form class="auth-form" @submit.prevent="saveSettings">
            <label class="auth-form__field">
              <span>Имя организатора</span>
              <input v-model="settings.name" type="text" />
            </label>
            <label class="auth-form__field">
              <span>Эл. почта для уведомлений</span>
              <input v-model="settings.email" type="email" />
            </label>
            <label class="auth-form__field">
              <span>Телефон поддержки</span>
              <input v-model="settings.phone" type="text" />
            </label>

            <div v-if="settingsMessage" class="state-box" :class="settingsMessageClass">
              {{ settingsMessage }}
            </div>

            <button class="button-link organizer-panel__submit" type="submit">Сохранить</button>
          </form>
        </section>

        <section class="organizer-panel">
          <h2 class="organizer-panel__title">Выплаты</h2>
          <form class="auth-form" @submit.prevent="requestPayout">
            <label class="auth-form__field">
              <span>Доступно к выплате</span>
              <input :value="formatCurrency(summary.currentBalance)" type="text" readonly />
            </label>
            <label class="auth-form__field">
              <span>Сумма</span>
              <input v-model.number="payout.amount" type="number" min="0" />
            </label>
            <label class="auth-form__field">
              <span>Счёт</span>
              <input v-model="payout.account" type="text" />
            </label>

            <div v-if="payoutMessage" class="state-box" :class="payoutMessageClass">
              {{ payoutMessage }}
            </div>

            <button class="button-link organizer-panel__submit" type="submit">Запросить выплату</button>
          </form>
        </section>
      </aside>

      <div class="organizer-content">
        <section class="organizer-panel">
          <div class="organizer-toolbar">
            <h2 class="organizer-panel__title">Мои события</h2>
            <div class="organizer-toolbar__filters">
              <label class="visually-hidden" for="organizerSearch">Поиск событий</label>
              <input
                id="organizerSearch"
                v-model="search"
                class="organizer-toolbar__input"
                type="search"
                placeholder="Поиск по названию"
              />

              <label class="visually-hidden" for="organizerStatusFilter">Фильтр статуса</label>
              <select id="organizerStatusFilter" v-model="statusFilter" class="organizer-toolbar__select">
                <option value="Все статусы">Все статусы</option>
                <option value="Опубликовано">Опубликовано</option>
                <option value="Черновик">Черновик</option>
                <option value="Завершено">Завершено</option>
                <option value="Приостановлено">Приостановлено</option>
              </select>
            </div>
          </div>

          <div v-if="pageMessage" class="state-box" :class="pageMessageClass">{{ pageMessage }}</div>
          <div v-if="isLoading" class="state-box">Загрузка событий...</div>
          <div v-else-if="error" class="state-box state-box--error">{{ error }}</div>
          <div v-else-if="!filteredEvents.length" class="state-box">
            События по текущим фильтрам не найдены.
          </div>
          <div v-else class="organizer-table-wrapper">
            <table class="organizer-table">
              <thead>
                <tr>
                  <th>Событие</th>
                  <th>Дата</th>
                  <th>Продажи</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in filteredEvents" :key="event.id">
                  <td>
                    <div class="organizer-event__title">{{ event.title }}</div>
                    <div class="organizer-event__meta">{{ event.city }} · {{ event.venue }}</div>
                  </td>
                  <td>{{ formatShortDate(event.date, event.time) }}</td>
                  <td>
                    <div class="organizer-sales">
                      <div class="organizer-sales__meta">
                        <span>{{ getSoldCount(event) }} / {{ event.capacity }}</span>
                        <span>{{ getSoldPercent(event) }}%</span>
                      </div>
                      <div class="organizer-sales__track">
                        <span class="organizer-sales__fill" :style="{ width: `${getSoldPercent(event)}%` }" />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="organizer-status" :class="getStatusClass(event.status)">
                      {{ event.status || 'Опубликовано' }}
                    </span>
                  </td>
                  <td>
                    <div class="organizer-actions">
                      <RouterLink class="button-link button-link--ghost organizer-actions__link" :to="`/events/${event.id}`">
                        Открыть
                      </RouterLink>
                      <button class="app-nav__button organizer-actions__button" type="button" @click="startEdit(event)">
                        Редактировать
                      </button>
                      <button class="app-nav__button organizer-actions__button" type="button" @click="showSalesInfo(event)">
                        Продажи
                      </button>
                      <button
                        class="app-nav__button organizer-actions__button"
                        type="button"
                        :disabled="(event.status || 'Опубликовано') === 'Черновик'"
                        @click="toggleSales(event)"
                      >
                        {{ (event.status || 'Опубликовано') === 'Приостановлено' ? 'Возобновить' : 'Остановить' }}
                      </button>
                      <button
                        class="app-nav__button organizer-actions__button"
                        :class="{ 'organizer-actions__button--danger': (event.status || 'Опубликовано') !== 'Черновик' }"
                        type="button"
                        @click="togglePublication(event)"
                      >
                        {{ (event.status || 'Опубликовано') === 'Черновик' ? 'Опубликовать' : 'Снять с публикации' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import EventEditorForm from '../components/EventEditorForm.vue';
import { useEvents } from '../composables/useEvents';

const SETTINGS_STORAGE_KEY = 'kontramarkaOrganizerSettings';
const PAYOUTS_STORAGE_KEY = 'kontramarkaOrganizerPayouts';
const DEFAULT_SETTINGS = {
  name: 'Северная Сцена',
  email: 'team@severscene.ru',
  phone: '+7 812 600-12-12'
};

const {
  events,
  isLoading,
  isSubmitting,
  error,
  loadEvents,
  createEvent,
  updateEvent
} = useEvents();

const search = ref('');
const statusFilter = ref('Все статусы');
const pageMessage = ref('');
const pageMessageType = ref('');
const editorMode = ref('create');
const isEditorVisible = ref(false);
const editingEventId = ref('');
const editorMessage = ref('');
const editorMessageType = ref('');
const settings = reactive(loadStoredSettings());
const settingsMessage = ref('');
const settingsMessageType = ref('');
const payout = reactive({
  amount: 0,
  account: ''
});
const payoutMessage = ref('');
const payoutMessageType = ref('');
const eventForm = reactive(createDefaultEventForm());

const filteredEvents = computed(() => {
  const normalizedSearch = search.value.trim().toLowerCase();

  return events.value.filter((event) => {
    const matchesSearch = !normalizedSearch || [event.title, event.city, event.venue]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);

    const eventStatus = event.status || 'Опубликовано';
    const matchesStatus = statusFilter.value === 'Все статусы' || eventStatus === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const summary = computed(() => {
  const activeEvents = events.value.filter((event) => (event.status || 'Опубликовано') === 'Опубликовано').length;
  const soldTickets = events.value.reduce((total, event) => total + getSoldCount(event), 0);
  const pendingPayout = Math.round(soldTickets * 350);
  const requestedPayouts = loadStoredPayouts().reduce((total, item) => total + Number(item.amount || 0), 0);

  return {
    activeEvents,
    soldTickets,
    pendingPayout,
    currentBalance: Math.max(0, pendingPayout - requestedPayouts)
  };
});

const pageMessageClass = computed(() => {
  if (pageMessageType.value === 'error') {
    return 'state-box--error';
  }

  if (pageMessageType.value === 'success') {
    return 'state-box--success';
  }

  return '';
});

const settingsMessageClass = computed(() => settingsMessageType.value === 'error' ? 'state-box--error' : 'state-box--success');
const payoutMessageClass = computed(() => payoutMessageType.value === 'error' ? 'state-box--error' : 'state-box--success');

function createDefaultEventForm() {
  return {
    title: '',
    category: 'Концерт',
    city: '',
    venue: '',
    date: '',
    time: '',
    capacity: 120,
    price: 1200,
    age: '18+',
    description: '',
    image: ''
  };
}

function loadStoredSettings() {
  try {
    return {
      ...DEFAULT_SETTINGS,
      ...(JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY)) || {})
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function loadStoredPayouts() {
  try {
    return JSON.parse(localStorage.getItem(PAYOUTS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveStoredPayouts(items) {
  localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(items));
}

function applyFormValues(values) {
  Object.assign(eventForm, createDefaultEventForm(), values);
}

function setPageMessage(text, type = 'success') {
  pageMessage.value = text;
  pageMessageType.value = type;
}

function resetEditorMessages() {
  editorMessage.value = '';
  editorMessageType.value = '';
}

function openCreateForm() {
  editorMode.value = 'create';
  editingEventId.value = '';
  isEditorVisible.value = true;
  applyFormValues(createDefaultEventForm());
  resetEditorMessages();
}

function startEdit(event) {
  editorMode.value = 'edit';
  editingEventId.value = String(event.id);
  isEditorVisible.value = true;
  applyFormValues({
    title: event.title,
    category: event.category,
    city: event.city,
    venue: event.venue,
    date: event.date,
    time: event.time,
    capacity: Number(event.capacity || event.availableTickets || 120),
    price: Number(event.price || 0),
    age: event.age || '18+',
    description: event.description || '',
    image: event.image || ''
  });
  resetEditorMessages();
}

function closeEditor() {
  isEditorVisible.value = false;
  editingEventId.value = '';
  applyFormValues(createDefaultEventForm());
  resetEditorMessages();
}

function validateForm() {
  if (
    !eventForm.title.trim() ||
    !eventForm.city.trim() ||
    !eventForm.venue.trim() ||
    !eventForm.date ||
    !eventForm.time ||
    Number(eventForm.capacity) <= 0 ||
    Number(eventForm.price) < 0
  ) {
    editorMessage.value = 'Заполните обязательные поля события корректно.';
    editorMessageType.value = 'error';
    return false;
  }

  return true;
}

function buildEventPayload() {
  const currentEvent = events.value.find((event) => String(event.id) === String(editingEventId.value));
  const capacity = Number(eventForm.capacity || 0);

  return {
    ...(editingEventId.value ? { id: editingEventId.value } : {}),
    title: eventForm.title.trim(),
    description: eventForm.description.trim() || 'Описание события будет добавлено организатором позже.',
    date: eventForm.date,
    time: eventForm.time,
    city: eventForm.city.trim(),
    venue: eventForm.venue.trim(),
    price: Number(eventForm.price || 0),
    image: eventForm.image.trim() || 'https://placehold.co/800x500/1f2633/e6edf6?text=Событие',
    category: eventForm.category,
    availableTickets: capacity,
    capacity,
    age: eventForm.age,
    status: editingEventId.value ? (currentEvent?.status || 'Опубликовано') : 'Опубликовано'
  };
}

async function handleEventSubmit() {
  if (!validateForm()) {
    return;
  }

  try {
    if (editorMode.value === 'edit' && editingEventId.value) {
      await updateEvent(editingEventId.value, buildEventPayload());
      editorMessage.value = 'Событие обновлено.';
    } else {
      await createEvent(buildEventPayload());
      editorMessage.value = 'Событие создано.';
    }

    editorMessageType.value = 'success';
    setPageMessage(editorMessage.value, 'success');
    window.setTimeout(closeEditor, 500);
  } catch {
    editorMessage.value = 'Не удалось сохранить событие. Попробуйте позже.';
    editorMessageType.value = 'error';
  }
}

async function toggleSales(event) {
  if ((event.status || 'Опубликовано') === 'Черновик') {
    setPageMessage('Сначала опубликуйте событие, чтобы управлять продажами.', 'error');
    return;
  }

  const nextStatus = (event.status || 'Опубликовано') === 'Приостановлено' ? 'Опубликовано' : 'Приостановлено';

  try {
    await updateEvent(event.id, { ...event, status: nextStatus });
    setPageMessage(nextStatus === 'Приостановлено' ? 'Продажи остановлены.' : 'Продажи снова активны.', 'success');
  } catch {
    setPageMessage('Не удалось изменить статус продаж.', 'error');
  }
}

async function togglePublication(event) {
  const nextStatus = (event.status || 'Опубликовано') === 'Черновик' ? 'Опубликовано' : 'Черновик';

  try {
    await updateEvent(event.id, { ...event, status: nextStatus });
    setPageMessage(
      nextStatus === 'Черновик'
        ? 'Событие снято с публикации и переведено в черновик.'
        : 'Событие снова опубликовано и доступно пользователям.',
      'success'
    );
  } catch {
    setPageMessage('Не удалось изменить публикацию события.', 'error');
  }
}

function showSalesInfo(event) {
  const sold = getSoldCount(event);
  const revenue = sold * Number(event.price || 0);
  setPageMessage(`Продано ${sold} из ${event.capacity} билетов. Выручка: ${formatCurrency(revenue)}.`, 'success');
}

function saveSettings() {
  if (!settings.name.trim() || !settings.email.trim() || !settings.phone.trim()) {
    settingsMessage.value = 'Заполните все поля настроек.';
    settingsMessageType.value = 'error';
    return;
  }

  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
    name: settings.name.trim(),
    email: settings.email.trim(),
    phone: settings.phone.trim()
  }));

  settingsMessage.value = 'Настройки организатора сохранены.';
  settingsMessageType.value = 'success';
}

function requestPayout() {
  if (Number(payout.amount || 0) <= 0 || !payout.account.trim()) {
    payoutMessage.value = 'Укажите сумму и счёт для выплаты.';
    payoutMessageType.value = 'error';
    return;
  }

  const payouts = loadStoredPayouts();
  payouts.push({
    id: Date.now(),
    amount: Number(payout.amount),
    account: payout.account.trim(),
    createdAt: new Date().toISOString()
  });
  saveStoredPayouts(payouts);

  payout.amount = summary.value.currentBalance;
  payout.account = '';
  payoutMessage.value = 'Запрос на выплату отправлен.';
  payoutMessageType.value = 'success';
}

function getSoldCount(event) {
  return Math.max(0, Number(event.capacity || 0) - Number(event.availableTickets || 0));
}

function getSoldPercent(event) {
  const capacity = Number(event.capacity || 0);
  return capacity > 0 ? Math.min(100, Math.round((getSoldCount(event) / capacity) * 100)) : 0;
}

function getStatusClass(status) {
  if (status === 'Опубликовано') {
    return 'organizer-status--success';
  }

  if (status === 'Черновик') {
    return 'organizer-status--muted';
  }

  if (status === 'Приостановлено') {
    return 'organizer-status--warning';
  }

  return '';
}

function formatShortDate(date, time) {
  const parsedDate = new Date(`${date}T${time || '00:00'}`);
  if (Number.isNaN(parsedDate.getTime())) {
    return `${date} ${time || ''}`.trim();
  }

  return `${parsedDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })} ${time || ''}`.trim();
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
}

onMounted(async () => {
  try {
    await loadEvents({ includeAll: true });
    payout.amount = summary.value.currentBalance;
  } catch {
    // Error state is handled in the composable.
  }
});
</script>
