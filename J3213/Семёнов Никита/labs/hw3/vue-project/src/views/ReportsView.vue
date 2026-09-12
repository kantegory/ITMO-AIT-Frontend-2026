<template>
  <NavBar />
  <main class="container">
    <section class="row justify-content-center">
      <div class="col-lg-8 mb-4">
        <div class="card shadow-sm">
          <div class="card-header fw-bold">Структура расходов по категориям</div>
          <div class="card-body d-flex justify-content-center">
            <div style="width: 100%; max-width: 500px;">
              <canvas id="expenseChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'
import NavBar from '../components/NavBar.vue'

const user = JSON.parse(localStorage.getItem('app_session'))

onMounted(async () => {
  if (!user) return

  const res = await fetch(`http://localhost:3000/transactions?userId=${user.id}`)
  const data = await res.json()
  
  // Считаем расходы по категориям (как в старом script.js)
  const expenses = data.filter(t => t.amount < 0)
  const categories = {}
  expenses.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount)
  })

  const ctx = document.getElementById('expenseChart')
  const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark'
  const textColor = isDark ? '#f8f9fa' : '#666'

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#0d6efd', '#6f42c1'],
        borderWidth: 2,
        borderColor: isDark ? '#212529' : '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { 
          position: 'bottom',
          labels: { color: textColor }
        }
      }
    }
  })
})
</script>