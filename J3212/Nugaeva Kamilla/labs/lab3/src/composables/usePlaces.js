import { computed, onMounted, reactive, ref } from 'vue'
import { placesApi } from '../api/index.js'

const correctHeroImages = {
  amsterdam: 'assets/img/amsterdam.jpg',
  alps: 'assets/img/alps.jpg',
  karelia: 'assets/img/karelia.jpg',
  barcelona: 'assets/img/barcelona-hero.jpg',
  prague: 'assets/img/prague-hero.jpg',
}

const demoPlaces = [
  {
    key: 'amsterdam',
    title: 'Амстердам',
    type: 'city',
    typeLabel: 'Город',
    budget: 700,
    days: 5,
    badge: 'Город каналов',
    image: '',
    hero: '',
    gallery: [],
    description: 'Амстердам — уютный город с каналами, музеями, велосипедами и спокойной атмосферой для прогулок.',
    placesList: [
      'Музей Ван Гога',
      'Рейксмюсеум',
      'Каналы Амстердама',
      'Парк Вондела',
    ],
    tipsList: [
      'Лучше заранее купить билеты в музеи',
      'По центру удобно передвигаться пешком или на велосипеде',
      'Жильё рядом с транспортом поможет сэкономить время',
    ],
    includedList: [
      'Маршрут на 5 дней',
      'Подборка достопримечательностей',
      'Советы по бюджету',
      'Карта района',
    ],
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=4.84%2C52.34%2C4.94%2C52.39&layer=mapnik',
  },
  {
    key: 'alps',
    title: 'Альпы',
    type: 'nature',
    typeLabel: 'Природа',
    budget: 1200,
    days: 7,
    badge: 'Горы и виды',
    image: '',
    hero: '',
    gallery: [],
    description: 'Альпы подойдут для активного отдыха, прогулок по горам, панорамных маршрутов и красивых природных видов.',
    placesList: [
      'Горные тропы',
      'Смотровые площадки',
      'Озёра',
      'Канатные дороги',
    ],
    tipsList: [
      'Нужно заранее проверить погоду',
      'Удобная обувь обязательна',
      'Лучше закладывать запас времени на маршруты',
    ],
    includedList: [
      'Маршрут на 7 дней',
      'Идеи для прогулок',
      'Советы по подготовке',
      'Карта района',
    ],
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=7.8%2C45.7%2C8.1%2C46.0&layer=mapnik',
  },
  {
    key: 'barcelona',
    title: 'Барселона',
    type: 'city',
    typeLabel: 'Город',
    budget: 900,
    days: 6,
    badge: 'Море и архитектура',
    image: '',
    hero: '',
    gallery: [],
    description: 'Барселона — направление для тех, кто хочет совместить городские прогулки, море, архитектуру и атмосферу южной Европы.',
    placesList: [
      'Саграда Фамилия',
      'Парк Гуэль',
      'Готический квартал',
      'Набережная Барселонета',
    ],
    tipsList: [
      'Билеты в популярные места лучше покупать заранее',
      'Для прогулок удобно выбирать жильё рядом с метро',
      'Летом активные прогулки лучше планировать утром или вечером',
    ],
    includedList: [
      'Маршрут на 6 дней',
      'Подборка достопримечательностей',
      'Советы по бюджету',
      'Карта района',
    ],
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=2.13%2C41.36%2C2.22%2C41.42&layer=mapnik',
  },
  {
    key: 'karelia',
    title: 'Карелия',
    type: 'nature',
    typeLabel: 'Природа',
    budget: 300,
    days: 3,
    badge: 'Леса и озёра',
    image: '',
    hero: '',
    gallery: [],
    description: 'Карелия — вариант для спокойной поездки на природу, прогулок у воды, лесов и короткой перезагрузки.',
    placesList: [
      'Ладожские шхеры',
      'Рускеала',
      'Озёра',
      'Лесные маршруты',
    ],
    tipsList: [
      'Лучше заранее продумать транспорт',
      'Стоит взять удобную одежду для природы',
      'Погода может быстро меняться',
    ],
    includedList: [
      'Маршрут на 3 дня',
      'Идеи для прогулок',
      'Советы по бюджету',
      'Карта района',
    ],
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=30.4%2C61.7%2C31.1%2C62.1&layer=mapnik',
  },
  {
    key: 'prague',
    title: 'Прага',
    type: 'city',
    typeLabel: 'Город',
    budget: 500,
    days: 4,
    badge: 'Уютный город',
    image: '',
    hero: '',
    gallery: [],
    description: 'Прага — спокойное городское направление с красивой архитектурой, старинными улицами и удобным маршрутом на несколько дней.',
    placesList: [
      'Карлов мост',
      'Староместская площадь',
      'Пражский град',
      'Вацлавская площадь',
    ],
    tipsList: [
      'Центр удобно изучать пешком',
      'Лучше заранее выбрать районы для прогулок',
      'Для экономии можно брать жильё не в самом центре, но рядом с транспортом',
    ],
    includedList: [
      'Маршрут на 4 дня',
      'Подборка достопримечательностей',
      'Советы по бюджету',
      'Карта района',
    ],
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=14.37%2C50.06%2C14.47%2C50.11&layer=mapnik',
  },
]

export function usePlaces(autoLoad = true) {
  const places = ref([])
  const place = ref(null)

  const loading = ref(false)
  const isLoading = loading
  const error = ref('')

  const filters = reactive({
    type: 'all',
    budget: '',
    days: 'all',
  })

  async function loadPlaces() {
    loading.value = true
    error.value = ''

    try {
      const response = await placesApi.getAll()
      const apiPlaces = Array.isArray(response.data) ? response.data : []

      if (apiPlaces.length > 0) {
        places.value = apiPlaces.map(normalizePlace)
      } else {
        places.value = demoPlaces.map(normalizePlace)
      }
    } catch {
      places.value = demoPlaces.map(normalizePlace)
      error.value = 'JSON Server недоступен, поэтому используются демонстрационные данные.'
    } finally {
      loading.value = false
    }
  }

  async function loadPlaceByKey(placeKey) {
    const key = String(placeKey || '')

    loading.value = true
    error.value = ''
    place.value = null

    if (!key) {
      error.value = 'Направление не найдено.'
      loading.value = false
      return
    }

    try {
      let apiPlace = null

      if (typeof placesApi.getByKey === 'function') {
        const response = await placesApi.getByKey(key)
        apiPlace = findPlaceInData(response.data, key)
      }

      if (apiPlace) {
        place.value = normalizePlace(apiPlace)
        return
      }

      const demoPlace = demoPlaces.find((item) => item.key === key)

      if (demoPlace) {
        place.value = normalizePlace(demoPlace)
        return
      }

      error.value = 'Направление не найдено.'
    } catch {
      const demoPlace = demoPlaces.find((item) => item.key === key)

      if (demoPlace) {
        place.value = normalizePlace(demoPlace)
      } else {
        error.value = 'Направление не найдено.'
      }
    } finally {
      loading.value = false
    }
  }

  const filteredPlaces = computed(() => {
    return places.value.filter((item) => {
      const matchesType = filters.type === 'all' || item.type === filters.type

      const matchesBudget =
        !filters.budget || item.budget <= Number(filters.budget)

      const matchesDays = checkDays(item.days, filters.days)

      return matchesType && matchesBudget && matchesDays
    })
  })

  const popularPlaces = computed(() => {
    return places.value.slice(0, 3)
  })

  function findPlaceInData(data, key) {
    if (Array.isArray(data)) {
      return data.find((item) => {
        return item.key === key || String(item.id) === key
      })
    }

    if (data && (data.key === key || String(data.id) === key)) {
      return data
    }

    return null
  }

  function checkDays(days, value) {
    if (value === 'all') return true
    if (value === '1-3') return days >= 1 && days <= 3
    if (value === '4-7') return days >= 4 && days <= 7
    if (value === '8+') return days >= 8

    return true
  }

  function normalizePlace(item) {
    const fallback = demoPlaces.find((demoItem) => {
      return demoItem.key === item.key || demoItem.key === String(item.id)
    })

    const key = item.key || fallback?.key || String(item.id || '')

    const heroImages = {
      amsterdam: 'assets/img/amsterdam.jpg',
      alps: 'assets/img/alps.jpg',
      karelia: 'assets/img/karelia.jpg',
      barcelona: 'assets/img/barcelona-hero.jpg',
      prague: 'assets/img/prague-hero.jpg',
    }

    return {
      ...fallback,
      ...item,
      key,
      title: item.title || fallback?.title || 'Направление',
      type: item.type || fallback?.type || 'city',
      typeLabel: item.typeLabel || fallback?.typeLabel || getTypeLabel(item.type),
      budget: item.budget || fallback?.budget || 0,
      days: item.days || fallback?.days || 1,
      badge: item.badge || fallback?.badge || 'Популярно',
      image: item.image || fallback?.image || '',
      hero: heroImages[key] || item.hero || item.image || fallback?.hero || fallback?.image || '',
      gallery: Array.isArray(item.gallery) ? item.gallery : fallback?.gallery || [],
      description: item.description || fallback?.description || '',
      placesList: Array.isArray(item.placesList) ? item.placesList : fallback?.placesList || [],
      tipsList: Array.isArray(item.tipsList) ? item.tipsList : fallback?.tipsList || [],
      includedList: Array.isArray(item.includedList) ? item.includedList : fallback?.includedList || [],
      map:
        item.map ||
        fallback?.map ||
        'https://www.openstreetmap.org/export/embed.html?bbox=30.2%2C59.8%2C30.5%2C60.0&layer=mapnik',
    }
  }

  function getTypeLabel(type) {
    if (type === 'city') return 'Город'
    if (type === 'nature') return 'Природа'

    return 'Направление'
  }

  function resetFilters() {
    filters.type = 'all'
    filters.budget = ''
    filters.days = 'all'
  }

  if (autoLoad) {
    onMounted(loadPlaces)
  }

  return {
    places,
    place,
    filters,
    filteredPlaces,
    popularPlaces,
    loading,
    isLoading,
    error,
    loadPlaces,
    loadPlaceByKey,
    resetFilters,
  }
}