<template>
  <base-layout>
    <div class="container pt-4 pt-lg-5 event-page-container" style="padding-top: 90px">
      <div v-if="loading" class="text-center py-5">
        <p class="events-counter">Загрузка...</p>
      </div>

      <div v-else-if="!event" class="events-shell">
        <h1 class="events-title">Мероприятие не найдено</h1>
        <p class="events-counter">Проверьте ссылку или вернитесь к списку.</p>
        <router-link to="/" class="site-button">На главную</router-link>
      </div>

      <template v-else>
        <section class="mb-4 mb-lg-5">
          <div class="row g-4 align-items-stretch">
            <div class="col-12 col-lg-7">
              <article class="rounded-4 overflow-hidden shadow-sm bg-white">
                <div class="event-media-ratio">
                  <img :src="`/${event.image}`" :alt="event.title" class="w-100 h-100 d-block" style="object-fit:cover">
                </div>
              </article>
            </div>
            <div class="col-12 col-lg-5">
              <article class="rounded-4 shadow-sm bg-white p-4 event-side-main-card">
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="badge rounded-pill text-bg-light border event-meta-badge goal-badge">{{ getGoalLabel(event.goal) }}</span>
                  <span class="badge rounded-pill text-bg-light border event-meta-badge">{{ getPlaceLabel(event.place) }}</span>
                  <span class="badge rounded-pill text-bg-light border event-meta-badge">{{ formatDate(event.date) }}</span>
                </div>
                <h1 class="h3 mb-3 text-break-safe">{{ event.title }}</h1>
                <p class="text-secondary mb-4 text-break-safe">{{ event.description?.slice(0, 140) }}</p>
                <div class="d-grid gap-2">
                  <button v-if="!isRegistered" class="btn btn-lg site-button event-action-button" @click="handleRegister">Записаться</button>
                  <button v-else class="btn btn-lg subtle-button event-action-button" @click="handleCancel">Отменить запись</button>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section class="pb-5">
          <div class="row g-4 align-items-start">
            <div class="col-12 col-lg-8">
              <article class="rounded-4 shadow-sm bg-white p-4 event-description-card">
                <h2 class="h5 mb-3">Описание</h2>
                <p class="text-secondary mb-0 text-break-safe">{{ event.description }}</p>
              </article>
            </div>
            <div class="col-12 col-lg-4">
              <aside class="event-sidebar">
                <article class="rounded-4 shadow-sm bg-white p-4">
                  <h2 class="h5 mb-3">Информация</h2>
                  <div class="d-flex flex-column gap-3">
                    <div>
                      <div class="small text-secondary">Участников</div>
                      <div class="fw-semibold">{{ activeCount }} / {{ event.capacity }}</div>
                    </div>
                    <div>
                      <div class="small text-secondary">Для кого</div>
                      <div class="fw-semibold">{{ event.audience }}</div>
                    </div>
                  </div>
                </article>
                <article class="rounded-4 shadow-sm bg-white p-4">
                  <h2 class="h5 mb-3">Статус записи</h2>
                  <span :class="['badge rounded-pill registration-status-badge', isRegistered ? 'registration-status-badge--active' : 'registration-status-badge--inactive']">
                    {{ isRegistered ? 'Вы записаны' : 'Вы не записаны' }}
                  </span>
                  <p v-if="hint" class="mt-2 small text-secondary mb-0">{{ hint }}</p>
                  <p v-else class="mt-2 small text-secondary mb-0">
                    {{ isRegistered ? 'При необходимости запись можно отменить.' : 'Нажмите «Записаться», чтобы добавить мероприятие.' }}
                  </p>
                </article>
              </aside>
            </div>
          </div>
        </section>
      </template>
    </div>
  </base-layout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { eventsApi } from '@/api'
import useAuthStore from '@/stores/auth'
import { useRegistration } from '@/composables/useRegistration'
import { useFormatters } from '@/composables/useFormatters'
import BaseLayout from '@/layouts/BaseLayout.vue'

export default {
  name: 'EventPage',
  components: { BaseLayout },
  setup() {
    const route = useRoute()
    const auth = useAuthStore()
    const { formatDate, getGoalLabel, getPlaceLabel } = useFormatters()

    const event = ref(null)
    const loading = ref(true)

    const eventId = computed(() => String(route.params.id))
    const userId = computed(() => auth.user?.id ? String(auth.user.id) : null)

    const { registrations, isRegistered, hint, syncState, register, cancel } = useRegistration(eventId, userId)

    const activeCount = computed(() =>
      registrations.value.filter(r => r.status === 'active').length
    )

    async function handleRegister() {
      await register(event.value?.capacity)
    }

    async function handleCancel() {
      await cancel()
    }

    onMounted(async () => {
      try {
        const res = await eventsApi.getById(route.params.id)
        event.value = res.data
        await syncState()
      } catch {
        event.value = null
      } finally {
        loading.value = false
      }
    })

    return {
      event, loading, isRegistered, activeCount, hint,
      handleRegister, handleCancel,
      formatDate, getGoalLabel, getPlaceLabel
    }
  }
}
</script>
