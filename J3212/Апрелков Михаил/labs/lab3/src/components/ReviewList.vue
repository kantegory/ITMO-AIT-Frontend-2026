<template>
  <div class="row g-4">
    <div
      v-for="review in reviews"
      :key="review.id"
      class="col-md-4"
    >
      <div class="card tripatropa-card h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between mb-1">
            <span class="fw-semibold">{{ review.author }}</span>
            <span class="text-warning">
              <template v-for="n in 5" :key="n">
                <i
                  :class="n <= Number(review.rating) ? 'bi bi-star-fill' : 'bi bi-star'"
                ></i>
              </template>
            </span>
          </div>
          <p class="text-muted-sm mb-2">{{ review.text }}</p>
          <button
            v-if="canDelete(review)"
            type="button"
            class="btn btn-outline-danger btn-sm"
            @click="$emit('delete', review)"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
    <div v-if="!reviews.length" class="col-12">
      <p class="text-muted-sm mb-0">Отзывов пока нет.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from "../composables/useAuth.js";

const props = defineProps({
  reviews: { type: Array, required: true }
});
defineEmits(["delete"]);

const { currentUser } = useAuth();

function canDelete(review) {
  if (!currentUser.value) return false;
  if (review.authorId == null) return false;
  return String(review.authorId) === String(currentUser.value.id);
}
</script>
