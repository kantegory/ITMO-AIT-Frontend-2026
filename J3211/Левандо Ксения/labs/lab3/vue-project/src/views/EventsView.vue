<script setup>
import { ref, onMounted, watch } from "vue";
import Navbar from "@/components/Navbar.vue";
import api from "@/api/instance";
import Footer from "@/components/Footer.vue";

const events = ref([]);

const type = ref("All");
const city = ref("");
const date = ref("");

// loading with filters through API
async function loadEvents() {
  try {
    const params = {};

    if (type.value && type.value !== "All") {
      params.type = type.value;
    }

    if (date.value) {
      params.date = date.value;
    }

    const response = await api.get("/events", { params });
    let data = response.data;

    if (city.value.trim()) {
      data = data.filter(e =>
        e.city.toLowerCase().includes(city.value.toLowerCase().trim())
      );
    }

    events.value = data;

  } catch (error) {
    console.error("Error loading events:", error);
  }
}
// first load
onMounted(loadEvents);

// auto-filter by changing
watch([type, city, date], loadEvents);

// icons
function getEventTypeIcon(eventType) {
  const icons = {
    Sport: "icon-sport",
    Concert: "icon-music",
    Theatre: "icon-theater",
    Exhibition: "icon-gallery",
    Festival: "icon-festival",
  };
  return icons[eventType] || "icon-default";
}
</script>

<template>
  <div>
    <!-- CONTENT -->
    <main class="container my-5">
      <h1 class="mb-4">Events</h1>

      <!-- FILTERS -->
      <div class="row mb-4">
        <div class="col-md-4">
          <select v-model="type" class="form-select">
            <option value="All">All types</option>
            <option value="Concert">Concert</option>
            <option value="Festival">Festival</option>
            <option value="Theatre">Theatre</option>
            <option value="Sport">Sport</option>
            <option value="Exhibition">Exhibition</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="col-md-4">
          <input v-model="date" type="date" class="form-control">
        </div>

        <div class="col-md-4">
          <input v-model="city" type="text" class="form-control" placeholder="City">
        </div>
      </div>

      <!-- EVENTS -->
      <div class="row g-4">

        <div v-if="events.length === 0">
          <p class="fw-bold">No matching events found</p>
        </div>

        <div v-for="event in events" :key="event.id" class="col-md-4">
          <div class="card h-100 shadow-sm">

            <img
              :src="event.image"
              class="card-img-top"
              :alt="`${event.name} at ${event.venue}`"
            >

            <div class="card-body">

              <span class="badge bg-secondary mb-2">
                <svg class="icon" width="16" height="16">
                  <use :xlink:href="`/sprite.svg#${getEventTypeIcon(event.type)}`"></use>
                </svg>
                {{ event.type }}
              </span>

              <h5 class="card-title">{{ event.name }}</h5>

              <p class="text-muted">
                {{ event.city }} · {{ event.venue }}
              </p>

              <p class="text-muted">
                {{ new Date(event.date).toLocaleDateString() }}
              </p>

              <router-link
                :to="`/event/${event.id}`"
                class="btn btn-outline-primary"
              >
                <svg class="icon" width="20" height="20">
                  <use xlink:href="/sprite.svg#icon-eye"></use>
                </svg>
                View
              </router-link>

            </div>
          </div>
        </div>

      </div>
    </main>

  </div>
</template>