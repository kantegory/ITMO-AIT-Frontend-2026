import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import App from "./App.vue";
import router from "./router.js";
import { useTheme } from "./composables/useTheme.js";

const { applyTheme } = useTheme();
applyTheme();

createApp(App).use(router).mount("#app");
