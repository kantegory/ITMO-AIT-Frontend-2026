import { resolve } from "node:path";
import { defineConfig } from "vite";

const pages = [
    "dashboard",
    "dataset-details",
    "explore",
    "login",
    "model-details",
    "my-datasets",
    "my-models",
    "my-subscriptions",
    "register",
    "settings",
    "subscription-details"
];

export default defineConfig({
    base: "./",
    build: {
        rollupOptions: {
            input: Object.fromEntries(pages.map(page => [page, resolve(__dirname, `${page}.html`)]))
        }
    }
});
