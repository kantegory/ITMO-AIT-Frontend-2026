<template>
  <main class="container mt-4 mb-5">

    <div class="glass p-3 mb-4 d-flex justify-content-between align-items-center">
      <router-link :to="{ name: 'profile' }" class="fw-bold text-decoration-none">
        <svg width="24" height="24" class="me-2"><use href="#icon-arrow-left"></use></svg>
        Вернуться в кабинет
      </router-link>
      <span class="opacity-75 fw-bold">Просмотр курса (ID: {{ route.params.id }})</span>
    </div>

    <div class="row g-4 flex-column-reverse flex-lg-row">

      <section class="col-lg-8" aria-label="Основной контент урока">

        <div class="glass mb-4 overflow-hidden position-relative" style="aspect-ratio: 16/9; background: #000;">
          <img src="/img/video-cover.jpg" class="w-100 h-100 opacity-50" style="object-fit: cover;" alt="Заставка видео">
          <div class="position-absolute top-50 start-50 translate-middle">
            <button class="btn rounded-circle d-flex align-items-center justify-content-center glass-hover" style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); width: 70px; height: 70px; border: 1px solid rgba(255,255,255,0.4);">
              <span class="fs-2 text-white ps-1"><svg width="30" height="30" class="ms-1"><use href="#icon-play"></use></svg></span>
            </button>
          </div>
        </div>

        <div class="glass p-4">
          <h1 class="fs-3 fw-bold mb-4">Урок 5: Выбранная тема</h1>

          <ul class="nav nav-tabs border-secondary border-opacity-25 mb-4">
            <li class="nav-item">
              <button 
                class="nav-link bg-transparent border-0"
                :class="activeLessonTab === 'theory' ? 'active border-bottom border-primary border-3 fw-bold' : 'opacity-75'"
                @click="activeLessonTab = 'theory'"
              >
                Теория
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link bg-transparent border-0"
                :class="activeLessonTab === 'discuss' ? 'active border-bottom border-primary border-3 fw-bold' : 'opacity-75'"
                @click="activeLessonTab = 'discuss'"
              >
                Обсуждение
              </button>
            </li>
          </ul>

          <div class="tab-content lh-lg opacity-75">
            <div v-if="activeLessonTab === 'theory'" class="tab-pane fade show active">
              <p>В этом уроке мы разберем основные концепции. Вы научитесь:</p>
              <ul>
                <li>Понимать архитектуру</li>
                <li>Писать чистый код на Vue 3</li>
              </ul>
              <button class="btn btn-sm btn-outline-info rounded-pill px-3 mt-3">
                <svg width="16" height="16" class="me-1"><use href="#icon-file"></use></svg> Презентация.pdf
              </button>
            </div>

            <div v-else class="tab-pane fade show active">
              <form class="d-flex gap-3 mb-4" @submit.prevent="postComment">
                <div class="rounded-circle default-avatar flex-shrink-0" style="width:50px; height:50px; font-size: 1.5rem;">
                  <svg width="50%" height="50%"><use href="#icon-user"></use></svg>
                </div>
                <div class="w-100">
                  <input v-model="newComment" type="text" class="form-control glass-input mb-2" placeholder="Задайте вопрос преподавателю...">
                  <button type="submit" class="btn glass-btn btn-sm px-4">Отправить</button>
                </div>
              </form>

              <article class="d-flex gap-3 border-top border-secondary border-opacity-25 pt-3">
                <div class="rounded-circle default-avatar flex-shrink-0" style="width:40px; height:40px; font-size: 1.2rem;">
                  <svg width="50%" height="50%"><use href="#icon-user"></use></svg>
                </div>
                <div>
                  <h4 class="mb-1 small fw-bold">Александр Смирнов<span class="opacity-75 ms-2 fw-normal">2 часа назад</span></h4>
                  <p class="small mb-0">Какую версию Vue использовать для старта?</p>
                  <div class="d-flex gap-2 mt-2 align-items-center">
                    <span class="badge bg-primary">Ответ:</span>
                    <span class="small">Используйте всегда самую последнюю стабильную Vue 3 (Composition API).</span>
                  </div>
                </div>
              </article>
            </div>

          </div>
        </div>
      </section>

      <aside class="col-lg-4" aria-label="Оглавление курса">
        <div class="glass p-4 h-100">
          <h2 class="fs-5 fw-bold mb-4">Содержание</h2>
          
          <div class="accordion" id="courseAccordion">
            <div class="accordion-item bg-transparent border-0 mb-2">
              <h3 class="accordion-header fs-6">
                <button @click="isModuleOpen = !isModuleOpen" class="accordion-button glass-input shadow-none d-flex justify-content-between align-items-center" type="button">
                  Модуль 1
                  <svg width="20" height="20" class="ms-auto transition-transform" :style="{ transform: isModuleOpen ? 'rotate(180deg)' : 'rotate(0deg)' }">
                    <use href="#icon-chevron-down"></use>
                  </svg>
                </button>
              </h3>
              <div v-show="isModuleOpen" class="accordion-collapse mt-2">
                <nav class="accordion-body p-2 border border-secondary border-opacity-25 rounded glass" aria-label="Список уроков модуля 1">
                  <a href="#" class="d-block text-info fw-bold text-decoration-none p-2 rounded" style="background: rgba(255,255,255,0.05);">
                    <span><svg width="30" height="30" class="ms-1"><use href="#icon-play"></use></svg></span> 5. Выбранная тема
                  </a>
                  <a href="#" class="d-block opacity-75 text-decoration-none p-2 rounded mt-1">
                    6. Практика
                  </a>
                </nav>
              </div>
            </div>
          </div>

        </div>
      </aside>

    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeLessonTab = ref('theory')
const isModuleOpen = ref(true)

const newComment = ref('')
const postComment = () => {
  if(newComment.value.trim() === '') return
  alert(`Ваш комментарий "${newComment.value}" отправлен!`)
  newComment.value = ''
}
</script>