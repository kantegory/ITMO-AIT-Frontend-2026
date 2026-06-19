import { initTheme } from './theme.js';
import { initSession } from './session.js';
import { initFilters } from './filters.js';
import { initModal } from './modal.js';
import { initAuth } from './auth.js';
import { initDashboard } from './dashboard.js';

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initSession();
    initFilters();
    initModal();
    initAuth();
    initDashboard();
    
    console.log("App initialized successfully!");
});