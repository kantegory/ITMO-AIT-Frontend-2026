<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useFavorites } from '@/composables/useFavorites'
import { useTravelNotes } from '@/composables/useTravelNotes'

const router = useRouter()
const { user, logout } = useAuth()
const { count } = useFavorites()
const { notes, saved, saveNotes } = useTravelNotes()
const greeting = computed(() => user.value?.name || 'Путешественник')

function exit() {
  logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="mb-4">
    <h1 class="h2">Личный кабинет</h1>
    <p class="text-muted">Планируйте поездки и сохраняйте идеи для будущих маршрутов.</p>
  </header>
  <div class="row g-4">
    <aside class="col-md-4">
      <div class="card shadow-sm">
        <div class="card-body text-center p-4">
          <svg class="bi text-muted mb-3" width="110" height="110"><use href="#avatar" /></svg>
          <h2 class="h4">{{ greeting }}</h2>
          <p class="text-muted mb-1">{{ user?.email }}</p>
          <p><strong>{{ count }}</strong> туров в избранном</p>
          <button class="btn btn-outline-danger w-100" type="button" @click="exit">Выйти</button>
        </div>
      </div>
    </aside>
    <section class="col-md-8">
      <article class="card shadow-sm mb-4">
        <header class="card-header"><h2 class="h5 mb-0">Ближайшие маршруты</h2></header>
        <div class="list-group list-group-flush">
          <div class="list-group-item"><strong>Поездка в Карелию</strong><br><small class="text-muted">Запланировано на: 20.06.2026</small></div>
          <div class="list-group-item"><strong>Выходные в Санкт-Петербурге</strong><br><small class="text-muted">Завершено: 10.01.2026</small></div>
        </div>
      </article>
      <article class="card shadow-sm">
        <header class="card-header"><h2 class="h5 mb-0">Путевые заметки</h2></header>
        <div class="card-body">
          <label for="travel-notes" class="visually-hidden">Текст заметок</label>
          <textarea id="travel-notes" v-model="notes" class="form-control mb-3" rows="5" placeholder="Куда вы хотите поехать дальше?"></textarea>
          <button class="btn" :class="saved ? 'btn-success' : 'btn-primary'" type="button" @click="saveNotes">
            {{ saved ? '✓ Сохранено' : 'Сохранить' }}
          </button>
        </div>
      </article>
    </section>
  </div>
</template>
