<template>
  <main>
    <section class="bg-primary text-white text-center py-5 rounded">
      <div class="container">
        <h1 class="display-4 fw-bold">Учитесь онлайн в удобное время</h1>

        <p class="lead">
          Курсы по программированию, дизайну, аналитике и другим направлениям
        </p>

        <RouterLink to="/catalog" class="btn btn-light btn-lg mt-3">
          Найти курс
        </RouterLink>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <h2 class="text-center mb-4">О платформе</h2>

        <p>
          <strong>SECly</strong> — это современная образовательная платформа,
          предоставляющая онлайн-курсы по программированию, дизайну и другим направлениям.
        </p>

        <p>
          Мы помогаем пользователям получать актуальные знания, выполнять практические задания
          и развивать навыки в удобном онлайн-формате.
        </p>

        <p>
          Преподаватели могут создавать курсы, управлять материалами и обучать студентов,
          а пользователи — отслеживать прогресс и получать сертификаты.
        </p>
      </div>
    </section>

    <section class="py-5 bg-light rounded">
      <div class="container">
        <h2 class="text-center mb-4">Популярные курсы</h2>

        <div class="row g-4">
          <div class="col-md-4">
            <article class="card h-100 shadow-sm">
              <img
                src="/img/html.png"
                class="card-img-top"
                alt="Курс по HTML и CSS"
              >

              <div class="card-body">
                <h3 class="card-title h5">HTML и CSS с нуля</h3>

                <p class="card-text">
                  Изучите основы веб-разработки и создайте свой первый сайт.
                </p>

                <RouterLink to="/course/1" class="btn btn-primary">
                  Подробнее
                </RouterLink>
              </div>
            </article>
          </div>

          <div class="col-md-4">
            <article class="card h-100 shadow-sm">
              <img
                src="/img/java.png"
                class="card-img-top"
                alt="Курс по JavaScript"
              >

              <div class="card-body">
                <h3 class="card-title h5">JavaScript для начинающих</h3>

                <p class="card-text">
                  Освойте интерактивность сайтов и базовые сценарии.
                </p>

                <RouterLink to="/course/2" class="btn btn-primary">
                  Подробнее
                </RouterLink>
              </div>
            </article>
          </div>

          <div class="col-md-4">
            <article class="card h-100 shadow-sm">
              <img
                src="/img/python.png"
                class="card-img-top"
                alt="Курс по Python"
              >

              <div class="card-body">
                <h3 class="card-title h5">Python: старт в программировании</h3>

                <p class="card-text">
                  Подойдёт новичкам, которые хотят начать карьеру в IT.
                </p>

                <RouterLink to="/course/3" class="btn btn-primary">
                  Подробнее
                </RouterLink>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <h2 class="text-center mb-4">Как проходит обучение</h2>

        <ol class="list-group list-group-numbered">
          <li class="list-group-item">Регистрация и выбор курса</li>
          <li class="list-group-item">Просмотр видео-лекций и материалов</li>
          <li class="list-group-item">Выполнение практических заданий</li>
          <li class="list-group-item">Отслеживание прогресса</li>
          <li class="list-group-item">Общение в обсуждениях</li>
          <li class="list-group-item">Получение сертификата</li>
        </ol>
      </div>
    </section>
  </main>

  <footer class="text-center py-3">
    <div class="container">
      <p class="mb-0">© 2026 SECly. Все права защищены.</p>
    </div>
  </footer>

</template>