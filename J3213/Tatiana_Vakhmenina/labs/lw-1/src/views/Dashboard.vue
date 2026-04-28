<template>
  <div class="row">
    <aside class="col-md-2 sidebar p-3 shadow">
      <h6>Вахменина Т. М.</h6>
      <nav class="nav flex-column mt-3">
        <router-link to="/dashboard" class="nav-link active">Дашборд</router-link>
        <router-link to="/" class="nav-link text-danger">Выход</router-link>
      </nav>
    </aside>

    <main class="col-md-10 p-4">
      <h2>Личный кабинет</h2>
      
      <div class="card p-4 mb-4 shadow-sm" style="max-width: 300px;">
        <h3 class="h6 text-muted">Баланс</h3>
        <p class="h2" v-if="!loading">{{ balance.toLocaleString() }} ₽</p>
        <p v-else>Загрузка...</p>
      </div>

      <div class="card shadow-sm p-3">
        <h5>Последние транзакции</h5>
        <table class="table mt-3">
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
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFinance } from '../composables/useFinance'

const { transactions, balance, loading, fetchFinancialData } = useFinance()

onMounted(fetchFinancialData)
</script>