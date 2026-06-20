<script setup>
defineProps({
  course: {
    type: Object,
    required: true,
  },
  enrollment: {
    type: Object,
    default: null,
  },
});

defineEmits(['enroll']);
</script>

<template>
  <article class="course-card">
    <div class="course-meta">
      <span>{{ course.subjectLabel }}</span>
      <span>{{ course.levelLabel }}</span>
    </div>

    <h3>{{ course.title }}</h3>
    <p>{{ course.description }}</p>

    <dl class="compact-list">
      <div>
        <dt>Лекций</dt>
        <dd>{{ course.lessons }}</dd>
      </div>
      <div>
        <dt>Рейтинг</dt>
        <dd>{{ course.rating }}</dd>
      </div>
    </dl>

    <div class="course-footer">
      <strong>{{ course.price === 0 ? 'Бесплатно' : `${course.price} ₽` }}</strong>
      <RouterLink class="ghost-button" :to="{ name: 'course', params: { id: course.id } }">Подробнее</RouterLink>
      <button class="primary-button" type="button" @click="$emit('enroll', course.id)">
        {{ enrollment ? `${enrollment.progress}%` : 'Записаться' }}
      </button>
    </div>
  </article>
</template>
