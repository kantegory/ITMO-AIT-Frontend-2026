import { initFilters } from './filters.js';
import { initModal } from './modal.js';
import { initAuth } from './auth.js';

document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    initModal();
    initAuth();
    console.log("App initialized successfully!");
});