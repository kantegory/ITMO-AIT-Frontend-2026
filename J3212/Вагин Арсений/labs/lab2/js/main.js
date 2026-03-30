// Лабораторная 1

document.addEventListener('DOMContentLoaded', function() {
    
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {

            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            this.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    }
});

function openProductModal(title, code, price) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalCode').innerText = code;
    document.getElementById('modalPrice').innerText = price;

    var myModal = new bootstrap.Modal(document.getElementById('productModal'));
    myModal.show();
}

const filterForm = document.getElementById('filterForm');
if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        applyFilters();
    });
}

// Логика фильтрации и поиска
async function applyFilters() {
    const btn = document.querySelector('#filterForm button');
    const originalText = btn.innerText;
    
    btn.innerText = 'Applying...';
    btn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/products`);
        let products = await response.json();

        const searchInput = document.getElementById('searchInput');
        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        const collectionSelect = document.querySelector('#filterForm select');
        const selectedCollection = collectionSelect ? collectionSelect.value : 'all';

        const catJackets = document.getElementById('cat1') ? document.getElementById('cat1').checked : false;
        const catShirts = document.getElementById('cat2') ? document.getElementById('cat2').checked : false;
        const catPants = document.getElementById('cat3') ? document.getElementById('cat3').checked : false;

        if (searchText !== '') {
            products = products.filter(p => 
                p.name.toLowerCase().includes(searchText) || 
                p.article.toLowerCase().includes(searchText)
            );
        }

        if (selectedCollection !== 'all') {
            products = products.filter(p => p.collection === selectedCollection);
        }

        if (catJackets || catShirts || catPants) {
            products = products.filter(p => {
                if (catJackets && p.category === 'jackets') return true;
                if (catShirts && p.category === 'shirts') return true;
                if (catPants && p.category === 'pants') return true;
                return false;
            });
        }

        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = '<p class="text-muted text-center w-100 mt-5">По вашему запросу ничего не найдено.</p>';
        } else {
            products.forEach(product => {
                const productCard = `
                <div class="col-md-6 mb-4">
                    <article class="card product-card">
                        <div class="img-wrapper">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <button class="btn btn-outline-ca quick-view-btn" onclick="openProductModal('${product.name}', '${product.article}', '${product.price} ₽')">Быстрый просмотр</button>
                        </div>
                        <div class="card-body">
                            <p class="product-code">${product.article} | ${product.collection.toUpperCase()}</p>
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.price} ₽</p>
                        </div>
                    </article>
                </div>
                `;
                productGrid.insertAdjacentHTML('beforeend', productCard);
            });
        }

    } catch (error) {
        console.error('Ошибка при фильтрации:', error);
        alert('Не удалось применить фильтры. Проверьте сервер.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// Лабораторная 2

const API_URL = 'http://localhost:3000';

// Регистрация
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;

        try {
            const checkResponse = await fetch(`${API_URL}/users?email=${email}`);
            const existingUsers = await checkResponse.json();

            if (existingUsers.length > 0) {
                alert('Ошибка: Пользователь с таким Email уже существует!');
                return;
            }

            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const newUser = await response.json();

            localStorage.setItem('user', JSON.stringify(newUser));
            
            alert('Регистрация прошла успешно!');
            window.location.href = 'profile.html';

        } catch (error) {
            console.error('Ошибка API:', error);
            alert('Нет связи с сервером. Убедитесь, что json-server запущен!');
        }
    });
}

// Вход
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('emailInput').value.trim();
        const password = document.getElementById('passwordInput').value.trim();

        try {
            const response = await fetch(`${API_URL}/users?email=${email}`);
            const users = await response.json();

            if (users.length > 0) {
                const user = users[0];

                if (user.password === password) {
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = 'profile.html';
                } else {
                    alert('Неверный пароль!');
                }
            } else {
                alert('Пользователь с таким Email не найден!');
            }

        } catch (error) {
            console.error('Ошибка API:', error);
            alert('Нет связи с сервером. Убедитесь, что json-server запущен!');
        }
    });
}

// ЛК
const ordersContainer = document.getElementById('ordersContainer');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');

if (ordersContainer) {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
        window.location.href = 'login.html';
    } else {
        const user = JSON.parse(savedUser);
        if (userEmailDisplay) userEmailDisplay.innerText = `User: ${user.email}`;

        async function fetchUserOrders() {
            try {
                const response = await fetch(`${API_URL}/orders`);
                const allOrders = await response.json();
                const orders = allOrders.filter(o => String(o.userId) === String(user.id));

                ordersContainer.innerHTML = '';

                if (orders.length === 0) {
                    ordersContainer.innerHTML = '<p class="text-muted">У вас пока нет заказов.</p>';
                    return;
                }

                orders.forEach(order => {
                    const item = order.items[0]; 

                    const orderHTML = `
                        <div class="card rounded-0 mb-4 border-0 border-bottom pb-4" style="background: transparent;">
                            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 mb-sm-4 gap-2">
                                <span class="text-muted small">Order #${order.orderNumber} • ${order.date}</span>
                                <span class="badge rounded-0 border text-uppercase px-2 py-1" style="color: var(--text-dark); font-weight: 500; font-family: 'Inter'; letter-spacing: 0.05em;">${order.status}</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <div style="width: 80px; height: 110px; flex-shrink: 0;" class="me-3 me-sm-4 border">
                                    <img src="${item.image}" alt="${item.name}" class="w-100 h-100" style="object-fit: cover;">
                                </div>
                                <div>
                                    <p class="small text-muted mb-1">Total: ${order.total} ₽</p>
                                    <h5 class="mb-1 fs-6 fs-sm-5" style="font-family: 'Inter', sans-serif;">${item.name} (Size ${item.size})</h5>
                                    <p class="mb-0 fw-medium mt-2">${item.price} ₽</p>
                                </div>
                            </div>
                        </div>
                    `;
                    ordersContainer.insertAdjacentHTML('beforeend', orderHTML);
                });

            } catch (error) {
                console.error('Ошибка загрузки заказов:', error);
                ordersContainer.innerHTML = '<p class="text-danger">Не удалось загрузить историю заказов.</p>';
            }
        }

        fetchUserOrders();
    }
}

// Кнопка выхода
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}

// Каталог товаров
const productGrid = document.getElementById('productGrid');

if (productGrid) {
    async function fetchProducts() {
        try {
            productGrid.innerHTML = '<p class="text-muted text-center w-100 mt-5">Загрузка коллекции...</p>';
            
            const response = await fetch(`${API_URL}/products`);
            const products = await response.json();

            productGrid.innerHTML = '';

            products.forEach(product => {
                const productCard = `
                <div class="col-md-6 mb-4">
                    <article class="card product-card">
                        <div class="img-wrapper">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <button class="btn btn-outline-ca quick-view-btn" onclick="openProductModal('${product.name}', '${product.article}', '${product.price} ₽')">Быстрый просмотр</button>
                        </div>
                        <div class="card-body">
                            <p class="product-code">${product.article} | ${product.collection.toUpperCase()}</p>
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.price} ₽</p>
                        </div>
                    </article>
                </div>
                `;
                productGrid.insertAdjacentHTML('beforeend', productCard);
            });

        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            productGrid.innerHTML = '<p class="text-danger text-center w-100 mt-5">Не удалось загрузить каталог. Проверьте соединение с сервером.</p>';
        }
    }
    
    fetchProducts();
}

// Кнопка профиля фикс
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    if (link.textContent.includes('Профиль')) {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const savedUser = localStorage.getItem('user');
            
            if (savedUser) {
                window.location.href = 'profile.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }
});

// Смена темы
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});