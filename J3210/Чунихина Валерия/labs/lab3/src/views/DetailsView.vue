<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

import { useDetails } from '@/composables/useDetails'

const route = useRoute()
const { detail, loading, error, comments, addComment } = useDetails(route)

const newComment = ref('')
const stars = ref(0)
const forkCount = ref(0)
const forked = ref(false)

const hasDetail = computed(() => Boolean(detail.value))

// URL для кнопки «Открыть на Hugging Face»
const huggingFaceUrl = computed(() => {
  const modelId = route.query.model
  return modelId ? `https://huggingface.co/${modelId}` : null
})

// Форматирование больших чисел
function formatCount(value) {
  const n = Number(value) || 0
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)} млн`
  if (n >= 1_000) return `${Math.round(n / 1_000)} к`
  return String(n)
}

function syncCounters() {
  stars.value = detail.value?.stars || 0
  forkCount.value = detail.value?.forks || 0
  forked.value = false
}

watchEffect(() => {
  syncCounters()
})

// Переключатель форка: +1 при первом нажатии, -1 при повторном
function toggleFork() {
  if (forked.value) {
    forkCount.value -= 1
    forked.value = false
  } else {
    forkCount.value += 1
    forked.value = true
  }
}

function submitComment() {
  const text = newComment.value.trim()
  if (!text) return
  addComment(text)
  newComment.value = ''
}
</script>

<template>
  <section class="container py-5">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status" aria-hidden="true"></div>
      <p class="mt-2 text-muted mb-0">Готовим страницу модели...</p>
    </div>

    <p v-else-if="error && !hasDetail" class="text-danger py-4 mb-0">{{ error }}</p>

    <template v-else-if="detail">
      <header class="py-4 border-bottom bg-white rounded-4 px-4 mb-5">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <nav aria-label="Хлебные крошки">
              <ol class="breadcrumb mb-2">
                <li class="breadcrumb-item">
                  <RouterLink to="/" class="text-decoration-none text-muted">Поиск</RouterLink>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{ detail.title }}</li>
              </ol>
            </nav>
            <h1 class="display-5 fw-bold mb-2">{{ detail.title }} <span aria-hidden="true">{{ detail.emoji }}</span></h1>
            <p class="text-muted mb-0">
              Автор: <span class="model-meta-link fw-semibold">{{ detail.author }}</span> • {{ detail.updatedAt }}
            </p>
          </div>

          <div class="mt-3 mt-lg-0 d-flex gap-2 align-items-center flex-wrap">
            <!-- Счётчик звёзд -->
            <button
              type="button"
              class="btn btn-social-action shadow-sm"
              :class="stars > (detail.stars || 0) ? 'btn-primary' : 'btn-outline-primary'"
              @click="stars += 1"
            >
              <svg class="ui-icon ui-icon-sm" aria-hidden="true">
                <use href="/sprite.svg#icon-star"></use>
              </svg>
              <span class="count">{{ formatCount(stars) }}</span>
            </button>

            <!-- Переключатель для форков -->
            <button
              type="button"
              class="btn btn-social-action shadow-sm"
              :class="forked ? 'btn-primary' : 'btn-outline-primary'"
              :aria-pressed="forked"
              :aria-label="forked ? 'Убрать форк' : 'Поставить форк'"
              @click="toggleFork"
            >
              <svg class="ui-icon ui-icon-sm" aria-hidden="true">
                <use href="/sprite.svg#icon-fork"></use>
              </svg>
              <span class="count">{{ formatCount(forkCount) }}</span>
            </button>

            <!-- Кнопка открытия на Hugging Face -->
            <a
              v-if="huggingFaceUrl"
              :href="huggingFaceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-accent shadow-sm px-4"
            >
              <svg class="ui-icon ui-icon-sm me-2" aria-hidden="true">
                <use href="/sprite.svg#icon-download"></use>
              </svg>
              Открыть на Hugging Face
            </a>
            <button
              v-else
              type="button"
              class="btn btn-accent shadow-sm px-4"
              disabled
            >
              <svg class="ui-icon ui-icon-sm me-2" aria-hidden="true">
                <use href="/sprite.svg#icon-download"></use>
              </svg>
              {{ detail.downloadsLabel }}
            </button>
          </div>
        </div>
      </header>

      <div class="row">
        <main class="col-lg-8">
          <section class="mb-5">
            <h2 class="h3 fw-bold mb-3">Процессы воспроизводимости</h2>
            <div class="card border-0 shadow-sm p-4">
              <div class="d-flex align-items-center mb-3">
                <div class="badge bg-success me-2">Проверено</div>
                <span class="text-muted small">Последняя проверка: 15.03.2024</span>
              </div>
              <ul class="list-group list-group-flush small">
                <li
                  v-for="item in detail.verification"
                  :key="item.label"
                  class="list-group-item d-flex justify-content-between align-items-center border-0 ps-0"
                >
                  {{ item.label }}
                  <span :class="item.tone === 'warning' ? 'text-warning' : 'text-success'">{{ item.value }}</span>
                </li>
              </ul>
            </div>
          </section>

          <section class="mb-5">
            <h2 class="h3 fw-bold mb-3">Описание проекта</h2>
            <div class="card border-0 shadow-sm p-4">
              <p v-for="paragraph in detail.description" :key="paragraph">{{ paragraph }}</p>
            </div>
          </section>

          <section class="mb-5">
            <h2 class="h3 fw-bold mb-3">Метрики качества</h2>
            <div class="card border-0 shadow-sm overflow-hidden">
              <table class="table table-hover mb-0">
                <thead class="bg-light">
                <tr>
                  <th scope="col" class="ps-4">Показатель</th>
                  <th scope="col">Значение (Val)</th>
                  <th scope="col">Значение (Test)</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="metric in detail.metrics" :key="metric.label">
                  <th scope="row" class="ps-4">{{ metric.label }}</th>
                  <td :class="metric.tone === 'success' ? 'text-success' : ''" :style="metric.tone === 'accent' ? 'color: var(--bloom-orange);' : ''">
                    {{ metric.val }}
                  </td>
                  <td :class="metric.tone === 'success' ? 'text-success' : ''" :style="metric.tone === 'accent' ? 'color: var(--bloom-orange);' : ''">
                    {{ metric.test }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="mb-5">
            <h2 class="h3 fw-bold mb-3">Пример использования</h2>
            <div class="card border-0 shadow-sm p-4 bg-dark">
              <pre class="mb-0 text-light"><code>{{ detail.codeSnippet }}</code></pre>
            </div>
          </section>

          <section>
            <h2 class="h3 fw-bold mb-3">Обсуждения</h2>
            <div class="card border-0 shadow-sm p-4 mb-4">
              <div class="mb-4">
                <article
                  v-for="comment in comments"
                  :key="comment.id"
                  class="d-flex mb-3 pb-3 border-bottom"
                >
                  <img
                    src="https://ui-avatars.com/api/?name=User&background=random"
                    class="rounded-circle me-3"
                    width="40"
                    height="40"
                    alt="Аватар пользователя"
                  >
                  <div>
                    <h3 class="h6 mb-0 fw-bold">
                      {{ comment.author }}
                      <span class="badge bg-light text-muted fw-normal ms-2">{{ comment.timeLabel }}</span>
                    </h3>
                    <p class="mb-0 small text-muted">{{ comment.text }}</p>
                  </div>
                </article>
              </div>

              <form @submit.prevent="submitComment">
                <div class="mb-3">
                  <label for="commentInput" class="form-label small fw-bold">Ваш комментарий</label>
                  <textarea
                    id="commentInput"
                    v-model="newComment"
                    class="form-control border-0 bg-light"
                    rows="3"
                    placeholder="Поделитесь опытом использования..."
                  />
                </div>
                <button type="submit" class="btn btn-primary btn-sm px-4">Отправить комментарий</button>
              </form>
            </div>
          </section>
        </main>

        <aside class="col-lg-4">
          <div class="card border-0 shadow-sm p-4 sticky-lg-top" style="top: 100px;">
            <h2 class="h5 fw-bold mb-3">Характеристики</h2>
            <dl class="mb-0">
              <div v-for="item in detail.info" :key="item.label" class="mb-3">
                <dt class="text-muted small">{{ item.label }}:</dt>
                <dd class="mb-0">
                  <span v-if="item.badge === 'model'" class="badge badge-model">{{ item.value }}</span>
                  <span v-else-if="item.badge === 'dataset'" class="badge badge-dataset">{{ item.value }}</span>
                  <span v-else :class="item.tone === 'success' ? 'text-success' : ''">{{ item.value }}</span>
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </template>
  </section>
</template>
