<script setup>
defineProps({ item: { type: Object, required: true } })
</script>

<template>
  <RouterLink :to="`/item/${item.type}/${item.id}`" class="profile-item-card">

    <div class="item-main">
      <h3>{{ item.title }}</h3>

      <p class="item-meta">
        {{ item.author }}
        <span>•</span>
        {{ item.framework }}
      </p>

      <p class="item-meta">
        {{ item.task }}
        <span>•</span>
        {{ item.license }}
      </p>

      <p class="item-description">
        {{ item.description }}
      </p>
    </div>

    <div class="item-footer">

      <div class="card-stat star">
        <svg class="stat-icon" aria-hidden="true">
          <use href="/sprite.svg#icon-star-outline" />
        </svg>
        <span>{{ item.stars }}</span>
      </div>

      <div class="card-stat">
        <svg class="stat-icon" aria-hidden="true">
          <use href="/sprite.svg#icon-download" />
        </svg>
        <span>{{ item.downloads }}</span>
      </div>

      <div v-if="item.forks !== undefined" class="card-stat">
        <svg class="stat-icon" aria-hidden="true">
          <use href="/sprite.svg#icon-fork" />
        </svg>
        <span>{{ item.forks }}</span>
      </div>

    </div>

  </RouterLink>
</template>