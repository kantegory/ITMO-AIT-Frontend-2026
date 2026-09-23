<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from "vue";

const props = defineProps({
  event: Object,
  show: Boolean
});

const emit = defineEmits(["close", "buy"]);

const selectedCategory = ref(0);
const price = ref(0);

const modalRef = ref(null);
let modalInstance = null;

onMounted(() => {
  modalInstance = new bootstrap.Modal(modalRef.value);
});

watch(() => props.show, (val) => {
  if (val) modalInstance.show();
  else modalInstance.hide();
});

watch(() => selectedCategory.value, (val) => {
  if (props.event?.categories?.length)
    price.value = props.event.categories[val].price;
});

function confirmBuy() {
  const category = props.event.categories[selectedCategory.value];
  emit("buy", category);
  emit("close");
}
</script>

<template>
  <div ref="modalRef" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Select Ticket Category</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        <div class="modal-body">
          <select class="form-select mb-3" v-model="selectedCategory">
            <option
              v-for="(cat, i) in props.event?.categories"
              :key="i"
              :value="i"
            >
              {{ cat.name }} - ${{ cat.price }}
            </option>
          </select>
          <p class="fw-bold">Price: ${{ price }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="emit('close')">Cancel</button>
          <button class="btn btn-warning" @click="confirmBuy">Buy</button>
        </div>
      </div>
    </div>
  </div>
</template>