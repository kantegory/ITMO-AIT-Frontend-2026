<template>
  <main>
    <section class="hero-section">
      <div class="container">
        <h1>Автоматизация MLOps</h1>
        <p>Полный цикл CI/CD для машинного обучения: от тестирования модели до деплоя в продакшен за минуты</p>
        <div class="d-flex justify-content-center gap-3">
          <RouterLink to="/register" class="btn btn-primary btn-lg">Начать бесплатно</RouterLink>
          <RouterLink to="/pipelines" class="btn btn-outline-light btn-lg">Смотреть пайплайны</RouterLink>
        </div>
      </div>
    </section>

    <section class="container my-5">
      <h2 class="text-center mb-4">Возможности платформы</h2>
      <div class="row g-4">
        <div v-for="f in features" :key="f.title" class="col-md-4">
          <div class="feature-card">
            <i :class="['bi', f.icon]"></i>
            <h5>{{ f.title }}</h5>
            <p class="text-muted">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container my-5 text-center">
      <h2 class="mb-3">Готовы начать?</h2>
      <p class="text-muted mb-4">Присоединяйтесь и автоматизируйте деплой ваших ML-моделей уже сегодня</p>
      <RouterLink to="/register" class="btn btn-primary btn-lg">Создать аккаунт</RouterLink>
    </section>
  </main>
</template>

<script setup>
const features = [
  { icon: 'bi-arrow-repeat', title: 'CI/CD пайплайны', desc: 'Автоматическое тестирование, валидация и деплой ML-моделей при каждом коммите' },
  { icon: 'bi-diagram-3', title: 'Управление средами', desc: 'Blue/Green и Canary деплой с автоматическим откатом при падении метрик' },
  { icon: 'bi-shield-check', title: 'Валидация моделей', desc: 'Проверка качества модели на тестовых данных перед каждым развертыванием' },
  { icon: 'bi-box-seam', title: 'Артефакт-стор', desc: 'Хранение и версионирование моделей, датасетов и конфигураций' },
  { icon: 'bi-people', title: 'Роли и доступ', desc: 'Гибкая настройка прав: кто может запускать деплой, а кто только смотреть' },
  { icon: 'bi-graph-up', title: 'Мониторинг', desc: 'Отслеживание метрик моделей в реальном времени с алертами' }
];
</script>
