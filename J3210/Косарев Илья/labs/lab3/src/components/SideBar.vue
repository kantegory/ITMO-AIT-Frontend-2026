<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <aside class="col-md-3 col-lg-2 p-0 border-end" id="sidebarMenuWrapper">
    <div class="offcanvas-md offcanvas-start" id="sidebarMenu" tabindex="-1" aria-labelledby="sidebarMenuLabel">
      
      <div class="offcanvas-header">
        <h4 class="offcanvas-title" id="sidebarMenuLabel">
          <router-link class="navbar-brand" to="/">MLShare</router-link>
        </h4>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Закрыть боковое меню"></button>
      </div>

      <nav class="offcanvas-body p-0 sidebar-menu-scroll-area">
        <ul class="nav flex-column w-100 nav-pills">
          <li class="nav-item">
            <router-link exact-active-class="fw-bold text-bg-secondary" class="nav-link text-contrast" to="/">
              <svg class="svg-icon me-2" aria-hidden="true"><use href="/icons.svg#person-badge"></use></svg> Мой профиль
            </router-link>
          </li>
          <li class="nav-item">
            <router-link exact-active-class="fw-bold text-bg-secondary" class="nav-link text-contrast" to="/subscriptions">
              <svg class="svg-icon me-2" aria-hidden="true"><use href="/icons.svg#bell"></use></svg> Подписки
            </router-link>
          </li>
          <li class="nav-item">
            <router-link exact-active-class="fw-bold text-bg-secondary" class="nav-link text-contrast" to="/hub">
              <svg class="svg-icon me-2" aria-hidden="true"><use href="/icons.svg#search"></use></svg> Хаб
            </router-link>
          </li>
          <li class="nav-item">
            <button class="nav-link text-contrast w-100 text-start border-0 bg-transparent" type="button" aria-label="Загрузить">
              <svg class="svg-icon me-2" aria-hidden="true"><use href="/icons.svg#cloud-upload"></use></svg> Загрузить
            </button>
          </li>
        </ul>
      </nav>
      
    </div>
  </aside>
</template>