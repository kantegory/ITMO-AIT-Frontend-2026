<script setup>
import { ref, computed } from 'vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useAuth } from '../composables/useAuth.js'

const { role } = useAuth()

const query  = ref('')
const type   = ref('all')
const status = ref('all')

const allDocs = ref([
  { title: 'Договор аренды KR-18/26',  typeKey: 'contract',  typeLabel: 'Договор',       date: '10.01.2026', status: 'signed',   comment: 'Базовый договор по помещению 3.18.' },
  { title: 'Допсоглашение № 3',        typeKey: 'agreement', typeLabel: 'Допсоглашение', date: '13.03.2026', status: 'pending',  comment: 'Изменение индексации аренды.' },
  { title: 'Счет за март 2026',        typeKey: 'invoice',   typeLabel: 'Счет',          date: '12.03.2026', status: 'received', comment: 'Размещён в кабинете арендатора.' },
  { title: 'Акт сверки за март',       typeKey: 'act',       typeLabel: 'Акт',           date: '15.03.2026', status: 'pending',  comment: 'Нужно подписать до 20.03.2026.' },
])

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return allDocs.value.filter(d =>
    (!q                         || d.title.toLowerCase().includes(q)) &&
    (type.value  === 'all'      || d.typeKey === type.value) &&
    (status.value === 'all'     || d.status  === status.value)
  )
})

const heroTitle = computed(() =>
  role.value === 'admin' ? 'Архив и управление документами' : 'Архив договоров, счетов и актов'
)
const heroText = computed(() =>
  role.value === 'admin'
    ? 'Входящие и исходящие документы, быстрый доступ к согласованию.'
    : 'Договоры, допсоглашения, счета и акты с поиском и фильтрами.'
)
</script>

<template>
  <main class="container py-4 py-lg-5">
    <section class="hero-card mb-4">
      <div class="row g-4 align-items-end">
        <div class="col-lg-8">
          <span class="eyebrow">Архив документов</span>
          <h1>{{ heroTitle }}</h1>
          <p class="section-text">{{ heroText }}</p>
        </div>
        <div class="col-lg-4">
          <div class="stat-grid">
            <div class="stat-card"><strong>{{ filtered.length }}</strong><span>документа в выдаче</span></div>
            <div class="stat-card"><strong>4 типа</strong><span>договор, соглашение, счет, акт</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="page-card">
      <div class="row g-3">
        <div class="col-md-5">
          <label class="form-label" for="archiveQuery">Название</label>
          <input v-model="query" class="form-control" id="archiveQuery" type="search" placeholder="Например, счет или договор" />
        </div>
        <div class="col-md-4">
          <label class="form-label" for="archiveType">Тип</label>
          <select v-model="type" class="form-select" id="archiveType">
            <option value="all">Все</option>
            <option value="contract">Договор</option>
            <option value="agreement">Допсоглашение</option>
            <option value="invoice">Счет</option>
            <option value="act">Акт</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label" for="archiveStatus">Статус</label>
          <select v-model="status" class="form-select" id="archiveStatus">
            <option value="all">Все</option>
            <option value="signed">Подписан</option>
            <option value="pending">Ожидает</option>
            <option value="received">Получен</option>
          </select>
        </div>
      </div>

      <div class="table-responsive mt-4">
        <table class="table data-table align-middle">
          <thead>
            <tr><th>Документ</th><th>Тип</th><th>Дата</th><th>Статус</th><th>Комментарий</th></tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="5" class="text-body-secondary">По выбранным фильтрам ничего не найдено.</td>
            </tr>
            <tr v-for="(d, i) in filtered" :key="i">
              <td>{{ d.title }}</td>
              <td>{{ d.typeLabel }}</td>
              <td>{{ d.date }}</td>
              <td><StatusBadge :status="d.status === 'signed' ? 'accepted' : d.status" /></td>
              <td class="text-body-secondary small">{{ d.comment }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
