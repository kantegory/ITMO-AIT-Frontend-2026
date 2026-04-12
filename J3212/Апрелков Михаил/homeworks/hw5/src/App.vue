<script setup>
import Header from './components/Header.vue'
import DestinationList from './components/DestinationList.vue'
import Footer from './components/Footer.vue'

const destinations = [
  {
    id: 1,
    title: 'Прага',
    country: 'Чехия',
    description: 'Старый город, Карлов мост и уютные улочки - хороший вариант для первой поездки в Европу.',
  },
  {
    id: 2,
    title: 'Барселона',
    country: 'Испания',
    description: 'Море, архитектура Гауди и гастрономия: можно совместить экскурсии и отдых.',
  },
  {
    id: 3,
    title: 'Стамбул',
    country: 'Турция',
    description: 'Босфор, базары и исторические кварталы - яркий город на стыке культур.',
  },
  {
    id: 4,
    title: 'Лиссабон',
    country: 'Португалия',
    description: 'Трамваи, смотровые площадки и атмосфера побережья Атлантики.',
  },
]
</script>

<template>
  <div class="app">
    <Header
      title="Идеи для путешествий"
      subtitle="Список направлений"
    />
    <main class="app__main">
      <DestinationList :items="destinations" />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 960px;
  margin: 0 auto;
}

.app__main {
  flex: 1;
}
</style>
