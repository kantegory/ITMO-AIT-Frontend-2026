<template>
  <div>
    <AppHeader :show-search="true" @search="onSearch"/>
    <router-view :search-query="headerSearch"/>
    <AppFooter/>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const headerSearch = ref('')

function onSearch(q) {
  headerSearch.value = q
}
</script>
