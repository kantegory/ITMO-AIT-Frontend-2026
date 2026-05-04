<script setup>
import { useAuth } from "@/composables/useAuth.js";
import Icon from "@/components/ui/Icon.vue";

const { isAuthenticated } = useAuth();
</script>

<template>
    <div class="container mt-5">
        <h1 class="mb-3">Платформа управления ML-пайплайнами</h1>
        <p class="mb-4">
            PipelineLab — это сервис для отслеживания экспериментов машинного обучения, хранения метрик
            моделей и управления версиями моделей.
        </p>
        <RouterLink v-if="isAuthenticated" :to="{ name: 'experiments' }" class="btn btn-primary">
            Посмотреть эксперименты
        </RouterLink>
        <RouterLink v-else :to="{ name: 'login' }" class="btn btn-primary">Войти</RouterLink>
        <RouterLink v-if="!isAuthenticated" :to="{ name: 'register' }" class="btn btn-outline-primary ms-2">
            Регистрация
        </RouterLink>
    </div>

    <div class="container mt-5">
        <div class="row g-3">
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <Icon name="runFast" class="icon icon--card" />
                            <h2 class="card-title h5 mb-0">Эксперименты</h2>
                        </div>
                        <p class="card-text">
                            Отслеживайте запуски моделей, сохраняйте логи, метрики и артефакты обучения.
                        </p>
                        <RouterLink
                            :to="isAuthenticated ? { name: 'experiments' } : { name: 'login' }"
                            class="stretched-link"
                        >
                            <span class="visually-hidden">Перейти к экспериментам</span>
                        </RouterLink>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <Icon name="metricsDonut" class="icon icon--card" />
                            <h2 class="card-title h5 mb-0">Метрики</h2>
                        </div>
                        <p class="card-text">
                            Сравнивайте accuracy, ROC-AUC, F1 и любые кастомные метрики прямо на странице
                            эксперимента.
                        </p>
                        <RouterLink
                            :to="isAuthenticated ? { name: 'experiments' } : { name: 'login' }"
                            class="stretched-link"
                        >
                            <span class="visually-hidden">Перейти к спискам экспериментов</span>
                        </RouterLink>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <Icon name="cpuChip" class="icon icon--card" />
                            <h2 class="card-title h5 mb-0">Модели</h2>
                        </div>
                        <p class="card-text">
                            Версионируйте модели, отмечайте развернутые в проде и архивируйте устаревшие.
                        </p>
                        <RouterLink
                            :to="isAuthenticated ? { name: 'models' } : { name: 'login' }"
                            class="stretched-link"
                        >
                            <span class="visually-hidden">Перейти к реестру моделей</span>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
