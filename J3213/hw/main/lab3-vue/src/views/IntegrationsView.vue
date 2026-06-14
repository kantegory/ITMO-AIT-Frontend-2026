<script setup>
import { onMounted } from 'vue'
import { useTransactions } from '../composables/useTransactions'

const { accounts, transactions, loadAll } = useTransactions()

onMounted(() => {
  loadAll()
})
</script>

<template>
  <section class="container">
    <div class="row g-4">
      <div class="col-lg-8">
        <article class="surface-card h-100">
          <div class="badge-soft mb-3">Интеграции</div>
          <h1 class="section-title mb-3">Интеграции и импорт</h1>
          <p class="muted mb-4">Подключай платёжные аккаунты, запускай импорт операций и настраивай правила автоматической обработки транзакций.</p>
          <div class="row g-3">
            <div class="col-md-4">
              <article class="stat-card h-100">
                <div class="muted">Подключено аккаунтов</div>
                <div class="display-6 fw-bold mt-2">{{ accounts.length }}</div>
              </article>
            </div>
            <div class="col-md-4">
              <article class="stat-card h-100">
                <div class="muted">Импортов за месяц</div>
                <div class="display-6 fw-bold mt-2">3</div>
              </article>
            </div>
            <div class="col-md-4">
              <article class="stat-card h-100">
                <div class="muted">Активных правил</div>
                <div class="display-6 fw-bold mt-2">3</div>
              </article>
            </div>
          </div>
        </article>
      </div>
      <div class="col-lg-4">
        <article class="surface-card h-100">
          <h2 class="h3 mb-3">Источники</h2>
          <div class="d-grid gap-3">
            <div class="stat-card">
              <div class="fw-semibold">Сбер</div>
              <div class="muted">Подключён, импорт раз в сутки</div>
            </div>
            <div class="stat-card">
              <div class="fw-semibold">Т-Банк</div>
              <div class="muted">Подключён, ручной импорт доступен</div>
            </div>
            <div class="stat-card">
              <div class="fw-semibold">Новый аккаунт</div>
              <div class="muted">Можно подключить ещё один источник</div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="row g-4 mt-1">
      <div class="col-lg-7">
        <article class="surface-card h-100">
          <h2 class="h3 mb-3">Подключение аккаунта</h2>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Провайдер</label>
              <select class="form-select">
                <option>Сбер</option>
                <option>Т-Банк</option>
                <option>ЮMoney</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Режим синхронизации</label>
              <select class="form-select">
                <option>Автоматически раз в сутки</option>
                <option>Только вручную</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Маска счёта</label>
              <input class="form-control" type="text" placeholder="**** 4589">
            </div>
            <div class="col-md-6">
              <label class="form-label">Импортировать с даты</label>
              <input class="form-control" type="date" value="2026-03-01">
            </div>
          </div>
        </article>
      </div>
      <div class="col-lg-5">
        <article class="surface-card h-100">
          <h2 class="h3 mb-3">Правила импорта</h2>
          <div class="d-grid gap-3">
            <div class="stat-card">
              <div class="fw-semibold">Пятёрочка → Продукты</div>
              <div class="muted">Автокатегоризация трат по описанию операции.</div>
            </div>
            <div class="stat-card">
              <div class="fw-semibold">РЖД / Метро → Транспорт</div>
              <div class="muted">Правило для перевозчиков и проездных списаний.</div>
            </div>
            <div class="stat-card">
              <div class="fw-semibold">Расход > 10 000 ₽ → Крупный расход</div>
              <div class="muted">Флаг и отдельная обработка больших списаний.</div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="row g-4 mt-1">
      <div class="col-12">
        <article class="surface-card">
          <h2 class="h3 mb-3">Последние импортированные операции</h2>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Описание</th>
                  <th>Категория</th>
                  <th>Счёт</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in transactions.slice(0, 5)" :key="item.id">
                  <td>{{ item.date }}</td>
                  <td>{{ item.description }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.account }}</td>
                  <td>{{ Number(item.amount).toLocaleString('ru-RU') }} ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
