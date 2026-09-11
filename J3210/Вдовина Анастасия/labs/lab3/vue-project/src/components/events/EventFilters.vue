<template>
  <form class="row g-3 align-items-end mb-4" role="search" aria-label="Фильтр мероприятий" @submit.prevent="$emit('apply')">
    <div class="col-12 col-md-4 col-lg-3">
      <label for="query" class="form-label">Поиск по названию</label>
      <input
        id="query"
        :value="modelValue.query"
        type="search"
        class="form-control"
        placeholder="Например: Москва или Пицца"
        @input="update('query', $event.target.value)"
      />
    </div>

    <div class="col-6 col-md-4 col-lg-2">
      <label for="type" class="form-label">Тип</label>
      <select id="type" :value="modelValue.type" class="form-select" @change="update('type', $event.target.value)">
        <option value="">Любой</option>
        <option value="concert">Концерт</option>
        <option value="festival">Фестиваль</option>
      </select>
    </div>

    <div class="col-6 col-md-4 col-lg-2">
      <label for="city" class="form-label">Город</label>
      <select id="city" :value="modelValue.city" class="form-select" @change="update('city', $event.target.value)">
        <option value="">Любой</option>
        <option value="spb">Санкт-Петербург</option>
        <option value="msk">Москва</option>
        <option value="istra">Истра</option>
        <option value="suzdal">Суздаль</option>
        <option value="izhevsk">Ижевск</option>
        <option value="tver">Тверь</option>
        <option value="kamyshin">Камышин</option>
        <option value="tomsk">Томск</option>
        <option value="krapivna">Крапивна</option>
        <option value="kologriv">Кологрив</option>
        <option value="molebka">Молёбка</option>
      </select>
    </div>

    <div class="col-6 col-md-4 col-lg-2">
      <label for="date" class="form-label">Дата, от</label>
      <input
        id="date"
        :value="modelValue.date"
        type="date"
        class="form-control"
        @input="update('date', $event.target.value)"
      />
    </div>

    <div class="col-6 col-md-8 col-lg-3 d-flex gap-2">
      <button type="submit" class="btn btn-brand flex-fill"><icon-component name="search" /> Применить</button>
      <button type="button" class="btn btn-outline-secondary" @click="$emit('reset')">Сбросить</button>
    </div>
  </form>
</template>

<script>
import IconComponent from '@/components/common/IconComponent.vue'

export default {
  name: 'EventFilters',
  components: { IconComponent },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue', 'apply', 'reset'],
  methods: {
    update(field, value) {
      this.$emit('update:modelValue', { ...this.modelValue, [field]: value })
    },
  },
}
</script>
