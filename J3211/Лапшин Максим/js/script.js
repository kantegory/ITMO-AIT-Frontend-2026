﻿const API_BASE = 'http://localhost:3001';

function getSavedTheme() {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch (e) {
    return 'light';
  }
}

function initTheme() {
  const savedTheme = getSavedTheme();
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  try {
    localStorage.setItem('theme', newTheme);
  } catch (e) {
    console.warn('localStorage недоступен');
  }
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  const iconUse = themeToggle.querySelector('use');
  if (iconUse) {
    iconUse.setAttribute('href', theme === 'dark' ? '#sun' : '#moon');
  }
}

window.addEventListener('storage', function(e) {
  if (e.key === 'theme') {
    const newTheme = e.newValue || 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcon(newTheme);
  }
});

async function fetchTours(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.minPrice !== undefined) params.append('price_gte', filters.minPrice);
  if (filters.maxPrice !== undefined) params.append('price_lte', filters.maxPrice);
  if (filters.duration) params.append('duration', filters.duration);
  if (filters.search) params.append('title_like', filters.search);
  
  try {
    const response = await fetch(API_BASE + '/tours?' + params);
    if (!response.ok) throw new Error('Ошибка загрузки туров');
    return await response.json();
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
}

async function fetchFilters() {
  try {
    const response = await fetch(API_BASE + '/filters');
    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки фильтров:', error);
    return { types: [], priceRanges: [], durations: [] };
  }
}

function renderTours(tours, containerId) {
  containerId = containerId || 'tours-container';
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (tours.length === 0) {
    container.innerHTML = '<p class="text-center text-muted" role="status">Туры не найдены</p>';
    return;
  }
  
  const layout = [
    { count: 1, colClass: 'col-12', imgHeight: '300px' },
    { count: 3, colClass: 'col-md-4', imgHeight: '200px' },
    { count: 4, colClass: 'col-md-3', imgHeight: '150px' }
  ];
  
  let index = 0;
  
  layout.forEach(function(row) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row g-4 mb-4';
    
    for (let i = 0; i < row.count && index < tours.length; i++, index++) {
      const tour = tours[index];
      const col = document.createElement('div');
      col.className = row.colClass;
      
      let badgeClass = 'bg-secondary';
      if (tour.type === 'city') badgeClass = 'bg-primary';
      else if (tour.type === 'nature') badgeClass = 'bg-success';
      else if (tour.type === 'culture') badgeClass = 'bg-info text-dark';
      else if (tour.type === 'beach') badgeClass = 'bg-warning text-dark';
      
      let imageUrl = tour.image;
      if (tour.image && tour.image.indexOf('http') !== 0) {
        imageUrl = API_BASE + tour.image;
      }
      
      col.innerHTML = 
        '<div class="card h-100 shadow-sm hover-shadow">' +
          '<img src="' + imageUrl + '" class="card-img-top" alt="' + tour.title + '" style="height: ' + row.imgHeight + '; object-fit: cover;">' +
          '<div class="card-body d-flex flex-column">' +
            '<h5 class="card-title">' + tour.title + '</h5>' +
            '<p class="card-text text-muted small flex-grow-1">' + tour.description + '</p>' +
            '<div class="d-flex justify-content-between align-items-center mt-2">' +
              '<span class="badge ' + badgeClass + '">' + tour.type + '</span>' +
              '<small class="text-muted fw-bold">$' + tour.price + ' / ' + tour.duration + ' дн.</small>' +
            '</div>' +
          '</div>' +
        '</div>';
      rowDiv.appendChild(col);
    }
    
    if (rowDiv.children.length > 0) container.appendChild(rowDiv);
  });
}

function initSearchForm() {
  const form = document.getElementById('search-form');
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    let filters = {
      type: form.querySelector('[name="type"]')?.value || 'all',
      search: form.querySelector('[name="search"]')?.value || '',
      duration: form.querySelector('[name="duration"]')?.value || ''
    };
    
    let budget = form.querySelector('[name="budget"]')?.value;
    if (budget === 'low') { filters.minPrice = 0; filters.maxPrice = 1000; }
    else if (budget === 'medium') { filters.minPrice = 1000; filters.maxPrice = 2500; }
    else if (budget === 'high') { filters.minPrice = 2500; filters.maxPrice = 99999; }
    
    const container = document.getElementById('tours-container');
    if (container) {
      container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>';
    }
    
    let tours = await fetchTours(filters);
    renderTours(tours);
  });
}

async function initFilters() {
  let filters = await fetchFilters();
  let typeSelect = document.querySelector('[name="type"]');
  if (typeSelect && filters.types?.length) {
    filters.types.forEach(function(type) {
      let option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.name;
      typeSelect.appendChild(option);
    });
  }
}

function initUserProfile() {
  let nameElement = document.getElementById('user-name');
  if (!nameElement) {
    nameElement = document.querySelector('.card-body .h4'); 
  }

  if (nameElement) {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      nameElement.textContent = savedName;
    }
  }
}

function initSaveNotesButton() {
  const saveBtn = document.getElementById('save-notes-btn') || document.querySelector('button.btn-primary');
  const notesArea = document.getElementById('travel-notes');

  if (notesArea) {
    const savedNotes = localStorage.getItem('travelNotes');
    if (savedNotes) notesArea.value = savedNotes;
  }

  if (saveBtn && notesArea) {
    saveBtn.addEventListener('click', function() {
      const notes = notesArea.value.trim();
      if (notes) {
        localStorage.setItem('travelNotes', notes);
        
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✓ Сохранено';
        saveBtn.classList.add('btn-success');
        saveBtn.classList.remove('btn-primary');
        
        setTimeout(() => {
          saveBtn.textContent = originalText;
          saveBtn.classList.remove('btn-success');
          saveBtn.classList.add('btn-primary');
        }, 1500);
      } else {
        notesArea.focus();
      }
    });
  }
}

function initRegisterForm() {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    
    if (nameInput && nameInput.value.trim()) {
      localStorage.setItem('userName', nameInput.value.trim());
      if (emailInput) localStorage.setItem('userEmail', emailInput.value.trim());

      window.location.href = 'dashboard.html';
    } else {
      alert('Пожалуйста, введите ваше имя');
    }
  });
}

function initLoginForm() {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    window.location.href = 'dashboard.html';
  });
}

function initLogoutButton() {
  const logoutBtn = document.querySelector('.btn-outline-danger');
  if (logoutBtn && (logoutBtn.textContent.trim() === 'Выйти' || logoutBtn.textContent.trim() === 'Выход')) {
    logoutBtn.addEventListener('click', function() {
      if (confirm('Вы действительно хотите выйти?')) {
        localStorage.removeItem('userName');
        window.location.href = 'login.html';
      }
    });
  }
}

function initSidebar() {
  const toggleBtn = document.getElementById('toggle-sidebar');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('show');
      if (overlay) overlay.classList.toggle('show');
      toggleBtn.setAttribute('aria-expanded', sidebar.classList.contains('show'));
    });
  }
  
  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initSidebar();
  initLogoutButton();

  if (document.getElementById('search-form')) {
    initSearchForm();
    initFilters();
    fetchTours().then(tours => renderTours(tours));
  }
  
  if (document.getElementById('travel-notes')) {
    initUserProfile();
    initSaveNotesButton();
  }
  
  if (document.querySelector('input[type="text"]') && !document.getElementById('search-form')) {
    initRegisterForm();
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
});

window.fetchTours = fetchTours;
window.renderTours = renderTours;
window.toggleTheme = toggleTheme;