class TripsApi {
  constructor(instance) {
    this.API = instance;
  }

  getTrip(id) {
    return this.API.get(`/trips/${id}`);
  }

  getNotes(tripId) {
    return this.API.get("/notes", { params: { tripId: Number(tripId) } });
  }

  createNote(data) {
    return this.API.post("/notes", data);
  }

  deleteNote(id) {
    return this.API.delete(`/notes/${id}`);
  }
}

export default TripsApi;
