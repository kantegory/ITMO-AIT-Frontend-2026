<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useCollaboration } from '@/composables/useCollaboration.js'
import { useToast } from '@/composables/useToast.js'

const {
  participants,
  stages,
  sharedNotes,
  ideas,
  loadAll,
  addParticipant,
  addStage,
  updateStage,
  removeStage,
  addSharedNote,
  removeSharedNote,
  addIdea,
  supportIdea
} = useCollaboration()
const { showToast } = useToast()

const participantForm = reactive({ name: '', email: '', role: '', status: '' })
const stageForm = reactive({ id: '', day: '', place: '', description: '' })
const noteForm = reactive({ author: '', text: '' })
const ideaForm = reactive({ title: '', text: '' })

const isInviteOpen = ref(false)
const isStageOpen = ref(false)

function openInvite() {
  participantForm.name = ''
  participantForm.email = ''
  participantForm.role = ''
  participantForm.status = ''
  isInviteOpen.value = true
}

function openStage(stage = null) {
  if (stage) {
    stageForm.id = stage.id
    stageForm.day = stage.day
    stageForm.place = stage.place
    stageForm.description = stage.description
  } else {
    stageForm.id = ''
    stageForm.day = ''
    stageForm.place = ''
    stageForm.description = ''
  }
  isStageOpen.value = true
}

async function submitParticipant() {
  if (!participantForm.name.trim() || !participantForm.email.trim() || !participantForm.role || !participantForm.status) {
    showToast('Заполните данные участника', 'error')
    return
  }
  try {
    await addParticipant({
      name: participantForm.name.trim(),
      email: participantForm.email.trim(),
      role: participantForm.role,
      status: participantForm.status
    })
    isInviteOpen.value = false
    showToast('Участник добавлен', 'success')
  } catch {
    showToast('Не удалось добавить участника', 'error')
  }
}

async function submitStage() {
  if (!stageForm.day.trim() || !stageForm.place.trim() || !stageForm.description.trim()) {
    showToast('Заполните этап маршрута', 'error')
    return
  }
  const payload = {
    day: stageForm.day.trim(),
    place: stageForm.place.trim(),
    description: stageForm.description.trim()
  }
  try {
    if (stageForm.id) {
      await updateStage(stageForm.id, payload)
      showToast('Этап маршрута обновлён', 'success')
    } else {
      await addStage(payload)
      showToast('Этап маршрута добавлен', 'success')
    }
    isStageOpen.value = false
  } catch {
    showToast('Не удалось сохранить этап', 'error')
  }
}

async function deleteStage(stageId) {
  try {
    await removeStage(stageId)
    showToast('Этап маршрута удалён', 'info')
  } catch {
    showToast('Не удалось удалить этап', 'error')
  }
}

async function submitSharedNote() {
  if (!noteForm.author.trim() || !noteForm.text.trim()) {
    showToast('Укажите автора и текст заметки', 'error')
    return
  }
  try {
    await addSharedNote({ author: noteForm.author.trim(), text: noteForm.text.trim() })
    noteForm.author = ''
    noteForm.text = ''
    showToast('Общая заметка добавлена', 'success')
  } catch {
    showToast('Не удалось добавить заметку', 'error')
  }
}

async function deleteSharedNote(noteId) {
  try {
    await removeSharedNote(noteId)
    showToast('Заметка удалена', 'info')
  } catch {
    showToast('Не удалось удалить заметку', 'error')
  }
}

async function submitIdea() {
  if (!ideaForm.title.trim() || !ideaForm.text.trim()) {
    showToast('Заполните заголовок и описание идеи', 'error')
    return
  }
  try {
    await addIdea({ title: ideaForm.title.trim(), text: ideaForm.text.trim() })
    ideaForm.title = ''
    ideaForm.text = ''
    showToast('Идея добавлена', 'success')
  } catch {
    showToast('Не удалось добавить идею', 'error')
  }
}

async function vote(ideaId) {
  try {
    await supportIdea(ideaId)
    showToast('Вы поддержали идею', 'success')
  } catch {
    showToast('Не удалось обновить голос', 'error')
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value))
}

onMounted(() => loadAll(true))
</script>

<template>
  <div id="collaborationPage">
    <section class="page-header">
      <div class="container">
        <div class="page-header-card">
          <h1 class="section-title-sm mb-2">Совместное планирование поездки</h1>
          <p>Раздел для командной работы: участники, общий маршрут, заметки и идеи поездки.</p>
        </div>
      </div>
    </section>

    <section class="pb-5">
      <div class="container">
        <div class="dashboard-card mb-4">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div>
              <h2 class="h3 mb-1">Участники поездки</h2>
              <p class="text-secondary mb-0">Кто участвует в подготовке, кто организует поездку и кто сейчас на связи.</p>
            </div>
            <button class="btn btn-primary" type="button" @click="openInvite">Пригласить участника</button>
          </div>
          <div class="row g-4">
            <div v-for="participant in participants" :key="participant.id" class="col-md-6 col-xl-4">
              <article class="collab-card">
                <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h3 class="h5 mb-1">{{ participant.name }}</h3>
                    <p class="text-secondary mb-0">{{ participant.email }}</p>
                  </div>
                  <span class="badge" :class="participant.role === 'organizer' ? 'badge-city' : 'badge-soft'">
                    {{ participant.role === 'organizer' ? 'Организатор' : 'Участник' }}
                  </span>
                </div>
                <p
                  class="participant-status"
                  :class="participant.status === 'online' ? 'status-online' : 'status-offline'"
                >
                  {{ participant.status === 'online' ? 'Онлайн' : 'Оффлайн' }}
                </p>
              </article>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-7">
            <div class="dashboard-card mb-4">
              <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <h2 class="h3 mb-1">Общий маршрут</h2>
                  <p class="text-secondary mb-0">Этапы поездки по дням с возможностью редактирования и удаления.</p>
                </div>
                <button class="btn btn-outline-primary" type="button" @click="openStage()">Добавить этап</button>
              </div>
              <div v-if="stages.length" class="collab-stack">
                <article v-for="stage in stages" :key="stage.id" class="collab-card">
                  <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                    <div>
                      <span class="badge badge-soft mb-3">{{ stage.day }}</span>
                      <h3 class="h5 mb-2">{{ stage.place }}</h3>
                      <p class="text-secondary mb-0">{{ stage.description }}</p>
                    </div>
                    <div class="d-flex flex-wrap gap-2 align-self-stretch align-self-md-start">
                      <button type="button" class="btn btn-sm btn-outline-primary" @click="openStage(stage)">Редактировать</button>
                      <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteStage(stage.id)">Удалить</button>
                    </div>
                  </div>
                </article>
              </div>
              <div v-else class="empty-state">
                <i class="bi bi-signpost-split" />
                <h3 class="h4">Этапы ещё не добавлены</h3>
                <p class="text-secondary mb-0">Создайте первый пункт маршрута, чтобы команда видела план по дням.</p>
              </div>
            </div>

            <div class="dashboard-card">
              <div class="d-flex justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <h2 class="h3 mb-1">Общие заметки</h2>
                  <p class="text-secondary mb-0">Короткие комментарии и важные напоминания для всей группы.</p>
                </div>
              </div>
              <form class="mb-4" @submit.prevent="submitSharedNote">
                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="form-label" for="sharedNoteAuthor">Автор</label>
                    <input id="sharedNoteAuthor" v-model="noteForm.author" class="form-control" type="text" placeholder="Ваше имя" />
                  </div>
                  <div class="col-md-8">
                    <label class="form-label" for="sharedNoteText">Заметка</label>
                    <input id="sharedNoteText" v-model="noteForm.text" class="form-control" type="text" placeholder="Что важно учесть для поездки" />
                  </div>
                </div>
                <button class="btn btn-primary mt-3" type="submit">Добавить заметку</button>
              </form>
              <div v-if="sharedNotes.length" class="collab-stack">
                <article v-for="note in sharedNotes" :key="note.id" class="collab-card">
                  <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                    <div>
                      <h3 class="h6 mb-1">{{ note.author }}</h3>
                      <p class="text-secondary mb-0">{{ formatDate(note.date) }}</p>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteSharedNote(note.id)">Удалить</button>
                  </div>
                  <p class="mb-0">{{ note.text }}</p>
                </article>
              </div>
              <div v-else class="empty-state">
                <i class="bi bi-stickies" />
                <h3 class="h4">Нет общих заметок</h3>
                <p class="text-secondary mb-0">Добавьте первую заметку для команды.</p>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="dashboard-card">
              <h2 class="h3 mb-3">Идеи и рекомендации</h2>
              <p class="text-secondary">Сюда можно добавлять предложения по поездке и поддерживать их голосами.</p>
              <form class="mb-4" @submit.prevent="submitIdea">
                <div class="mb-3">
                  <label class="form-label" for="ideaTitle">Заголовок идеи</label>
                  <input id="ideaTitle" v-model="ideaForm.title" class="form-control" type="text" placeholder="Например: Устроить музейный день" />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="ideaText">Описание</label>
                  <textarea id="ideaText" v-model="ideaForm.text" class="form-control" placeholder="Почему это полезно для всей поездки" />
                </div>
                <button class="btn btn-primary w-100" type="submit">Добавить идею</button>
              </form>
              <div v-if="ideas.length" class="row g-4">
                <div v-for="idea in ideas" :key="idea.id" class="col-md-6 col-xl-12">
                  <article class="collab-card h-100">
                    <h3 class="h5">{{ idea.title }}</h3>
                    <p class="text-secondary">{{ idea.text }}</p>
                    <div class="d-flex justify-content-between align-items-center gap-3 flex-nowrap">
                      <span class="badge badge-soft text-nowrap">Поддержали: {{ idea.votes }}</span>
                      <button type="button" class="btn btn-sm btn-primary text-nowrap" @click="vote(idea.id)">Поддержать идею</button>
                    </div>
                  </article>
                </div>
              </div>
              <div v-else class="empty-state">
                <i class="bi bi-lightbulb" />
                <h3 class="h4">Пока нет идей</h3>
                <p class="text-secondary mb-0">Предложите первую активность или улучшение маршрута.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="isInviteOpen" class="modal-backdrop-custom" @click.self="isInviteOpen = false">
      <div class="modal-dialog-custom">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h5 mb-0">Пригласить участника</h2>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="isInviteOpen = false" />
        </div>
        <form @submit.prevent="submitParticipant">
          <div class="mb-3">
            <label class="form-label" for="participantName">Имя</label>
            <input id="participantName" v-model="participantForm.name" class="form-control" type="text" placeholder="Иван Петров" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="participantEmail">Email</label>
            <input id="participantEmail" v-model="participantForm.email" class="form-control" type="email" placeholder="ivan@example.com" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="participantRole">Роль</label>
            <select id="participantRole" v-model="participantForm.role" class="form-select">
              <option value="">Выберите роль</option>
              <option value="organizer">Организатор</option>
              <option value="member">Участник</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label" for="participantStatus">Статус</label>
            <select id="participantStatus" v-model="participantForm.status" class="form-select">
              <option value="">Выберите статус</option>
              <option value="online">Онлайн</option>
              <option value="offline">Оффлайн</option>
            </select>
          </div>
          <button class="btn btn-primary w-100" type="submit">Добавить участника</button>
        </form>
      </div>
    </div>

    <div v-if="isStageOpen" class="modal-backdrop-custom" @click.self="isStageOpen = false">
      <div class="modal-dialog-custom">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h5 mb-0">{{ stageForm.id ? 'Редактировать этап маршрута' : 'Добавить этап маршрута' }}</h2>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="isStageOpen = false" />
        </div>
        <form @submit.prevent="submitStage">
          <div class="mb-3">
            <label class="form-label" for="stageDay">День</label>
            <input id="stageDay" v-model="stageForm.day" class="form-control" type="text" placeholder="День 3" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="stagePlace">Место</label>
            <input id="stagePlace" v-model="stageForm.place" class="form-control" type="text" placeholder="Старый город" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="stageDescription">Описание</label>
            <textarea id="stageDescription" v-model="stageForm.description" class="form-control" placeholder="Что делаем на этом этапе" />
          </div>
          <button class="btn btn-primary w-100" type="submit">Сохранить этап</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}
.modal-dialog-custom {
  background: var(--tp-surface, #fff);
  color: var(--tp-text, #0f172a);
  border-radius: var(--tp-radius-md, 1rem);
  padding: 1.5rem;
  width: min(540px, 100%);
  box-shadow: var(--tp-shadow, 0 30px 60px rgba(15, 23, 42, 0.25));
}
</style>
