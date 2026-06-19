import { computed, ref } from 'vue'
import { fetchKudaGoEvents, fetchKudaGoSearch } from '../api/events'
import { getOrganizerUsers } from '../api/users'

export const KUDAGO_LOCATION_LABELS = {
  msk: 'Москва',
  spb: 'Санкт-Петербург',
  nsk: 'Новосибирск',
  ekb: 'Екатеринбург',
  kzn: 'Казань',
  nnv: 'Нижний Новгород',
}

const KUDAGO_LOCATION_ALIASES = {
  москва: 'msk',
  мск: 'msk',
  moscow: 'msk',
  питер: 'spb',
  'санкт петербург': 'spb',
  'санкт-петербург': 'spb',
  spb: 'spb',
  piter: 'spb',
  новосибирск: 'nsk',
  nsk: 'nsk',
  екатеринбург: 'ekb',
  ekb: 'ekb',
  казань: 'kzn',
  kazan: 'kzn',
  kzn: 'kzn',
  'нижний новгород': 'nnv',
  nnv: 'nnv',
}

const FALLBACK_POSTER =
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80'
const ORGANIZER_POSTER =
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'

export const EVENT_CATALOG = {
  'symphonic-cinema-night': {
    id: 'symphonic-cinema-night',
    category: 'Концерт',
    name: 'Symphonic Cinema Night',
    date: '21 апреля 2026',
    dateIso: '2026-04-21',
    time: '19:00',
    city: 'Москва',
    venue: 'Vegas City Hall',
    venueAddress: 'Vegas City Hall, Москва, 66-й км МКАД, Крокус Сити',
    venueDetails: 'Рядом метро «Мякинино», удобный вход с набережной и подземная парковка.',
    age: '12+',
    price: 2500,
    description: 'Большой концерт-саундтрек: живой оркестр исполнит музыку из культовых фильмов на большом экране.',
    posterImage: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=1200&q=80',
    hallSchemeImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
    seatForPurchase: 'Сектор B, ряд 3, место 7',
    reviews: [
      { author: 'Анна П.', text: 'Оркестр и визуал на экране были на высоте, атмосфера потрясающая.' },
      { author: 'Максим Л.', text: 'Отличная организация и хороший звук, рекомендую брать места ближе к центру.' },
      { author: 'Екатерина С.', text: 'Очень понравился подбор треков из фильмов, вечер прошел идеально.' },
    ],
  },
  'neon-lights-live': {
    id: 'neon-lights-live',
    category: 'Концерт',
    name: 'Neon Lights Live',
    date: '14 мая 2026',
    dateIso: '2026-05-14',
    time: '20:00',
    city: 'Москва',
    venue: 'ВТБ Арена',
    venueAddress: 'ВТБ Арена, Москва, Ленинградский проспект, 36',
    venueDetails: 'Вход с центрального фасада, доступны гардероб и фудкорт на втором уровне.',
    age: '16+',
    price: 1900,
    description: 'Большое сольное шоу с визуальными эффектами и новой концертной программой.',
    posterImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    hallSchemeImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=80',
    seatForPurchase: 'Сектор A, ряд 4, место 12',
    reviews: [
      { author: 'Илья Н.', text: 'Свет и звук были очень мощными, шоу держало до последней песни.' },
      { author: 'Мария К.', text: 'Понравилась сцена и организация входа, всё прошло без очередей.' },
      { author: 'Тимур Р.', text: 'Отличная энергетика, обязательно пойду еще на следующий тур.' },
    ],
  },
  'hamlet-new-stage': {
    id: 'hamlet-new-stage',
    category: 'Театр',
    name: 'Гамлет: Новая сцена',
    date: '18 мая 2026',
    dateIso: '2026-05-18',
    time: '19:30',
    city: 'Санкт-Петербург',
    venue: 'Александринский театр',
    venueAddress: 'Александринский театр, Санкт-Петербург, пл. Островского, 6',
    venueDetails: 'Тихий зал с хорошей акустикой, рекомендуем приходить за 30 минут до начала.',
    age: '12+',
    price: 1200,
    description: 'Современное прочтение классики с минималистичной сценографией и живой музыкой.',
    posterImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80',
    hallSchemeImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1000&q=80',
    seatForPurchase: 'Партер, ряд 2, место 8',
    reviews: [
      { author: 'Софья В.', text: 'Необычная постановка, глубокая игра актеров и сильная режиссура.' },
      { author: 'Никита С.', text: 'Впечатлила сценография и работа со светом, очень атмосферно.' },
      { author: 'Ольга М.', text: 'Спектакль держит внимание от начала до конца, рекомендую.' },
    ],
  },
  'city-league-final': {
    id: 'city-league-final',
    category: 'Спорт',
    name: 'Финал Лиги Городов',
    date: '25 мая 2026',
    dateIso: '2026-05-25',
    time: '18:00',
    city: 'Казань',
    venue: 'Ак Барс Арена',
    venueAddress: 'Ак Барс Арена, Казань, проспект Ямашева, 115А',
    venueDetails: 'Для болельщиков открыты фан-зоны, рядом большая парковка и остановки транспорта.',
    age: '6+',
    price: 1500,
    description: 'Решающий матч сезона с шоу-программой, гимном турнира и церемонией награждения.',
    posterImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    hallSchemeImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80',
    seatForPurchase: 'Сектор C, ряд 6, место 18',
    reviews: [
      { author: 'Денис Т.', text: 'Крутая атмосфера, отличная видимость поля даже с верхних рядов.' },
      { author: 'Алёна З.', text: 'Организация на уровне, быстро проходили контроль и рассадку.' },
      { author: 'Руслан А.', text: 'Очень яркий финал, эмоции до мурашек, рекомендую всем фанатам спорта.' },
    ],
  },
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`
}

function stripHtmlToText(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeCityToken(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
}

function resolveKudaGoLocationCode(value) {
  const normalized = normalizeCityToken(value)
  if (!normalized) {
    return ''
  }

  const aliasCode = KUDAGO_LOCATION_ALIASES[normalized]
  if (aliasCode) {
    return aliasCode
  }

  const matchedEntry = Object.entries(KUDAGO_LOCATION_LABELS).find(
    ([, cityLabel]) => normalizeCityToken(cityLabel) === normalized,
  )

  return matchedEntry ? matchedEntry[0] : ''
}

function formatKudaGoDate(dates) {
  if (!Array.isArray(dates) || !dates.length) {
    return { dateLabel: 'Скоро', dateIso: '' }
  }

  const nowTimestamp = Math.floor(Date.now() / 1000)
  const closestDate = dates.find((item) => Number(item.start) >= nowTimestamp) || dates[0]
  const startTimestamp = Number(closestDate.start)

  if (!Number.isFinite(startTimestamp) || startTimestamp <= 0) {
    return { dateLabel: 'Скоро', dateIso: '' }
  }

  const date = new Date(startTimestamp * 1000)

  return {
    dateIso: date.toISOString().slice(0, 10),
    dateLabel: date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  }
}

function normalizeKudaGoImage(images) {
  if (!Array.isArray(images) || !images.length) {
    return FALLBACK_POSTER
  }

  const firstImage = images.find((item) => item?.image?.trim()) || images[0]
  return firstImage?.image?.trim() || FALLBACK_POSTER
}

function normalizeKudaGoPrice(eventItem) {
  if (eventItem?.is_free) {
    return { value: 0, isKnown: true, isFree: true }
  }

  const matches = String(eventItem?.price || '').match(/\d[\d\s\u00A0]*/g) || []
  const values = matches
    .map((part) => Number(String(part).replace(/[^\d]/g, '')))
    .filter((value) => Number.isFinite(value) && value > 0)

  if (values.length) {
    return { value: Math.min(...values), isKnown: true, isFree: false }
  }

  return { value: 0, isKnown: false, isFree: false }
}

function buildKudaGoEventUrl(eventItem) {
  const siteUrl = String(eventItem?.site_url || '').trim()
  if (!siteUrl) {
    return '#'
  }

  if (siteUrl.startsWith('http://') || siteUrl.startsWith('https://')) {
    return siteUrl
  }

  return `https://kudago.com${siteUrl.startsWith('/') ? '' : '/'}${siteUrl}`
}

function toKudaGoEventViewModel(item) {
  const dateData = formatKudaGoDate(item.dates)
  const category = Array.isArray(item.categories) && item.categories.length ? item.categories[0] : 'Мероприятие'
  const locationCode = String(item?.place?.location || item.__locationCode || '').trim().toLowerCase()
  const description = stripHtmlToText(item?.description)
  const price = normalizeKudaGoPrice(item)

  return {
    id: String(item?.id || generateId('kudago')),
    title: String(item?.title || 'Событие').trim(),
    category,
    city: KUDAGO_LOCATION_LABELS[locationCode] || 'Не указан',
    venue: item?.place?.title || 'Площадка уточняется',
    dateLabel: dateData.dateLabel,
    dateIso: dateData.dateIso,
    description: description ? `${description.slice(0, 150)}${description.length > 150 ? '...' : ''}` : 'Описание скоро появится.',
    image: normalizeKudaGoImage(item?.images),
    price,
    url: buildKudaGoEventUrl(item),
    isExternalUrl: true,
    source: 'api',
  }
}

function toReadableDate(dateValue) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return dateValue || 'Скоро'
  }

  return date.toLocaleDateString('ru-RU')
}

function toOrganizerEventViewModel(user, eventItem, index) {
  const eventId = String(eventItem?.id || `${user.id}_event_${index}`)
  const rawPrice = Number(eventItem?.price || 0)
  const priceValue = Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 0
  const description = String(eventItem?.description || '').trim()

  return {
    id: eventId,
    title: String(eventItem?.name || 'Новое событие').trim() || 'Новое событие',
    category: String(eventItem?.category || 'Мероприятие'),
    city: String(eventItem?.city || 'Не указан'),
    venue: String(eventItem?.venue || 'Площадка уточняется'),
    dateLabel: eventItem?.date || toReadableDate(eventItem?.dateIso),
    dateIso: String(eventItem?.dateIso || ''),
    description: description ? `${description.slice(0, 150)}${description.length > 150 ? '...' : ''}` : 'Событие от организатора EventPass.',
    image: String(eventItem?.posterImage || '').trim() || ORGANIZER_POSTER,
    price: { value: priceValue, isKnown: true, isFree: priceValue === 0 },
    route: `/events/organizer-${encodeURIComponent(eventId)}`,
    isExternalUrl: false,
    source: 'organizer',
    organizerName: String(user?.name || 'Организатор'),
  }
}

function matchesOrganizerFilters(eventItem, filters = {}) {
  const normalizedQuery = normalizeCityToken(filters.searchText)
  const normalizedCity = normalizeCityToken(filters.selectedCity)
  const selectedDate = String(filters.selectedDate || '').trim()

  if (selectedDate && eventItem.dateIso !== selectedDate) {
    return false
  }

  if (normalizedCity && normalizeCityToken(eventItem.city) !== normalizedCity) {
    return false
  }

  if (!normalizedQuery) {
    return true
  }

  const searchIndex = [
    eventItem.title,
    eventItem.category,
    eventItem.city,
    eventItem.venue,
    eventItem.organizerName,
  ]
    .map((value) => normalizeCityToken(value))
    .join(' ')

  return searchIndex.includes(normalizedQuery)
}

export function useEvents() {
  const events = ref([])
  const apiEventsCount = ref(0)
  const organizerEventsCount = ref(0)
  const loading = ref(false)
  const error = ref('')

  const cityOptions = computed(() => Object.values(KUDAGO_LOCATION_LABELS))

  async function fetchKudaGoSearchIds(locationCode, searchQuery, pageSize) {
    const payload = await fetchKudaGoSearch({
      lang: 'ru',
      location: locationCode || 'msk',
      page_size: pageSize || 15,
      ctype: 'event',
      q: String(searchQuery || '').trim(),
    })

    return Array.isArray(payload.results)
      ? payload.results.map((item) => Number(item?.id)).filter((id) => Number.isFinite(id) && id > 0)
      : []
  }

  async function fetchKudaGoEventsByLocation(locationCode, options = {}) {
    const actualSince = Math.floor(Date.now() / 1000)
    const hasIds = Array.isArray(options.ids) && options.ids.length > 0
    const payload = await fetchKudaGoEvents({
      lang: 'ru',
      location: locationCode || 'msk',
      page_size: hasIds ? Math.min(options.ids.length, Number(options.pageSize || 15)) : Number(options.pageSize || 15),
      is_free: 'false',
      actual_since: actualSince,
      order_by: '-publication_date',
      ...(hasIds ? { ids: options.ids.join(',') } : {}),
    })

    return Array.isArray(payload.results) ? payload.results : []
  }

  function buildSearchLocations(filters = {}) {
    const selectedLocationCode = resolveKudaGoLocationCode(filters.selectedCity)
    const textLocationCode = selectedLocationCode ? '' : resolveKudaGoLocationCode(filters.searchText)
    const normalizedSearch = normalizeCityToken(filters.searchText)
    const normalizedCityOnly = normalizeCityToken(KUDAGO_LOCATION_LABELS[textLocationCode] || '')
    const queryText = textLocationCode && normalizedSearch === normalizedCityOnly ? '' : filters.searchText
    const locations = selectedLocationCode
      ? [selectedLocationCode]
      : textLocationCode
        ? [textLocationCode]
        : Object.keys(KUDAGO_LOCATION_LABELS)

    return { locations, queryText }
  }

  async function fetchKudaGoByLocations({ locations, searchQuery, pageSize }) {
    const responses = await Promise.allSettled(
      locations.map(async (locationCode) => {
        if (searchQuery) {
          const ids = await fetchKudaGoSearchIds(locationCode, searchQuery, pageSize)
          if (!ids.length) {
            return { locationCode, results: [] }
          }

          return {
            locationCode,
            results: await fetchKudaGoEventsByLocation(locationCode, { pageSize, ids }),
          }
        }

        return {
          locationCode,
          results: await fetchKudaGoEventsByLocation(locationCode, { pageSize }),
        }
      }),
    )

    const deduped = new Map()
    responses
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
      .forEach(({ locationCode, results }) => {
        results.forEach((item) => {
          if (item?.id && !deduped.has(String(item.id))) {
            deduped.set(String(item.id), { ...item, __locationCode: locationCode })
          }
        })
      })

    return Array.from(deduped.values()).filter((item) => !item.is_free)
  }

  async function getOrganizerEventsForHome(filters) {
    const users = await getOrganizerUsers()

    return users
      .filter((user) => user.accountType === 'organizer' && Array.isArray(user.organizerEvents))
      .flatMap((user) =>
        user.organizerEvents
          .map((eventItem, index) => toOrganizerEventViewModel(user, eventItem, index))
          .filter((eventItem) => matchesOrganizerFilters(eventItem, filters)),
      )
  }

  async function loadEvents(filters = {}) {
    loading.value = true
    error.value = ''

    try {
      const hasFilters = !!(filters.searchText || filters.selectedDate || filters.selectedCity)
      const searchConfig = buildSearchLocations(filters)
      const organizerItems = await getOrganizerEventsForHome(filters)
      const sourceItems = await fetchKudaGoByLocations({
        locations: searchConfig.locations,
        searchQuery: searchConfig.queryText || '',
        pageSize: hasFilters ? 30 : 15,
      })

      let sourceEvents = sourceItems.map((item) => toKudaGoEventViewModel(item)).slice(0, 30)
      if (filters.selectedDate) {
        sourceEvents = sourceEvents.filter((item) => item.dateIso === filters.selectedDate)
      }

      apiEventsCount.value = sourceEvents.length
      organizerEventsCount.value = organizerItems.length
      events.value = [...organizerItems, ...sourceEvents]
    } catch (loadError) {
      const organizerItems = await getOrganizerEventsForHome(filters)
      events.value = organizerItems
      apiEventsCount.value = 0
      organizerEventsCount.value = organizerItems.length
      error.value = loadError?.response?.data?.message || loadError?.message || 'Не удалось получить мероприятия по API.'
    } finally {
      loading.value = false
    }
  }

  async function findOrganizerEventByRouteId(routeId) {
    if (!String(routeId || '').startsWith('organizer-')) {
      return null
    }

    const organizerEventId = decodeURIComponent(String(routeId).slice('organizer-'.length))
    const users = await getOrganizerUsers()

    for (const user of users) {
      const matchedEvent = user.organizerEvents?.find((eventItem) => String(eventItem.id) === organizerEventId)
      if (!matchedEvent) {
        continue
      }

      const poster = String(matchedEvent.posterImage || '').trim()

      return {
        id: `organizer-${organizerEventId}`,
        category: matchedEvent.category || 'Мероприятие',
        name: matchedEvent.name || 'Событие',
        date: matchedEvent.date || toReadableDate(matchedEvent.dateIso),
        dateIso: matchedEvent.dateIso || '',
        time: matchedEvent.time || '19:00',
        city: matchedEvent.city || 'Не указан',
        venue: matchedEvent.venue || 'Площадка уточняется',
        venueAddress: `${matchedEvent.venue || 'Площадка'}${matchedEvent.city ? `, ${matchedEvent.city}` : ''}`,
        venueDetails: 'Событие добавлено организатором через личный кабинет.',
        age: matchedEvent.age || '6+',
        price: Number(matchedEvent.price || 0),
        description:
          matchedEvent.description || `Мероприятие от организатора ${user.name}. Подробное описание будет добавлено позже.`,
        posterImage: poster || ORGANIZER_POSTER,
        hallSchemeImage: ORGANIZER_POSTER,
        seatForPurchase: 'Электронный билет',
        reviews: [{ author: 'EventPass', text: 'Это новое мероприятие. Отзывы появятся после первых посещений.' }],
      }
    }

    return null
  }

  return {
    events,
    apiEventsCount,
    organizerEventsCount,
    loading,
    error,
    cityOptions,
    loadEvents,
    findOrganizerEventByRouteId,
  }
}
