<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'reset'])

const update = (key, value) => {
    emit('update:modelValue', {...props.modelValue, [key]: value})
}
</script>

<template>
    <aside class="col-lg-3 mb-4">
        <div class="card border-0 p-4">
            <h2 class="fw-bold mb-4 h5">Фильтры</h2>

            <div class="mb-3">
                <label for="search" class="form-label small fw-bold">Поиск</label>
                <input
                    :value="modelValue.search"
                    @input="update('search', $event.target.value)"
                    type="text" class="form-control" id="search" placeholder="Название курса"
                >
            </div>

            <div class="mb-3">
                <label for="filter" class="form-label small fw-bold">Предмет</label>
                <select
                    :value="modelValue.category"
                    @change="update('category', $event.target.value)"
                    class="form-select" id="filter"
                >
                    <option value="all">Все предметы</option>
                    <option value="Программирование">Программирование</option>
                    <option value="Дизайн">Дизайн</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="levelFilter" class="form-label small fw-bold">Уровень</label>
                <select
                    :value="modelValue.level"
                    @change="update('level', $event.target.value)"
                    class="form-select" id="levelFilter"
                >
                    <option value="all">Любой уровень</option>
                    <option value="Новичок">Новичок</option>
                    <option value="Средний">Средний</option>
                </select>
            </div>

            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label id="priceLabel" for="priceFilter" class="form-label small fw-bold mb-0">Цена
                        до:</label>
                    <span id="priceValue" class="small fw-bold">{{ modelValue.maxPrice }} ₽</span>
                </div>
                <input
                    :value="modelValue.maxPrice"
                    @input="update('maxPrice', $event.target.value)"
                    type="range" class="form-range" id="priceFilter" min="0" max="20000" step="1000"
                >
            </div>

            <button class="btn btn-outline-secondary w-100" @click="$emit('reset')">Сбросить всё
            </button>
        </div>
    </aside>
</template>
