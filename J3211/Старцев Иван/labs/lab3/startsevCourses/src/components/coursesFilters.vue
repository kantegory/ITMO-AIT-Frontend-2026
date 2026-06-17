<script setup>
const props = defineProps({
    idPrefix: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    minPrice: {
        type: String,
        required: true,
    },
    maxPrice: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
})

const emit = defineEmits([
    'update:level',
    'update:minPrice',
    'update:maxPrice',
    'update:language',
])
</script>

<template>
    <div class="mb-3">
        <label :for="`${idPrefix}Level`" class="form-label">Сложность</label>
        <select
            :id="`${idPrefix}Level`"
            :value="props.level"
            class="form-select"
            @change="emit('update:level', $event.target.value)"
        >
            <option value="any">Любая</option>
            <option value="Начальный">Начальный</option>
            <option value="Средний">Средний</option>
            <option value="Продвинутый">Продвинутый</option>
        </select>
    </div>

    <fieldset class="mb-3">
        <legend class="form-label">Цена</legend>

        <div class="row g-2">
            <div class="col-6">
                <label :for="`${idPrefix}MinPrice`" class="visually-hidden">
                    Введите минимальную цену
                </label>
                <input
                    :id="`${idPrefix}MinPrice`"
                    :value="props.minPrice"
                    type="number"
                    class="form-control"
                    placeholder="От"
                    min="0"
                    @input="emit('update:minPrice', $event.target.value)"
                >
            </div>

            <div class="col-6">
                <label :for="`${idPrefix}MaxPrice`" class="visually-hidden">
                    Введите максимальную цену
                </label>
                <input
                    :id="`${idPrefix}MaxPrice`"
                    :value="props.maxPrice"
                    type="number"
                    class="form-control"
                    placeholder="До"
                    min="0"
                    @input="emit('update:maxPrice', $event.target.value)"
                >
            </div>
        </div>
    </fieldset>

    <div class="mb-3">
        <label :for="`${idPrefix}Language`" class="form-label">Язык</label>
        <select
            :id="`${idPrefix}Language`"
            :value="props.language"
            class="form-select"
            @change="emit('update:language', $event.target.value)"
        >
            <option value="any">Любой</option>
            <option value="Русский">Русский</option>
            <option value="Английский">Английский</option>
        </select>
    </div>
</template>
