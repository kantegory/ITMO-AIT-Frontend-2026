class DestinationsApi {
  constructor(instance) {
    this.API = instance;
  }

  getAll() {
    return this.API.get("/destinations");
  }

  create(data) {
    return this.API.post("/destinations", data);
  }
}

export default DestinationsApi;
