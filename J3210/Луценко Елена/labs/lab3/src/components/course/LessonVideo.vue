<script setup>
import {ref, watch, onMounted} from 'vue'
import axios from 'axios'

const props = defineProps(['lessonTitle', 'courseTitle'])
const videoUrl = ref('')

const loadVideo = async () => {
    videoUrl.value = ''
    const API_KEY = 'oIPivGII5t0bLqhIo6RKy3KdLCCtGygx5GlIBLAJ1kh5YjTbTtYDER4M'
    const query = encodeURIComponent(props.lessonTitle + " " + props.courseTitle)

    try {
        const res = await axios.get(`https://api.pexels.com/videos/search?query=${query}&per_page=1`, {
            headers: {Authorization: API_KEY}
        })
        videoUrl.value = res.data.videos[0]?.video_files[0]?.link || ''
    } catch (e) {
        console.error("Video API error", e)
    }
}

watch(() => props.lessonTitle, loadVideo)
onMounted(loadVideo)
</script>

<template>
    <div class="ratio ratio-16x9 video mb-4 bg-dark" id="video-container">
        <div v-if="!videoUrl" class="video-content">
            <div class="text-center">
                <div class="display-4">
                    <svg class="icon">
                        <use href="/sprite.svg#icon-play"></use>
                    </svg>
                </div>
                <div class="spinner-border text-light" role="status"></div>
                <h4 class="fw-bold mt-2">{{ lessonTitle }}</h4>
            </div>
        </div>
        <video v-else id="courseVideo" controls autoplay muted loop class="course-video">
            <source :src="videoUrl" type="video/mp4">
        </video>
    </div>
</template>
