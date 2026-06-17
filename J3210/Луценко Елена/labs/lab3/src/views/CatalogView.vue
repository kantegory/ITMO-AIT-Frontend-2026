<script setup>
import {ref, onMounted, computed} from 'vue'
import {Modal} from 'bootstrap'
import {coursesApi} from '@/api'
import {useAuth} from '@/composables/useAuth'

import MainLayout from '@/layouts/MainLayout.vue'
import CourseCard from '@/components/catalog/CourseCard.vue'
import CourseInfoModal from '@/components/modals/CourseInfoModal.vue'
import CourseFilters from '@/components/catalog/CourseFilters.vue'

const {user} = useAuth()
const courses = ref([])
const fullUser = ref(null)
const selectedCourse = ref(null)

const filters = ref({
    search: '',
    category: 'all',
    level: 'all',
    maxPrice: 20000
})

const loadUserData = async () => {
    if (user.value) {
        const res = await coursesApi.getUser(user.value.id)
        fullUser.value = res.data
    }
}

onMounted(async () => {
    const res = await coursesApi.getAll()
    courses.value = res.data
    await loadUserData()
})

const openModal = (id) => {
    selectedCourse.value = courses.value.find(course => course.id === id)
    const modalEl = document.getElementById('courseInfoModal')
    const modal = new Modal(modalEl)
    modal.show()
}

const filteredCourses = computed(() => {
    return courses.value.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(filters.value.search.toLowerCase())
        const matchesCategory = filters.value.category === 'all' || course.category === filters.value.category
        const matchesLevel = filters.value.level === 'all' || course.level === filters.value.level
        const matchesPrice = course.price <= filters.value.maxPrice

        return matchesSearch && matchesCategory && matchesLevel && matchesPrice
    })
})

const resetFilters = () => {
    filters.value = {
        search: '',
        category: 'all',
        level: 'all',
        maxPrice: 20000
    }
}
</script>


<template>
    <MainLayout>
        <main class="container-fluid py-4">
            <div class="row">
                <CourseFilters
                    v-model="filters"
                    @reset="resetFilters"
                    aria-label="Фильтры курсов"
                />

                <section class="col-lg-9">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h1 class="fw-bold m-0 h2">Каталог курсов</h1>
                        <span class="badge bg-secondary" aria-live="polite" aria-atomic="true">Найдено: {{
                                filteredCourses.length
                            }}</span>
                    </div>

                    <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4" role="list"
                         aria-label="Список доступных курсов">
                        <CourseCard
                            v-for="course in filteredCourses"
                            :key="course.id"
                            :course="course"
                            @show-info="openModal"
                            role="listitem"
                        />
                    </div>

                    <div v-if="filteredCourses.length === 0" class="col-12 text-muted mt-4"
                         role="alert">
                        Курсы не найдены :(
                    </div>
                </section>
            </div>

            <CourseInfoModal
                :course="selectedCourse"
                :fullUser="fullUser"
                @enrolled="loadUserData"
            />
        </main>
    </MainLayout>
</template>
