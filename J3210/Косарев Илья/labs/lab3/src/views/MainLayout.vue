<script setup>
import NavBar from '../components/NavBar.vue'
import SideBar from '../components/SideBar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <NavBar />
  <div class="container-fluid">
    <div class="row">
      <SideBar />
      <main class="col-md-9 col-lg-10" id="profileMain">
        <RouterView />
      </main>
    </div>
  </div>
</template>
