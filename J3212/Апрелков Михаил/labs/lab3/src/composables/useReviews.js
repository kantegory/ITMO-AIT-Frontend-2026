import { ref } from "vue";
import { reviewsApi } from "../api/api.js";

export function useReviews() {
  const reviews = ref([]);

  async function load(destinationId) {
    try {
      reviews.value = await reviewsApi.listByDestination(destinationId);
    } catch (e) {
      reviews.value = [];
    }
  }

  async function add(payload) {
    const created = await reviewsApi.create(payload);
    reviews.value = [created, ...reviews.value];
    return created;
  }

  async function remove(id) {
    await reviewsApi.remove(id);
    reviews.value = reviews.value.filter((r) => r.id !== id);
  }

  return { reviews, load, add, remove };
}
