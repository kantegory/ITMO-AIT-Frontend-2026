<template>
  <div>
    <div class="mb-4 p-4 border rounded-3">
      <h5 class="fw-semibold mb-3">Основная информация</h5>
      <div class="row g-3">

        <div class="col-md-8">
          <label class="form-label">Название курса</label>
          <input
            :value="modelValue.title"
            type="text"
            class="form-control"
            placeholder="Например: Python для начинающих"
            required
            @input="update('title', $event.target.value)"
          />
        </div>

        <div class="col-md-4">
          <label class="form-label">Категория</label>
          <select :value="modelValue.category" class="form-select"
                  @change="update('category', $event.target.value)">
            <option value="" disabled>Выберите категорию</option>
            <option>Программирование</option>
            <option>Дизайн</option>
            <option>Data Science</option>
            <option>DevOps</option>
            <option>Маркетинг</option>
          </select>
        </div>

        <div class="col-12">
          <label class="form-label">Краткое описание</label>
          <textarea
            :value="modelValue.shortDescription"
            class="form-control"
            rows="2"
            @input="update('shortDescription', $event.target.value)"
          ></textarea>
        </div>

        <div class="col-12">
          <label class="form-label">Полное описание</label>
          <textarea
            :value="modelValue.fullDescription"
            class="form-control"
            rows="5"
            @input="update('fullDescription', $event.target.value)"
          ></textarea>
        </div>

        <div class="col-md-4">
          <label class="form-label">Язык курса</label>
          <select :value="modelValue.language" class="form-select"
                  @change="update('language', $event.target.value)">
            <option>Русский</option>
            <option>Английский</option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label">Уровень</label>
          <select :value="modelValue.level" class="form-select"
                  @change="update('level', $event.target.value)">
            <option>Начинающий</option>
            <option>Средний</option>
            <option>Продвинутый</option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label">URL обложки</label>
          <input
            :value="modelValue.image"
            type="url"
            class="form-control"
            placeholder="https://..."
            @input="update('image', $event.target.value)"
          />
        </div>

      </div>
    </div>

    <div class="mb-4 p-4 border rounded-3">
      <h5 class="fw-semibold mb-3">Параметры публикации</h5>
      <div class="row g-3">

        <div class="col-md-4">
          <label class="form-label">Цена (₽)</label>
          <input
            :value="modelValue.price"
            type="number"
            min="0"
            class="form-control"
            @input="update('price', Number($event.target.value))"
          />
        </div>

        <div class="col-md-4">
          <div class="form-check form-switch mt-4">
            <input
              :checked="modelValue.hasCertificate"
              class="form-check-input"
              type="checkbox"
              id="certSwitch"
              @change="update('hasCertificate', $event.target.checked)"
            />
            <label class="form-check-label" for="certSwitch">Выдавать сертификат</label>
          </div>
        </div>

        <div class="col-md-4">
          <div class="form-check form-switch mt-4">
            <input
              :checked="modelValue.isPublished"
              class="form-check-input"
              type="checkbox"
              id="publishSwitch"
              @change="update('isPublished', $event.target.checked)"
            />
            <label class="form-check-label" for="publishSwitch">Опубликован</label>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {type: Object, required: true},
})
const emit = defineEmits(['update:modelValue'])

function update(field, value) {
  emit('update:modelValue', {...props.modelValue, [field]: value})
}
</script>
