<script setup>
import { ref, watch } from 'vue';
import { getModelById } from '@/api/models';
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
    item.value = await getModelById(id);
  } catch (e) {
    error.value =
      e?.response?.status === 404
        ? 'Модель не найдена.'
        : 'Не удалось загрузить данные. Убедитесь, что json-server запущен.';
  } finally {
    loading.value = false;
  }
}

watch(() => props.id, load, { immediate: true });

const files = [
  { name: 'README.md', size: '3.1 KB', icon: 'file-text' },
  { name: 'config.json', size: '1.2 KB', icon: 'file-code' },
  { name: 'model.safetensors', size: '140 GB', icon: 'file-binary' },
  { name: 'tokenizer.json', size: '8.7 MB', icon: 'file-code' },
];

const benchmarks = [
  { name: 'MMLU', score: '82.0%', metric: 'Accuracy (5-shot)' },
  { name: 'HumanEval', score: '81.7%', metric: 'Pass@1' },
  { name: 'GSM8K', score: '93.0%', metric: 'Accuracy (CoT)' },
];

const comments = [
  {
    author: 'alex_ml',
    date: '2 часа назад',
    body: 'Кто-нибудь пробовал квантизацию до 4-bit? Интересует потеря качества.',
    color: '',
  },
  {
    author: 'maria_dev',
    date: '1 день назад',
    body: 'Отлично работает на русском языке, рекомендую.',
    color: 'var(--success)',
  },
];
</script>

<template>
  <main id="main-content" class="py-4">
    <div class="container">
      <p v-if="loading" class="text-muted">Загрузка…</p>
      <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

      <template v-else-if="item">
        <ItemHeader :item="item" type="model" />

        <ul class="nav nav-tabs mb-4" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-description" type="button" role="tab">Описание</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-metrics" type="button" role="tab">Метрики</button>
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

          <div class="tab-pane fade" id="tab-metrics" role="tabpanel">
            <div class="card">
              <div class="card-body">
                <h2 class="h5 mb-3">Результаты бенчмарков</h2>
                <div class="table-responsive">
                  <table class="table table-dark-custom table-striped">
                    <thead>
                      <tr><th>Бенчмарк</th><th>Результат</th><th>Метрика</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="b in benchmarks" :key="b.name">
                        <td>{{ b.name }}</td>
                        <td><strong>{{ b.score }}</strong></td>
                        <td>{{ b.metric }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="tab-usage" role="tabpanel">
            <div class="card">
              <div class="card-body">
                <h2 class="h5 mb-3">Пример использования</h2>
                <div class="code-block">
<pre>from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("{{ item.slug }}")
model = AutoModelForCausalLM.from_pretrained("{{ item.slug }}")

inputs = tokenizer("Привет, как дела?", return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=100)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))</pre>
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
                    <Avatar :name="c.author" :style="c.color ? `background-color: ${c.color};` : ''" />
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
