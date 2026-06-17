<template>
  <base-layout>
    <h2 class="text-light mb-4">Мои транзакции</h2>
    
    <div class="card bg-dark border-secondary p-4 mb-5 text-light">
      <h5>Добавить операцию</h5>
      <form ref="transForm" @submit.prevent="addTransaction" class="d-flex flex-column gap-3 mt-3">
        <input type="text" v-model="form.description" class="form-control bg-secondary text-light border-0" placeholder="Описание" required>
        <input type="number" v-model="form.amount" class="form-control bg-secondary text-light border-0" placeholder="Сумма" required>
        <select v-model="form.category" class="form-select bg-secondary text-light border-0" required>
            <option value="" disabled selected>Выберите категорию</option>
            <option>Продукты</option>
            <option>Транспорт</option>
            <option>Доходы</option>
            <option>Другое</option>
        </select>
        <button type="submit" class="btn btn-primary mt-2">Сохранить</button>
      </form>
    </div>

    <h4 class="text-light mb-3">История операций</h4>
    <div id="transactions-list">
      <transaction-card 
        v-for="item in transactions" 
        :key="item.id"
        :description="item.description"
        :date="item.date"
        :category="item.category"
        :amount="item.amount"
      />
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import TransactionCard from '../components/TransactionCard.vue'
import { mapActions, mapState } from 'pinia'
import useTransactionsStore from '../stores/transactions'

export default {
  name: 'TransactionsPage',
  components: { BaseLayout, TransactionCard },
  data() {
    return {
      form: {
        description: '',
        amount: null,
        category: '',
        date: new Date().toLocaleDateString('ru-RU').slice(0, 5),
        account: "Карта"
      }
    }
  },
  computed: {
    ...mapState(useTransactionsStore, ['transactions'])
  },
  methods: {
    ...mapActions(useTransactionsStore, ['loadTransactions', 'createTransaction']),
    async addTransaction() {
      await this.createTransaction(this.form)
      
      this.form.description = ''
      this.form.amount = null
      this.form.category = ''
    }
  },
  mounted() {
    document.body.style.backgroundColor = "#0A192F";
    this.loadTransactions()
  }
}
</script>