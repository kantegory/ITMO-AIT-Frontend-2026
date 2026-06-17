<script setup>
import { ref, watch } from 'vue';
import { getDatasetById } from '@/api/datasets';
import ItemHeader from '@/components/detail/ItemHeader.vue';
import SvgIcon from '@/components/ui/SvgIcon.vue';
import Avatar from '@/components/ui/Avatar.vue';

const props = defineProps({
  id: { type: String, required: true },
});

const item = ref(null);
const error = ref('');
const loading = ref(false);

async function load(id) {
  loading.value = true;
  error.value = '';
  item.value = null;
  try {
    item.value = await getDatasetById(id);
  } catch (e) {
    error.value =
      e?.response?.status === 404
        ? 'Датасет не найден.'
        : 'Не удалось загрузить данные. Убедитесь, что json-server запущен.';
  } finally {
    loading.value = false;
  }
}

watch(() => props.id, load, { immediate: true });

const files = [
  { name: 'README.md', size: '2.4 KB', icon: 'file-text' },
  { name: 'train.json', size: '42 MB', icon: 'file-earmark' },
  { name: 'dev.json', size: '4.3 MB', icon: 'file-earmark' },
];

const comments = [
  {
    author: 'dmitry_nlp',
    date: '5 часов назад',
    body: 'Есть ли планы добавить русскоязычную версию датасета?',
  },
];
</script>

<template>
  <main id="main-content" class="py-4">
    <div class="container">
      <p v-if="loading" class="text-muted">Загрузка…</p>
      <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

      <template v-else-if="item">
        <ItemHeader :item="item" type="dataset" />

        <ul class="nav nav-tabs mb-4" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-description" type="button" role="tab">Описание</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-usage" type="button" role="tab">Примеры</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-files" type="button" role="tab">Файлы</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-discussions" type="button" role="tab">Обсуждения</button>
          </li>
        </ul>

        <div class="tab-content">
          <div class="tab-pane fade show active" id="tab-description" role="tabpanel">
            <div class="card">
              <div class="card-body">
                <h2 class="h5">{{ item.slug }}</h2>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="tab-usage" role="tabpanel">
            <div class="card">
              <div class="card-body">
                <h2 class="h5 mb-3">Пример загрузки</h2>
                <div class="code-block">
<pre>from datasets import load_dataset

dataset = load_dataset("{{ item.slug }}")
print(dataset["train"][0])</pre>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="tab-files" role="tabpanel">
            <div class="card">
              <div class="card-body p-0">
                <div v-for="f in files" :key="f.name" class="file-item">
                  <div>
                    <SvgIcon :name="f.icon" class-name="icon text-muted me-2" />
                    <span>{{ f.name }}</span>
                    <span class="text-muted small ms-2">{{ f.size }}</span>
                  </div>
                  <a href="#" class="btn btn-sm btn-outline-themed" :aria-label="`Скачать ${f.name}`">
                    <SvgIcon name="download" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="tab-discussions" role="tabpanel">
            <div class="card">
              <div class="card-body">
                <h2 class="h5 mb-3">Обсуждения</h2>
                <div v-for="c in comments" :key="c.author" class="comment">
                  <div class="d-flex gap-3">
                    <Avatar :name="c.author" />
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between">
                        <span class="comment-author">{{ c.author }}</span>
                        <span class="comment-date">{{ c.date }}</span>
                      </div>
                      <p class="comment-body mt-1 mb-0">{{ c.body }}</p>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-top" style="border-color: var(--border) !important;">
                  <h3 class="h6">Написать комментарий</h3>
                  <form @submit.prevent>
                    <div class="mb-3">
                      <label for="commentText" class="visually-hidden">Текст комментария</label>
                      <textarea id="commentText" class="form-control" rows="3" placeholder="Ваш комментарий…"></textarea>
                    </div>
                    <button type="submit" class="btn btn-accent btn-sm">Отправить</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>
