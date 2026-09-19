class AuthApi {
  constructor(instance) {
    this.API = instance;
  }

  findByEmail(email) {
    return this.API.get("/users", { params: { email } });
  }

  register(data) {
    return this.API.post("/users", data);
  }
}

export default AuthApi;
