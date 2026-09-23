<script setup>
import { onMounted, reactive, ref } from "vue";
import PageLoading from "../components/common/PageLoading.vue";
import { useSession } from "../composables/useSession";
import { fetchJson } from "../services/api";
import { formatCompactCurrency, formatCurrency, formatDate, formatNumber, getProgressBarClass } from "../utils/formatters";

const { getAuthHeaders } = useSession();

const isLoading = ref(true);
const pageError = ref("");
const formMessage = ref("");
const formMessageClass = ref("alert-success");
const isSubmitting = ref(false);

const organizer = ref(null);
const stats = ref({
  activeEvents: 0,
  soldTickets: 0,
  revenue: 0,
  returnsPercent: 0
});
const sales = ref([]);
const events = ref([]);
const formRef = ref(null);

const form = reactive({
  title: "",
  type: "concert",
  city: "moscow",
  place: "",
  date: "",
  price: "",
  description: ""
});

async function loadDashboard() {
  isLoading.value = true;
  pageError.value = "";

  try {
    const response = await fetchJson("/organizer/dashboard", {
      headers: getAuthHeaders()
    });

    organizer.value = response.organizer;
    stats.value = response.stats;
    sales.value = response.sales;
    events.value = response.events;
  } catch (error) {
    pageError.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

async function submitEvent() {
  formMessage.value = "";

  if (!formRef.value?.reportValidity()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetchJson("/organizer/events", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: form.title.trim(),
        type: form.type,
        city: form.city,
        place: form.place.trim(),
        date: form.date,
        price: Number(form.price),
        description: form.description.trim()
      })
    });

    formMessage.value = response.message;
    formMessageClass.value = "alert-success";

    form.title = "";
    form.type = "concert";
    form.city = "moscow";
    form.place = "";
    form.date = "";
    form.price = "";
    form.description = "";

    await loadDashboard();
  } catch (error) {
    formMessage.value = error.message;
    formMessageClass.value = "alert-danger";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(loadDashboard);
</script>

<template>
  <div class="container">
    <div v-if="pageError" class="alert alert-danger" role="status" aria-live="polite">
      {{ pageError }}
    </div>

    <PageLoading v-if="isLoading">Загрузка кабинета организатора...</PageLoading>

    <template v-else>
      <section class="mb-4">
        <h1 class="h3 fw-bold mb-2">Личный кабинет организатора</h1>
        <p class="text-secondary mb-3">Аккаунт: <strong>{{ organizer?.firstName }} {{ organizer?.lastName }}</strong></p>

        <div class="row g-3">
          <div class="col-sm-6 col-xl-3">
            <article class="stats-tile">
              <p class="text-secondary mb-1">Активных событий</p>
              <p class="stats-value mb-0">{{ stats.activeEvents }}</p>
            </article>
          </div>

          <div class="col-sm-6 col-xl-3">
            <article class="stats-tile">
              <p class="text-secondary mb-1">Продано билетов</p>
              <p class="stats-value mb-0">{{ formatNumber(stats.soldTickets) }}</p>
            </article>
          </div>

          <div class="col-sm-6 col-xl-3">
            <article class="stats-tile">
              <p class="text-secondary mb-1">Выручка</p>
              <p class="stats-value mb-0">{{ formatCompactCurrency(stats.revenue) }}</p>
            </article>
          </div>

          <div class="col-sm-6 col-xl-3">
            <article class="stats-tile">
              <p class="text-secondary mb-1">Возвраты</p>
              <p class="stats-value mb-0">{{ stats.returnsPercent.toFixed(1) }}%</p>
            </article>
          </div>
        </div>
      </section>

      <div class="row g-4">
        <section class="col-lg-5">
          <div class="card h-100">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold mb-3">Создать новое событие</h2>

              <form ref="formRef" novalidate @submit.prevent="submitEvent">
                <fieldset class="mb-0">
                  <legend class="form-legend">Параметры нового события</legend>

                  <div class="mb-3">
                    <label for="eventTitle" class="form-label">Название</label>
                    <input id="eventTitle" v-model="form.title" type="text" class="form-control" required placeholder="Например, Summer Sound Festival">
                  </div>

                  <div class="row g-3">
                    <div class="col-md-6">
                      <label for="eventType" class="form-label">Тип</label>
                      <select id="eventType" v-model="form.type" class="form-select" required>
                        <option value="concert">Концерт</option>
                        <option value="theater">Театр</option>
                        <option value="festival">Фестиваль</option>
                        <option value="sport">Спорт</option>
                      </select>
                    </div>

                    <div class="col-md-6">
                      <label for="eventCityField" class="form-label">Город</label>
                      <select id="eventCityField" v-model="form.city" class="form-select" required>
                        <option value="moscow">Москва</option>
                        <option value="spb">Санкт-Петербург</option>
                        <option value="kazan">Казань</option>
                      </select>
                    </div>
                  </div>

                  <div class="mb-3 mt-3">
                    <label for="eventPlace" class="form-label">Место проведения</label>
                    <input id="eventPlace" v-model="form.place" type="text" class="form-control" required placeholder="Площадка или адрес">
                  </div>

                  <div class="mb-3">
                    <label for="eventDateField" class="form-label">Дата</label>
                    <input id="eventDateField" v-model="form.date" type="date" class="form-control" required>
                  </div>

                  <div class="mb-3">
                    <label for="eventPrice" class="form-label">Базовая цена, ₽</label>
                    <input id="eventPrice" v-model="form.price" type="number" min="500" step="100" class="form-control" required placeholder="2500">
                    <div class="form-hint">Минимальная цена: 500 ₽, шаг изменения: 100 ₽.</div>
                  </div>

                  <div class="mb-4">
                    <label for="eventDescriptionField" class="form-label">Описание</label>
                    <textarea id="eventDescriptionField" v-model="form.description" class="form-control" rows="4" placeholder="Короткое описание события"></textarea>
                  </div>
                </fieldset>

                <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
                  {{ isSubmitting ? "Сохраняем..." : "Добавить событие" }}
                </button>
              </form>

              <div v-if="formMessage" class="alert mt-3" :class="formMessageClass" role="status" aria-live="polite">
                {{ formMessage }}
              </div>
            </div>
          </div>
        </section>

        <section class="col-lg-7">
          <div class="card mb-4">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold mb-3">Управление продажами</h2>
              <div class="table-responsive">
                <table class="table align-middle mb-0">
                  <caption class="table-caption">Статистика проданных билетов и текущей заполняемости.</caption>
                  <thead>
                    <tr>
                      <th scope="col">Событие</th>
                      <th scope="col">Продано</th>
                      <th scope="col">Заполняемость</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in sales" :key="item.id">
                      <th scope="row">{{ item.title }}</th>
                      <td>{{ formatNumber(item.soldTickets) }}</td>
                      <td>
                        <div
                          class="progress"
                          role="progressbar"
                          :aria-label="`Заполняемость ${item.title}`"
                          :aria-valuenow="item.occupancyPercent"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div class="progress-bar" :class="getProgressBarClass(item.occupancyPercent)" :style="{ width: `${item.occupancyPercent}%` }">
                            {{ item.occupancyPercent }}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="h5 fw-bold mb-0">Список событий</h2>
                <span class="badge text-bg-secondary">Черновики и активные</span>
              </div>

              <div class="table-responsive">
                <table class="table align-middle mb-0">
                  <caption class="table-caption">Список событий организатора со статусом публикации и ценой.</caption>
                  <thead>
                    <tr>
                      <th scope="col">Название</th>
                      <th scope="col">Место</th>
                      <th scope="col">Дата</th>
                      <th scope="col">Цена</th>
                      <th scope="col">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="event in events" :key="event.id">
                      <th scope="row">{{ event.title }}</th>
                      <td>{{ event.venue }}</td>
                      <td>{{ formatDate(event.dateTime) }}</td>
                      <td>{{ formatCurrency(event.price) }}</td>
                      <td>
                        <span class="badge" :class="event.status === 'published' ? 'text-bg-success' : 'text-bg-warning'">
                          {{ event.status === "published" ? "Опубликовано" : "Черновик" }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>
