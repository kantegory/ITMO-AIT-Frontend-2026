<template>
  <main class="container">
    <div class="row g-4">
      <div class="col-lg-5">
        <section class="card p-4 shadow-sm border-0 h-100">
          <h2 class="fw-bold h5 mb-3">Связь с банком</h2>
          <div class="p-3 rounded-3 mb-3 text-center border">
             <span :class="isConnected ? 'text-success fw-bold' : 'text-muted fw-bold'">
               Статус: {{ isConnected ? 'Подключено' : 'Не подключено' }}
             </span>
          </div>
          <button class="btn btn-primary w-100 py-2 fw-bold" @click="importMocks">
            {{ isConnected ? 'Обновить данные' : 'Подключить и импортировать' }}
          </button>
        </section>
      </div>

      <div class="col-lg-7">
        <section class="card p-4 shadow-sm border-0 h-100">
          <h2 class="fw-bold h5 mb-1">Настройка правил</h2>
          <div class="row g-2 mb-4">
            <div class="col-5"><input v-model="newRule.keyword" class="form-control" placeholder="Слово (Uber)"></div>
            <div class="col-5"><input v-model="newRule.category" class="form-control" placeholder="Категория (Такси)">
            </div>
            <div class="col-2">
              <button class="btn btn-success w-100" @click="addRule">+</button>
            </div>
          </div>
          <div>
            <div v-for="(r, i) in rules" :key="i"
                 class="rule-card d-flex justify-content-between p-2 mb-2 border rounded">
              <div><span class="badge bg-secondary me-2">{{ r.keyword }}</span> → <b>{{ r.category }}</b></div>
              <button class="btn btn-danger btn-sm" @click="removeRule(i)">✕</button>
            </div>
            <div v-if="rules.length === 0" class="text-center text-muted small mt-3">Правила не настроены</div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useTransactions} from '../composables/useTransactions'

const {addTransaction} = useTransactions()
const userId = localStorage.getItem('currentUserId')
const isConnected = ref(localStorage.getItem(`bank_${userId}`) === 'true')

const rules = ref([])
const newRule = ref({keyword: '', category: ''})

onMounted(() => {
  rules.value = JSON.parse(localStorage.getItem(`rules_${userId}`) || '[]')
})

const addRule = () => {
  if (!newRule.value.keyword || !newRule.value.category) return
  rules.value.push({...newRule.value})
  localStorage.setItem(`rules_${userId}`, JSON.stringify(rules.value))
  newRule.value = {keyword: '', category: ''}
}

const removeRule = (i) => {
  rules.value.splice(i, 1)
  localStorage.setItem(`rules_${userId}`, JSON.stringify(rules.value))
}

const importMocks = async () => {
  const rawData = [{desc: "Yandex Go", sum: 450, type: "minus"}, {desc: "Salary", sum: 50000, type: "plus"}]

  for (const item of rawData) {
    const rule = rules.value.find(r => item.desc.toLowerCase().includes(r.keyword.toLowerCase()))
    await addTransaction({
      cat: rule ? rule.category : (item.type === 'plus' ? 'Зарплата' : 'Разное'),
      sum: item.sum,
      type: item.type,
      date: new Date().toISOString().split('T')[0]
    })
  }

  isConnected.value = true
  localStorage.setItem(`bank_${userId}`, 'true')
  alert("Импорт завершен!")
}
</script>