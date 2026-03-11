import { initFilters } from './filters.js';
import { initModal } from './modal.js';
import { initAuth } from './auth.js';
import { initDashboard } from './dashboard.js'

document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    initModal();
    initAuth();
    initDashboard();
    console.log("App initialized successfully!");
});