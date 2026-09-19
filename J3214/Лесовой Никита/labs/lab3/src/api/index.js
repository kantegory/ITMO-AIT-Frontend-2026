import instance from "./instance";
import AuthApi from "./auth";
import DestinationsApi from "./destinations";
import TripsApi from "./trips";
import weatherApi from "./weather";

const authApi = new AuthApi(instance);
const destinationsApi = new DestinationsApi(instance);
const tripsApi = new TripsApi(instance);

export { authApi, destinationsApi, tripsApi, weatherApi };
