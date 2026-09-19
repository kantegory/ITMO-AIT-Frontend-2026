<template>
  <section
    class="bento-card p-4 p-md-5 d-flex flex-column justify-content-center align-items-center text-center"
    aria-label="Досье исследователя"
  >
    <div class="w-100 d-flex justify-content-between mb-4">
      <h2 class="text-uppercase letter-spacing-2 text-muted-custom fs-7 mb-0">Досье исследователя</h2>
      <span class="badge-silver px-2 py-1 fs-7 rounded">Active</span>
    </div>

    <img
      :src="user?.avatarUrl"
      :alt="`Аватар: ${user?.name}`"
      class="rounded-circle mb-3 border border-secondary border-opacity-50 p-1"
      width="96"
      height="96"
    >
    <h3 class="fw-bold mb-1 text-main fs-4">{{ user?.name }}</h3>
    <p class="text-muted-custom fs-7 letter-spacing-2 text-uppercase mb-4">Код: {{ user?.code }}</p>

    <div class="d-flex gap-2 flex-wrap justify-content-center mb-4">
      <span class="badge-silver px-3 py-1 fs-7 rounded-pill">{{ user?.class || 'Cadet Class' }}</span>
      <span v-if="user?.isDeepSpaceMember" class="badge-gold px-3 py-1 fs-7 rounded-pill">
        DeepSpace Member
      </span>
    </div>

    <button
      type="button"
      class="btn btn-glass btn-sm d-inline-flex align-items-center gap-2"
      aria-label="Завершить сеанс"
      @click="handleLogout"
    >
      <svg class="icon icon-sm" aria-hidden="true" focusable="false">
        <use href="#icon-logout"></use>
      </svg>
      Завершить сессию
    </button>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

defineProps({
  user: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const { logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>