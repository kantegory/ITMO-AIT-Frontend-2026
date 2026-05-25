<script setup>
const teacher = JSON.parse(localStorage.getItem('user')) || {
  name: 'Преподаватель',
  email: 'teacher@example.com',
  role: 'teacher',
}
</script>

<template>
  <main class="container py-5">

    <h1 class="mb-4">
      Личный кабинет преподавателя
    </h1>

    <div class="row g-4">

      <section class="col-lg-4">

        <div class="card shadow-sm">

          <div class="card-body">

            <h2 class="h4 mb-3">
              Профиль
            </h2>

            <p>
              <strong>ФИО:</strong>
              {{ teacher.name }}
            </p>

            <p>
              <strong>Email:</strong>
              {{ teacher.email }}
            </p>

            <p>
              <strong>Роль:</strong>
              {{ teacher.role }}
            </p>

            <p>
              <strong>Статус:</strong>
              Активен
            </p>

          </div>

        </div>

      </section>

      <section class="col-lg-8">

        <div class="card shadow-sm mb-4">

          <div class="card-body d-flex justify-content-between align-items-center">

            <h2 class="h4 mb-0">
              Мои курсы
            </h2>

            <button class="btn btn-primary">
              Добавить курс
            </button>

          </div>

        </div>

        <div class="card shadow-sm">

          <div class="card-body">

            <ul class="list-group">

              <li class="list-group-item">
                HTML и CSS с нуля
              </li>

              <li class="list-group-item">
                JavaScript для начинающих
              </li>

              <li class="list-group-item">
                Python Start
              </li>

            </ul>

          </div>

        </div>

      </section>

    </div>

  </main>
</template>