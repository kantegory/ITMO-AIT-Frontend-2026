<template>
  <main id="main-content" tabindex="-1">
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="container">
        <div class="row align-items-center g-4">
          <div class="col-lg-7">
            <span class="section-label">Управление финансами</span>
            <h1 id="hero-title" class="display-4 hero-title mt-3">
              Контролируйте счета, бюджеты и траты в одном интерфейсе.
            </h1>
            <p class="hero-copy">
              FinFlow помогает видеть движение денег в реальном времени, быстро находить нужные транзакции и принимать решения на основе отчётов и прогнозов.
            </p>
            <div class="d-flex flex-wrap gap-3 mt-4">
              <RouterLink class="btn btn-accent btn-lg" to="/login">Начать</RouterLink>
              <button class="btn btn-outline-dark btn-lg" type="button" @click="showQuickStart = true">
                Данные для демо
              </button>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="content-card">
              <h2 class="h4 mb-3">Что можно делать</h2>
              <ul class="list-group list-group-flush simple-list">
                <li class="list-group-item">Смотреть счета и общий баланс</li>
                <li class="list-group-item">Фильтровать транзакции по категории, сумме и дате</li>
                <li class="list-group-item">Открывать отчёты по расходам</li>
                <li class="list-group-item">Подключать банковские аккаунты</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5" aria-labelledby="pages-title">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-label">Разделы сервиса</span>
            <h2 id="pages-title" class="section-title">Основные страницы</h2>
          </div>
        </div>
        <div class="row g-4 mt-1">
          <div v-for="feature in features" :key="feature.title" class="col-md-6 col-xl-3">
            <article class="feature-card">
              <SvgIcon :name="feature.icon" class-name="feature-card__icon" />
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.copy }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>

  <div v-if="showQuickStart" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="quickStartLabel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-modal">
        <div class="modal-header border-0">
          <div>
            <span class="section-label">Демо-доступ</span>
            <h2 id="quickStartLabel" class="h4 mb-0">Быстрый вход в систему</h2>
          </div>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="showQuickStart = false"></button>
        </div>
        <div class="modal-body pt-0">
          <p class="text-secondary">Для демонстрации используйте готовый профиль и перейдите в личный кабинет.</p>
          <div class="quick-access-card">
            <div>
              <small class="text-uppercase text-secondary">Логин</small>
              <div class="fw-semibold">demo@finflow.ru</div>
            </div>
            <div>
              <small class="text-uppercase text-secondary">Пароль</small>
              <div class="fw-semibold">FinFlow2026</div>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0">
          <RouterLink class="btn btn-accent w-100" to="/login" @click="showQuickStart = false">Открыть страницу входа</RouterLink>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showQuickStart" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import SvgIcon from "@/components/SvgIcon.vue";

const showQuickStart = ref(false);

const features = [
  { icon: "shield-lock", title: "Вход и регистрация", copy: "Отдельные формы с быстрыми сценариями входа и создания аккаунта." },
  { icon: "wallet", title: "Личный кабинет", copy: "Счета, бюджеты, быстрые действия и список транзакций на одной странице." },
  { icon: "funnel", title: "Фильтры", copy: "Поиск транзакций по категории, сумме и дате с мгновенным откликом." },
  { icon: "chart", title: "Отчёты", copy: "Графики расходов, разбивка по категориям и краткий финансовый прогноз." },
];
</script>
