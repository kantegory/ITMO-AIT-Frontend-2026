<script setup>
import {ref, onMounted, watch} from 'vue'
import {coursesApi} from '@/api'
import {useAuth} from '@/composables/useAuth'

import MainLayout from '@/layouts/MainLayout.vue'
import ProfileCourseCard from '@/components/profile/ProfileCourseCard.vue'
import CertificateCard from '@/components/profile/CertificateCard.vue'

const {user} = useAuth()
const fullUser = ref(null)
const enrolledCourses = ref([])

const loadData = async () => {
    if (!user.value || !user.value.id) {
        return
    }

    const [uRes, cRes] = await Promise.all([
        coursesApi.getUser(user.value.id),
        coursesApi.getAll()
    ])

    fullUser.value = uRes.data
    enrolledCourses.value = cRes.data.filter(course => fullUser.value.courses.includes(course.id))
}

onMounted(loadData)

watch(() => user.value, (newUser) => {
    if (newUser && !fullUser.value) {
        loadData()
    }
}, { immediate: true })

const issueCertificate = async (title) => {
    const updated = [...fullUser.value.certificates, title]
    await coursesApi.updateUser(fullUser.value.id, {certificates: updated})
    await loadData()
}

const handleDownloadCert = (certName) => {
    alert("Файл 'сертификат_" + certName + ".pdf' успешно загружен");
}
</script>

<template>
    <MainLayout>
        <main class="container py-5" v-if="fullUser">
            <div class="row">
                <aside class="col-lg-4 mb-4">
                    <div class="card p-4 d-flex flex-column align-items-center text-center">
                        <div class="user-avatar mb-3">{{ fullUser.name[0] }}</div>
                        <h1 class="fw-bold mb-1 h4 w-100">{{ fullUser.name }}</h1>
                        <p class="text-muted small mb-0 w-100">{{ fullUser.email }}</p>
                    </div>
                </aside>

                <section class="col-lg-8">
                    <h2 class="fw-bold mb-4 h3">Моё обучение</h2>
                    <div class="row g-3">
                        <ProfileCourseCard
                            v-for="course in enrolledCourses"
                            :key="course.id"
                            :course="course"
                            :progress="fullUser.progress[course.id] || '0%'"
                            :has-certificate="fullUser.certificates.includes(course.title)"
                            @get-cert="issueCertificate"
                        />
                    </div>

                    <div v-if="fullUser.certificates.length" class="mt-5">
                        <h2 class="fw-bold mb-4 h3">Мои сертификаты</h2>
                        <div class="row g-3">
                            <CertificateCard
                                v-for="cert in fullUser.certificates"
                                :key="cert"
                                :title="cert"
                                @download="handleDownloadCert(cert)"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </MainLayout>
</template>
