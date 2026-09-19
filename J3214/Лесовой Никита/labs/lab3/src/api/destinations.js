class DestinationsApi {
  constructor(instance) {
    this.API = instance;
  }

  getAll() {
    return this.API.get("/destinations");
  }

  getById(id) {
    return this.API.get(`/destinations/${id}`);
  }

  getSavedRoutes(userId) {
    return this.API.get("/savedRoutes", { params: { userId: Number(userId) } });
  }

  saveRoute(data) {
    return this.API.post("/savedRoutes", data);
  }
}

export default DestinationsApi;
