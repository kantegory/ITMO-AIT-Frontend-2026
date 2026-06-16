<script setup>
defineProps({
    workers: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <div class="table-wrap">
        <table>
            <caption>Исполнители, роли, количество заданий и качество</caption>
            <thead>
            <tr>
                <th scope="col">Исполнитель</th>
                <th scope="col">Роль</th>
                <th scope="col">Заданий</th>
                <th scope="col">Качество</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="worker in workers" :key="worker.id">
                <th scope="row">{{ worker.name }}</th>
                <td>{{ worker.role }}</td>
                <td>{{ worker.tasks }}</td>
                <td>{{ worker.quality }}%</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
