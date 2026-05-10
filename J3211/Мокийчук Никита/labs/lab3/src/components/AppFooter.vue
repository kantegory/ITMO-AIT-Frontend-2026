<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast'

const { showToast } = useToast()
const newsletterEmail = ref('')

const handleSubscribe = () => {
  if (!newsletterEmail.value.trim()) return
  showToast('Вы подписались на рассылку!', 'success')
  newsletterEmail.value = ''
}
</script>

<template>
  <footer class="footer" aria-label="Подвал сайта">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4">
          <p class="h5 fw-bold mb-3">
            <i class="bi bi-mortarboard-fill me-2" aria-hidden="true"></i>MokiichukKnowledge
          </p>
          <p class="footer-description">
            Современная платформа для онлайн-обучения. Развивайте навыки с лучшими экспертами индустрии.
          </p>
        </div>

        <div class="col-6 col-lg-2">
          <nav aria-label="Навигация по платформе">
            <h2 class="h6">Платформа</h2>
            <div class="d-flex flex-column gap-2">
              <router-link :to="{ name: 'catalog' }">Каталог курсов</router-link>
              <router-link :to="{ name: 'teacher' }">Преподавателям</router-link>
              <router-link :to="{ name: 'register' }">Регистрация</router-link>
            </div>
          </nav>
        </div>

        <div class="col-6 col-lg-2">
          <nav aria-label="Навигация по направлениям">
            <h2 class="h6">Направления</h2>
            <div class="d-flex flex-column gap-2">
              <router-link :to="{ name: 'catalog', query: { category: 'programming' } }">Разработка</router-link>
              <router-link :to="{ name: 'catalog', query: { category: 'design' } }">Дизайн</router-link>
              <router-link :to="{ name: 'catalog', query: { category: 'marketing' } }">Маркетинг</router-link>
            </div>
          </nav>
        </div>

        <div class="col-lg-4">
          <h2 class="h6">Подписка на новости</h2>
          <form
            class="d-flex gap-2"
            aria-label="Форма подписки на email-рассылку"
            @submit.prevent="handleSubscribe"
          >
            <label for="newsletterEmail" class="visually-hidden">Ваш email для подписки</label>
            <input
              type="email"
              class="form-control form-control-sm"
              id="newsletterEmail"
              name="email"
              placeholder="Ваш email"
              autocomplete="email"
              required
              v-model="newsletterEmail"
            />
            <button type="submit" class="btn btn-primary btn-sm" style="white-space: nowrap">
              Подписаться
            </button>
          </form>
        </div>
      </div>
    </div>
  </footer>
</template>
