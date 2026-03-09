import { initFilters } from './filters.js';
import { initModal } from './modal.js';

document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    initModal();
    console.log("App initialized successfully!");
});