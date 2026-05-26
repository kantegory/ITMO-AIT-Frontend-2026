<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppTopbar from "../components/AppTopbar.vue";
import SvgIcon from "../components/SvgIcon.vue";
import { removeItem, store } from "../store.js";

const route = useRoute();
const router = useRouter();
const subscription = computed(() => store.mySubscriptions.find(item => item.id === Number(route.params.id)));

async function unsubscribe() {
    if (await removeItem("subs", Number(route.params.id))) router.push("/subscriptions");
}
</script>

<template>
    <template v-if="subscription">
        <AppTopbar :title="subscription.name">
            <template #before><RouterLink to="/subscriptions" class="btn btn-light btn-sm me-3"><SvgIcon name="back" />Назад</RouterLink></template>
        </AppTopbar>
        <div class="content-area">
            <div class="row">
                <div class="col-md-8">
                    <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h5 class="fw-bold mb-3">О сообществе</h5>
                        <p class="text-muted mb-0">{{ subscription.description }}</p>
                    </div>
                    <h5 class="fw-bold mb-3">Последние релизы</h5>
                    <div class="card border-0 shadow-sm rounded-4 p-3 mb-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="fw-bold mb-1">New Russian LLM v2</h6>
                                <div class="text-muted small">Опубликовано 2 дня назад · Модель</div>
                            </div>
                            <button class="btn btn-outline-primary btn-sm" type="button">Посмотреть</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 mb-4 text-center">
                        <div class="mb-3"><div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center subscription-avatar">{{ subscription.name.substring(0, 2).toUpperCase() }}</div></div>
                        <h5 class="fw-bold mb-1">{{ subscription.name }}</h5>
                        <p class="text-muted small mb-3">{{ subscription.type }}</p>
                        <div class="row g-2 mb-4">
                            <div class="col-6"><div class="p-2 bg-light rounded-3"><div class="small text-muted">Участники</div><div class="fw-bold">{{ subscription.members }}</div></div></div>
                            <div class="col-6"><div class="p-2 bg-light rounded-3"><div class="small text-muted">Релизы</div><div class="fw-bold">{{ subscription.releases }}</div></div></div>
                        </div>
                        <button class="btn btn-danger w-100 py-2 mb-2" type="button" @click="unsubscribe">Отписаться</button>
                        <button class="btn btn-light w-100 py-2" type="button">Поделиться</button>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
