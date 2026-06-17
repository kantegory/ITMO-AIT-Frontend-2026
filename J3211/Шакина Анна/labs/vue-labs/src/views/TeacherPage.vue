<template>
  <base-layout>
    <section class="events-explorer py-5">
      <div class="container pt-4 pt-lg-5">
        <div class="events-shell">
          <div class="events-intro profile-intro">
            <h1 class="events-title mb-2">{{ teacherName }}</h1>
            <p class="events-counter mb-0">Здесь собраны мероприятия, где вы назначены ответственным.</p>
          </div>

          <div class="events-meta-row">
            <p class="events-counter mb-0">Мероприятий: {{ myEvents.length }}</p>
          </div>

          <!-- Карточки мероприятий -->
          <div v-if="myEvents.length" class="row g-4 mb-4">
            <event-card v-for="event in myEvents" :key="event.id" :event="event" />
          </div>
          <div v-else class="profile-state-card">
            <h2 class="events-empty-title mb-2">Пока нет назначенных мероприятий</h2>
            <p class="events-empty-text mb-0">Назначенные мероприятия появятся здесь.</p>
          </div>

          <!-- Списки учеников по каждому мероприятию -->
          <section class="dashboard-panel-section mt-4">
            <div class="dashboard-panel-head mb-3">
              <div>
                <h2 class="events-title h3 mb-1">Кто записан на ваши мероприятия</h2>
                <p class="events-counter mb-0">Ученики сгруппированы по каждому мероприятию.</p>
              </div>
            </div>

            <div class="dashboard-stack">
              <article
                  v-for="event in myEvents"
                  :key="'students-' + event.id"
                  class="dashboard-panel"
              >
                <div class="dashboard-panel-head">
                  <div>
                    <h3 class="dashboard-panel-title">{{ event.title }}</h3>
                    <p class="dashboard-panel-text mb-0">
                      {{ formatDate(event.date) }} · {{ getPlaceLabel(event.place) }}
                    </p>
                  </div>
                  <span class="events-kicker mb-0">
                    Учеников: {{ getStudentsForEvent(event.id).length }}
                  </span>
                </div>

                <div class="dashboard-list">
                  <template v-if="getStudentsForEvent(event.id).length">
                    <div
                        v-for="student in getStudentsForEvent(event.id)"
                        :key="student.id"
                        class="dashboard-list-row"
                    >
                      <div>
                        <div class="dashboard-list-title">{{ getUserName(student) }}</div>
                        <div class="dashboard-list-subtitle">{{ getClassLabel(student) }}</div>
                      </div>
                      <span class="event-meta-pill">{{ student.email || 'Почта не указана' }}</span>
                    </div>
                  </template>
                  <div v-else class="profile-state-card mb-0">
                    <p class="events-empty-text mb-0">На это мероприятие ещё никто не записался.</p>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </section>
  </base-layout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { eventsApi, registrationsApi, usersApi } from '@/api'
import { useFormatters } from '@/composables/useFormatters'
import useAuthStore from '@/stores/auth'
import BaseLayout from '@/layouts/BaseLayout.vue'
import EventCard from '@/components/EventCard.vue'

export default {
  name: 'TeacherPage',
  components: { BaseLayout, EventCard },
  setup() {
    const auth = useAuthStore()
    const { formatDate, getPlaceLabel } = useFormatters()

    const myEvents = ref([])
    const registrations = ref([])
    const usersMap = ref({})

    const teacherName = computed(() => {
      const u = auth.user
      return u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Учитель' : 'Учитель'
    })

    function getStudentsForEvent(eventId) {
      return registrations.value
          .filter(r => String(r.eventId) === String(eventId) && r.status === 'active')
          .map(r => usersMap.value[String(r.userId)])
          .filter(u => u && u.role === 'student')
    }

    function getUserName(user) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Без имени'
    }

    function getClassLabel(student) {
      if (student.isExternal) return 'Не является учеником школы'
      if (student.studentClass && student.studentLetter) return `${student.studentClass} ${student.studentLetter} класс`
      return 'Класс не указан'
    }

    onMounted(async () => {
      try {
        const [eventsRes, regsRes, usersRes] = await Promise.all([
          eventsApi.getAll(),
          registrationsApi.getAll({ status: 'active' }),
          usersApi.getAll()
        ])

        myEvents.value = eventsRes.data
            .filter(e => String(e.responsibleTeacherId) === String(auth.user?.id))
            .sort((a, b) => new Date(a.date) - new Date(b.date))

        registrations.value = regsRes.data

        usersMap.value = Object.fromEntries(
            usersRes.data.map(u => [String(u.id), u])
        )
      } catch (e) {
        console.error(e)
      }
    })

    return { myEvents, teacherName, formatDate, getPlaceLabel, getStudentsForEvent, getUserName, getClassLabel }
  }
}
</script>