<template>
  <section class="text-center py-5 bg-light rounded mb-4">
    <h1 class="display-4 fw-bold">Стань водителем легко и быстро</h1>
    <p class="lead">Права категории B, обучение с нуля и восстановление навыков вождения.</p>
    <router-link to="/instructor" class="btn btn-danger btn-lg me-2">Записаться</router-link>
    <a href="tel:+78005553535" class="btn btn-outline-danger btn-lg">Консультация</a>
  </section>

  <h2 id="packages" class="mb-4">Выберите свой пакет</h2>
  <div class="row g-4">
    <div class="col-md-4" v-for="pkg in packages" :key="pkg.title">
      <div class="card h-100 hover-lift" :class="{'border-danger': pkg.top}">
        <div class="card-body">
          <span v-if="pkg.top" class="badge bg-danger mb-2">TOP</span>
          <h3 class="card-title">{{ pkg.title }}</h3>
          <p class="card-text">{{ pkg.desc }}</p>
          <h4 class="text-danger fw-bold">{{ pkg.price }}</h4>
          <router-link to="/instructor" class="btn btn-outline-danger w-100 mt-2">{{ pkg.btn }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const packages = [
  { title: 'С нуля', desc: 'Полный курс: от площадки до города. 25 занятий.', price: '45 000 ₽', btn: 'Выбрать' },
  { title: 'Оптимальный', top: true, desc: '15 занятий. Идеально для тех, кто уже что-то умеет.', price: '30 000 ₽', btn: 'Записаться' },
  { title: 'Разовый', desc: 'Отработка конкретных маршрутов или парковки.', price: '2 500 ₽', btn: 'Взять урок' }
]
</script>