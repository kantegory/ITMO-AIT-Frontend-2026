<template>
  <div>
    <section class="hero">
      <div class="container">
        <h1>Мир фанфиков</h1>
        <p class="lead">Читай истории, делись своими и находи единомышленников</p>
        <div class="d-flex justify-content-center mt-4 gap-2 search">
          <input
            v-model="searchQuery"
            class="form-control form-control-lg"
            style="max-width: 500px"
            placeholder="Поиск фанфика..."
            @keypress.enter="handleSearch"
          />
          <button class="btn btn-dark btn-lg" @click="handleSearch">
            Поиск
          </button>
        </div>
      </div>
    </section>

    <div class="container mt-5">
      <h2 class="section-title">Популярные фанфики</h2>
      <div class="row" v-if="!loading">
        <FicCard v-for="fic in popularFics" :key="fic.id" :fic="fic" />
        <div v-if="popularFics.length === 0" class="col-12 text-center py-5 text-muted">
          Нет доступных фанфиков
        </div>
      </div>
      <div v-else class="row">
        <div class="col-md-4 mb-4">
          <div class="text-center p-5">
            <div class="spinner-border text-primary"></div>
          </div>
        </div>
      </div>

      <h2 class="section-title mt-5">Новые фанфики</h2>
      <div class="row" v-if="!loading">
        <FicCard v-for="fic in newFics" :key="fic.id" :fic="fic" />
        <div v-if="newFics.length === 0" class="col-12 text-center py-5 text-muted">
          Нет доступных фанфиков
        </div>
      </div>
      <div v-else class="row">
        <div class="col-md-4 mb-4">
          <div class="text-center p-5">
            <div class="spinner-border text-primary"></div>
          </div>
        </div>
      </div>

      <section class="hero-rounded mt-5">
        <div class="container text-center">
          <h2>Создай свой фанфик</h2>
          <p>Поделись своей историей со всем миром</p>
          <button class="btn btn-dark btn-lg" @click="handleCreateFic">
            Начать писать
          </button>
        </div>
      </section>
    </div>

    <div class="modal fade" id="loginModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Войти или зарегистрироваться</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <p>Чтобы создавать фанфики, нужно войти в аккаунт или зарегистрироваться.</p>
            <router-link to="/login" class="btn btn-secondary">Войти</router-link>
            <router-link to="/register" class="btn btn-main">Регистрация</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFics } from '@/composables/useFics'
import { useAuth } from '@/composables/useAuth'
import { Modal } from 'bootstrap'
import FicCard from '@/components/FicCard.vue'

const router = useRouter()
const { fetchFics, loading } = useFics()
const { isAuthenticated } = useAuth()

const allFics = ref([])
const searchQuery = ref('')

const popularFics = computed(() => {
  return [...allFics.value]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3)
})

const newFics = computed(() => {
  return [...allFics.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
})

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  } else {
    router.push('/search')
  }
}

function handleCreateFic() {
  if (isAuthenticated.value) {
    router.push('/write')
  } else {
    const modal = new Modal(document.getElementById('loginModal'))
    modal.show()
  }
}

onMounted(async () => {
  allFics.value = await fetchFics()
})
</script>