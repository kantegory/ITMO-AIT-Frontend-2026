<template>
  <div class="container mt-4">
    <h2>Поиск направлений</h2>
    <div class="row">
      <!-- Фильтры -->
      <div class="col-md-3">
        <div class="card">
          <div class="card-header">Фильтры</div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Тип</label>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="filterCity" v-model="filters.city">
                <label class="form-check-label" for="filterCity">Город</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="filterNature" v-model="filters.nature">
                <label class="form-check-label" for="filterNature">Природа</label>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Бюджет</label>
              <select class="form-select" v-model="filters.budget">
                <option value="all">Все</option>
                <option value="low">Эконом (до 50 000 ₽)</option>
                <option value="medium">Стандарт (50 000 - 200 000 ₽)</option>
                <option value="high">Премиум (200 000+ ₽)</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Длительность</label>
              <select class="form-select" v-model="filters.duration">
                <option value="all">Все</option>
                <option value="short">1-7 дней</option>
                <option value="medium">7-14 дней</option>
                <option value="long">14+ дней</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Карточки -->
      <div class="col-md-9">
        <div class="d-flex flex-nowrap overflow-auto" style="gap: 20px; padding-bottom: 10px;">
          <div v-for="dest in filteredDestinations" :key="dest.name" class="destination-card">
            <div class="card h-100" style="width: 320px;">
              <img :src="dest.image" class="card-img-top" :alt="dest.name" style="height: 180px; object-fit: cover;">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ dest.name }}</h5>
                <p class="card-text">{{ dest.description }}</p>
                <p class="card-text">
                  <small class="text-muted">
                    {{ dest.price.toLocaleString() }} ₽ |
                    {{ dest.duration === 'short' ? '1-7 дней' : dest.duration === 'medium' ? '7-14 дней' : '14+ дней' }}
                  </small>
                </p>
                <a :href="dest.mapLink" target="_blank" class="btn btn-outline-primary btn-sm mt-auto">Посмотреть на карте</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'SearchPage',
  setup() {
    const destinations = [
  { name: "Рим", type: "city", budget: "high", duration: "medium", description: "Колизей, Ватикан, фонтан Треви", price: 280000, image: "/images/Rim.jpg", mapLink: "https://www.google.com/maps/place/Рим" },
  { name: "Париж", type: "city", budget: "high", duration: "medium", description: "Эйфелева башня, Лувр", price: 250000, image: "/images/Paris.jpg", mapLink: "https://www.google.com/maps/place/Париж" },
  { name: "Токио", type: "city", budget: "high", duration: "long", description: "Небоскребы, храмы, суши", price: 350000, image: "/images/Tokio.jpg", mapLink: "https://www.google.com/maps/place/Токио" },
  { name: "Барселона", type: "city", budget: "medium", duration: "short", description: "Саграда Фамилия, пляжи, Гауди", price: 160000, image: "/images/Barselona.jpg", mapLink: "https://www.google.com/maps/place/Барселона" },
  { name: "Алтай", type: "nature", budget: "medium", duration: "long", description: "Горы, реки, чистый воздух", price: 150000, image: "/images/Altay.jpeg", mapLink: "https://www.google.com/maps/place/Республика+Алтай" },
  { name: "Байкал", type: "nature", budget: "medium", duration: "medium", description: "Самое глубокое озеро", price: 120000, image: "/images/Baikal.webp", mapLink: "https://www.google.com/maps/place/Озеро+Байкал" },
  { name: "Карелия", type: "nature", budget: "low", duration: "medium", description: "Лесные озера, водопады, Кижи", price: 45000, image: "/images/Karelia.jpg", mapLink: "https://www.google.com/maps/place/Карелия" },  
  { name: "Санкт-Петербург", type: "city", budget: "medium", duration: "short", description: "Эрмитаж, разводные мосты", price: 80000, image: "/images/Spb.jpg", mapLink: "https://www.google.com/maps/place/Санкт-Петербург" }, 
  { name: "Камчатка", type: "nature", budget: "high", duration: "long", description: "Вулканы, гейзеры, медведи", price: 30000, image: "/images/Kamchatka.jpg", mapLink: "https://www.google.com/maps/place/Камчатка" },
  ]


    const filters = ref({
      city: false,
      nature: false,
      budget: 'all',
      duration: 'all'
    })

    const filteredDestinations = computed(() => {
      return destinations.filter(dest => {
        // Фильтр по типу
        let typeMatch = true
        if (filters.value.city && !filters.value.nature) {
          typeMatch = dest.type === 'city'
        } else if (!filters.value.city && filters.value.nature) {
          typeMatch = dest.type === 'nature'
        }

        // Фильтр по бюджету
        let budgetMatch = true
        if (filters.value.budget === 'low') {
          budgetMatch = dest.price <= 50000
        } else if (filters.value.budget === 'medium') {
          budgetMatch = dest.price > 50000 && dest.price <= 200000
        } else if (filters.value.budget === 'high') {
          budgetMatch = dest.price > 200000
        }

        // Фильтр по длительности
        let durationMatch = true
        if (filters.value.duration === 'short') {
          durationMatch = dest.duration === 'short'
        } else if (filters.value.duration === 'medium') {
          durationMatch = dest.duration === 'medium'
        } else if (filters.value.duration === 'long') {
          durationMatch = dest.duration === 'long'
        }

        return typeMatch && budgetMatch && durationMatch
      })
    })

    return { filters, filteredDestinations }
  }
}
</script>

<style scoped>
.d-flex {
  scrollbar-width: thin;
  scrollbar-color: var(--green, #3e6b1f) #e0e0e0;
}

.destination-card {
  flex-shrink: 0;
}
</style>