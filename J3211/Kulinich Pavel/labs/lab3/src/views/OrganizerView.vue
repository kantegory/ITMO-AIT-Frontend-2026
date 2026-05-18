<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useOrganizerEvents } from '../composables/useOrganizerEvents';
import { useAlert } from '../composables/useAlert';
import { useFormValidation } from '../composables/useFormValidation';
import OrganizerEventCard from '../components/OrganizerEventCard.vue';
import AlertMessage from '../components/AlertMessage.vue';

const { organizerEvents, loading, error, fetchOrganizerEvents, createOrganizerEvent } = useOrganizerEvents();
const { alert, showAlert } = useAlert();
const { wasValidated, validateForm, resetValidation } = useFormValidation();

const formRef = ref(null);
const form = reactive({
  title: '',
  type: '',
  date: '',
  location: '',
  description: ''
});

const stats = [
  { label: 'Активных событий', value: '12' },
  { label: 'Продано билетов', value: '2 458' },
  { label: 'Выручка', value: '6.2M' }
];

async function handleSubmit() {
  if (!validateForm(formRef.value)) return;

  try {
    await createOrganizerEvent({ ...form });
    showAlert('success', 'Событие успешно сохранено.');
    Object.assign(form, { title: '', type: '', date: '', location: '', description: '' });
    resetValidation();
  } catch {
    showAlert('danger', 'Ошибка сохранения события.');
  }
}

onMounted(fetchOrganizerEvents);
</script>

<template>
  <main class="py-5">
    <div class="container">
      <header class="mb-4">
        <h1 class="fw-bold">Личный кабинет организатора</h1>
        <p class="text-secondary">Создание событий и управление продажами билетов.</p>
      </header>

      <div class="row g-4">
        <section class="col-lg-5">
          <article class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <h2 class="h4 fw-bold mb-3">Создать событие</h2>
              <form
                ref="formRef"
                novalidate
                :class="{ 'was-validated': wasValidated }"
                @submit.prevent="handleSubmit"
              >
                <div class="mb-3">
                  <label class="form-label" for="orgTitle">Название</label>
                  <input id="orgTitle" v-model="form.title" class="form-control" required>
                </div>

                <div class="mb-3">
                  <label class="form-label" for="orgType">Тип</label>
                  <select id="orgType" v-model="form.type" class="form-select" required>
                    <option value="">Выберите тип</option>
                    <option>Концерт</option>
                    <option>Театр</option>
                    <option>Выставка</option>
                    <option>Спорт</option>
                    <option>Стендап</option>
                  </select>
                </div>

                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label" for="orgDate">Дата</label>
                    <input id="orgDate" v-model="form.date" type="date" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="orgPlace">Город</label>
                    <input id="orgPlace" v-model="form.location" class="form-control" required>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label" for="orgDescription">Описание</label>
                  <textarea
                    id="orgDescription"
                    v-model="form.description"
                    class="form-control"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <button class="btn btn-primary w-100" type="submit">Сохранить событие</button>
              </form>

              <section class="mt-3">
                <AlertMessage :type="alert.type" :text="alert.text" />
              </section>
            </div>
          </article>
        </section>

        <section class="col-lg-7">
          <div class="row g-3 mb-3">
            <div v-for="stat in stats" :key="stat.label" class="col-md-4">
              <article class="stat-card rounded-4 p-4 shadow-sm h-100">
                <p class="small text-secondary mb-1">{{ stat.label }}</p>
                <p class="display-6 fw-bold mb-0">{{ stat.value }}</p>
              </article>
            </div>
          </div>

          <section class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <h2 class="h4 fw-bold mb-3">Мои события</h2>
              <div v-if="loading" class="alert alert-info">Загружаем события...</div>
              <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
              <section v-else class="row g-3">
                <div v-if="!organizerEvents.length" class="col-12">
                  <div class="alert alert-secondary mb-0">Пока нет созданных событий.</div>
                </div>
                <div v-for="event in organizerEvents" :key="event.id" class="col-md-6">
                  <OrganizerEventCard :event="event" />
                </div>
              </section>
            </div>
          </section>
        </section>
      </div>
    </div>
  </main>
</template>
