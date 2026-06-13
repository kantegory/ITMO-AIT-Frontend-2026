<template>
  <div class="container mt-4">
    <h2 class="mb-4">{{ isEditMode ? 'Редактирование фанфика' : 'Создание фанфика' }}</h2>

    <div class="editor-box">
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-8">
            <div class="mb-3">
              <label class="form-label">Название фанфика</label>
              <input class="form-control" v-model="form.title" placeholder="Введите название" />
            </div>
          </div>
          <div class="col-md-4">
            <div class="mb-3">
              <label class="form-label">Фандом</label>
              <select class="form-select" v-model="form.fandom">
                <option value="">Выберите фандом</option>
                <option>Harry Potter</option>
                <option>Naruto</option>
                <option>Marvel</option>
                <option>Star Wars</option>
                <option>Lord of the Rings</option>
                <option>Оригинальный</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Описание</label>
          <textarea class="form-control" v-model="form.description" rows="3"></textarea>
        </div>

        <div class="row">
          <div class="col-md-4">
            <label class="form-label">Рейтинг</label>
            <select class="form-select" v-model="form.rating">
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Статус</label>
            <select class="form-select" v-model="form.status">
              <option value="in_progress">В процессе</option>
              <option value="completed">Закончен</option>
            </select>
          </div>
        </div>

        <div class="mt-3">
          <TagInput v-model="form.tags" />
        </div>

        <hr class="mt-4" />

        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">Главы</h5>
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="addChapter">
            <i class="bi bi-plus-circle"></i> Добавить главу
          </button>
        </div>

        <div class="chapter-navigation mb-3">
          <div class="btn-group btn-group-sm flex-wrap">
            <button
              v-for="(chapter, index) in chapters"
              :key="index"
              type="button"
              class="btn btn-outline-primary btn-sm"
              :class="{ active: currentChapterIndex === index }"
              @click="switchChapter(index)"
            >
              {{ chapter.title.length > 20 ? chapter.title.substring(0, 17) + '...' : chapter.title }}
            </button>
          </div>
        </div>

        <div>
          <ChapterEditor
            v-for="(chapter, index) in chapters"
            :key="index"
            v-show="currentChapterIndex === index"
            :chapter="chapter"
            :can-remove="chapters.length > 1"
            @remove="removeChapter(index)"
          />
        </div>

        <div class="mt-4 text-end">
          <button type="button" class="btn btn-outline-main me-2" @click="saveDraft">
            Сохранить черновик
          </button>
          <button type="submit" class="btn btn-main" :disabled="saving">
            {{ isEditMode ? 'Сохранить изменения' : 'Опубликовать' }}
          </button>
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFics } from '@/composables/useFics'
import TagInput from '@/components/TagInput.vue'
import ChapterEditor from '@/components/ChapterEditor.vue'

const route = useRoute()
const router = useRouter()
const { fetchFicById, createFic, updateFic } = useFics()

const isEditMode = ref(false)
const ficId = ref(null)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  title: '',
  fandom: '',
  description: '',
  rating: 'G',
  status: 'in_progress',
  tags: []
})

const chapters = ref([])
const currentChapterIndex = ref(0)

function addChapter() {
  const newId = chapters.value.length
  chapters.value.push({
    id: newId,
    title: `Глава ${newId + 1}`,
    content: ''
  })
  currentChapterIndex.value = newId
}

function removeChapter(index) {
  if (chapters.value.length <= 1) {
    alert('Нельзя удалить единственную главу')
    return
  }

  chapters.value.splice(index, 1)

  if (currentChapterIndex.value >= chapters.value.length) {
    currentChapterIndex.value = chapters.value.length - 1
  }
}

function switchChapter(index) {
  if (index >= 0 && index < chapters.value.length) {
    currentChapterIndex.value = index
  }
}

function buildFullContent() {
  let fullContent = ''

  chapters.value.forEach((chapter) => {
    if (chapter.content.trim()) {
      fullContent += `<h2>${escapeHtml(chapter.title)}</h2>\n`

      let formattedContent = chapter.content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')

      fullContent += formattedContent
      fullContent += '\n\n'
    }
  })

  return fullContent
}

function parseContentToChapters(htmlContent) {
  const result = []
  const h2Regex = /<h2>(.*?)<\/h2>/g
  const titles = []
  let match

  while ((match = h2Regex.exec(htmlContent)) !== null) {
    titles.push(match[1])
  }

  if (titles.length === 0) {
    let content = htmlContent
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<[^>]*>/g, '')

    result.push({ title: 'Глава 1', content })
  } else {
    let currentPos = 0

    for (let i = 0; i < titles.length; i++) {
      const escapedTitle = titles[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const titlePattern = new RegExp(`<h2>${escapedTitle}<\\/h2>`, 'i')
      const matchObj = titlePattern.exec(htmlContent.substring(currentPos))

      if (matchObj) {
        const startPos = currentPos + matchObj.index + matchObj[0].length
        const endPos = i < titles.length - 1
          ? currentPos + htmlContent.substring(currentPos).search(
              new RegExp(`<h2>${titles[i + 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/h2>`, 'i')
            )
          : htmlContent.length

        let content = htmlContent
          .substring(startPos, endPos)
          .replace(/<br\s*\/?>/g, '\n')
          .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
          .replace(/<em>(.*?)<\/em>/g, '*$1*')
          .replace(/<[^>]*>/g, '')
          .trim()

        result.push({ title: titles[i], content })
        currentPos = endPos
      }
    }
  }

  return result
}

function escapeHtml(str) {
  if (!str) return ''
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function validateForm() {
  if (!form.title || form.title.length < 3) {
    errorMessage.value = 'Название должно быть не менее 3 символов'
    return false
  }

  if (!form.fandom) {
    errorMessage.value = 'Выберите фандом'
    return false
  }

  if (!form.description || form.description.length < 10) {
    errorMessage.value = 'Описание должно быть не менее 10 символов'
    return false
  }

  const fullContent = buildFullContent()
  if (!fullContent.trim()) {
    errorMessage.value = 'Введите текст хотя бы одной главы'
    return false
  }

  if (form.tags.length === 0) {
    errorMessage.value = 'Добавьте хотя бы один тег'
    return false
  }

  return true
}

async function saveDraft() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) return

  saving.value = true

  const ficData = {
    title: form.title,
    fandom: form.fandom,
    description: form.description,
    rating: form.rating,
    content: buildFullContent(),
    tags: form.tags,
    status: 'draft'
  }

  try {
    let result

    if (isEditMode.value) {
      result = await updateFic(ficId.value, ficData)
    } else {
      result = await createFic(ficData)
    }

    if (result.success) {
      successMessage.value = 'Черновик сохранен! Перенаправление...'
      setTimeout(() => {
        router.push(`/fic/${result.data.id}`)
      }, 2000)
    } else {
      errorMessage.value = result.error
    }
  } catch (err) {
    errorMessage.value = 'Ошибка сохранения черновика'
  } finally {
    saving.value = false
  }
}

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) return

  saving.value = true

  const ficData = {
    title: form.title,
    fandom: form.fandom,
    description: form.description,
    rating: form.rating,
    content: buildFullContent(),
    tags: form.tags,
    status: form.status
  }

  try {
    let result

    if (isEditMode.value) {
      result = await updateFic(ficId.value, ficData)
    } else {
      result = await createFic(ficData)
    }

    if (result.success) {
      successMessage.value = isEditMode.value
        ? 'Изменения сохранены! Перенаправление...'
        : 'Фанфик успешно опубликован! Перенаправление...'
      setTimeout(() => {
        router.push(`/fic/${result.data.id}`)
      }, 2000)
    } else {
      errorMessage.value = result.error
    }
  } catch (err) {
    errorMessage.value = 'Ошибка сохранения фанфика'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  ficId.value = route.params.id

  if (ficId.value) {
    isEditMode.value = true
    const data = await fetchFicById(ficId.value)

    if (data) {
      form.title = data.fic.title
      form.fandom = data.fic.fandom
      form.description = data.fic.description
      form.rating = data.fic.rating
      form.status = data.fic.status
      form.tags = [...data.fic.tags]

      const parsedChapters = parseContentToChapters(data.fic.content)
      chapters.value = parsedChapters.map((ch, idx) => ({
        id: idx,
        title: ch.title,
        content: ch.content
      }))

      if (chapters.value.length === 0) {
        chapters.value = [{ id: 0, title: 'Глава 1', content: '' }]
      }
    }
  } else {
    chapters.value = [{ id: 0, title: 'Глава 1', content: '' }]
  }
})
</script>