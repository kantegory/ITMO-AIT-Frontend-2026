<template>
  <div class="container mt-4">
    <h1 class="visually-hidden">Карта маршрутов</h1>
    <h2>Карта</h2>
    <p>Нажмите на маркер, чтобы увидеть информацию о месте</p>
    <div id="map" style="height: 500px; border-radius: 10px;"></div>
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  name: 'MapPage',
  setup() {
    onMounted(() => {
      // Проверяем, что карта ещё не создана
      if (!window.mapInitialized) {
        window.mapInitialized = true
        
        // Создаём карту
        const map = L.map('map').setView([55.751244, 37.618423], 5)
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map)
        
        // Маркеры с популярными местами
        const places = [
          { name: "Париж", coords: [48.8566, 2.3522], desc: "Эйфелева башня, Лувр" },
          { name: "Байкал", coords: [53.5587, 108.1650], desc: "Самое глубокое озеро" },
          { name: "Санкт-Петербург", coords: [59.9343, 30.3351], desc: "Эрмитаж, мосты" },
          { name: "Алтай", coords: [50.2468, 86.6620], desc: "Горы, реки" }
        ]
        
        // Добавляем маркеры на карту
        places.forEach(place => {
          L.marker(place.coords).addTo(map)
            .bindPopup(`<b>${place.name}</b><br>${place.desc}<br><a href="/search">Посмотреть маршруты</a>`)
        })
      }
    })
  }
}
</script>