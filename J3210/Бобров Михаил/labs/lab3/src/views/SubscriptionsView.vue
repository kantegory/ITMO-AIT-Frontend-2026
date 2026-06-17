<script setup>
import AppTopbar from "../components/AppTopbar.vue";
import { useResources } from "../composables/useResources.js";

const { removeItem, resources } = useResources();
</script>

<template>
    <AppTopbar title="Подписки">
        <template #actions><RouterLink class="btn btn-primary" to="/explore">Найти сообщества</RouterLink></template>
    </AppTopbar>
    <div class="content-area">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="table-responsive">
                <table class="table align-middle mb-0">
                    <thead>
                        <tr>
                            <th class="ps-4" scope="col">Источник</th>
                            <th scope="col">Статус обновлений</th>
                            <th scope="col">Состояние</th>
                            <th scope="col">Дата подписки</th>
                            <th class="text-end pe-4" scope="col">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="subscription in resources.mySubscriptions" :key="subscription.id">
                            <td class="ps-4"><RouterLink :to="`/subscriptions/${subscription.id}`" class="text-dark fw-bold text-decoration-none">{{ subscription.name }}</RouterLink></td>
                            <td><span class="tag">{{ subscription.updates }}</span></td>
                            <td>Активна</td>
                            <td>{{ subscription.date }}</td>
                            <td class="text-end pe-4"><button class="btn btn-light btn-sm text-danger" type="button" :aria-label="`Отписаться от ${subscription.name}`" @click="removeItem('subs', subscription.id)">Отписаться</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <nav class="mt-4" aria-label="Страницы подписок">
            <ul class="pagination justify-content-center">
                <li class="page-item"><button class="page-link" type="button">Назад</button></li>
                <li class="page-item active" aria-current="page"><button class="page-link" type="button">1</button></li>
                <li class="page-item"><button class="page-link" type="button">2</button></li>
                <li class="page-item"><button class="page-link" type="button">Вперед</button></li>
            </ul>
        </nav>
    </div>
</template>
