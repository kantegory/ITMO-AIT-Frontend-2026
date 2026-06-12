<template>
    <div class="container py-5">
        <div class="row">
            
            <div class="col-lg-3 mb-4">
                <div class="card text-center mb-3">
                    <div class="card-body">
                        <img :src="`https://ui-avatars.com/api/?name=${user?.name || 'Пользователь'}&background=dc2626&color=fff&size=100&format=png`" 
     class="rounded-circle mb-3" alt="Profile" id="userAvatar">
                        <h5 id="sidebarUserName">{{ user?.name || 'Загрузка...' }}</h5>
                        <p class="text-muted small" id="sidebarUserEmail">{{ user?.email || '...' }}</p>
                        <span class="badge bg-danger">Студент</span>
                    </div>
                </div>
                
                <div class="list-group">
                    <a href="#" 
                       class="list-group-item list-group-item-action" 
                       :class="{ active: activeSection === 'courses' }"
                       @click.prevent="activeSection = 'courses'">
                        <i class="bi bi-book me-2"></i> Мои курсы
                    </a>
                    <a href="#" 
                       class="list-group-item list-group-item-action" 
                       :class="{ active: activeSection === 'certificates' }"
                       @click.prevent="activeSection = 'certificates'">
                        <i class="bi bi-trophy me-2"></i> Сертификаты
                        <span class="badge bg-danger float-end">3</span>
                    </a>
                    <a href="#" 
                       class="list-group-item list-group-item-action" 
                       :class="{ active: activeSection === 'history' }"
                       @click.prevent="activeSection = 'history'">
                        <i class="bi bi-clock me-2"></i> История
                    </a>
                    <a href="#" 
                       class="list-group-item list-group-item-action" 
                       :class="{ active: activeSection === 'favorites' }"
                       @click.prevent="activeSection = 'favorites'">
                        <i class="bi bi-heart me-2"></i> Избранное
                    </a>
                    <a href="#" 
                       class="list-group-item list-group-item-action" 
                       :class="{ active: activeSection === 'settings' }"
                       @click.prevent="activeSection = 'settings'">
                        <i class="bi bi-gear me-2"></i> Настройки
                    </a>
                </div>
            </div>

            <div class="col-lg-9">
                
                <div v-if="activeSection === 'courses'" class="content-section" id="section-courses">
                    <h2 class="mb-4">Мои курсы</h2>
                    
                    <div class="row mb-4">
                        <div class="col-md-4 mb-3">
                            <div class="card bg-danger text-white">
                                <div class="card-body text-center">
                                    <h3>5</h3>
                                    <p class="mb-0">Активных курсов</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="card bg-success text-white">
                                <div class="card-body text-center">
                                    <h3>12</h3>
                                    <p class="mb-0">Завершено</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="card bg-warning text-white">
                                <div class="card-body text-center">
                                    <h3>3</h3>
                                    <p class="mb-0">Сертификата</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-3 shadow-sm border-0">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-2 mb-3 mb-md-0">
                                    <img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=150" 
                                         class="img-fluid rounded" alt="Классическая механика">
                                </div>
                                <div class="col-md-6">
                                    <h5 class="mb-1 fw-bold">Классическая механика</h5>
                                    <p class="text-muted small mb-2">Проф. Александр Петров</p>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="small text-muted">Прогресс: 60%</span>
                                        <span class="badge bg-danger">В процессе</span>
                                    </div>
                                    <div class="progress mb-1" style="height: 8px;">
                                        <div class="progress-bar bg-danger" style="width: 60%"></div>
                                    </div>
                                    <small class="text-muted">12 из 48 уроков пройдено</small>
                                </div>
                                <div class="col-md-4 text-md-end mt-3 mt-md-0">
                                    <router-link to="/course/1" class="btn btn-danger btn-sm mb-2">
                                        <i class="bi bi-play-fill me-1"></i> Продолжить
                                    </router-link>
                                    <div class="mt-2">
                                        <small class="text-muted d-block">Последний урок:</small>
                                        <small class="fw-semibold text-dark">Законы Ньютона</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-3 shadow-sm border-0">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-2 mb-3 mb-md-0">
                                    <img src="https://images.unsplash.com/photo-1555255707-c07966088b7b?w=150" 
                                         class="img-fluid rounded" alt="Машинное обучение">
                                </div>
                                <div class="col-md-6">
                                    <h5 class="mb-1 fw-bold">Введение в машинное обучение</h5>
                                    <p class="text-muted small mb-2">Д-р Елена Сидорова</p>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="small text-muted">Прогресс: 35%</span>
                                        <span class="badge bg-warning text-dark">В процессе</span>
                                    </div>
                                    <div class="progress mb-1" style="height: 8px;">
                                        <div class="progress-bar bg-warning" style="width: 35%"></div>
                                    </div>
                                    <small class="text-muted">22 из 62 уроков пройдено</small>
                                </div>
                                <div class="col-md-4 text-md-end mt-3 mt-md-0">
                                    <router-link to="/course/2" class="btn btn-danger btn-sm mb-2">
                                        <i class="bi bi-play-fill me-1"></i> Продолжить
                                    </router-link>
                                    <div class="mt-2">
                                        <small class="text-muted d-block">Последний урок:</small>
                                        <small class="fw-semibold text-dark">Линейная регрессия</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="activeSection === 'certificates'" class="content-section" id="section-certificates">
                    <h2 class="mb-4">Мои сертификаты</h2>
                    <div class="row">
                        <div class="col-md-6 mb-4">
                            <div class="card h-100 text-center p-4 shadow-sm border-0">
                                <div class="card-body">
                                    <i class="bi bi-trophy text-warning display-4 mb-3"></i>
                                    <h5 class="mt-2 fw-bold">Квантовая механика для начинающих</h5>
                                    <p class="text-muted mb-1">Проф. Михаил Козлов</p>
                                    <p class="small text-muted mb-3">Выдан: 10 января 2026</p>
                                    <button class="btn btn-outline-danger btn-sm">
                                        <i class="bi bi-download me-1"></i> Скачать PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-4">
                            <div class="card h-100 text-center p-4 shadow-sm border-0">
                                <div class="card-body">
                                    <i class="bi bi-trophy text-warning display-4 mb-3"></i>
                                    <h5 class="mt-2 fw-bold">Термодинамика и статфизика</h5>
                                    <p class="text-muted mb-1">Проф. Ольга Иванова</p>
                                    <p class="small text-muted mb-3">Выдан: 20 ноября 2025</p>
                                    <button class="btn btn-outline-danger btn-sm">
                                        <i class="bi bi-download me-1"></i> Скачать PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="activeSection === 'history'" class="content-section" id="section-history">
                    <h2 class="mb-4">История обучения</h2>
                    <div class="card shadow-sm border-0">
                        <div class="card-body p-0">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                                    <div>
                                        <strong class="text-dark">Классическая механика</strong>
                                        <div class="small text-muted mt-1">Последний урок: 15 марта 2026</div>
                                    </div>
                                    <span class="badge bg-danger px-3">В процессе</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                                    <div>
                                        <strong class="text-dark">Введение в машинное обучение</strong>
                                        <div class="small text-muted mt-1">Последний урок: 10 марта 2026</div>
                                    </div>
                                    <span class="badge bg-warning text-dark px-3">В процессе</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                                    <div>
                                        <strong class="text-dark">Квантовая механика</strong>
                                        <div class="small text-muted mt-1">Завершён: 10 января 2026</div>
                                    </div>
                                    <span class="badge bg-success px-3">Завершён</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div v-if="activeSection === 'favorites'" class="content-section" id="section-favorites">
                    <h2 class="mb-4">Избранные курсы</h2>
                    <div class="card shadow-sm border-0 p-5 text-center">
                        <div class="text-muted">Список избранного пуст или находится в разработке.</div>
                    </div>
                </div>

                <div v-if="activeSection === 'settings'" class="content-section" id="section-settings">
                    <h2 class="mb-4">Настройки профиля</h2>
                    <div class="card shadow-sm border-0">
                        <div class="card-body p-4">
                            <form @submit.prevent="handleSaveSettings">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Имя</label>
                                    <input type="text" class="form-control" v-model="form.name" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Email</label>
                                    <input type="email" class="form-control" v-model="form.email" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Текущий пароль</label>
                                    <input type="password" class="form-control" v-model="form.currentPassword" placeholder="Оставьте пустым, если не меняете">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Новый пароль</label>
                                    <input type="password" class="form-control" v-model="form.newPassword" placeholder="Минимум 6 символов">
                                </div>
                                <button type="submit" class="btn btn-danger px-4 mt-2">
                                    <i class="bi bi-check-circle me-1"></i> Сохранить изменения
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import useAuth from '../composables/useAuth';

const { user } = useAuth();

const activeSection = ref('courses');

const form = reactive({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
});

const syncFormData = () => {
    if (user.value) {
        form.name = user.value.name || '';
        form.email = user.value.email || '';
    }
};

watch(user, () => {
    syncFormData();
}, { immediate: true });

onMounted(() => {
    syncFormData();
});

async function handleSaveSettings() {
    if (!form.name || !form.email) {
        alert('Имя и email обязательны для заполнения');
        return;
    }
    
    try {
        if (user.value) {
            user.value.name = form.name;
            user.value.email = form.email;
            
            const savedData = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({
                ...savedData,
                name: form.name,
                email: form.email
            }));
        }

        alert('Настройки успешно обновлены!');
        form.currentPassword = '';
        form.newPassword = '';
    } catch (err) {
        alert('Ошибка при сохранении: ' + err.message);
    }
}
</script>

<style scoped>
.list-group-item {
    cursor: pointer;
    transition: all 0.2s ease;
}
.list-group-item.active {
    background-color: #dc2626 !important;
    border-color: #dc2626 !important;
}
.progress-bar {
    transition: width 0.6s ease;
}
.card {
    border-radius: 8px;
}
</style>