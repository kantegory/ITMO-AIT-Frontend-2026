<template>
  <base-layout>
    <h1 class="h2 mb-4">Сводка по счетам</h1>

    <div class="row mb-5">
      <div class="col-md-4 mb-3" v-for="acc in computedAccounts" :key="acc.name">
        <account-card :name="acc.name" :type="acc.type" :balance="acc.balance" />
      </div>
    </div>

    <div class="card p-4 shadow-sm">
      <h2 class="h5 mb-3">Новая транзакция</h2>
      <form @submit.prevent="submitTransaction">
        <div class="mb-3">
          <label class="form-label">Счёт</label>
          <select class="form-select" v-model="form.accountName" required>
            <option value="Зарплатная карта">Зарплатная карта</option>
            <option value="Наличные">Наличные</option>
            <option value="Кредитная карта">Кредитная карта</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Описание</label>
          <input type="text" class="form-control" v-model="form.description" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Сумма (₽)</label>
          <input type="number" class="form-control" v-model="form.amount" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Сохранить</button>
      </form>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
import AccountCard from '@/components/AccountCard.vue'

export default {
  name: 'DashboardPage',
  components: { BaseLayout, AccountCard },
  data() {
    return {
      form: { transType: 'expense', accountName: 'Зарплатная карта', description: '', amount: null, category: 'food' },
      transactions: [],
      baseAccounts: [
        { name: 'Зарплатная карта', type: 'primary', balance: 0 },
        { name: 'Наличные', type: 'success', balance: 0 },
        { name: 'Кредитная карта', type: 'credit', balance: 0 }
      ]
    }
  },
  computed: {
    computedAccounts() {
      let accounts = JSON.parse(JSON.stringify(this.baseAccounts));
      this.transactions.forEach(t => {
        let acc = accounts.find(a => a.name === t.accountName);
        if (acc) acc.balance += (t.transType === 'expense' ? -parseFloat(t.amount) : parseFloat(t.amount));
      });
      return accounts;
    }
  },
  methods: {
    submitTransaction() {
      this.transactions.push({ ...this.form });
      this.form.description = '';
      this.form.amount = null;
      alert('Транзакция добавлена!');
    }
  }
}
</script>
