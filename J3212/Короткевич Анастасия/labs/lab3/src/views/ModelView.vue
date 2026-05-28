<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'
import { useItems } from '../composables/useItems'

const props = defineProps({ type: String, id: String })
const { getItem, updateStat } = useItems()
const item = ref(null)
const author = ref(null)
const discussions = ref([])
const comment = ref('')
const isLoading = ref(true)

const loadPage = async () => {
  item.value = await getItem(props.type, props.id)

  if (!item.value) {
    isLoading.value = false
    return
  }

  const [authorResponse, commentsResponse] = await Promise.all([
    api.get(`/users/${item.value.authorId}`),
    api.get('/discussions', { params: { itemType: item.value.type, itemId: item.value.id } })
  ])

  author.value = authorResponse.data
  discussions.value = commentsResponse.data
  isLoading.value = false
}

const increment = async (field) => {
  item.value = await updateStat(item.value, field)
}

const addComment = async () => {
  if (!comment.value.trim()) return

  const response = await api.post('/discussions', {
    itemType: item.value.type,
    itemId: item.value.id,
    author: localStorage.getItem('userName') || 'guest',
    text: comment.value.trim()
  })

  discussions.value.push(response.data)
  comment.value = ''
}

onMounted(loadPage)
</script>

<template>
  <main class="detail-page page-gradient">
    <p v-if="isLoading" class="empty-text">Загрузка страницы</p>
    <p v-else-if="!item" class="empty-text">Объект не найден</p>

    <template v-else>
      <section class="detail-hero modern-card">
        <div class="detail-hero-main">
          <span class="type-badge">{{ item.type === 'dataset' ? 'Dataset' : 'Model' }}</span>
          <h1>{{ item.title }}</h1>
          <p>{{ item.description }}</p>

          <div class="tags">
            <span>{{ item.task }}</span>
            <span>{{ item.framework }}</span>
            <span>{{ item.license }}</span>
            <span>{{ item.size }}</span>
          </div>
        </div>

        <aside class="actions-card">
          <button type="button" @click="increment('stars')"><svg aria-hidden="true"><use href="/sprite.svg#icon-star-outline" /></svg>{{ item.stars }} Stars</button>
          <button type="button" @click="increment('downloads')"><svg aria-hidden="true"><use href="/sprite.svg#icon-download" /></svg>{{ item.downloads }} Downloads</button>
          <button type="button" @click="increment('forks')"><svg aria-hidden="true"><use href="/sprite.svg#icon-fork" /></svg>{{ item.forks }} Forks</button>
        </aside>
      </section>

      <section class="detail-layout">
        <article class="panel detail-content-card">
          <h2>Описание</h2>
          <p>{{ item.description }}</p>

          <h2>Пример использования</h2>
          <pre><code>{{ item.usageExample || 'Пример использования пока не добавлен.' }}</code></pre>

          <h2>Метрики</h2>
          <div class="metric-grid">
            <div v-for="(value, key) in item.metrics" :key="key" class="metric-card">
              <span>{{ key }}</span>
              <strong>{{ value }}</strong>
            </div>
          </div>
        </article>

        <aside class="panel author-panel" v-if="author">
          <img :src="author.avatar" :alt="`Аватар ${author.name}`" class="avatar small" />
          <h3>{{ author.name }}</h3>
          <p class="role">{{ author.role }}</p>
        </aside>
      </section>

      <section class="panel discussion-panel">
        <h2>Обсуждение</h2>
        <form class="comment-form" @submit.prevent="addComment">
          <input v-model="comment" placeholder="Написать комментарий" />
          <button type="submit">Отправить</button>
        </form>

        <article v-for="message in discussions" :key="message.id" class="comment-card">
          <strong>{{ message.author }}</strong>
          <p>{{ message.text }}</p>
        </article>
      </section>
    </template>
  </main>
</template>
