<template>
  <div>
    <!-- Навбар поверх hero -->
    <nav class="navbar navbar-expand-lg navbar-dark" style="background:transparent;position:absolute;width:100%;z-index:10;">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/">EduPlatform</router-link>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#homeNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="homeNav">
          <ul class="navbar-nav mx-auto">
            <li v-if="isLoggedIn" class="nav-item">
              <router-link class="nav-link" to="/courses">Каталог курсов</router-link>
            </li>
          </ul>
          <div class="d-flex gap-2">
            <template v-if="isLoggedIn">
              <router-link :to="isTeacher ? '/teacher' : '/dashboard'" class="btn btn-outline-light btn-sm">
                {{ isTeacher ? 'Кабинет преподавателя' : 'Личный кабинет' }}
              </router-link>
              <button class="btn btn-outline-light btn-sm" @click="logout">Выйти</button>
            </template>
            <template v-else>
              <router-link to="/login"    class="btn btn-warning btn-sm fw-semibold">Войти</router-link>
              <router-link to="/register" class="btn btn-outline-light btn-sm">Регистрация</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero — стиль из index.html -->
    <main style="background:linear-gradient(#1c5aa6 0%,#3388d8 60%,#51affc 100%);min-height:80vh;display:flex;align-items:center;">
      <div class="container">
        <div class="col-12 col-lg-7">
          <p class="text-white-50 small fw-semibold">
            <i class="bi bi-lightning-charge-fill me-1 text-warning" aria-hidden="true"></i>
            Более 100 курсов онлайн
          </p>
          <h1 style="font-size:clamp(2rem,5vw,3.2rem);font-weight:800;color:#fff;line-height:1.15;" class="mb-3">
            Учитесь у лучших,<br>развивайтесь быстрее
          </h1>
          <p style="color:rgba(255,255,255,.8);font-size:1.05rem;" class="mb-4">
            Платформа для онлайн-обучения с практическими заданиями и сертификатами.
          </p>
          <div class="d-flex gap-3 flex-wrap">
            <template v-if="isLoggedIn">
              <router-link to="/courses" class="btn btn-warning btn-lg fw-bold px-4">Каталог курсов</router-link>
              <router-link :to="isTeacher ? '/teacher' : '/dashboard'" class="btn btn-outline-light btn-lg px-4">
                {{ isTeacher ? 'Кабинет преподавателя' : 'Личный кабинет' }}
              </router-link>
            </template>
            <template v-else>
              <router-link to="/login"    class="btn btn-warning btn-lg fw-bold px-4">Войти</router-link>
              <router-link to="/register" class="btn btn-outline-light btn-lg px-4">Регистрация</router-link>
            </template>
          </div>
          <div class="d-flex gap-4 mt-4">
            <div><div class="fw-bold text-white fs-5">10 000+</div><div class="text-white-50 small">студентов</div></div>
            <div><div class="fw-bold text-white fs-5">100+</div><div class="text-white-50 small">преподавателей</div></div>
            <div><div class="fw-bold text-white fs-5">4.8 ★</div><div class="text-white-50 small">средний рейтинг</div></div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-4" style="background:#0f172a;">
      <div class="container">
        <div class="row g-3 mb-3">
          <div class="col-12 col-md-4">
            <p class="text-white fw-bold mb-1">EduPlatform</p>
            <p class="text-secondary small mb-0">Платформа для онлайн-обучения.</p>
          </div>
          <div class="col-6 col-md-2">
            <p class="text-white small fw-semibold mb-2">Обучение</p>
            <router-link v-if="isLoggedIn" to="/courses" class="d-block" style="color:#94a3b8;text-decoration:none;font-size:.8rem;">Каталог курсов</router-link>
            <span v-else class="text-secondary small">Требуется вход</span>
          </div>
          <div class="col-6 col-md-2">
            <p class="text-white small fw-semibold mb-2">Аккаунт</p>
            <template v-if="isLoggedIn">
              <router-link :to="isTeacher ? '/teacher' : '/dashboard'"
                class="d-block" style="color:#94a3b8;text-decoration:none;font-size:.8rem;">
                {{ isTeacher ? 'Кабинет преподавателя' : 'Личный кабинет' }}
              </router-link>
            </template>
            <template v-else>
              <router-link to="/login"    class="d-block" style="color:#94a3b8;text-decoration:none;font-size:.8rem;">Войти</router-link>
              <router-link to="/register" class="d-block" style="color:#94a3b8;text-decoration:none;font-size:.8rem;">Регистрация</router-link>
            </template>
          </div>
        </div>
        <hr style="border-color:#334155;" class="mb-2" />
        <p class="text-secondary small text-center mb-0">© 2026 EduPlatform</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
const { isLoggedIn, isTeacher, logout } = useAuth()
</script>
