<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="hero-section" aria-label="Главный баннер">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-6">
          <div class="hero-copy">
            <span class="section-badge"><i class="bi bi-compass" /> Планируйте поездки без хаоса</span>
            <h1 class="section-title">Маршруты, заметки и совместные идеи для каждого путешествия в одном приложении.</h1>
            <p class="section-text">
              TripPlanner помогает быстро подобрать направление, собрать маршрут по дням, сохранить заметки, добавить избранное и обсуждать план поездки с друзьями.
            </p>
            <div class="hero-actions">
              <RouterLink class="btn btn-primary btn-lg" to="/destinations">Начать планирование</RouterLink>
              <RouterLink class="btn btn-outline-dark btn-lg" to="/login">Войти</RouterLink>
            </div>
            <div class="hero-stats">
              <div class="metric-card">
                <div class="metric-value">5+</div>
                <p class="metric-label">рабочих разделов сайта</p>
              </div>
              <div class="metric-card">
                <div class="metric-value">100%</div>
                <p class="metric-label">статическая работа в браузере</p>
              </div>
              <div class="metric-card">
                <div class="metric-value">24/7</div>
                <p class="metric-label">доступ к планам и заметкам</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="hero-visual">
            <div class="glass-card highlight">
              <div class="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <p class="mb-2 text-uppercase small">Путешествие недели</p>
                  <h3 class="h2 mb-2">Стамбул на 5 дней</h3>
                  <p class="mb-0">Исторический центр, паромы по Босфору, крыши, гастрономия и гибкий маршрут по дням.</p>
                </div>
                <span class="icon-bubble bg-white text-primary"><i class="bi bi-airplane-engines" /></span>
              </div>
            </div>
            <div class="hero-mini-grid">
              <div class="glass-card">
                <div class="icon-bubble mb-3"><i class="bi bi-signpost-split" /></div>
                <h4 class="h5 mb-2">Поиск направлений</h4>
                <p class="mb-0 text-secondary">Фильтрация по типу, бюджету и длительности.</p>
              </div>
              <div class="glass-card">
                <div class="icon-bubble mb-3"><i class="bi bi-journal-richtext" /></div>
                <h4 class="h5 mb-2">Путевые заметки</h4>
                <p class="mb-0 text-secondary">Личные записи и быстрые идеи по поездке.</p>
              </div>
            </div>
            <div class="glass-card floating-card">
              <p class="mb-2 text-uppercase small text-secondary">Совместная работа</p>
              <h4 class="h5 mb-2">Маршрут для группы</h4>
              <p class="mb-0 text-secondary">Приглашайте участников, обсуждайте этапы и голосуйте за идеи.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section-space">
    <div class="container">
      <div class="text-center mb-5">
        <span class="section-badge"><i class="bi bi-stars" /> Возможности</span>
        <h2 class="section-title-sm">Что можно делать в приложении</h2>
        <p class="section-text mx-auto" style="max-width: 760px;">
          Все ключевые элементы лабораторной собраны в единую travel-систему: каталог, кабинет, формы, модальные окна, фильтры, вкладки и localStorage.
        </p>
      </div>
      <div class="row g-4">
        <div class="col-md-6 col-xl-3">
          <article class="feature-card">
            <span class="feature-number">01</span>
            <h3 class="h4">Поиск направлений</h3>
            <p class="text-secondary mb-0">Каталог с фильтрацией по типу отдыха, бюджету, длительности и сортировкой карточек.</p>
          </article>
        </div>
        <div class="col-md-6 col-xl-3">
          <article class="feature-card">
            <span class="feature-number">02</span>
            <h3 class="h4">Сохранение маршрутов</h3>
            <p class="text-secondary mb-0">Добавляйте собственные маршруты, связывайте их с направлениями и открывайте детальные страницы.</p>
          </article>
        </div>
        <div class="col-md-6 col-xl-3">
          <article class="feature-card">
            <span class="feature-number">03</span>
            <h3 class="h4">Путевые заметки</h3>
            <p class="text-secondary mb-0">Фиксируйте идеи, полезные адреса, список дел и редактируйте заметки в личном кабинете.</p>
          </article>
        </div>
        <div class="col-md-6 col-xl-3">
          <article class="feature-card">
            <span class="feature-number">04</span>
            <h3 class="h4">Совместное планирование</h3>
            <p class="text-secondary mb-0">Обсуждайте этапы поездки, приглашайте участников и голосуйте за идеи всей группой.</p>
          </article>
        </div>
      </div>
    </div>
  </section>

  <section class="section-space pt-0">
    <div class="container">
      <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <span class="section-badge"><i class="bi bi-geo-alt" /> Популярные направления</span>
          <h2 class="section-title-sm mb-2">Подборка для первого старта</h2>
        </div>
        <RouterLink class="btn btn-outline-primary" to="/destinations">Открыть весь каталог</RouterLink>
      </div>
      <div class="row g-4">
        <div class="col-md-6 col-xl-3">
          <article class="destination-card card border-0">
            <img src="/images/istanbul.jpg" alt="Стамбул" />
            <div class="card-body d-flex flex-column">
              <div class="card-meta mt-0">
                <span class="badge badge-city">Город</span>
                <span class="badge badge-budget">Средний бюджет</span>
                <span class="badge badge-soft">5 дней</span>
              </div>
              <h3 class="h4">Стамбул</h3>
              <p class="text-secondary flex-grow-1">История, вода, гастрономия и гибкий городской маршрут с насыщенной программой.</p>
              <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'destination-details', params: { id: 1 } }">Подробнее</RouterLink>
            </div>
          </article>
        </div>
        <div class="col-md-6 col-xl-3">
          <article class="destination-card card border-0">
            <img src="/images/altai.jpg" alt="Алтай" />
            <div class="card-body d-flex flex-column">
              <div class="card-meta mt-0">
                <span class="badge badge-nature">Природа</span>
                <span class="badge badge-budget">Средний бюджет</span>
                <span class="badge badge-soft">8 дней</span>
              </div>
              <h3 class="h4">Алтай</h3>
              <p class="text-secondary flex-grow-1">Горы, озёра, длинные переезды, природные маршруты и ощущение полной перезагрузки.</p>
              <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'destination-details', params: { id: 2 } }">Подробнее</RouterLink>
            </div>
          </article>
        </div>
        <div class="col-md-6 col-xl-3">
          <article class="destination-card card border-0">
            <img src="/images/kazan.jpg" alt="Казань" />
            <div class="card-body d-flex flex-column">
              <div class="card-meta mt-0">
                <span class="badge badge-city">Город</span>
                <span class="badge badge-budget">Низкий бюджет</span>
                <span class="badge badge-soft">3 дня</span>
              </div>
              <h3 class="h4">Казань</h3>
              <p class="text-secondary flex-grow-1">Удобный city-break для выходных с кремлём, набережной и сильной гастрономией.</p>
              <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'destination-details', params: { id: 3 } }">Подробнее</RouterLink>
            </div>
          </article>
        </div>
        <div class="col-md-6 col-xl-3">
          <article class="destination-card card border-0">
            <img src="/images/baikal.jpg" alt="Байкал" />
            <div class="card-body d-flex flex-column">
              <div class="card-meta mt-0">
                <span class="badge badge-nature">Природа</span>
                <span class="badge badge-budget">Высокий бюджет</span>
                <span class="badge badge-soft">7 дней</span>
              </div>
              <h3 class="h4">Байкал</h3>
              <p class="text-secondary flex-grow-1">Крупный маршрут с островами, береговыми прогулками и сильными видами каждый день.</p>
              <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'destination-details', params: { id: 4 } }">Подробнее</RouterLink>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>

  <section class="section-space pt-0">
    <div class="container">
      <div class="row g-4 align-items-stretch">
        <div class="col-lg-4">
          <div class="cta-card h-100 p-4">
            <span class="section-badge"><i class="bi bi-diagram-3" /> Как это работает</span>
            <h2 class="section-title-sm">Три шага до готового маршрута</h2>
            <p class="section-text mb-0">Приложение рассчитано на реальный сценарий подготовки поездки: от идеи до личного кабинета и совместного обсуждения.</p>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="row g-4">
            <div class="col-md-4">
              <article class="feature-card h-100">
                <span class="feature-number"><i class="bi bi-search" /></span>
                <h3 class="h4">1. Выберите направление</h3>
                <p class="text-secondary mb-0">Используйте поиск и фильтры, чтобы быстро найти подходящий вариант под ваш ритм и бюджет.</p>
              </article>
            </div>
            <div class="col-md-4">
              <article class="feature-card h-100">
                <span class="feature-number"><i class="bi bi-map" /></span>
                <h3 class="h4">2. Составьте маршрут</h3>
                <p class="text-secondary mb-0">Сохраните направление, добавьте его в маршрут и дополните поездку собственными заметками.</p>
              </article>
            </div>
            <div class="col-md-4">
              <article class="feature-card h-100">
                <span class="feature-number"><i class="bi bi-share" /></span>
                <h3 class="h4">3. Сохраните и поделитесь</h3>
                <p class="text-secondary mb-0">Откройте совместный раздел, пригласите участников и обсудите детали поездки всей группой.</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section-space pt-0">
    <div class="container">
      <div class="cta-card p-4 p-lg-5">
        <div class="row align-items-center g-4">
          <div class="col-lg-8">
            <span class="section-badge"><i class="bi bi-person-plus" /> Начните сейчас</span>
            <h2 class="section-title-sm mb-3">Создайте аккаунт и соберите первый маршрут уже сегодня.</h2>
            <p class="section-text mb-0">После регистрации вы получите доступ к личному кабинету, заметкам, избранным направлениям и разделу совместного планирования.</p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <RouterLink class="btn btn-primary btn-lg" to="/register">Создать аккаунт</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
