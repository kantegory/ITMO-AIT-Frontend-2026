<template>
  <div :data-theme="theme">
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold" href="#">Finance ITMO</a>
          <div class="d-flex align-items-center">
            <button @click="toggleTheme" class="btn btn-outline-light btn-sm me-3">Тема</button>
            <button v-if="!isLoggedIn" class="btn btn-info btn-sm" @click="isLoggedIn = true; loadDashboardData()">Демо-вход</button>
            <span v-else class="text-white">Татьяна М.</span>
          </div>
        </div>
      </nav>
    </header>

    <div class="container-fluid">
      <div class="row">
        <aside class="col-md-2 d-none d-md-block sidebar p-3 shadow">
          <div class="mb-4">
            <h6 class="mb-0">Вахменина Т. М.</h6>
            <small class="text-muted">Группа J3113</small>
          </div>
          <ul class="nav flex-column">
            <li class="nav-item"><a href="#" class="nav-link active mb-2">Дашборд</a></li>
          </ul>
        </aside>

        <main class="col-md-10 ms-sm-auto px-md-4 py-4">
          <div v-if="!isLoggedIn" class="text-center py-5">
            <h1>FinanceControl</h1>
            <p class="text-muted">Используйте демо-вход для просмотра данных</p>
          </div>

          <section v-else>
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2>Личный кабинет</h2>
              <button class="btn btn-success btn-sm" @click="loadDashboardData">Обновить</button>
            </div>

            <div class="row mb-4">
              <div class="col-md-4">
                <article class="card p-4 shadow-sm">
                  <h3 class="h6 text-muted">Общий баланс</h3>
                  <p class="h2 my-2">{{ balance.toLocaleString() }} ₽</p>
                </article>
              </div>
            </div>

            <div class="card shadow-sm">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Категория</th>
                      <th class="text-end">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="tx in transactions" :key="tx.id">
                      <td>{{ tx.date }}</td>
                      <td>{{ tx.category }}</td>
                      <td class="text-end" :style="{ color: tx.amount < 0 ? '#e63946' : '#2a9d8f' }">
                        {{ tx.amount.toLocaleString() }} ₽
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')
const isLoggedIn = ref(false)
const balance = ref(0)
const transactions = ref([])

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}

async function loadDashboardData() {
  try {
    const [tRes, pRes] = await Promise.all([
      fetch('http://localhost:3000/transactions'),
      fetch('http://localhost:3000/profile')
    ])
    transactions.value = await tRes.json()
    const profile = await pRes.json()
    balance.value = profile.balance
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
.sidebar { min-height: 100vh; background-color: var(--sidebar-bg); }
.card { background-color: var(--bg-card); color: var(--text-main); }
[data-theme="dark"] {
  --bg-body: #121212;
  --bg-card: #1e1e1e;
  --text-main: #f8f9fa;
  --sidebar-bg: #000000;
}
</style>