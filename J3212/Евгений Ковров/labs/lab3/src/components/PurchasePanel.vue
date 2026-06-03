<template>
  <section class="purchase-panel">
    <div class="purchase-panel__header">
      <div>
        <p class="purchase-panel__eyebrow">Покупка билетов</p>
        <h2 class="purchase-panel__title">Билеты и доступность</h2>
      </div>
      <div class="purchase-panel__price">{{ formattedPrice }}</div>
    </div>

    <div class="purchase-panel__grid">
      <div class="details-card">
        <span class="details-card__label">Статус продажи</span>
        <strong>{{ saleStatusText }}</strong>
      </div>
      <div class="details-card">
        <span class="details-card__label">Доступно билетов</span>
        <strong>{{ ticketsText }}</strong>
      </div>
    </div>

    <button class="button-link purchase-panel__submit" type="button" :disabled="isButtonDisabled" @click="openModal">
      {{ actionButtonText }}
    </button>

    <div v-if="processingMessage" class="state-box">{{ processingMessage }}</div>
    <div v-if="successMessage" class="state-box state-box--success">{{ successMessage }}</div>
    <div v-if="errorMessage && !isModalOpen" class="state-box state-box--error">{{ errorMessage }}</div>

    <Teleport to="body">
      <div v-if="isModalOpen" class="purchase-modal" @click.self="closeModal">
        <div class="purchase-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="purchaseModalTitle">
          <button class="purchase-modal__close" type="button" aria-label="Закрыть окно покупки" @click="closeModal">
            ×
          </button>

          <div class="purchase-modal__header">
            <p class="purchase-panel__eyebrow">Покупка билетов</p>
            <h2 id="purchaseModalTitle" class="purchase-modal__title">{{ event.title }}</h2>
            <p class="purchase-modal__meta">{{ event.city }} · {{ event.venue }}</p>
          </div>

          <div class="purchase-modal__content">
            <div class="purchase-panel__grid">
              <div class="details-card">
                <span class="details-card__label">Цена</span>
                <strong>{{ formattedPrice }}</strong>
              </div>
              <div class="details-card">
                <span class="details-card__label">Доступно билетов</span>
                <strong>{{ ticketsText }}</strong>
              </div>
            </div>

            <div v-if="processingMessage" class="state-box">{{ processingMessage }}</div>
            <div v-if="successMessage" class="state-box state-box--success">{{ successMessage }}</div>
            <div v-if="errorMessage" class="state-box state-box--error">{{ errorMessage }}</div>

            <div v-if="!isAuthenticated" class="purchase-panel__guest">
              <p class="view-description">Чтобы купить билет, войдите в аккаунт.</p>
              <RouterLink class="button-link" :to="loginLink" @click="closeModal">Войти и продолжить</RouterLink>
            </div>

            <div v-else-if="!isPublished" class="state-box">
              <span v-if="status === 'Приостановлено'">
                Продажа билетов на это мероприятие временно приостановлена.
              </span>
              <span v-else>
                Мероприятие снято с публикации и недоступно для покупки.
              </span>
            </div>

            <div v-else-if="availableTickets <= 0" class="state-box">
              Билеты на это мероприятие закончились.
            </div>

            <form v-else class="purchase-panel__form" @submit.prevent="$emit('purchase')">
              <label class="auth-form__field purchase-panel__field" for="ticketQuantity">
                <span>Количество билетов</span>
                <select
                  id="ticketQuantity"
                  :value="quantity"
                  class="purchase-panel__select"
                  :disabled="isSubmitting"
                  @change="$emit('update:quantity', Number($event.target.value))"
                >
                  <option v-for="value in quantityOptions" :key="value" :value="value">
                    {{ value }}
                  </option>
                </select>
              </label>

              <button class="button-link purchase-panel__submit" type="submit" :disabled="isSubmitting">
                {{ buttonText }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div v-if="toastVisible" class="purchase-toast" role="status" aria-live="polite">
        <div class="purchase-toast__title">Покупка завершена</div>
        <div>{{ toastMessage }}</div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  processingMessage: {
    type: String,
    default: ''
  },
  successMessage: {
    type: String,
    default: ''
  },
  loginLink: {
    type: Object,
    required: true
  }
});

defineEmits(['purchase', 'update:quantity']);

const isModalOpen = ref(false);
const toastVisible = ref(false);
const toastMessage = ref('');
let closeTimerId = null;
let toastTimerId = null;
let toastHideTimerId = null;

const status = computed(() => props.event.status || 'Опубликовано');
const isPublished = computed(() => status.value === 'Опубликовано');
const availableTickets = computed(() => Number(props.event.availableTickets || 0));

const quantityOptions = computed(() => {
  const limit = Math.max(1, Math.min(availableTickets.value, 4));
  return Array.from({ length: limit }, (_, index) => index + 1);
});

const formattedPrice = computed(() => `${Number(props.event.price || 0).toLocaleString('ru-RU')} ₽`);

const ticketsText = computed(() => {
  return availableTickets.value > 0 ? `${availableTickets.value} шт.` : 'Нет в наличии';
});

const saleStatusText = computed(() => {
  if (status.value === 'Приостановлено') {
    return 'Продажа приостановлена';
  }

  if (status.value === 'Черновик') {
    return 'Не опубликовано';
  }

  return availableTickets.value > 0 ? 'Билеты доступны' : 'Нет в наличии';
});

const buttonText = computed(() => {
  if (props.isSubmitting) {
    return 'Оформляем заказ...';
  }

  return 'Купить билет';
});

const actionButtonText = computed(() => {
  if (!props.isAuthenticated) {
    return 'Войти для покупки';
  }

  if (!isPublished.value) {
    return status.value === 'Приостановлено' ? 'Продажи остановлены' : 'Недоступно';
  }

  if (availableTickets.value <= 0) {
    return 'Билеты закончились';
  }

  return 'Купить билет';
});

const isButtonDisabled = computed(() => {
  return props.isSubmitting;
});

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

function clearTimers() {
  if (closeTimerId) {
    window.clearTimeout(closeTimerId);
    closeTimerId = null;
  }

  if (toastTimerId) {
    window.clearTimeout(toastTimerId);
    toastTimerId = null;
  }

  if (toastHideTimerId) {
    window.clearTimeout(toastHideTimerId);
    toastHideTimerId = null;
  }
}

function showToast(message) {
  toastMessage.value = message;
  toastVisible.value = true;

  if (toastHideTimerId) {
    window.clearTimeout(toastHideTimerId);
  }

  toastHideTimerId = window.setTimeout(() => {
    toastVisible.value = false;
    toastHideTimerId = null;
  }, 4200);
}

watch(isModalOpen, (opened) => {
  document.body.style.overflow = opened ? 'hidden' : '';
});

watch(() => props.successMessage, (message) => {
  if (!message) {
    return;
  }

  clearTimers();

  closeTimerId = window.setTimeout(() => {
    closeModal();
    closeTimerId = null;
  }, 900);

  toastTimerId = window.setTimeout(() => {
    showToast(message);
    toastTimerId = null;
  }, 1150);
});

onBeforeUnmount(() => {
  clearTimers();
  document.body.style.overflow = '';
});
</script>
