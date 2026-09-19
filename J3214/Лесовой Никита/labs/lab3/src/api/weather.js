import axios from "axios";

const weatherApi = {
  getForecast(latitude, longitude) {
    return axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude,
        longitude,
        current: "temperature_2m,weather_code,wind_speed_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min",
        forecast_days: 4,
        timezone: "auto"
      },
      timeout: 8000
    });
  }
};

export default weatherApi;
