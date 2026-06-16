<script setup>
const user = JSON.parse(localStorage.getItem('user')) || {
  name: 'Пользователь',
  email: 'user@example.com',
  role: 'student',
}
</script>

<template>
  <main class="container py-5">

    <h1 class="mb-4">
      Личный кабинет пользователя
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
              {{ user.name }}
            </p>

            <p>
              <strong>Email:</strong>
              {{ user.email }}
            </p>

            <p>
              <strong>Роль:</strong>
              {{ user.role }}
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

          <div class="card-body">

            <h2 class="h4 mb-3">
              Мои курсы
            </h2>

            <ul class="list-group">

              <li class="list-group-item">
                HTML и CSS с нуля
              </li>

              <li class="list-group-item">
                JavaScript для начинающих
              </li>

            </ul>

          </div>

        </div>

        <div class="card shadow-sm">

          <div class="card-body">

            <h2 class="h4 mb-3">
              Сертификаты
            </h2>

            <ul class="list-group">

              <li class="list-group-item">
                Сертификат HTML/CSS
              </li>

              <li class="list-group-item">
                Сертификат JavaScript
              </li>

            </ul>

          </div>

        </div>

      </section>

    </div>

  </main>
</template>