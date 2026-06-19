<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import OrganizerEventForm from '../components/OrganizerEventForm.vue'
import OrganizerEventList from '../components/OrganizerEventList.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { currentUser, loadCurrentUser, persistUser } = useAuth()
const message = ref('')
const messageType = ref('success')
const saving = ref(false)

const organizerEvents = computed(() => currentUser.value?.organizerEvents || [])

onMounted(async () => {
  const user = currentUser.value || (await loadCurrentUser())
  if (!user) {
    router.replace('/auth')
    return
  }

  if (user.accountType !== 'organizer') {
    router.replace('/profile')
    return
  }

  if (!Array.isArray(user.organizerEvents)) {
    await persistUser({ ...user, organizerEvents: [] })
  }
})

function toReadableDate(dateValue) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return dateValue
  }

  return date.toLocaleDateString('ru-RU')
}

function showMessage(text, type = 'success') {
  message.value = text
  messageType.value = type
  window.setTimeout(() => {
    message.value = ''
  }, 2400)
}

async function createOrganizerEvent(payload) {
  if (!currentUser.value || saving.value) {
    return
  }

  saving.value = true

  const newEvent = {
    id: `org_event_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    name: payload.name,
    category: payload.category,
    dateIso: payload.dateIso,
    date: toReadableDate(payload.dateIso),
    time: payload.time,
    city: payload.city,
    venue: payload.venue,
    age: payload.age,
    description: payload.description,
    posterImage: payload.posterImage,
    price: payload.price,
  }

  try {
    await persistUser({
      ...currentUser.value,
      organizerEvents: [newEvent, ...organizerEvents.value],
    })

    payload.resetForm()
    showMessage('Событие создано.', 'success')
  } catch (error) {
    showMessage(error?.response?.data?.message || 'Не удалось сохранить событие. Попробуйте позже.', 'danger')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AppNavbar active-page="organizer" />

  <main class="cabinet-page py-4 py-lg-5">
    <div class="container">
      <div v-if="!currentUser" class="alert alert-light border">Загружаем кабинет организатора...</div>

      <template v-else>
        <section class="cabinet-card p-3 p-sm-4 mb-4">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 class="h4 m-0">Личный кабинет организатора</h1>
              <p class="text-secondary m-0 small">{{ currentUser.name }} | {{ currentUser.email }}</p>
            </div>
            <div v-if="message">
              <div class="alert py-2 px-3 mb-0" :class="`alert-${messageType}`">{{ message }}</div>
            </div>
          </div>
        </section>

        <div class="row g-4">
          <div class="col-xl-5">
            <section class="cabinet-card p-3 p-sm-4">
              <h2 class="h5 mb-3">Создание события</h2>
              <OrganizerEventForm @create="createOrganizerEvent" />
            </section>
          </div>

          <div class="col-xl-7">
            <section class="cabinet-card p-3 p-sm-4">
              <div class="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
                <h2 class="h5 m-0">Список событий</h2>
                <span v-if="saving" class="text-secondary small">Сохраняем...</span>
              </div>
              <OrganizerEventList :events="organizerEvents" />
            </section>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>
