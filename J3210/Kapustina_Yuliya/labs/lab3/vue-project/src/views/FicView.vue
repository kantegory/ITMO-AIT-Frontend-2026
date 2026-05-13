<template>
  <div class="container mt-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="currentFic" class="fic-card">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h1 class="mb-2">{{ currentFic.title }}</h1>
          <div class="d-flex align-items-center gap-2 mb-3">
            <span class="rating-tag">{{ currentFic.rating }}</span>
            <span class="fandom-tag">{{ currentFic.fandom }}</span>
            <span :class="statusClass">{{ statusText }}</span>
          </div>
        </div>
        <button
          v-if="isAuthenticated"
          class="btn btn-like"
          :class="{ liked: isLiked }"
          @click="handleLike"
        >
          <i class="bi bi-heart-fill me-1"></i>
          {{ currentFic.likes }}
        </button>
        <div v-else class="text-muted">
          <i class="bi bi-heart me-1"></i>
          {{ currentFic.likes }}
        </div>
      </div>

      <div class="mb-3">
        <p class="text-muted mb-2">
          <span class="author-info">
            <router-link :to="`/profile/${currentFic.authorName}`">
              {{ currentFic.authorName }}
            </router-link>
          </span>
          <span class="ms-3 date-info">{{ formattedDate }}</span>
        </p>
      </div>

      <div class="mb-3">
        <span v-for="tag in currentFic.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <div class="mb-4">
        <p class="lead">{{ currentFic.description }}</p>
      </div>

      <hr />

      <div v-if="chapters.length > 0" class="chapter-navigation mb-4">
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

      <div class="fic-content mt-4" v-html="chapters[currentChapterIndex]?.contentHtml || ''"></div>

      <div class="chapter-navigation mt-4 d-flex justify-content-between" v-if="chapters.length > 1">
        <button
          class="btn btn-outline-main"
          :disabled="currentChapterIndex === 0"
          @click="switchChapter(currentChapterIndex - 1)"
        >
          ← Предыдущая глава
        </button>
        <button
          class="btn btn-outline-main"
          :disabled="currentChapterIndex === chapters.length - 1"
          @click="switchChapter(currentChapterIndex + 1)"
        >
          Следующая глава →
        </button>
      </div>

      <div class="fic-meta mt-4">
        <span class="meta-heart">{{ currentFic.likes }}</span>
        <span class="meta-chat">{{ currentFic.commentsCount }}</span>
        <span class="meta-eye">{{ currentFic.views }}</span>
      </div>

      <CommentSection
        :comments="comments"
        @add-comment="handleAddComment"
      />
    </div>

    <div v-else class="text-center py-5">
      <h2>Фанфик не найден</h2>
      <router-link to="/" class="btn btn-main mt-3">На главную</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFics } from '@/composables/useFics'
import { useAuth } from '@/composables/useAuth'
import CommentSection from '@/components/CommentSection.vue'

const route = useRoute()
const { currentFic, comments, loading, fetchFicById, toggleLike, addToHistory, addComment } = useFics()
const { isAuthenticated } = useAuth()

const isLiked = ref(false)
const chapters = ref([])
const currentChapterIndex = ref(0)

const statusText = computed(() => {
  if (!currentFic.value) return ''
  switch (currentFic.value.status) {
    case 'completed': return 'Закончен'
    case 'in_progress': return 'В процессе'
    default: return ''
  }
})

const statusClass = computed(() => {
  if (!currentFic.value) return ''
  switch (currentFic.value.status) {
    case 'completed': return 'text-success'
    case 'in_progress': return 'text-warning'
    default: return ''
  }
})

const formattedDate = computed(() => {
  if (!currentFic.value) return ''
  return new Date(currentFic.value.createdAt).toLocaleDateString('ru-RU')
})

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
      .replace(/<br\s*\/?>/g, '<br>')
    result.push({
      title: 'Глава 1',
      contentHtml: content
    })
  } else {
    let currentPos = 0

    for (let i = 0; i < titles.length; i++) {
      const escapedTitle = titles[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const titlePattern = new RegExp(`<h2>${escapedTitle}<\\/h2>`, 'i')
      const matchObj = titlePattern.exec(htmlContent.substring(currentPos))

      if (matchObj) {
        const startPos = currentPos + matchObj.index
        const endPos = i < titles.length - 1
          ? currentPos + htmlContent.substring(currentPos).search(
              new RegExp(`<h2>${titles[i + 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/h2>`, 'i')
            )
          : htmlContent.length

        let content = htmlContent.substring(startPos, endPos).trim()

        result.push({
          title: titles[i],
          contentHtml: content
        })
        currentPos = endPos
      }
    }
  }

  return result
}

function switchChapter(index) {
  if (index >= 0 && index < chapters.value.length) {
    currentChapterIndex.value = index
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

async function handleLike() {
  if (!isAuthenticated.value || !currentFic.value) return

  const result = await toggleLike(currentFic.value.id)
  if (result.success) {
    isLiked.value = result.liked
  }
}

async function handleAddComment(content) {
  if (!currentFic.value) return
  await addComment(currentFic.value.id, content)
}

onMounted(async () => {
  const ficId = route.params.id
  await fetchFicById(ficId)

  if (currentFic.value) {
    chapters.value = parseContentToChapters(currentFic.value.content)
    currentChapterIndex.value = 0

    if (isAuthenticated.value) {
      await addToHistory(currentFic.value.id)
    }
  }
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    await fetchFicById(newId)
    if (currentFic.value) {
      chapters.value = parseContentToChapters(currentFic.value.content)
      currentChapterIndex.value = 0
      if (isAuthenticated.value) {
        await addToHistory(currentFic.value.id)
      }
    }
  }
})
</script>
