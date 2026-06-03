<script setup>
const props = defineProps({ modelValue: Object })
const emit = defineEmits(['update:modelValue'])

const update = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>

<template>
  <article class="card p-3 border-0 shadow-sm mb-4">
    <div class="row g-3">
      <div class="col-md-4">
        <input type="text" class="form-control" placeholder="Поиск по описанию..."
               :value="modelValue.search"
               @input="update('search', $event.target.value)">
      </div>
      <div class="col-md-4">
        <select class="form-select"
                :value="modelValue.account"
                @change="update('account', $event.target.value)">
          <option value="all">Все счета</option>
          <option value="Зарплатная">Зарплатная карта</option>
          <option value="Наличные">Наличные</option>
          <option value="Кредитная">Кредитная карта</option>
        </select>
      </div>
      <div class="col-md-4">
        <select class="form-select"
                :value="modelValue.category"
                @change="update('category', $event.target.value)">
          <option value="all">Все категории</option>
          <option value="food">Еда</option>
          <option value="transport">Транспорт</option>
          <option value="income">Поступления / Зарплата</option>
          <option value="transfers">Переводы</option>
        </select>
      </div>
    </div>
  </article>
</template>
