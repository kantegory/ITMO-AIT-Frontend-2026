import { initSession } from './session.js';
import { initFilters } from './filters.js';
import { initModal } from './modal.js';
import { initAuth } from './auth.js';
import { initDashboard } from './dashboard.js';

document.addEventListener("DOMContentLoaded", () => {
    initSession();
    initFilters();
    initModal();
    initAuth();
    initDashboard();
    
    console.log("App initialized successfully!");
});