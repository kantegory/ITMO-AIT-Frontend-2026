import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" }
});

export default api;

export const usersApi = {
  findByEmail(email) {
    return api.get("/users", { params: { email } }).then((r) => r.data);
  },
  create(user) {
    return api.post("/users", user).then((r) => r.data);
  }
};

export const destinationsApi = {
  list() {
    return api.get("/destinations").then((r) => r.data);
  },
  get(id) {
    return api.get(`/destinations/${id}`).then((r) => r.data);
  }
};

export const reviewsApi = {
  listByDestination(destinationId) {
    return api
      .get("/reviews", { params: { destinationId } })
      .then((r) => r.data);
  },
  create(review) {
    return api.post("/reviews", review).then((r) => r.data);
  },
  remove(id) {
    return api.delete(`/reviews/${id}`).then((r) => r.data);
  }
};

export const savedApi = {
  listByUser(userId) {
    return api
      .get("/savedDestinations", { params: { userId } })
      .then((r) => r.data);
  },
  add(userId, destinationId) {
    return api
      .post("/savedDestinations", { userId, destinationId })
      .then((r) => r.data);
  },
  remove(id) {
    return api.delete(`/savedDestinations/${id}`).then((r) => r.data);
  }
};

export const notesApi = {
  listByUser(userId) {
    return api.get("/notes", { params: { userId } }).then((r) => r.data);
  },
  create(note) {
    return api.post("/notes", note).then((r) => r.data);
  },
  remove(id) {
    return api.delete(`/notes/${id}`).then((r) => r.data);
  }
};

export const collabApi = {
  listNotes(tripId = "default") {
    return api.get("/collabNotes", { params: { tripId } }).then((r) => r.data);
  },
  createNote(note) {
    return api.post("/collabNotes", note).then((r) => r.data);
  },
  removeNote(id) {
    return api.delete(`/collabNotes/${id}`).then((r) => r.data);
  },
  listActivities(tripId = "default") {
    return api
      .get("/collabActivities", { params: { tripId } })
      .then((r) => r.data);
  }
};

export const tripMembersApi = {
  listByTrip(tripId = "default") {
    return api.get("/tripMembers", { params: { tripId } }).then((r) => r.data);
  },
  add(member) {
    return api.post("/tripMembers", member).then((r) => r.data);
  },
  remove(id) {
    return api.delete(`/tripMembers/${id}`).then((r) => r.data);
  }
};
