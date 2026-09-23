<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import AppModal from "@/components/AppModal.vue";
import BuyTicketModal from "@/components/BuyTicketModal.vue";
import api from "@/api/instance.js";
import { useModal } from "@/composables/useModal";
import { useAuth } from "@/composables/useAuth";

// STATE
const currentEvent = ref(null);
const reviews = ref([]);
const reviewInput = ref("");

const ticketCategory = ref(0);
const ticketPrice = ref(0);

const showBuyModal = ref(false);

const {  user,
    isAuth,
    organizer,
    isOrganizer} = useAuth();


const route = useRoute();
const eventId = route.params.id;


async function loadEvent() {
  try {
    const response = await api.get(`/events/${eventId}`);
    currentEvent.value = response.data;

    if (currentEvent.value.categories?.length) {
      ticketPrice.value = currentEvent.value.categories[0].price;
    }

    await loadReviews();
  } catch (e) {
    console.error(e);
    showModal("Error", "Failed to load event", "danger");
  }
}

async function loadReviews() {
  try {
    const response = await api.get(`/reviews?eventId=${eventId}`);
    reviews.value = response.data;
  } catch (e) {
    console.error(e);
  }
}


async function submitReview() {
  if (isOrganizer.value) {
    return showModal("Info", "Organizers cannot leave reviews", "info");
  }

  const text = reviewInput.value.trim();
  if (!text) return showModal("Info", "Enter review text", "info");

  const user = JSON.parse(localStorage.getItem("user")) || { email: "Guest" };

  try {
    await api.post("/reviews", {
      eventId: Number(eventId),
      user: user.email,
      text
    });
    reviewInput.value = "";
    loadReviews();
  } catch (e) {
    console.error(e);
    showModal("Error", "Failed to submit review", "danger");
  }
}

function openBuyModal() {
  if (localStorage.getItem("organizerAuth") === "true") {
    return showModal("Info", "Organizers cannot buy tickets", "info");
  }
  showBuyModal.value = true;
}

function onCategoryChange() {
  const selected = currentEvent.value.categories[ticketCategory.value];
  ticketPrice.value = selected.price;
}

async function handleBuy() {
  if (localStorage.getItem("auth") !== "true") {
    showModal("Authorization required", "Please login to buy tickets", "warning");
    setTimeout(() => (window.location.href = "/login"), 2500);
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const selected = currentEvent.value.categories[ticketCategory.value];

  try {
    await api.post("/tickets", {
      eventId: Number(currentEvent.value.id),
      event: currentEvent.value.name,
      date: currentEvent.value.date,
      owner: user.email,
      category: selected.name,
      price: selected.price
    });

    showBuyModal.value = false;
    showModal(
      "Success",
      `Ticket purchased!\nCategory: ${selected.name}, $${selected.price}`,
      "success"
    );
  } catch (e) {
    console.error(e);
    showModal("Error", "Failed to buy ticket", "danger");
  }
}

const {
  modal,
  showModal
} = useModal();
// lifecycle
onMounted(() => {
  loadEvent();
});
</script>

<template>
  <div class="d-flex flex-column min-vh-100">

    <main class="flex-grow-1">
      <div class="container my-5">
        <div class="row g-4">

          <!-- LEFT: Event image + Buy button -->
          <div class="col-md-5">
            <div class="card shadow-sm">
              <img
                :src="currentEvent?.image"
                class="card-img-top"
                style="height: 400px; object-fit: cover;"
              >
              <div class="card-body">
                <span class="badge bg-secondary mb-2">{{ currentEvent?.type }}</span>
                <h3 class="card-title">{{ currentEvent?.name }}</h3>
                <p class="text-muted">{{ new Date(currentEvent?.date).toLocaleDateString() }} · {{ currentEvent?.city }}</p>
                <p>{{ currentEvent?.venue }}</p>

                <button class="btn btn-warning w-100" @click="openBuyModal">
                  <svg class="icon icon-scaling" width="24" height="24">
                    <use xlink:href="/sprite.svg#icon-buy"></use>
                  </svg>
                  Buy ticket
                </button>
              </div>
            </div>
          </div>

          <!-- RIGHT: Description + Seatmap + Reviews -->
          <div class="col-md-7">
            <h4>Description</h4>
            <p>{{ currentEvent?.description }}</p>

            <h4 class="mt-4">Seat Map</h4>
            <img :src="currentEvent?.seatmap" class="img-fluid mb-4" style="max-height:300px; object-fit:contain">

            <h4>Reviews</h4>
            <div id="reviewsContainer" class="mb-3">
              <template v-if="reviews.length === 0">
                <p class="text-muted">No reviews yet.</p>
              </template>
              <div v-for="r in reviews" :key="r.id" class="card mb-2 p-2">
                <strong>{{ r.user }}</strong>: {{ r.text }}
              </div>
            </div>

            <div class="mb-3">
              <label for="reviewInput" class="form-label">Leave a review</label>
              <textarea id="reviewInput" class="form-control" rows="2" v-model="reviewInput"></textarea>
              <button class="btn btn-primary mt-2" @click="submitReview">Submit</button>
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- MODALS -->
    <AppModal
      :title="modal.title"
      :message="modal.message"
      :type="modal.type"
      :show="modal.show"
      @close="modal.show = false"
    />

    <BuyTicketModal
      :event="currentEvent"
      :show="showBuyModal"
      v-model:category="ticketCategory"
      v-model:price="ticketPrice"
      @close="showBuyModal = false"
      @buy="handleBuy"
    />
  </div>
</template>