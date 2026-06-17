<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import Card from '@/components/Card.vue'

const api = useApi()
const items = ref([])
const type = ref('all')
const task = ref('all')
const license = ref('all')
const framework = ref('all')

onMounted(async () => {
    const { data } = await api.get('/items')
    items.value = data
})

const filtered = computed(() =>
    items.value.filter(
        (i) => (type.value === 'all' || i.type === type.value) &&
            (task.value === 'all' || i.task === task.value) &&
            (license.value === 'all' || i.license === license.value) &&
            (framework.value === 'all' || i.framework === framework.value)
    )
)
</script>

<template>
    <div class="container">
        <section class="hero">
            <h1>AInator</h1>
            <p class="muted">Платформа для моделей и датасетов</p>
            <p class="muted"><em>Всё без СМС, но с регистрацией</em></p>
        </section>

        <h2>Каталог</h2>
        <div class="layout">
            <aside class="card filters">
                <label>Тип
                    <select v-model="type" class="select">
                        <option value="all">Все</option>
                        <option value="model">Модели</option>
                        <option value="dataset">Датасеты</option>
                    </select>
                </label>
                <label>Задача
                    <select v-model="task" class="select">
                        <option value="all">Любая</option>
                        <option value="CV">Computer Vision</option>
                        <option value="NLP">NLP</option>
                    </select>
                </label>
                <label>Лицензия
                    <select v-model="license" class="select">
                        <option value="all">Любая</option>
                        <option value="MIT">MIT</option>
                        <option value="Apache-2.0">Apache-2.0</option>
                    </select>
                </label>
                <label>Фреймворк
                    <select v-model="framework" class="select">
                        <option value="all">Любой</option>
                        <option value="PyTorch">PyTorch</option>
                        <option value="TensorFlow">TensorFlow</option>
                    </select>
                </label>
            </aside>

            <div class="grid">
                <Card v-for="item in filtered" :key="item.id" :item="item" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.hero { 
    text-align: center; 
    padding: 3rem 0; 
}
.hero h1 { 
    font-size: 3rem; 
    margin: 0; 
}
.layout { 
    display: grid; 
    grid-template-columns: 250px 1fr; 
    gap: 1.5rem; 
}
.filters { 
    display: flex; 
    flex-direction: 
    column; gap: 1rem; 
}
.grid { 
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
    gap: 1rem; 
    align-items: start; 
}
</style>