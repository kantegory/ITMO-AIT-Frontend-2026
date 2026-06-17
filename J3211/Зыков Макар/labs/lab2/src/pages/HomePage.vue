<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import PageLoading from "../components/common/PageLoading.vue";
import { fetchJson } from "../services/api";

const eventsCount = ref("...");
const statusMessage = ref("Проверяем доступность mock API...");
const statusClass = ref("status-note mb-0 mt-3");
const isChecking = ref(true);

async function loadSummary() {
  try {
    const events = await fetchJson("/events");
    eventsCount.value = String(events.length);
    statusMessage.value = "Mock API подключено и отвечает.";
    statusClass.value = "status-note text-success mb-0 mt-3";
  } catch (error) {
    eventsCount.value = "0";
    statusMessage.value = "Mock API недоступно. Сначала запустите `npm run api`.";
    statusClass.value = "status-note text-danger mb-0 mt-3";
  } finally {
    isChecking.value = false;
  }
}

onMounted(loadSummary);
</script>

<template>
  <div class="container">
    <section class="hero p-4 p-lg-5 mb-4 mb-lg-5" aria-labelledby="homeHeroTitle">
      <div class="row align-items-center g-4">
        <div class="col-lg-7">
          <span class="quick-chip bg-light text-primary">Домашняя работа 5</span>
          <h1 id="homeHeroTitle" class="display-6 fw-bold mt-3">Vue SPA на основе проекта из lab2</h1>
          <p class="lead mb-4">
            Приложение переведено на компонентный подход Vue.js: маршрутизация, авторизация, работа с mock API,
            кабинеты пользователя и организатора теперь работают внутри одного SPA.
          </p>
          <div class="d-flex flex-wrap gap-2 mb-4">
            <RouterLink class="btn btn-light btn-lg" to="/events">Открыть афишу</RouterLink>
            <RouterLink class="btn btn-outline-light btn-lg" :to="{ name: 'login' }">Проверить вход</RouterLink>
          </div>

          <div class="hero-status-grid">
            <article class="status-card">
              <p class="status-label">Событий в API</p>
              <p class="status-value">{{ eventsCount }}</p>
            </article>
            <article class="status-card">
              <p class="status-label">Стек</p>
              <p class="status-value status-value-sm">Vue + Vue Router + Vite</p>
            </article>
          </div>

          <p :class="statusClass">{{ statusMessage }}</p>
        </div>

        <div class="col-lg-5">
          <img
            class="img-fluid rounded-4 shadow"
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
            alt="Концертная сцена и зрители"
          >
        </div>
      </div>
    </section>

    <section class="mb-4 mb-lg-5" aria-labelledby="demoAccountsTitle">
      <div class="row g-3">
        <div class="col-lg-6">
          <article class="card h-100">
            <div class="card-body p-4">
              <h2 id="demoAccountsTitle" class="h5 fw-bold mb-3">Демо-аккаунты</h2>
              <ul class="demo-credentials list-unstyled mb-0">
                <li class="demo-credentials-card">
                  <p class="fw-semibold mb-1">Покупатель</p>
                  <p class="mb-1"><strong>Email:</strong> makary.zykov@mail.com</p>
                  <p class="mb-0"><strong>Пароль:</strong> frontend123</p>
                </li>
                <li class="demo-credentials-card">
                  <p class="fw-semibold mb-1">Организатор</p>
                  <p class="mb-1"><strong>Email:</strong> organizer@makarsevent.ru</p>
                  <p class="mb-0"><strong>Пароль:</strong> frontend123</p>
                </li>
              </ul>
            </div>
          </article>
        </div>

        <div class="col-lg-6">
          <article class="card h-100">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold mb-3">Запуск проекта</h2>
              <pre class="command-block mb-0"><code>npm install
npm run api
npm run dev</code></pre>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section aria-labelledby="projectPagesTitle">
      <h2 id="projectPagesTitle" class="section-title">Компоненты и разделы SPA</h2>
      <div class="row g-3 g-lg-4" role="list">
        <div class="col-md-6 col-xl-4">
          <article class="card h-100" role="listitem">
            <div class="card-body">
              <h3 class="h5">Главная страница</h3>
              <p class="mb-3 text-secondary">Hero-блок, статус API, команды запуска и демо-аккаунты.</p>
              <RouterLink class="btn btn-outline-primary" to="/">Открыть</RouterLink>
            </div>
          </article>
        </div>

        <div class="col-md-6 col-xl-4">
          <article class="card h-100" role="listitem">
            <div class="card-body">
              <h3 class="h5">Поиск мероприятий</h3>
              <p class="mb-3 text-secondary">Фильтрация событий по типу, городу и ближайшим датам.</p>
              <RouterLink class="btn btn-outline-primary" to="/events">Открыть</RouterLink>
            </div>
          </article>
        </div>

        <div class="col-md-6 col-xl-4">
          <article class="card h-100" role="listitem">
            <div class="card-body">
              <h3 class="h5">Страница мероприятия</h3>
              <p class="mb-3 text-secondary">Выбор мест, покупка билетов, отзывы и похожие события.</p>
              <RouterLink class="btn btn-outline-primary" :to="{ name: 'event-details', params: { id: 1 } }">
                Открыть
              </RouterLink>
            </div>
          </article>
        </div>

        <div class="col-md-6 col-xl-4">
          <article class="card h-100" role="listitem">
            <div class="card-body">
              <h3 class="h5">Авторизация</h3>
              <p class="mb-3 text-secondary">Отдельные Vue-страницы входа и регистрации с валидацией.</p>
              <RouterLink class="btn btn-outline-primary" :to="{ name: 'login' }">Открыть</RouterLink>
            </div>
          </article>
        </div>

        <div class="col-md-6 col-xl-4">
          <article class="card h-100" role="listitem">
            <div class="card-body">
              <h3 class="h5">Кабинет пользователя</h3>
              <p class="mb-3 text-secondary">Профиль, активные билеты и история возвратов.</p>
              <RouterLink class="btn btn-outline-primary" :to="{ name: 'user-cabinet' }">Открыть</RouterLink>
            </div>
          </article>
        </div>

        <div class="col-md-6 col-xl-4">
          <article class="card h-100" role="listitem">
            <div class="card-body">
              <h3 class="h5">Кабинет организатора</h3>
              <p class="mb-3 text-secondary">Статистика продаж и форма создания нового события.</p>
              <RouterLink class="btn btn-outline-primary" :to="{ name: 'organizer-cabinet' }">
                Открыть
              </RouterLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <PageLoading v-if="isChecking" class="mt-4">Проверка API завершится через пару секунд...</PageLoading>
  </div>
</template>
