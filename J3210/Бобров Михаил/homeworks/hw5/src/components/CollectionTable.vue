<script setup>
defineProps({
    items: {
        type: Array,
        required: true
    },
    kind: {
        type: String,
        required: true
    }
});
defineEmits(["remove"]);
</script>

<template>
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
            <table class="table align-middle mb-0">
                <thead>
                    <tr>
                        <th class="ps-4" scope="col">Название</th>
                        <th scope="col">Категория</th>
                        <th scope="col">Размер</th>
                        <th scope="col">Дата</th>
                        <th class="text-end pe-4" scope="col">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id">
                        <td class="ps-4"><RouterLink :to="`/${kind}/${item.id}`" class="text-dark fw-bold text-decoration-none">{{ item.name }}</RouterLink></td>
                        <td><span class="tag">{{ item.tag }}</span></td>
                        <td>{{ item.size }}</td>
                        <td>{{ item.date }}</td>
                        <td class="text-end pe-4"><button class="btn btn-light btn-sm text-danger" type="button" :aria-label="`Удалить ${item.name}`" @click="$emit('remove', item.id)">Удалить</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
