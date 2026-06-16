<script setup>
import { ref, computed } from 'vue'
import CourseCard from './CourseCard.vue'

const courses = [
  {
    id: 'py-begin',
    title: 'Python для начинающих',
    author: 'Алексей Смирнов',
    subject: 'Программирование',
    level: 'Начинающий',
    price: 1200,
    lessons: 24,
    rating: 4.8,
    emoji: '🐍',
    thumbBg: '#edeaf8',
  },
  {
    id: 'html-css',
    title: 'HTML & CSS: быстрый старт',
    author: 'Мария Кузнецова',
    subject: 'Дизайн',
    level: 'Начинающий',
    price: 0,
    lessons: 20,
    rating: 4.7,
    emoji: '🌐',
    thumbBg: '#e1f5ee',
  },
  {
    id: 'js-core',
    title: 'JavaScript: основы',
    author: 'Дмитрий Орлов',
    subject: 'Программирование',
    level: 'Средний',
    price: 1900,
    lessons: 28,
    rating: 4.9,
    emoji: '🟨',
    thumbBg: '#faeeda',
  },
  {
    id: 'sql-start',
    title: 'SQL и базы данных',
    author: 'Ольга Иванова',
    subject: 'Базы данных',
    level: 'Начинающий',
    price: 900,
    lessons: 18,
    rating: 4.6,
    emoji: '🗄️',
    thumbBg: '#e0f2fe',
  },
  {
    id: 'ml-intro',
    title: 'Machine Learning: введение',
    author: 'Илья Петров',
    subject: 'ML / AI',
    level: 'Средний',
    price: 2900,
    lessons: 30,
    rating: 4.7,
    emoji: '🤖',
    thumbBg: '#ffe4e6',
  },
  {
    id: 'math-lin',
    title: 'Линейная алгебра для ИТ',
    author: 'Екатерина Соколова',
    subject: 'Математика',
    level: 'Продвинутый',
    price: 1500,
    lessons: 16,
    rating: 4.5,
    emoji: '📐',
    thumbBg: '#fef3c7',
  },
]

const search  = ref('')
const subject = ref('')
const level   = ref('')
const price   = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return courses.filter((c) => {
    const hay = `${c.title} ${c.author} ${c.subject}`.toLowerCase()
    if (q && !hay.includes(q))                         return false
    if (subject.value && c.subject !== subject.value)  return false
    if (level.value   && c.level   !== level.value)    return false
    if (price.value === 'free' && c.price !== 0)       return false
    if (price.value === '1000' && c.price > 1000)      return false
    if (price.value === '3000' && c.price > 3000)      return false
    return true
  })
})

function clearFilters() {
  search.value  = ''
  subject.value = ''
  level.value   = ''
  price.value   = ''
}

function onSelect(title) {
  alert(`Вы выбрали курс: «${title}»`)
}
</script>

<template>
  <section>
    <div class="section-header">
      <div>
        <h2 class="section-title">Каталог курсов</h2>
        <p class="section-sub">Найдите курс, который подойдёт именно вам</p>
      </div>
    </div>

    <div class="filters">
      <input
        v-model="search"
        class="filter-input"
        type="text"
        placeholder="Поиск по названию или автору…"
      />

      <select v-model="subject" class="filter-select">
        <option value="">Все предметы</option>
        <option>Программирование</option>
        <option>Дизайн</option>
        <option>Математика</option>
        <option>ML / AI</option>
        <option>Базы данных</option>
      </select>

      <select v-model="level" class="filter-select">
        <option value="">Любой уровень</option>
        <option>Начинающий</option>
        <option>Средний</option>
        <option>Продвинутый</option>
      </select>

      <select v-model="price" class="filter-select">
        <option value="">Любая цена</option>
        <option value="free">Бесплатно</option>
        <option value="1000">До 1 000 ₽</option>
        <option value="3000">До 3 000 ₽</option>
      </select>

      <button class="btn-clear" @click="clearFilters">Сброс</button>
    </div>

    <p class="results-info">Найдено {{ filtered.length }} курсов</p>

    <div v-if="filtered.length > 0" class="grid">
      <CourseCard
        v-for="course in filtered"
        :key="course.id"
        v-bind="course"
        @select="onSelect"
      />
    </div>

    <div v-else class="empty">
      <p>😕 Ничего не найдено. Попробуйте изменить фильтры.</p>
      <button class="btn-clear" style="margin-top: 12px;" @click="clearFilters">Сбросить фильтры</button>
    </div>
  </section>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.section-sub {
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 12px;
  margin-bottom: 12px;
}

.filter-input,
.filter-select {
  flex: 1;
  min-width: 140px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.filter-input:focus,
.filter-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(83, 74, 183, 0.1);
}

.btn-clear {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--muted);
  padding: 9px 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.btn-clear:hover {
  background: var(--primary-subtle);
  color: var(--primary);
  border-color: rgba(83, 74, 183, 0.25);
}

.results-info {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--muted);
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
}
</style>
