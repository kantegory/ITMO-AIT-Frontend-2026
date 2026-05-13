<template>
  <base-layout>
    <h2 class="text-cold-beige mb-4 fw-bold">Отчёт</h2>

    <div class="widget-card mb-4">
        <h3 class="h5 text-cold-beige">Мой кошелек</h3>
        <div class="row text-center" aria-live="polite">
            <div class="col-md-4">Текущий баланс: <b>{{ formatCurrency(totalBalance) }}</b></div>
            <div class="col-md-4">Доходы: <span class="text-success">+{{ formatCurrency(totalIncome) }}</span></div>
            <div class="col-md-4">Расходы: <span class="text-danger">-{{ formatCurrency(totalExpenses) }}</span></div>
        </div>
    </div>

    <div class="widget-card mb-4">
        <div class="row g-3 align-items-center">
            <div class="col-6 col-md-3">
                <label for="monthFilter" class="visually-hidden">Фильтр по месяцу</label>
                <select id="monthFilter" v-model="filters.month" class="custom-input m-0">
                    <option value="03">Март</option>
                    <option value="02">Февраль</option>
                    <option value="all">За всё время</option>
                </select>
            </div>
            <div class="col-6 col-md-3">
                <label for="accountFilter" class="visually-hidden">Фильтр по счету</label>
                <select id="accountFilter" v-model="filters.account" class="custom-input m-0">
                    <option value="all">Bce счета</option>
                    <option value="Карта">Карта</option>
                    <option value="Наличные">Наличные</option>
                </select>
            </div>
        </div>
    </div>

    <div class="row g-4">
        <div class="col-lg-6">
            <div class="widget-card h-100">
                <h3 class="h5 text-cold-beige mb-3">Расходы по категориям</h3>
                <div class="row align-items-center">
                    <div class="col-5 d-flex justify-content-center">
                        <div id="pieChart" :style="{ background: pieGradient }" style="width: 150px; height: 150px; border-radius: 50%; border: 2px solid var(--border-color);"></div>
                    </div>

                    <div id="categoriesList" class="col-7 text-cold-beige" aria-live="polite">
                        <p v-if="filteredExpenses.length === 0" class="text-muted text-center mt-3">Нет расходов</p>
                        <ul v-else class="list-unstyled">
                          <li v-for="(stat, index) in stats" :key="index" class="mb-2 d-flex align-items-center">
                            <span :style="{ background: stat.color }" style="width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 10px;"></span>
                            {{ stat.category }}: <b class="ms-1">{{ formatCurrency(stat.sum) }}</b> 
                            <span class="ms-2 text-muted">({{ stat.percent }}%)</span>
                          </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-lg-6">
            <div class="widget-card h-100">
                <h3 class="h5 text-cold-beige mb-3">Сравнение c прошлым месяцем</h3>
                <p>Транспорт: 22к (было 18к)</p>
                <div class="progress-container"><div class="progress-fill transport" style="width: 70%;"></div></div>
                <p>Продукты: 20к (было 30к)</p>
                <div class="progress-container"><div class="progress-fill food" style="width: 45%;"></div></div>
            </div>
        </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import { mapState, mapActions } from 'pinia'
import useTransactionsStore from '../stores/transactions'
import { useFormatter } from '../composables/useFormatter'

export default {
  name: 'ReportsPage',
  components: { BaseLayout },
  setup() {
    const { formatCurrency } = useFormatter();
    return { formatCurrency };
  },
  data() {
    return {
      filters: {
        month: 'all',
        account: 'all'
      }
    }
  },
  computed: {
    ...mapState(useTransactionsStore, ['transactions']),
    
    filteredTransactions() {
      return this.transactions.filter(t => {
        const matchesMonth = this.filters.month === 'all' || t.date.includes(`.${this.filters.month}`);
        const matchesAccount = this.filters.account === 'all' || t.account === this.filters.account;
        return matchesMonth && matchesAccount;
      });
    },

    filteredExpenses() {
      return this.filteredTransactions.filter(t => t.amount < 0);
    },

    totalIncome() {
      return this.filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + Number(t.amount), 0);
    },
    totalExpenses() {
      return Math.abs(this.filteredExpenses.reduce((sum, t) => sum + Number(t.amount), 0));
    },
    totalBalance() {
      return this.totalIncome - this.totalExpenses;
    },

    stats() {
      if (this.filteredExpenses.length === 0) return [];

      const rawStats = {};
      this.filteredExpenses.forEach(t => {
        rawStats[t.category] = (rawStats[t.category] || 0) + Math.abs(t.amount);
      });

      const colors = ['var(--color-food)', 'var(--color-transport)', 'var(--color-cafe)', 'var(--gold-accent)', 'var(--color-subs)'];
      let colorIndex = 0;
      
      const result = [];
      for (let cat in rawStats) {
        result.push({
          category: cat,
          sum: rawStats[cat],
          percent: Math.round((rawStats[cat] / this.totalExpenses) * 100),
          color: colors[colorIndex % colors.length]
        });
        colorIndex++;
      }
      return result;
    },

    pieGradient() {
      if (this.stats.length === 0) return 'var(--bg-main)';
      
      let gradientStr = "";
      let currentAngle = 0;
      
      this.stats.forEach(stat => {
        gradientStr += `${stat.color} ${currentAngle}% ${currentAngle + stat.percent}%, `;
        currentAngle += stat.percent;
      });
      
      return `conic-gradient(${gradientStr.slice(0, -2)})`;
    }
  },
  methods: {
    ...mapActions(useTransactionsStore, ['loadTransactions'])
  },
  mounted() {
    this.loadTransactions();
  }
}
</script>