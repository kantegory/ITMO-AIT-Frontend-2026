<script setup>
import {ref, onMounted, computed, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {coursesApi} from '@/api'
import {useAuth} from '@/composables/useAuth'

import MainLayout from '@/layouts/MainLayout.vue'
import CommentItem from '@/components/course/CommentItem.vue'
import LessonProgramItem from '@/components/course/LessonProgramItem.vue'
import LessonVideo from '@/components/course/LessonVideo.vue'
import LessonDetails from '@/components/course/LessonDetails.vue'

const route = useRoute();
const router = useRouter();
const {user} = useAuth()
const course = ref(null);
const fullUser = ref(null);
const currentLessonIndex = ref(parseInt(route.query.lesson) || 0)
const comments = ref([]);
const newComment = ref('')

const currentLesson = computed(() => course.value?.lessons[currentLessonIndex.value])
const isLessonFinished = computed(() => {
    if (!course.value || !fullUser.value) {
        return false
    }
    const progressPercent = parseInt(fullUser.value.progress[course.value.id] || "0")
    const finishedCount = Math.round((progressPercent / 100) * course.value.lessons.length)
    return currentLessonIndex.value < finishedCount
})

const finishedCount = computed(() => {
    if (!course.value || !fullUser.value) {
        return 0
    }
    const total = course.value.lessons.length
    const progressPercent = parseInt(fullUser.value.progress[course.value.id] || "0")
    return Math.round((progressPercent / 100) * total)
})

const checkAccess = (index) => {
    if (user.value.role === 'teacher') {
        return true
    }

    if (index > finishedCount.value) {
        alert("Этот урок пока недоступен. Пройдите предыдущие темы!");
        return false
    }
    return true
}

const changeLesson = (index) => {
    if (checkAccess(index)) {
        currentLessonIndex.value = index
        router.push({query: {lesson: index}})
    }
}

const loadPageData = async () => {
    const courseId = route.params.id

    try {
        const [cRes, uRes] = await Promise.all([
            coursesApi.getById(courseId),
            coursesApi.getUser(user.value.id)
        ])

        course.value = cRes.data
        fullUser.value = uRes.data

        const totalLessons = course.value.lessons.length
        const progressVal = parseInt(fullUser.value.progress[course.value.id] || "0")
        const finishedCountValue = Math.round((progressVal / 100) * totalLessons)

        if (route.query.lesson === undefined) {
            const nextLesson = finishedCountValue < totalLessons ? finishedCountValue : totalLessons - 1
            router.replace({query: {lesson: nextLesson}})
            currentLessonIndex.value = nextLesson
            return
        }

        const requestedLesson = parseInt(route.query.lesson)
        if (user.value.role !== 'teacher' && requestedLesson > finishedCountValue) {
            alert("Этот урок пока недоступен. Пройдите предыдущие темы!");
            changeLesson(finishedCountValue)
            return
        }

        await Promise.all([loadVideo(), loadComments()])
    } catch (e) {
        console.error("Ошибка загрузки данных курса:", e)
    }
}

const loadComments = async () => {
    const res = await coursesApi.getComments(course.value.id, currentLessonIndex.value)
    comments.value = res.data
}

const addComment = async () => {
    if (!newComment.value.trim()) return
    await coursesApi.addComment({
        courseId: course.value.id,
        lessonIndex: currentLessonIndex.value,
        userId: user.value.id,
        userName: user.value.name,
        text: newComment.value
    })
    newComment.value = '';
    await loadComments()
}

const finishLesson = async () => {
    const total = course.value.lessons.length
    const newPercent = Math.round(((currentLessonIndex.value + 1) / total) * 100)
    const oldPercent = parseInt(fullUser.value.progress[course.value.id] || "0")

    if (newPercent > oldPercent) {
        const updatedProgress = {...fullUser.value.progress, [course.value.id]: newPercent + "%"}
        await coursesApi.updateUser(user.value.id, {progress: updatedProgress})
        fullUser.value.progress = updatedProgress
        alert("Урок пройден!")
    } else {
        alert("Урок завершен!")
    }

    if (currentLessonIndex.value + 1 < total) {
        changeLesson(currentLessonIndex.value + 1)
    } else {
        alert("Поздравляем! Вы завершили весь курс!");
        router.push('/profile')
    }
}

watch(() => route.query.lesson, (newVal) => {
    currentLessonIndex.value = parseInt(newVal) || 0
    loadComments()
})

onMounted(loadPageData)
</script>

<template>
    <MainLayout>
        <main class="container py-4" v-if="course && fullUser">
            <nav class="mb-4" aria-label="Хлебные крошки">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <router-link to="/" class="text-dark fw-bold">Каталог</router-link>
                    </li>
                    <li class="breadcrumb-item active text-dark" id="courseName" aria-current="page">
                        {{ course.title }}
                    </li>
                </ol>
            </nav>

            <div class="row">
                <div class="col-lg-8">
                    <h1 class="visually-hidden">Курс: {{ course.title }}. Урок: {{
                            currentLesson.title
                        }}</h1>
                    <LessonVideo :lessonTitle="currentLesson.title" :courseTitle="course.title"/>
                    <LessonDetails :lesson="currentLesson"/>

                    <section class="card border-0 p-4 mb-4" aria-labelledby="comments-title">
                        <h2 class="fw-bold mb-4 h5">Обсуждение</h2>

                        <div role="log" aria-live="polite" aria-relevant="additions">
                            <CommentItem v-for="comment in comments" :key="comment.id"
                                         :comment="comment"/>
                        </div>

                        <div class="mt-4">
                            <label for="comment-input" class="form-label small fw-bold">Ваш вопрос или
                                комментарий</label>
                            <div class="input-group">
                                <input
                                    id="comment-input"
                                    v-model="newComment"
                                    type="text"
                                    class="form-control"
                                    placeholder="Напишите ваш вопрос..."
                                    @keyup.enter="addComment"
                                >
                                <button class="btn btn-primary" @click="addComment">Отправить</button>
                            </div>
                        </div>
                    </section>
                </div>

                <div class="col-lg-4">
                    <aside class="card border-0" aria-labelledby="program-title">
                        <div class="card-header bg-white fw-bold py-3" id="program-title">Программа
                            курса
                        </div>
                        <div class="list-group list-group-flush" role="list"
                             aria-label="Список уроков курса">
                            <LessonProgramItem
                                v-for="(lesson, index) in course.lessons"
                                :key="index"
                                :title="lesson.title"
                                :is-active="currentLessonIndex === index"
                                @click="changeLesson(index)"
                                role="listitem"
                                :aria-current="currentLessonIndex === index ? 'true' : 'false'"
                            />
                        </div>
                        <div class="card-footer bg-white p-3" v-if="user.role !== 'teacher'">
                            <button
                                :class="['btn w-100 fw-bold', isLessonFinished ? 'btn-finished' : 'btn-success']"
                                :disabled="isLessonFinished"
                                @click="finishLesson"
                                :aria-label="isLessonFinished ? 'Урок уже пройден' : 'Отметить урок как пройденный и перейти дальше'"
                            >
                                {{ isLessonFinished ? 'Урок уже пройден' : 'Завершить урок' }}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    </MainLayout>
</template>
