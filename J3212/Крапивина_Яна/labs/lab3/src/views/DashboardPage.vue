<template>
  <base-layout>
    <div class="text-start"> 
      <h2 class="mb-5 fw-bold">Личный кабинет</h2>

      <div class="row g-4 mb-4" aria-live="polite">
          <div class="col-md-4">
            <div class="widget-card border-blue text-center p-4">
              <h3 class="h5 mb-2 text-muted">Общий баланс</h3>
              <h2 class="fw-bold m-0">{{ formatCurrency(totalBalance) }}</h2>
            </div>
          </div>
          <div class="col-md-4">
            <div class="widget-card border-teal text-center p-4">
              <h3 class="h5 mb-2 text-muted">Доходы</h3>
              <h2 class="text-success fw-bold m-0">+{{ formatCurrency(totalIncome) }}</h2>
            </div>
          </div>
          <div class="col-md-4">
            <div class="widget-card border-orange text-center p-4">
              <h3 class="h5 mb-2 text-muted">Расходы</h3>
              <h2 class="text-danger fw-bold m-0">-{{ formatCurrency(totalExpenses) }}</h2>
            </div>
          </div>
      </div>

      <div class="widget-card border-gold mb-4 p-4">
          <h3 class="h5 mb-3 d-flex align-items-center">
            <svg class="icon-svg me-2" style="width: 20px; height: 20px;"><use href="#icon-bank"></use></svg>
            Курсы валют (ЦБ РФ)
          </h3>
          <div class="d-flex gap-5" aria-live="polite">
              <div v-if="!rates.usd" class="text-muted small">Загрузка данных...</div>
              <div v-else class="d-flex gap-5">
                <div>USD: <b class="ms-1">{{ rates.usd }} ₽</b></div>
                <div>EUR: <b class="ms-1">{{ rates.eur }} ₽</b></div>
              </div>
          </div>
      </div>

      <div class="widget-card mb-4 p-4">
          <h3 class="h5 mb-4">Последние операции</h3>
          <div class="table-responsive">
            <table class="table m-0">
                <thead>
                    <tr class="small text-muted text-uppercase">
                        <th>Дата</th>
                        <th>Описание</th>
                        <th class="text-end">Сумма</th>
                    </tr>
                </thead>
                <tbody>
                  <tr v-for="t in recentTransactions" :key="t.id">
                    <td class="py-3 text-muted">{{ t.date }}</td>
                    <td class="py-3 fw-medium">{{ t.description || 'Без описания' }}</td>
                    <td class="py-3 fw-bold text-end" :class="t.amount < 0 ? 'text-danger' : 'text-success'">
                      {{ t.amount > 0 ? '+' : '' }}{{ formatCurrency(t.amount) }}
                    </td>
                  </tr>
                  <tr v-if="recentTransactions.length === 0">
                    <td colspan="3" class="text-center py-5 text-muted">У вас пока нет транзакций</td>
                  </tr>
                </tbody>
            </table>
          </div>
          <router-link to="/transactions" class="btn-widget d-block text-center mt-3 text-decoration-none">Смотреть всё</router-link>
      </div>
      
      <div class="row g-4">
          <div class="col-lg-6">
              <div class="widget-card border-indigo h-100 p-4">
                  <h3 class="h5 mb-4">Динамика по категориям</h3>
                  <div v-for="(val, cat) in progress" :key="cat" class="mb-3">
                    <div class="d-flex justify-content-between mb-2">
                      <span class="small fw-bold">{{ cat }}</span>
                      <span class="small text-muted">{{ val }}%</span>
                    </div>
                    <div class="progress-container">
                      <div class="progress-fill" :class="getCatClass(cat)" :style="{width: val + '%'}"></div>
                    </div>
                  </div>
              </div>
          </div>

          <div class="col-lg-6">
              <div class="widget-card border-gold h-100 p-4">
                  <h3 class="h5 mb-4">Быстрый перевод</h3>
                  <form @submit.prevent="handleQuickTransfer">
                      <div class="mb-3">
                        <label class="small text-muted mb-2">Номер карты получателя</label>
                        <input type="text" v-model="transferForm.card" class="custom-input" placeholder="0000 0000 0000 0000" required>
                      </div>
                      <div class="mb-3">
                        <label class="small text-muted mb-2">Сумма перевода (₽)</label>
                        <input type="number" v-model="transferForm.amount" class="custom-input" placeholder="Введите сумму" required>
                      </div>
                      <button type="submit" class="btn-custom mt-2">Отправить деньги</button>
                  </form>
              </div>
          </div>
      </div>
    </div>

    <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content text-center p-4 border-success bg-deep-blue">
          <div class="text-success mb-3" style="font-size: 3.5rem;">✔</div>
          <h5 class="fw-bold text-white">Перевод выполнен!</h5>
          <p class="small text-muted">Средства будут зачислены в течение нескольких минут</p>
          <button class="btn-custom mt-3" data-bs-dismiss="modal">Отлично</button>
        </div>
      </div>
    </div>

  </base-layout>
</template>

<script setup>
import BaseLayout from '../layouts/BaseLayout.vue'
import { ref, computed, onMounted } from 'vue'
import useTransactionsStore from '../stores/transactions'
import { useFormatter } from '../composables/useFormatter'
import * as bootstrap from 'bootstrap'

const { formatCurrency } = useFormatter()
const store = useTransactionsStore()
const rates = ref({ usd: null, eur: null })

const transferForm = ref({ card: '', amount: null })

const totalIncome = computed(() => {
  return store.transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0)
})

const totalExpenses = computed(() => {
  return Math.abs(
    store.transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Number(t.amount), 0)
  )
})

const totalBalance = computed(() => totalIncome.value - totalExpenses.value)

const recentTransactions = computed(() => {
  return [...store.transactions].reverse().slice(0, 3)
})

const progress = computed(() => {
    const stats = { "Продукты": 0, "Транспорт": 0, "Развлечения": 0, "Подписки": 0, "Другое": 0 };
    const expenses = store.transactions.filter(t => t.amount < 0);
    
    expenses.forEach(t => { 
      if (stats[t.category] !== undefined) stats[t.category] += Math.abs(t.amount); 
      else stats["Другое"] += Math.abs(t.amount); 
    });
    
    const res = {}; 
    for(let k in stats) {
      res[k] = totalExpenses.value ? Math.round(stats[k] / totalExpenses.value * 100) : 0;
    }
    return res;
})

const getCatClass = (cat) => { 
  const map = {
    "Продукты": "food", 
    "Транспорт": "transport", 
    "Развлечения": "cafe", 
    "Подписки": "subs", 
    "Другое": "transfers"
  }; 
  return map[cat] || "transfers"; 
}

const handleQuickTransfer = async () => {
  if (!transferForm.value.amount) return

  await store.createTransaction({
    description: `Перевод на карту *${transferForm.value.card.slice(-4)}`,
    amount: -Number(transferForm.value.amount),
    category: 'Другое',
    date: new Date().toLocaleDateString('ru-RU').slice(0, 5),
    account: 'Карта'
  })

  const modalElem = document.getElementById('successModal')
  const modal = new bootstrap.Modal(modalElem)
  modal.show()

  transferForm.value.card = ''
  transferForm.value.amount = null
}

const loadRates = async () => { 
  try { 
    const r = await fetch('https://www.cbr-xml-daily.ru/daily_json.js'); 
    const d = await r.json(); 
    rates.value.usd = d.Valute.USD.Value.toFixed(2); 
    rates.value.eur = d.Valute.EUR.Value.toFixed(2); 
  } catch(e) {
    console.error("Курсы валют временно недоступны");
  } 
}

onMounted(() => {
  store.loadTransactions();
  loadRates();
})
</script>

<style scoped>
.table tbody tr:hover {
  background-color: var(--bg-hover) !important;
}

.icon-svg {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
}
</style>