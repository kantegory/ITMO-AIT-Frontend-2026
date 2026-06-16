<template>
  <main id="mainContent" class="page-section">
    <div class="container layout-stack">
      <section class="panel-card" aria-labelledby="faqTitle">
        <div class="eyebrow">Справка</div>
        <h1 class="page-title" id="faqTitle">Справка</h1>
        <p class="page-text">Короткая справка по основным разделам и ролям.</p>
      </section>

      <section class="panel-card">
        <div class="accordion app-accordion" id="faqAccordion" aria-label="Частые вопросы">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq-roles"
                aria-expanded="true"
                aria-controls="faq-roles"
              >
                Как работают роли внутри проекта?
              </button>
            </h2>
            <div id="faq-roles" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
              <div class="accordion-body">
                <p>Роль задаётся отдельно внутри каждого проекта. Поэтому в одном месте можно редактировать данные, а в другом только смотреть.</p>
                <ul class="mb-0">
                  <li>Администратор меняет состав команды и основные настройки проекта.</li>
                  <li>Участник работает с задачами и материалами проекта.</li>
                  <li>Наблюдатель может смотреть прогресс, но ничего не меняет.</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq-search"
                aria-expanded="false"
                aria-controls="faq-search"
              >
                Что можно делать в поиске?
              </button>
            </h2>
            <div id="faq-search" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div class="accordion-body">
                <p>В поиске можно отфильтровать задачи и перейти в нужный проект.</p>
                <ul class="mb-0">
                  <li>Поиск по названию задачи или проекта.</li>
                  <li>Фильтрация по статусу, приоритету и исполнителю.</li>
                  <li>Переход в проект прямо из результата поиска.</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq-project"
                aria-expanded="false"
                aria-controls="faq-project"
              >
                Что доступно на странице проекта?
              </button>
            </h2>
            <div id="faq-project" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div class="accordion-body">
                <p>На странице проекта лежит всё основное, чтобы не прыгать по разным разделам.</p>
                <ul class="mb-0">
                  <li>Доска задач по статусам.</li>
                  <li>Сроки проекта по этапам.</li>
                  <li>Файлы проекта и обсуждения команды.</li>
                  <li>Блок с ролью и списком доступных действий.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
