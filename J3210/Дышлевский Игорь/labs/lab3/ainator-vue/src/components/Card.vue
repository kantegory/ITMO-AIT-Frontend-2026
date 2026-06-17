<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useLikes } from '@/composables/useLikes'

const props = defineProps({
    item: { type: Object, required: true },
    showStats: { type: Boolean, default: true },
})

const likes = useLikes()
const stars = ref(0)

onMounted(async () => {
    if (props.showStats) {
        stars.value = await likes.count(props.item.id)
    }
})

const meta = computed(() =>
    [props.item.framework, props.item.license].filter(Boolean).join(', ')
)
</script>

<template>
    <article class="card">
        <span class="badge" :class="item.type === 'model' ? 'badge-model' : 'badge-dataset'">
            <svg class="icon" aria-hidden="true"><use :href="`/sprites.svg#${item.type}`"/></svg>
            {{ item.type === 'model' ? 'Model' : 'Dataset' }}
        </span>
        <h3>
            <RouterLink :to="`/items/${item.id}`">{{ item.name }}</RouterLink>
        </h3>
        <p class="muted">{{ meta }}</p>
        <small v-if="showStats" class="muted">
            <svg class="icon" aria-hidden="true"><use :href="`/sprites.svg#star`"/></svg>
            {{ stars }} stars, {{ item.downloads }} downloads
        </small>
    </article>
</template>

<style scoped>
h3 { 
    margin: 0.5rem 0; 
}
</style>
