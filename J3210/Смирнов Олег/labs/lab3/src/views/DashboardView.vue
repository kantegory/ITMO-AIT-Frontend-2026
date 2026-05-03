<script setup>
import { ref, computed, onMounted, useTemplateRef } from 'vue';
import { Modal } from 'bootstrap';
import { useAuth } from '@/composables/useAuth';
import Avatar from '@/components/ui/Avatar.vue';
import SvgIcon from '@/components/ui/SvgIcon.vue';

const { user, updateProfile } = useAuth();

const editModalEl = useTemplateRef('editModalEl');
const uploadModalEl = useTemplateRef('uploadModalEl');
let editModal = null;
let uploadModal = null;

const form = ref({ name: '', bio: '', location: '' });
const saving = ref(false);

const subtitle = computed(() => {
  if (!user.value) return '';
  const parts = [];
  if (user.value.bio) parts.push(user.value.bio);
  if (user.value.location) parts.push(user.value.location);
  return parts.join(' · ') || 'Профиль не заполнен';
});

onMounted(() => {
  editModal = Modal.getOrCreateInstance(editModalEl.value);
  uploadModal = Modal.getOrCreateInstance(uploadModalEl.value);
});

function openEdit() {
  form.value = {
    name: user.value.name,
    bio: user.value.bio || '',
    location: user.value.location || '',
  };
  editModal.show();
}

async function saveProfile() {
  if (!form.value.name.trim()) return;
  saving.value = true;
  try {
    await updateProfile({
      name: form.value.name.trim(),
      bio: form.value.bio.trim(),
      location: form.value.location.trim(),
    });
    editModal.hide();
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <main id="main-content" class="py-4">
    <div class="container" v-if="user">
      <div class="card mb-4">
        <div class="card-body">
          <div class="d-flex align-items-center gap-4 flex-wrap">
            <Avatar :name="user.name" size="lg" />
            <div>
              <h1 class="h4 mb-1">{{ user.name }}</h1>
              <p class="text-muted mb-0">{{ subtitle }}</p>
            </div>
            <div class="ms-auto">
              <button type="button" class="btn btn-outline-themed btn-sm" @click="openEdit">
                <SvgIcon name="pencil" /> Редактировать
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">Ваш контент</h2>
        <button type="button" class="btn btn-accent btn-sm" @click="uploadModal && uploadModal.show()">
          <SvgIcon name="plus-lg" /> Загрузить
        </button>
      </div>

      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-models" type="button" role="tab">Мои модели</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-datasets" type="button" role="tab">Мои датасеты</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-starred" type="button" role="tab">Подписки</button>
        </li>
      </ul>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="tab-models" role="tabpanel">
          <p class="text-muted">У вас пока нет загруженных моделей.</p>
        </div>
        <div class="tab-pane fade" id="tab-datasets" role="tabpanel">
          <p class="text-muted">У вас пока нет загруженных датасетов.</p>
        </div>
        <div class="tab-pane fade" id="tab-starred" role="tabpanel">
          <p class="text-muted">Вы пока ни на что не подписаны.</p>
        </div>
      </div>
    </div>

    <!-- Модалка редактирования профиля -->
    <div class="modal fade" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true" ref="editModalEl">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editProfileModalLabel">Редактировать профиль</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProfile">
              <div class="mb-3">
                <label for="editName" class="form-label">Имя</label>
                <input id="editName" v-model="form.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="editBio" class="form-label">О себе</label>
                <input id="editBio" v-model="form.bio" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label for="editLocation" class="form-label">Город</label>
                <input id="editLocation" v-model="form.location" type="text" class="form-control" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-themed btn-sm" data-bs-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-accent btn-sm" :disabled="saving" @click="saveProfile">
              {{ saving ? 'Сохраняем…' : 'Сохранить' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка загрузки (UI-заглушка) -->
    <div class="modal fade" tabindex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true" ref="uploadModalEl">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="uploadModalLabel">Загрузить модель или датасет</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent>
              <div class="mb-3">
                <label for="uploadName" class="form-label">Название</label>
                <input id="uploadName" type="text" class="form-control" placeholder="my-model" />
              </div>
              <div class="mb-3">
                <label for="uploadType" class="form-label">Тип</label>
                <select id="uploadType" class="form-select">
                  <option value="model">Модель</option>
                  <option value="dataset">Датасет</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="uploadDesc" class="form-label">Описание</label>
                <textarea id="uploadDesc" class="form-control" rows="2" placeholder="Краткое описание…"></textarea>
              </div>
              <div class="mb-3">
                <label for="uploadFramework" class="form-label">Фреймворк</label>
                <select id="uploadFramework" class="form-select">
                  <option value="">Выберите…</option>
                  <option>PyTorch</option>
                  <option>TensorFlow</option>
                  <option>JAX</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="uploadFiles" class="form-label">Файлы</label>
                <input id="uploadFiles" class="form-control" type="file" multiple />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-themed btn-sm" data-bs-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-accent btn-sm">Загрузить</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
