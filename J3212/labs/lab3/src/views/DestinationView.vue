<template>
  <div v-if="dest">
    <!-- Hero -->
    <div class="dest-hero" style="position:relative;height:340px;overflow:hidden;">
      <img :src="dest.photo.replace('w=600&h=400','w=1200&h=500')" :alt="dest.name"
        style="width:100%;height:100%;object-fit:cover;" @error="e => e.target.style.display='none'" />
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.15),rgba(0,0,0,.55));"></div>
      <div style="position:absolute;bottom:2rem;left:2rem;right:2rem;color:#fff;">
        <div style="font-size:.8rem;opacity:.8;margin-bottom:.5rem;">
          <RouterLink to="/search" style="color:rgba(255,255,255,.75);">← Поиск</RouterLink>
          / {{ dest.continent }} / {{ dest.country }}
        </div>
        <h1 class="serif" style="font-size:2rem;margin:0;">{{ dest.name }}</h1>
        <div class="d-flex gap-2 flex-wrap mt-2">
          <span class="tag tag-dark" style="font-size:.78rem;">★ {{ dest.rating }} · {{ dest.reviews.toLocaleString('ru') }} отзывов</span>
          <span class="tag tag-dark" style="font-size:.78rem;">{{ typeIcons[dest.type] }} {{ dest.typeLabel }}</span>
          <span v-if="extra?.flight" class="tag tag-dark" style="font-size:.78rem;">✈ {{ extra.flight }}</span>
        </div>
      </div>
    </div>

    <main class="container-fluid py-4 px-3 px-md-4" style="max-width:1200px;position:relative;z-index:1;">
      <div class="row g-4">

        <!-- Основной контент -->
        <div class="col-lg-8">
          <!-- Инфо-строка -->
          <div class="d-flex gap-3 flex-wrap mb-4 p-3 card">
            <div v-if="extra?.season" class="d-flex flex-column">
              <span style="font-size:.72rem;color:var(--text-light);">Лучший сезон</span>
              <strong style="font-size:.88rem;">{{ extra.season }}</strong>
            </div>
            <div v-if="extra?.visa" class="d-flex flex-column">
              <span style="font-size:.72rem;color:var(--text-light);">Виза</span>
              <strong style="font-size:.88rem;" :style="extra.visa.includes('✓') ? 'color:var(--accent)' : ''">{{ extra.visa }}</strong>
            </div>
            <div v-if="extra?.budget" class="d-flex flex-column">
              <span style="font-size:.72rem;color:var(--text-light);">Бюджет/день</span>
              <strong style="font-size:.88rem;">{{ extra.budget }}</strong>
            </div>
          </div>

          <!-- Вкладки -->
          <div class="tabs-wrap mb-3" role="tablist">
            <button
              v-for="tab in tabs" :key="tab.id"
              class="tab-btn"
              :class="{ active: activeTab === tab.id }"
              :aria-selected="activeTab === tab.id"
              role="tab"
              @click="activeTab = tab.id">
              {{ tab.label }}
            </button>
          </div>

          <div class="tab-content-wrap">
            <!-- Достопримечательности -->
            <div v-show="activeTab === 'attractions'">
              <AttractionsList :attractions="attractions" />
            </div>

            <!-- Карта -->
            <div v-show="activeTab === 'map'">
              <MapTab :map-data="mapData" />
            </div>

            <!-- Советы -->
            <div v-show="activeTab === 'tips'">
              <TipsTab :tips="tips" />
            </div>

            <!-- Отзывы -->
            <div v-show="activeTab === 'reviews'">
              <ReviewsTab :reviews="reviews" />
            </div>
          </div>
        </div>

        <!-- Боковая панель -->
        <div class="col-lg-4">
          <!-- Действия -->
          <div class="card p-4 mb-4">
            <div class="d-flex flex-column gap-2">
              <button class="btn-primary-custom" style="justify-content:center;" @click="toggleSave">
                <i :class="`bi bi-bookmark${isSaved ? '-fill' : ''} me-2`"></i>
                {{ isSaved ? 'В сохранённых' : 'Сохранить маршрут' }}
              </button>
              <RouterLink to="/collab" class="btn-outline-custom" style="justify-content:center;">
                <i class="bi bi-people me-2"></i>Запланировать совместно
              </RouterLink>
            </div>
          </div>

          <!-- Погода -->
          <div class="card p-4 mb-4">
            <h3 class="serif mb-3" style="font-size:.95rem;">🌤 Погода сейчас</h3>
            <div v-if="weatherLoading" style="color:var(--text-muted);font-size:.85rem;">
              <span class="spinner-border spinner-border-sm me-1"></span> Загрузка...
            </div>
            <div v-else-if="weather">
              <div class="d-flex align-items-center gap-3">
                <img :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
                  width="56" height="56" :alt="weather.weather[0].description" style="flex-shrink:0;" />
                <div>
                  <div class="serif" style="font-size:1.6rem;color:var(--accent);line-height:1;">
                    {{ weather.main.temp > 0 ? '+' : '' }}{{ Math.round(weather.main.temp) }}°C
                  </div>
                  <div style="font-size:.82rem;color:var(--text-muted);text-transform:capitalize;">
                    {{ weather.weather[0].description }}
                  </div>
                  <div style="font-size:.75rem;color:var(--text-light);margin-top:.2rem;">
                    Влажность {{ weather.main.humidity }}% · Ветер {{ weather.wind.speed }} м/с
                  </div>
                </div>
              </div>
            </div>
            <div v-else style="color:var(--text-light);font-size:.82rem;">
              <i class="bi bi-cloud-slash me-1"></i>Погода временно недоступна
            </div>
          </div>

          <!-- Инфо о стране -->
          <div class="card p-4">
            <h3 class="serif mb-3" style="font-size:.95rem;">🌍 Страна</h3>
            <div v-if="countryInfo" style="font-size:.82rem;display:flex;flex-direction:column;gap:.5rem;">
              <div class="d-flex justify-content-between">
                <span style="color:var(--text-muted);">Столица</span>
                <strong>{{ countryInfo.capital?.[0] || '—' }}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span style="color:var(--text-muted);">Регион</span>
                <strong>{{ countryInfo.region || '—' }}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span style="color:var(--text-muted);">Население</span>
                <strong>{{ ((countryInfo.population || 0) / 1_000_000).toFixed(1) }} млн</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span style="color:var(--text-muted);">Валюта</span>
                <strong>{{ currencyStr }}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span style="color:var(--text-muted);">Язык</span>
                <strong>{{ languageStr }}</strong>
              </div>
            </div>
            <div v-else style="color:var(--text-light);font-size:.82rem;">Загрузка...</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDestinations } from '@/composables/useDestinations'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'
import AttractionsList from '@/components/destination/AttractionsList.vue'
import MapTab          from '@/components/destination/MapTab.vue'
import TipsTab         from '@/components/destination/TipsTab.vue'
import ReviewsTab      from '@/components/destination/ReviewsTab.vue'

const route = useRoute()
const { getDestination, DEST_EXTRA, DEST_MAP, DEST_TIPS, DEST_REVIEWS, DEST_ATTRACTIONS } = useDestinations()
const { getWeather, getCountryInfo, getSavedRoutes, saveRoute, unsaveRoute } = useApi()
const { showToast } = useToast()
const destId = computed(() => route.params.id)
const dest   = computed(() => getDestination(destId.value))
const extra  = computed(() => DEST_EXTRA[destId.value])
const mapData = computed(() => DEST_MAP[destId.value])
const tips    = computed(() => DEST_TIPS[destId.value])
const reviews = computed(() => DEST_REVIEWS[destId.value])
const attractions = computed(() => DEST_ATTRACTIONS[destId.value] || [])

const typeIcons = { city:'🌍', nature:'🌿', beach:'🏖' }
const activeTab = ref('attractions')
const tabs = [
  { id: 'attractions', label: '🗺 Достопримечательности' },
  { id: 'map',         label: '📍 Карта'                 },
  { id: 'tips',        label: '💡 Советы'                },
  { id: 'reviews',     label: '⭐ Отзывы'               },
]
const weather        = ref(null)
const weatherLoading = ref(true)

async function loadWeather() {
  if (!dest.value?.weatherCity) return
  weatherLoading.value = true
  try { weather.value = await getWeather(dest.value.weatherCity) }
  catch { weather.value = null }
  finally { weatherLoading.value = false }
}
const countryInfo = ref(null)
const currencyStr = computed(() =>
  Object.values(countryInfo.value?.currencies || {}).map(c => `${c.name} (${c.symbol || '?'})`).join(', ') || '—'
)
const languageStr = computed(() =>
  Object.values(countryInfo.value?.languages || {}).slice(0, 2).join(', ') || '—'
)

async function loadCountry() {
  if (!dest.value?.countryEn) return
  try { countryInfo.value = await getCountryInfo(dest.value.countryEn) }
  catch { countryInfo.value = null }
}
const isSaved = ref(false)

async function loadSavedState() {
  try {
    const list = await getSavedRoutes()
    isSaved.value = list.some(r => r.destinationId === destId.value)
  } catch {  }
}

async function toggleSave() {
  if (isSaved.value) {
    await unsaveRoute(destId.value).catch(() => {})
    isSaved.value = false
    showToast(`${dest.value.name} убран`, 'info')
  } else {
    await saveRoute(destId.value).catch(() => {})
    isSaved.value = true
    showToast(`${dest.value.name} сохранён!`)
  }
}
watch(destId, () => {
  activeTab.value = 'attractions'
  weather.value   = null
  weatherLoading.value = true
  countryInfo.value = null
  loadWeather()
  loadCountry()
  loadSavedState()
})

onMounted(() => {
  loadWeather()
  loadCountry()
  loadSavedState()
})
</script>
