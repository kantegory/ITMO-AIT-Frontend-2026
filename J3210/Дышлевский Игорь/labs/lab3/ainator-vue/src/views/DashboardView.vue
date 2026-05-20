<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useApi } from '@/composables/useApi'
import { useLikes } from '@/composables/useLikes'
import Card from '@/components/Card.vue'
import StatBox from '@/components/StatBox.vue'
import ItemForm from '@/components/ItemForm.vue'

const { user } = useAuth()
const api = useApi()
const likes = useLikes()

const items = ref([])
const totalStars = ref(0)
const showForm = ref(false)

const fullName = `${user.value?.firstName ?? ''} ${user.value?.lastName ?? ''}`.trim()

const totalDownloads = computed(() =>
    items.value.reduce((sum, i) => sum + (i.downloads || 0), 0)
)

async function refreshStars() {
    const counts = await Promise.all(items.value.map((i) => likes.count(i.id)))
    totalStars.value = counts.reduce((a, b) => a + b, 0)
}

onMounted(async () => {
    const { data } = await api.get(`/items?userId=${user.value.id}`)
    items.value = data
    await refreshStars()
})

async function createItem(payload) {
    const { data } = await api.post('/items', {
        ...payload,
        userId: user.value.id,
        downloads: 0,
    })
    items.value.push(data)
    showForm.value = false
}
</script>

<template>
    <div class="container">
        <section class="profile">
            <div class="card name-card">
                <h3>{{ fullName }}</h3>
            </div>
            <StatBox label="Загрузки" :value="totalDownloads" />
            <StatBox label="Звёзды" :value="totalStars" />
        </section>

        <section>
            <div class="section-head">
                <h2>Мои модели и датасеты</h2>
                <button class="btn btn-sm" @click="showForm = !showForm">+ Добавить</button>
            </div>

            <ItemForm v-if="showForm" @submit="createItem" @cancel="showForm = false" />

            <div v-if="items.length" class="grid">
                <Card v-for="item in items" :key="item.id" :item="item" :show-stats="false" />
            </div>
            <p v-else class="muted">Пока ничего нет.</p>
        </section>
    </div>
</template>

<style scoped>
.profile { 
    display: grid; 
    grid-template-columns: 2fr 1fr 1fr; 
    gap: 1rem; 
    margin: 2rem 0; 
}
.name-card { 
    text-align: center; 
}
.section-head { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 1rem; 
}
.grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
    gap: 1rem; align-items: start; 
}
</style>