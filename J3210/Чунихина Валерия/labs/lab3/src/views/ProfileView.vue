<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useProfile } from '@/composables/useProfile'

const {
  currentUser,
  activeTab,
  isUploadFormVisible,
  draftItem,
  modelItems,
  datasetItems,
  subscriptions,
  addInventoryItem
} = useProfile()

const sortOrder = ref('recent')

const sortedModels = computed(() => {
  return [...modelItems.value].sort((a, b) =>
    sortOrder.value === 'recent' ? b.id.localeCompare(a.id) : a.name.localeCompare(b.name)
  )
})

const sortedDatasets = computed(() => {
  return [...datasetItems.value].sort((a, b) =>
    sortOrder.value === 'recent' ? b.id.localeCompare(a.id) : a.name.localeCompare(b.name)
  )
})

const tabs = [
  { key: 'uploads', label: 'Модели', countKey: 'models' },
  { key: 'datasets', label: 'Датасеты', countKey: 'datasets' },
  { key: 'subs', label: 'Подписки', countKey: 'subs' },
]

const tabCount = computed(() => ({
  models: modelItems.value.length,
  datasets: datasetItems.value.length,
  subs: subscriptions.length,
}))

function pipelineColor(task) {
  const map = {
    'text-classification': '#3b82f6',
    'image-classification': '#a855f7',
    'text-generation': '#10b981',
    'object-detection': '#f59e0b',
    'Dataset': '#6366f1',
    'AI Model': '#22c55e',
  }
  return map[task] || 'var(--bloom-green)'
}
</script>

<template>
  <div class="hf-profile container-fluid px-0">
    <div class="hf-layout">

      <!-- LEFT SIDEBAR -->
      <aside class="hf-sidebar">
        <div class="hf-avatar-wrap">
          <img
            :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=6ca35e&color=fff&size=160`"
            class="hf-avatar"
            alt="Аватар"
          />
          <button class="hf-status-btn">+ Добавить статус</button>
        </div>

        <h1 class="hf-name">{{ currentUser.name }}</h1>
        <p class="hf-username">{{ currentUser.email?.split('@')[0] ?? 'user' }}</p>

        <div class="hf-actions">
          <button class="hf-btn-new" @click="isUploadFormVisible = !isUploadFormVisible">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Новый
          </button>
          <button class="hf-btn-outline">Редактировать</button>
        </div>

        <div v-if="isUploadFormVisible" class="hf-add-form">
          <select v-model="draftItem.type" class="hf-select">
            <option value="model">Модель</option>
            <option value="dataset">Датасет</option>
          </select>
          <input v-model="draftItem.name" class="hf-input" type="text" placeholder="Название..." />
          <button class="hf-btn-submit" @click="addInventoryItem">Создать</button>
        </div>

        <hr class="hf-divider" />

        <ul class="hf-meta-list">
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            Выращиваю нейросети с 2024 года
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            {{ currentUser.city }}
          </li>
        </ul>

        <hr class="hf-divider" />

        <p class="hf-section-label">AI &amp; ML интересы</p>
        <div class="hf-tags">
          <span class="hf-tag">NLP</span>
          <span class="hf-tag">Computer Vision</span>
          <span class="hf-tag">Fine-tuning</span>
        </div>

        <hr class="hf-divider" />

        <p class="hf-section-label">Статистика сада</p>
        <ul class="hf-stat-list">
          <li><span class="hf-stat-val">{{ modelItems.length }}</span> моделей</li>
          <li><span class="hf-stat-val">{{ datasetItems.length }}</span> датасетов</li>
          <li><span class="hf-stat-val">{{ modelItems.reduce((s, m) => s + Number(m.stars || 0), 0) }}</span> звёзд</li>
        </ul>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="hf-main" id="main-content" tabindex="-1">
        <nav class="hf-tabs" aria-label="Разделы профиля">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="hf-tab"
            :class="{ 'hf-tab--active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
            <span class="hf-tab-count">{{ tabCount[tab.countKey] }}</span>
          </button>
        </nav>

        <div v-if="activeTab !== 'subs'" class="hf-sort-row">
          <span class="hf-sort-label">Сортировка:</span>
          <select v-model="sortOrder" class="hf-sort-select">
            <option value="recent">Недавно обновлённые</option>
            <option value="alpha">По алфавиту</option>
          </select>
        </div>

        <!-- Models -->
        <section v-if="activeTab === 'uploads'">
          <div v-if="sortedModels.length === 0" class="hf-empty">
            Моделей пока нет. Нажмите «Новый», чтобы добавить.
          </div>
          <article v-for="model in sortedModels" :key="model.id" class="hf-item">
            <div class="hf-item-left">
              <span class="hf-dot" :style="{ background: pipelineColor(model.task) }"></span>
              <div>
                <RouterLink :to="{ name: 'details', params: { slug: model.slug } }" class="hf-item-name">
                  {{ currentUser.email?.split('@')[0] ?? 'user' }}/{{ model.name }}
                </RouterLink>
                <p class="hf-item-meta">
                  <span class="hf-item-badge">{{ model.task || 'AI Model' }}</span>
                  · {{ model.framework }} · {{ model.size }}
                </p>
              </div>
            </div>
            <div class="hf-item-right">
              <span v-if="model.stars" class="hf-item-stars">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {{ model.stars }}
              </span>
              <span class="hf-item-updated">Обновлено недавно</span>
            </div>
          </article>
        </section>

        <!-- Datasets -->
        <section v-else-if="activeTab === 'datasets'">
          <div v-if="sortedDatasets.length === 0" class="hf-empty">Датасетов пока нет.</div>
          <article v-for="dataset in sortedDatasets" :key="dataset.id" class="hf-item">
            <div class="hf-item-left">
              <span class="hf-dot" style="background: #6366f1;"></span>
              <div>
                <span class="hf-item-name">{{ currentUser.email?.split('@')[0] ?? 'user' }}/{{ dataset.name }}</span>
                <p class="hf-item-meta">
                  <span class="hf-item-badge hf-item-badge--dataset">Dataset</span>
                  · {{ dataset.license }} · {{ dataset.size }}
                </p>
              </div>
            </div>
            <div class="hf-item-right">
              <span class="hf-item-updated">Обновлено недавно</span>
            </div>
          </article>
        </section>

        <!-- Subscriptions -->
        <section v-else>
          <article v-for="sub in subscriptions" :key="sub.id" class="hf-item hf-item--sub">
            <div class="hf-item-left">
              <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(sub.name)}&background=A2C2E1&size=40`" class="hf-sub-avatar" :alt="sub.name" />
              <div>
                <span class="hf-item-name">{{ sub.name }}</span>
                <p class="hf-item-meta">{{ sub.models }} моделей · {{ sub.label }}</p>
              </div>
            </div>
            <button class="hf-btn-outline hf-btn-sm">В гости</button>
          </article>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.hf-profile { min-height: 100vh; background: var(--page-bg, #f9fafb); }

.hf-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2.5rem;
  align-items: start;
}

@media (max-width: 768px) {
  .hf-layout { grid-template-columns: 1fr; padding: 1.5rem 1rem; }
}

.hf-sidebar { position: sticky; top: 80px; }

.hf-avatar-wrap { position: relative; display: inline-block; margin-bottom: 1rem; }

.hf-avatar {
  width: 120px; height: 120px; border-radius: 50%; display: block;
  border: 3px solid var(--card-bg, #fff);
  box-shadow: 0 2px 12px rgba(0,0,0,.10);
}

.hf-status-btn {
  position: absolute; bottom: 6px; right: -4px;
  background: var(--card-bg, #fff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 20px; font-size: 0.7rem; padding: 3px 8px;
  cursor: pointer; white-space: nowrap; color: var(--text-muted, #6b7280);
}
.hf-status-btn:hover { background: #f3f4f6; }

.hf-name { font-size: 1.35rem; font-weight: 700; margin: 0 0 2px; color: var(--text-color, #111827); }

.hf-username {
  font-family: monospace; font-size: 0.9rem; color: var(--text-muted, #6b7280);
  background: var(--border-color, #f3f4f6); display: inline-block;
  padding: 1px 8px; border-radius: 6px; margin: 0 0 1rem;
}

.hf-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }

.hf-btn-new {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 0.35rem 0.75rem; background: var(--bloom-green, #3f8d4e);
  color: #fff; border: none; border-radius: 8px; font-size: 0.82rem;
  font-weight: 600; cursor: pointer; transition: opacity .15s;
}
.hf-btn-new:hover { opacity: .88; }

.hf-btn-outline {
  padding: 0.35rem 0.75rem; background: var(--card-bg, #fff);
  border: 1px solid var(--border-color, #d1d5db); border-radius: 8px;
  font-size: 0.82rem; cursor: pointer; color: var(--text-color, #374151);
  transition: background .15s;
}
.hf-btn-outline:hover { background: #f3f4f6; }
.hf-btn-sm { padding: 0.28rem 0.65rem; font-size: 0.78rem; }

.hf-add-form {
  display: flex; flex-direction: column; gap: 0.5rem;
  padding: 0.75rem; background: var(--card-bg, #fff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 10px; margin-bottom: 0.75rem;
}

.hf-select, .hf-input {
  width: 100%; padding: 0.35rem 0.6rem;
  border: 1px solid var(--border-color, #d1d5db); border-radius: 7px;
  font-size: 0.82rem; background: var(--page-bg, #f9fafb); color: var(--text-color, #111827);
}

.hf-btn-submit {
  padding: 0.38rem; background: var(--bloom-green, #3f8d4e);
  color: #fff; border: none; border-radius: 7px; font-size: 0.82rem; font-weight: 600; cursor: pointer;
}

.hf-divider { border: none; border-top: 1px solid var(--border-color, #e5e7eb); margin: 1rem 0; }

.hf-meta-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.45rem; }
.hf-meta-list li { display: flex; align-items: center; gap: 0.4rem; font-size: 0.84rem; color: var(--text-muted, #6b7280); }

.hf-section-label {
  font-size: 0.78rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .06em; color: var(--text-muted, #9ca3af); margin: 0 0 0.6rem;
}

.hf-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.hf-tag { font-size: 0.75rem; padding: 2px 10px; border-radius: 20px; background: #d1fae5; color: #065f46; font-weight: 500; }

.hf-stat-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.3rem; }
.hf-stat-list li { font-size: 0.84rem; color: var(--text-muted, #6b7280); }
.hf-stat-val { font-weight: 700; color: var(--text-color, #111827); margin-right: 2px; }

/* Tabs */
.hf-tabs { display: flex; border-bottom: 2px solid var(--border-color, #e5e7eb); margin-bottom: 1.25rem; }

.hf-tab {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.65rem 1rem; background: none; border: none;
  border-bottom: 2px solid transparent; margin-bottom: -2px;
  font-size: 0.9rem; font-weight: 500; cursor: pointer;
  color: var(--text-muted, #6b7280); transition: color .15s;
}
.hf-tab:hover { color: var(--text-color, #111827); }
.hf-tab--active { color: var(--text-color, #111827); border-bottom-color: var(--bloom-green, #3f8d4e); font-weight: 700; }

.hf-tab-count {
  font-size: 0.72rem; background: var(--border-color, #e5e7eb);
  color: var(--text-muted, #6b7280); border-radius: 20px;
  padding: 1px 7px; font-weight: 600;
}

.hf-sort-row { display: flex; align-items: center; gap: 0.5rem; justify-content: flex-end; margin-bottom: 0.75rem; }
.hf-sort-label { font-size: 0.8rem; color: var(--text-muted, #6b7280); }
.hf-sort-select {
  font-size: 0.8rem; padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color, #d1d5db); border-radius: 7px;
  background: var(--card-bg, #fff); color: var(--text-color, #374151); cursor: pointer;
}

/* Items */
.hf-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-color, #e5e7eb); border-radius: 10px;
  margin-bottom: 0.5rem; background: var(--card-bg, #fff);
  transition: box-shadow .15s;
}
.hf-item:hover { box-shadow: 0 2px 10px rgba(0,0,0,.07); }

.hf-item-left { display: flex; align-items: flex-start; gap: 0.65rem; min-width: 0; }

.hf-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }

.hf-item-name {
  font-family: monospace; font-size: 0.9rem; font-weight: 600;
  color: var(--bloom-green, #3f8d4e); text-decoration: none; display: block;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 420px;
}
.hf-item-name:hover { text-decoration: underline; }

.hf-item-meta {
  margin: 2px 0 0; font-size: 0.78rem; color: var(--text-muted, #9ca3af);
  display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
}

.hf-item-badge { background: #dcfce7; color: #166534; border-radius: 4px; padding: 0 5px; font-size: 0.7rem; font-weight: 600; }
.hf-item-badge--dataset { background: #ede9fe; color: #4c1d95; }

.hf-item-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }

.hf-item-stars { display: flex; align-items: center; gap: 3px; font-size: 0.78rem; color: var(--text-muted, #9ca3af); }
.hf-item-updated { font-size: 0.75rem; color: var(--text-muted, #9ca3af); white-space: nowrap; }

.hf-sub-avatar { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; }

.hf-empty {
  text-align: center; padding: 3rem 1rem; color: var(--text-muted, #9ca3af);
  font-size: 0.9rem; border: 1px dashed var(--border-color, #e5e7eb); border-radius: 10px;
}
</style>
