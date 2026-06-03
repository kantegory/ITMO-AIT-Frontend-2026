<template>
  <section class="content-card mb-3" aria-label="Фильтры транзакций">
    <div class="row g-2 filter-row">
      <div class="col-12 col-md-4">
        <label class="visually-hidden" for="search-input">Поиск по транзакциям</label>
        <div class="input-group">
          <span class="input-group-text search-icon border-end-0" aria-hidden="true">
            <Icon name="search" :size="18" />
          </span>
          <input
            id="search-input"
            type="search"
            class="form-control border-start-0"
            placeholder="Поиск по транзакциям"
            aria-label="Поиск по транзакциям"
            :value="filters.q"
            @input="update('q', $event.target.value)"
          />
        </div>
      </div>
      <div class="col-6 col-md-2">
        <label class="visually-hidden" for="category-filter">Категория</label>
        <select id="category-filter" class="form-select" aria-label="Фильтр по категории" :value="filters.category" @change="update('category', $event.target.value)">
          <option value="">Категория</option>
          <option v-for="c in categories" :key="c">{{ c }}</option>
        </select>
      </div>
      <div class="col-6 col-md-2">
        <label class="visually-hidden" for="amount-from">Сумма от</label>
        <input
          id="amount-from"
          type="number"
          class="form-control"
          placeholder="Сумма от"
          aria-label="Минимальная сумма"
          :value="filters.amountFrom"
          @input="update('amountFrom', $event.target.value)"
        />
      </div>
      <div class="col-6 col-md-2">
        <label class="visually-hidden" for="date-from">Дата от</label>
        <input
          id="date-from"
          type="date"
          class="form-control"
          aria-label="Дата начала периода"
          :value="filters.dateFrom"
          @change="update('dateFrom', $event.target.value)"
        />
      </div>
      <div class="col-6 col-md-2">
        <label class="visually-hidden" for="date-to">Дата до</label>
        <input
          id="date-to"
          type="date"
          class="form-control"
          aria-label="Дата конца периода"
          :value="filters.dateTo"
          @change="update('dateTo', $event.target.value)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import Icon from './Icon.vue'

const props = defineProps({ filters: { type: Object, required: true } })

const categories = [
  'Доход', 'Продукты', 'Транспорт', 'Развлечения',
  'Жильё', 'Техника', 'Авто', 'Крупная покупка', 'Накопления'
]

function update(key, value) {
  props.filters[key] = value
}
</script>
