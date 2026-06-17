<script setup>
import {computed} from 'vue'

const props = defineProps({
    course: Object,
    progress: String,
    hasCertificate: Boolean
})

const progressValue = computed(() => parseInt(props.progress) || 0)

defineEmits(['get-cert'])
</script>

<template>
    <div class="col-12">
        <div class="card p-3 mb-3">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="fw-bold mt-2 h5">{{ course.title }}</h3>
                <span class="badge bg-primary">{{ progress }}</span>
            </div>

            <div class="progress" role="progressbar" :aria-valuenow="progressValue"
                 aria-valuemin="0"
                 aria-valuemax="100" :aria-label="'Прогресс курса ' + course.title">
                <div class="progress-bar" :style="{ width: progress }"></div>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3">
                <button
                    v-if="progressValue >= 80 && !hasCertificate"
                    @click="$emit('get-cert', course.title)"
                    class="btn btn-sm btn-success mt-2"
                >
                    Получить сертификат
                </button>

                <router-link
                    :to="`/course/${course.id}`"
                    class="btn btn-sm btn-outline-primary ms-auto"
                >
                    Продолжить обучение
                </router-link>
            </div>
        </div>
    </div>
</template>
