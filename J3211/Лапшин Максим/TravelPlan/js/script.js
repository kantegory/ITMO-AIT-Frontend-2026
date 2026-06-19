﻿const API_BASE = 'http://localhost:3001';

async function fetchTours(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.type && filters.type !== 'all') {
    params.append('type', filters.type);
  }
  if (filters.minPrice !== undefined) {
    params.append('price_gte', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    params.append('price_lte', filters.maxPrice);
  }
  if (filters.duration) {
    params.append('duration', filters.duration);
  }
  if (filters.search) {
    params.append('title_like', filters.search);
  }
  
  try {
    const response = await fetch(`${API_BASE}/tours?${params}`);
    if (!response.ok) throw new Error('Ошибка загрузки туров');
    return await response.json();
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
}

async function fetchFilters() {
  try {
    const response = await fetch(`${API_BASE}/filters`);
    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки фильтров:', error);
    return { types: [], priceRanges: [], durations: [] };
  }
}

function renderTours(tours, containerId = 'tours-container') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (tours.length === 0) {
    container.innerHTML = '<p class="text-center text-muted">Туры не найдены</p>';
    return;
  }
  
  const layout = [
    { count: 1, colClass: 'col-12', imgHeight: '300px' },
    { count: 3, colClass: 'col-md-4', imgHeight: '200px' },
    { count: 4, colClass: 'col-md-3', imgHeight: '150px' }
  ];
  
  let index = 0;
  
  layout.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row g-4 mb-4';
    
    for (let i = 0; i < row.count && index < tours.length; i++, index++) {
      const tour = tours[index];
      const col = document.createElement('div');
      col.className = row.colClass;
      
      const badgeClass = {
        'city': 'bg-primary',
        'nature': 'bg-success',
        'culture': 'bg-info text-dark',
        'beach': 'bg-warning text-dark'
      }[tour.type] || 'bg-secondary';
      
      col.innerHTML = `
        <div class="card h-100 shadow-sm hover-shadow">
          <img src="${tour.image}" class="card-img-top" 
               alt="${tour.title}" style="height: ${row.imgHeight}; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${tour.title}</h5>
            <p class="card-text text-muted small flex-grow-1">${tour.description}</p>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <span class="badge ${badgeClass}">${tour.type}</span>
              <small class="text-muted fw-bold">$${tour.price} / ${tour.duration} дн.</small>
            </div>
          </div>
        </div>
      `;
      rowDiv.appendChild(col);
    }
    
    if (rowDiv.children.length > 0) {
      container.appendChild(rowDiv);
    }
  });
}

function initSearchForm() {
  const form = document.getElementById('search-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const filters = {
      type: form.querySelector('[name="type"]')?.value || 'all',
      search: form.querySelector('[name="search"]')?.value || '',
      duration: form.querySelector('[name="duration"]')?.value || ''
    };
    
    const budget = form.querySelector('[name="budget"]')?.value;
    if (budget === 'low') {
      filters.minPrice = 0;
      filters.maxPrice = 1000;
    } else if (budget === 'medium') {
      filters.minPrice = 1000;
      filters.maxPrice = 2500;
    } else if (budget === 'high') {
      filters.minPrice = 2500;
      filters.maxPrice = 99999;
    }
    
    const container = document.getElementById('tours-container');
    if (container) {
      container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';
    }
    
    const tours = await fetchTours(filters);
    renderTours(tours);
  });
}

async function initFilters() {
  const filters = await fetchFilters();
  
  const typeSelect = document.querySelector('[name="type"]');
  if (typeSelect && filters.types?.length) {
    filters.types.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.name;
      typeSelect.appendChild(option);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSearchForm();
  initFilters();
  
  if (document.getElementById('tours-container')) {
    fetchTours().then(tours => renderTours(tours));
  }
});

window.fetchTours = fetchTours;
window.renderTours = renderTours;