<template>
  <article class="card course-card">
    <p class="eyebrow">{{ course.subject }}</p>
    <h3>{{ course.title }}</h3>
    <p>{{ course.description }}</p>

    <dl class="meta-list">
      <div>
        <dt>Уровень</dt>
        <dd>{{ course.level }}</dd>
      </div>
      <div>
        <dt>Цена</dt>
        <dd>{{ course.price }}</dd>
      </div>
      <div>
        <dt>Длительность</dt>
        <dd>{{ course.duration }}</dd>
      </div>
    </dl>

    <RouterLink class="btn" :to="`/courses/${course.id}`">Подробнее</RouterLink>
  </article>
</template>

<script setup>
defineProps({
  course: {
    type: Object,
    required: true
  }
});
</script>
