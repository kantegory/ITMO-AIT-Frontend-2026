<script setup>
import ThemeToggle from "./ThemeToggle.vue";
</script>

<template>
    <header class="navbar bg-white border-bottom px-4 py-3">
        <div class="brand">DataPort</div>
        <nav class="ms-auto d-flex align-items-center" aria-label="Навигация авторизации">
            <ThemeToggle />
            <RouterLink to="/login" class="btn btn-outline-primary btn-sm ms-3 me-2">Вход</RouterLink>
            <RouterLink to="/register" class="btn btn-primary btn-sm">Регистрация</RouterLink>
        </nav>
    </header>
    <main class="container auth-wrapper d-flex align-items-center">
        <div class="row w-100">
            <div class="col-md-6 d-flex align-items-center">
                <div class="left-panel">
                    <div class="left-title">AI Model &amp; Dataset Hub</div>
                    <div class="left-text">
                        Платформа для обмена и публикации моделей машинного обучения и датасетов.
                        Загружай, находи, обсуждай и переиспользуй AI-решения.
                    </div>
                    <div class="left-badges">
                        <div class="badge-soft">Models</div>
                        <div class="badge-soft">Datasets</div>
                        <div class="badge-soft">Reproducibility</div>
                        <div class="badge-soft">Community</div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 d-flex justify-content-center">
                <div class="card auth-card glass p-4">
                    <slot />
                </div>
            </div>
        </div>
    </main>
</template>
