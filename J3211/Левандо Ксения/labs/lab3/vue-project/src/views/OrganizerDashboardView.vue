<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import AppModal from "@/components/AppModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/instance";

import { useAuth } from "@/composables/useAuth";
import { useModal } from "@/composables/useModal";

const router = useRouter();

// auth through composable
const { organizer, isOrganizer } = useAuth();

if (!isOrganizer.value) {
  router.push("/organizer-login");
}

// modals through composable
const {
  modal,
  confirmModal,
  showModal,
  showConfirmModal,
  handleConfirm
} = useModal();

// state
const events = ref([]);
const myEvents = ref([]);

const form = ref({
  name: "",
  date: "",
  city: "",
  venue: "",
  type: "",
  image: "",
  description: "",
  seatmap: "",
});

const categories = ref([{ name: "", price: "" }]);

// load events
const loadEvents = async () => {
  const res = await api.get("/events");
  events.value = res.data;

  myEvents.value = events.value.filter(
    (ev) => ev.organizer === organizer.value.email
  );
};

onMounted(loadEvents);

const addCategory = () => categories.value.push({ name: "", price: "" });

const removeCategory = (index) => {
  categories.value.splice(index, 1);
};

// create event
const createEvent = async () => {
  if (!form.value.name || !form.value.date || !form.value.city || !form.value.venue || !form.value.type) {
    return showModal("Error", "Fill all required fields", "error");
  }

  const validCategories = categories.value.filter(c => c.name && c.price);

  if (!validCategories.length) {
    return showModal("Warning", "Add at least one category", "warning");
  }

  const exists = events.value.find(ev =>
    ev.name === form.value.name &&
    ev.date === form.value.date &&
    ev.organizer === organizer.value.email
  );

  if (exists) {
    return showModal("Warning", "Event already exists", "warning");
  }

  const eventImage = form.value.image || "/assets/default_event_img.webp";

  await api.post("/events", {
    id: Date.now(),
    ...form.value,
    image: eventImage,
    categories: validCategories.map(c => ({
      name: c.name,
      price: Number(c.price)
    })),
    organizer: organizer.value.email
  });

  showModal("Success", "Event created!", "success");

  form.value = {
    name: "",
    date: "",
    city: "",
    venue: "",
    type: "",
    image: "",
    description: "",
    seatmap: "",
  };

  categories.value = [{ name: "", price: "" }];

  loadEvents();
};

const deleteEvent = (id) => {
  showConfirmModal("Delete event", "Are you sure?", async () => {
    await api.delete(`/events/${id}`);
    loadEvents();
  });
};

const viewSales = async (eventId) => {
  const res = await api.get(`/tickets?eventId=${eventId}`);
  const tickets = res.data;

  if (!tickets.length) {
    return showModal("Info", "No tickets sold", "info");
  }

  const rows = tickets.map(t => `
    <tr>
      <td>${t.owner}</td>
      <td>${t.category}</td>
    </tr>
  `).join("");

  showModal(
    "Sold tickets",
    `<table class="table">
      <thead><tr><th>User</th><th>Category</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`,
    "info"
  );
};
</script>

<template>
  <div class="container my-5">
    <h1 class="mb-4" >Organizer Dashboard</h1>
    <!-- create new event -->
    <h3>Create New Event</h3>
        <form @submit.prevent="createEvent">    
            <div class="row g-2">
                <div class="col-md-4">
                    <input v-model="form.name" placeholder="Name" class="form-control mb-2" />
                </div>
                <div class="col-md-4">
                    <input v-model="form.date" type="date" class="form-control mb-2" :min="new Date().toISOString().split('T')[0]" />
                </div>
                <div class="col-md-4">
                    <input v-model="form.city" placeholder="City" class="form-control mb-2" />
                </div>
                <div class="col-md-4">
                    <input v-model="form.venue" placeholder="Venue" class="form-control mb-2" />
                </div>
            <div class="col-md-4">
                <select v-model="form.type" class="form-select mb-2">
                    <option value="">Type</option>
                <option value="Concert">Concert</option>
                <option value="Festival">Festival</option>
                <option value="Theatre">Theatre</option>
                <option value="Sport">Sport</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Other">Other</option>
                </select>
            </div>
            <div class="col-md-4">
                <input v-model="form.image" class="form-control" placeholder="Image URL">
            </div>
            <div class="mt-3">
                <textarea v-model="form.description" class="form-control mb-2" placeholder="Description"></textarea>
            </div>
            <div class="mt-3">
                <input v-model="form.seatmap" class="form-control" placeholder="Seatmap image">
            </div>
            <hr>
            <h5>Ticket Categories</h5>
            <div v-for="(cat, i) in categories" :key="i" class="d-flex mb-2">
                <input v-model="cat.name" placeholder="Name" class="form-control me-2" />
                <input v-model="cat.price" type="number" placeholder="Price" class="form-control me-2" />
                <button type="button" class="btn btn-danger" @click="removeCategory(i)">X</button>
            </div>
            <button type="button" class="btn btn-outline-secondary btn-sm mt-2" @click="addCategory">
                + Add Category
            </button>
      <br>
    </div>
    <button class="btn btn-success mt-3">Create Event</button>
  </form>

    <!-- EVENTS -->
    <h3 class="mt-5">My Events</h3>
    <div class="row">
      <div v-for="ev in myEvents" :key="ev.id" class="col-md-4">
        <div class="card mb-3">
          <img :src="ev.image" class="card-img-top" />
          <div class="card-body">
            <h5>{{ ev.name }}</h5>
            <p>{{ ev.city }} · {{ ev.date }}</p>

            <button class="btn btn-primary me-2" @click="viewSales(ev.id)">
              Sales
            </button>

            <button class="btn btn-danger" @click="deleteEvent(ev.id)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AppModal
  :show="modal.show"
  :title="modal.title"
  :message="modal.message"
  :type="modal.type"
  @close="modal.show = false"
/>

<ConfirmModal
  :show="confirmModal.show"
  :title="confirmModal.title"
  :message="confirmModal.message"
  @confirm="handleConfirm"
  @close="confirmModal.show = false"
/>
</template>