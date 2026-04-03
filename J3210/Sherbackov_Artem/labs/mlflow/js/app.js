import { logout } from './authentication.js';
import { initAuthPage } from './pages/auth.js';
import { initDashboardPage } from './pages/dashboard.js';
import { initExperimentsListPage } from './pages/experiments_list.js';
import { initExperimentEntityPage } from './pages/experiment_entity.js';
import { initModelsListPage } from './pages/models_list.js';
import { initModelEntityPage } from './pages/model_entity.js';
import { initRunEntityPage } from './pages/run_entity.js';

document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        document.querySelectorAll('strong').forEach(el => {
            if (el.textContent === 'User') el.textContent = userData.username;
        });
    }

    document.querySelectorAll('.text-danger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.textContent.includes('Sign out')) {
                e.preventDefault();
                logout();
            }
        });
    });

    if (document.querySelector('#loginModal')) {
        initAuthPage();
    }

    if (document.getElementById('experimentList')) {
        initDashboardPage();
    }

    if (document.getElementById('experimentsTableBody')) {
        initExperimentsListPage();
    }

    if (document.getElementById('experimentTitle')) {
        initExperimentEntityPage();
    }

    if (document.getElementById('modelsTableBody')) {
        initModelsListPage();
    }

    if (document.getElementById('modelNameDisplay')) {
        initModelEntityPage();
    }

    if (document.getElementById('runName')) {
        initRunEntityPage();
    }
});