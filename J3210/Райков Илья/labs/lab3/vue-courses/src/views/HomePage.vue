<template>
    <MainLayout>
        <div class="container my-5">
            <h1 class="fw-bold mb-4">Найди свой идеальный курс</h1>
      
            <div class="row">
                <!-- Сайдбар -->
                <aside class="col-lg-3 mb-4">
                    <div class="card shadow-sm filter-sidebar">
                        <div class="card-body">
                            <h2 class="h5 card-title mb-4">Фильтры</h2>
                            <form @submit.prevent="applyFilters">
                
                                <div class="mb-4">
                                    <label class="form-label small fw-bold">ПОИСК</label>
                                    <input type="text" v-model="search" class="form-control" placeholder="Название...">
                                </div>

                                <div class="mb-4">
                                    <label class="form-label small fw-bold">КАТЕГОРИИ</label>
                                    <div class="form-check" v-for="cat in categoriesList" :key="cat.value">
                                        <input class="form-check-input" type="checkbox" :value="cat.value" v-model="categories">
                                        <label class="form-check-label">{{ cat.name }}</label>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label text-muted small fw-bold text-uppercase">Цена (₽)</label>
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>{{ minPrice }}</span>
                                        <span>{{ maxPrice }}</span>
                                    </div>
                                    <div class="range-slider">
                                        <div class="slider-track" :style="{ left: (minPrice/50000)*100 + '%', right: 100 - (maxPrice/50000)*100 + '%' }"></div>
                                        <input type="range" v-model.number="minPrice" min="0" max="50000" step="500" @input="updateSlider('min')">
                                        <input type="range" v-model.number="maxPrice" min="0" max="50000" step="500" @input="updateSlider('max')">
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label text-muted small fw-bold text-uppercase">Уровень</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="beginner" v-model="levels">
                                        <label class="form-check-label">Для новичков</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="advanced" v-model="levels">
                                        <label class="form-check-label">Продвинутый</label>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-primary w-100" :disabled="loading">Применить</button>
                                <button type="button" class="btn btn-link w-100 btn-sm text-decoration-none mt-2" @click="resetFilters">Сбросить</button>
                            </form>
                        </div>
                    </div>
                </aside>

                <!-- Каталог -->
                <main class="col-lg-9" aria-label="Каталог">
                    <div v-if="loading" class="text-center py-5">
                        <div class="spinner-border text-primary"></div>
                    </div>
                    <div v-else-if="filteredCourses.length === 0" class="text-center py-5">
                        <h4>Ничего не найдено</h4>
                    </div>
                    <div v-else class="row g-4">
                        <div class="col-md-6 col-xl-4" v-for="course in filteredCourses" :key="course.id">
                            <!-- Карточка курса. Ловим событие buy -->
                            <CourseCard :course="course" @buy="openModal" />
                        </div>
                    </div>
                </main>
            </div>
        </div>

        <!-- Модальное окно -->
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title">Оформление заказа</h5>
                        <button type="button" class="btn-close btn-close-white" @click="showModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <p>Курс: <strong class="text-primary">{{ selectedCourse?.title }}</strong></p>
                        <p class="fs-5">К оплате: <strong>{{ selectedCourse?.price.toLocaleString() }}</strong> ₽</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showModal = false">Отмена</button>
                        <button type="button" class="btn btn-warning" @click="buyCourse" :disabled="buying">
                            <span v-if="buying" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Оплатить</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import CourseCard from '@/components/CourseCard.vue';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const allCourses = ref([]);
const filteredCourses = ref([]);
const loading = ref(true);

const search = ref('');
const categories = ref([]);
const categoriesList = [
    { value: 'it', name: 'Программирование' },
    { value: 'design', name: 'Дизайн' },
    { value: 'marketing', name: 'Маркетинг' }
];

const showModal = ref(false);
const selectedCourse = ref(null);
const buying = ref(false);

const minPrice = ref(0);
const maxPrice = ref(50000);
const levels = ref([]);

const fetchCourses = async () => {
    try {
        loading.value = true;
        const res = await api.get('/courses');
        allCourses.value = res.data;
        filteredCourses.value = res.data;
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const updateSlider = (type) => {
    const minGap = 2000;
    if (maxPrice.value - minPrice.value < minGap) {
        if (type === 'min') minPrice.value = maxPrice.value - minGap;
        else maxPrice.value = minPrice.value + minGap;
    }
};

const applyFilters = () => {
    filteredCourses.value = allCourses.value.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(search.value.toLowerCase());
        const matchCat = categories.value.length === 0 || categories.value.includes(c.category);
        const matchLevel = levels.value.length === 0 || levels.value.includes(c.level);
        const matchPrice = c.price >= minPrice.value && c.price <= maxPrice.value;
        return matchSearch && matchCat && matchLevel && matchPrice;
    });
};

const resetFilters = () => {
    search.value = '';
    categories.value = [];
    levels.value = [];
    minPrice.value = 0;
    maxPrice.value = 50000;
    filteredCourses.value = [...allCourses.value];
};

const openModal = (course) => {
    selectedCourse.value = course;
    showModal.value = true;
};

const buyCourse = async () => {
    if (!authStore.isLoggedIn) {
        alert("Войдите в систему для покупки.");
        router.push('/login');
        return;
    }

    buying.value = true;
    try {
        const userRes = await api.get(`/users/${authStore.user.id}`);
        const userData = userRes.data;

        if (userData.courses.some(c => c.title === selectedCourse.value.title)) {
            alert("Уже куплено!");
            showModal.value = false;
            return;
        }

        userData.courses.push(selectedCourse.value);
        const updateRes = await api.patch(`/users/${userData.id}`, { courses: userData.courses });
    
        authStore.user = updateRes.data;
        alert("Успешно куплено!");
        showModal.value = false;
        router.push('/dashboard');
    } catch (err) {
        alert("Ошибка сервера");
    } finally {
        buying.value = false;
    }
};

onMounted(fetchCourses);
</script>