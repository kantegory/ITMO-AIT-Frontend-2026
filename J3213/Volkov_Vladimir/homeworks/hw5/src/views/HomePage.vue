<template>
  <BaseLayout>
    <section class="hero-card mb-4">
      <div class="row g-4 align-items-center">
        <div class="col-lg-7">
          <span class="chip mb-3">Сервис для управления личными финансами</span>
          <h1 class="display-5 fw-bold mb-3">
            Управляйте расходами, доходами и бюджетами в одном интерфейсе
          </h1>
          <p class="section-subtitle mb-4">
            MoneyFlow помогает удобно управлять личными финансами: отслеживать счета,
            контролировать доходы и расходы, планировать бюджеты и анализировать свои
            финансовые привычки.
          </p>
          <div class="d-flex flex-wrap gap-3">
            <RouterLink class="btn btn-primary btn-lg rounded-pill px-4" to="/dashboard">
              Открыть кабинет
            </RouterLink>
            <RouterLink class="btn btn-outline-dark btn-lg rounded-pill px-4" to="/register">
              Регистрация
            </RouterLink>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="page-card">
            <div class="row g-3">
              <div class="col-6">
                <div class="metric-card h-100 border-0 shadow-none bg-primary-subtle">
                  <div class="metric-label">Баланс</div>
                  <div class="metric-value">₽ 264 540</div>
                </div>
              </div>
              <div class="col-6">
                <div class="metric-card h-100 border-0 shadow-none bg-success-subtle">
                  <div class="metric-label">Доход за месяц</div>
                  <div class="metric-value">₽ 142 000</div>
                </div>
              </div>
              <div class="col-12">
                <div class="metric-card border-0 shadow-none bg-light">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="metric-label">Данные пользователя</span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar bg-warning" style="width: 72%"></div>
                  </div>
                  <p class="small text-secondary mt-3 mb-0">
                    Счета, транзакции, бюджеты и правила загружаются автоматически.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="page-card h-100">
          <h2 class="h5 fw-bold">Вход и регистрация</h2>
          <p class="text-secondary mb-0">Подключены к JSON Server через axios.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="page-card h-100">
          <h2 class="h5 fw-bold">Личный кабинет</h2>
          <p class="text-secondary mb-0">Счета, транзакции и бюджеты загружаются с API.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="page-card h-100">
          <h2 class="h5 fw-bold">Отчёты и интеграции</h2>
          <p class="text-secondary mb-0">Страница отчётов и правила построены на Vue.</p>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
</script>
