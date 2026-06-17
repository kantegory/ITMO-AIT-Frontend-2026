<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'
import { useLikes } from '@/composables/useLikes'
import { useDiscussions } from '@/composables/useDiscussions'

const route = useRoute()
const api = useApi()
const { isAuth, user } = useAuth()
const likes = useLikes()
const disc = useDiscussions()

const item = ref(null)
const stars = ref(0)
const liked = ref(false)

const discussions = ref([])
const showNewDiscussion = ref(false)
const newTitle = ref('')

const threads = ref({})

onMounted(async () => {
    const { data } = await api.get(`/items/${route.params.id}`)
    item.value = data

    stars.value = await likes.count(item.value.id)
    if (isAuth.value) {
        const my = await likes.myLike(item.value.id, user.value.id)
        liked.value = !!my
    }

    discussions.value = await disc.listByItem(item.value.id)
})

async function toggleLike() {
    if (!isAuth.value) return
    const isNowLiked = await likes.toggle(item.value.id, user.value.id)
    liked.value = isNowLiked
    stars.value += isNowLiked ? 1 : -1
}

async function download() {
    const updated = await api.patch(`/items/${item.value.id}`, {
        downloads: item.value.downloads + 1,
    })
    item.value.downloads = updated.data.downloads
}

async function createDiscussion() {
    const d = await disc.create(item.value.id, user.value.id, newTitle.value)
    discussions.value.push(d)
    newTitle.value = ''
    showNewDiscussion.value = false
}

async function toggleThread(id) {
    if (threads.value[id]?.open) {
        threads.value[id].open = false
        return
    }
    const msgs = await disc.messages(id)
    threads.value[id] = { open: true, messages: msgs, newMessage: '' }
}

async function sendMessage(id) {
    const t = threads.value[id]
    const m = await disc.sendMessage(id, user.value.id, t.newMessage)
    t.messages.push(m)
    t.newMessage = ''
}
</script>

<template>
    <div class="container" v-if="item">
        <RouterLink to="/" class="muted">← К каталогу</RouterLink>

        <article class="card detail">
            <span class="badge" :class="item.type === 'model' ? 'badge-model' : 'badge-dataset'">
                <svg class="icon" aria-hidden="true"><use :href="`/sprites.svg#${item.type}`"/></svg>
                {{ item.type === 'model' ? 'Model' : 'Dataset' }}
            </span>
            <h1>{{ item.name }}</h1>
            <p class="muted">{{ item.framework }} · {{ item.license }} · {{ item.task }}</p>
            <p>{{ item.description }}</p>

            <div class="actions">
                <button v-if="isAuth" class="btn btn-sm" @click="toggleLike">
                    <svg class="icon" aria-hidden="true"><use :href="`/sprites.svg#star`"/></svg>
                    {{ liked ? 'Unlike' : 'Like' }} ({{ stars }})
                </button>
                <span v-else class="muted">
                    <svg class="icon" aria-hidden="true"><use :href="`/sprites.svg#star`"/></svg>
                    {{ stars }}
                </span>

                <button class="btn btn-sm btn-alt" @click="download">
                    Скачать ({{ item.downloads }})
                </button>
            </div>
        </article>

        <section class="discussions">
            <div class="section-head">
                <h2>Обсуждения</h2>
                <button v-if="isAuth" class="btn btn-sm" @click="showNewDiscussion = !showNewDiscussion">
                    + Добавить обсуждение
                </button>
            </div>

            <form v-if="showNewDiscussion" class="card new-form" @submit.prevent="createDiscussion">
                <input v-model="newTitle" required class="input" placeholder="Тема обсуждения" />
                <button type="submit" class="btn">Создать</button>
            </form>

            <div v-if="discussions.length" class="list">
                <article v-for="d in discussions" :key="d.id" class="card discussion">
                    <header @click="toggleThread(d.id)" class="d-head">
                        <strong>{{ d.title }}</strong>
                        <small class="muted">{{ new Date(d.createdAt).toLocaleDateString() }}</small>
                    </header>
                    <div v-if="threads[d.id]?.open" class="thread">
                        <div v-for="m in threads[d.id].messages" :key="m.id" class="message">
                            <p>{{ m.body }}</p>
                        </div>
                        <form v-if="isAuth" @submit.prevent="sendMessage(d.id)" class="reply">
                            <textarea v-model="threads[d.id].newMessage" required class="input" placeholder="Написать сообщение"></textarea>
                            <button type="submit" class="btn btn-sm">Отправить</button>
                        </form>
                    </div>
                </article>
            </div>
            <p v-else class="muted">Обсуждений пока нет.</p>
        </section>
    </div>
    <p v-else class="container">Загрузка</p>
</template>

<style scoped>
.detail {
    margin-top: 1.5rem; 
}
.actions { 
    display: flex; 
    gap: 0.5rem; 
    margin-top: 1rem; 
    align-items: center; 
}
.discussions { 
    margin-top: 2rem; 
}
.section-head { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 1rem; 
}
.new-form { 
    display: flex; 
    gap: 0.5rem; 
    margin-bottom: 1rem; 
}
.list { 
    display: flex; 
    flex-direction: column; 
    gap: 0.75rem; 
}
.discussion { 
    padding: 1rem; 
}
.d-head { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    cursor: pointer; 
}
.thread {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.message {
    padding: 0.6rem 0.9rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    max-width: 80%;
    align-self: flex-start;
}
.message p { 
    margin: 0; 
}
.reply { 
    display: flex; 
    flex-direction: column; 
    gap: 0.5rem; 
    margin-top: 0.5rem; 
}
.reply textarea { 
    min-height: 60px; 
    resize: vertical; 
}
</style>
