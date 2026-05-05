document.addEventListener('DOMContentLoaded', () => {

    const coursesGrid = document.getElementById('coursesGrid');

    async function loadCourses(filters = '') {
        try {
            const url = `http://localhost:4000/courses${filters}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Сервер не отвечает');

            const courses = await response.json();
            coursesGrid.innerHTML = '';

            if (courses.length === 0) {
                coursesGrid.innerHTML = `
                    <div class="col-12 d-flex justify-content-center align-items-center" style="min-height: 200px;">
                        <h4 class="text-white-50 text-center">По вашему запросу ничего не найдено</h4>
                    </div>`;
                return;
            }

            courses.forEach(course => {
                const priceText = course.price === 0 ? 'Бесплатно' : `${course.price} ₽`;
                const priceClass = course.price === 0 ? 'text-white' : 'neon-text';
                const btnClass = course.price === 0 ? 'btn-outline-light' : 'btn-neon';
                const stars = '★'.repeat(course.rating) + '☆'.repeat(5 - course.rating);

                const cardHtml = `
                    <div class="col">
                        <div class="card course-card h-100 bg-dark text-white border-secondary rounded-4 overflow-hidden d-flex flex-column">
                            <img src="${course.image}" class="card-img-top image-placeholder" alt="Обложка курса: ${course.title}" loading="lazy">
                            <div class="card-body d-flex flex-column">
                                <h2 class="card-title h5 fw-bold mb-1">${course.title}</h2>
                                <div class="text-warning small mb-2" aria-label="Рейтинг: ${course.rating} из 5">
                                    <span aria-hidden="true">${stars}</span> <span class="text-white-50 ms-1">(${course.reviews})</span>
                                </div>
                                <p class="card-text text-white-50 small flex-grow-1">${course.desc}</p>
                                <div class="d-flex justify-content-between align-items-center mt-auto pt-3">
                                    <span class="fs-5 fw-bold ${priceClass}">${priceText}</span>
                                    <a href="course.html?id=${course.id}" class="btn btn-sm ${btnClass} rounded-pill px-3 fw-bold" aria-label="Подробнее о курсе ${course.title}">Подробнее</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                coursesGrid.innerHTML += cardHtml;
            });
        } catch (error) {
            console.error('Ошибка:', error);
            coursesGrid.innerHTML = '<div class="col-12"><p class="text-danger text-center mt-5 fs-5">Не удалось загрузить курсы. Сервер работает?</p></div>';
        }
    }

    if (coursesGrid) {
        loadCourses();

        const priceRange = document.getElementById('priceRange');
        const priceLabel = document.getElementById('priceLabel');
        if (priceRange && priceLabel) {
            priceRange.addEventListener('input', (e) => {
                priceLabel.textContent = `${e.target.value} ₽`;
            });
        }

        const applyBtn = document.getElementById('applyFiltersBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const search = document.getElementById('searchInput').value;
                const category = document.getElementById('categorySelect').value;
                const level = document.getElementById('levelSelect').value;
                const price = document.getElementById('priceRange').value;

                const params = new URLSearchParams();

                if (search) {
                    params.append('q', search);
                }
                if (category !== 'all') {
                    params.append('category', category);
                }
                if (level !== 'all') {
                    params.append('level', level);
                }

                params.append('price_lte', price);

                loadCourses(`?${params.toString()}`);
            });
        }

        const resetBtn = document.getElementById('resetFiltersBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.getElementById('searchInput').value = '';
                document.getElementById('categorySelect').value = 'all';
                document.getElementById('levelSelect').value = 'all';
                document.getElementById('priceRange').value = 10000;
                document.getElementById('priceLabel').textContent = '10 000 ₽';
                
                loadCourses();
            });
        }
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:4000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Такой email уже существует или произошла ошибка');
                }

                const result = await response.json();
                
                localStorage.setItem('accessToken', result.accessToken);
                localStorage.setItem('user', JSON.stringify(result.user));

                window.location.href = 'profile.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:4000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Неверный email или пароль');
                }

                const result = await response.json();
                
                localStorage.setItem('accessToken', result.accessToken);
                localStorage.setItem('user', JSON.stringify(result.user));

                window.location.href = 'profile.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    const navButtonsBlock = document.querySelector('.navbar-collapse .d-flex');
    const navList = document.querySelector('.navbar-nav');

    if (userJson && token) {
        const user = JSON.parse(userJson);
        const shortName = user.name.split(' ')[0];
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=a855f7&color=fff`;

        if (navButtonsBlock) {
            navButtonsBlock.innerHTML = `
                <div class="dropdown mt-3 mt-lg-0">
                    <a class="text-decoration-none d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="${avatarUrl}" class="rounded-circle border border-secondary" width="40" height="40" alt="Аватар">
                        <span class="text-white ms-2 d-none d-md-inline fw-bold">${shortName}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark mt-2 border-secondary shadow-lg">
                        <li><a class="dropdown-item" href="profile.html">Личный кабинет</a></li>
                        <li><hr class="dropdown-divider border-secondary"></li>
                        <li><a class="dropdown-item text-danger fw-bold" href="#" id="logoutBtn">Выйти</a></li>
                    </ul>
                </div>
            `;

            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            });
        }

        if (navList && !document.querySelector('a[href="profile.html"].nav-link')) {
            navList.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link text-white-50" href="profile.html">Мой прогресс</a>
                </li>
            `;
        }
    }


    if (window.location.pathname.includes('course.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('id');

        if (courseId) {

            fetch(`http://localhost:4000/courses/${courseId}`)
                .then(res => res.json())
                .then(course => {

                    document.getElementById('bcTitle').textContent = course.title;
                    document.getElementById('courseTitle').textContent = course.title;
                    document.getElementById('courseDesc').textContent = course.desc;
                    document.getElementById('courseFullDesc').textContent = course.desc;
                    document.getElementById('courseImg').src = course.image;
                    
                    const priceText = course.price === 0 ? 'Бесплатно' : `${course.price} ₽`;
                    document.getElementById('coursePrice').textContent = priceText;
                    document.getElementById('coursePrice').className = course.price === 0 ? 'text-white fw-bold mb-3' : 'neon-text fw-bold mb-3';

                    document.getElementById('teacherName').textContent = course.teacherName;
                    document.getElementById('teacherRole').textContent = course.teacherRole;
                    document.getElementById('teacherAvatar').src = course.teacherAvatar;
                })
                .catch(err => console.error("Курс не найден", err));
        } else {
            document.getElementById('courseTitle').textContent = "Курс не выбран";
        }
    }

    if (window.location.pathname.includes('profile.html')) {
        if (!userJson || !token) {
            window.location.href = 'login.html';
        } else {
            const user = JSON.parse(userJson);

            document.getElementById('profileName').textContent = user.name;
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profileAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=a855f7&color=fff&size=128`;
            document.getElementById('profileRoleBadge').textContent = user.role === 'teacher' ? 'Преподаватель' : 'Студент';

            const studentTabBtn = document.querySelector('[data-bs-target="#student-panel"]');
            const teacherTabBtn = document.querySelector('[data-bs-target="#teacher-panel"]');

            if (user.role === 'student') {
                teacherTabBtn.parentElement.style.display = 'none';
                studentTabBtn.click();

                document.getElementById('stat1').textContent = '0';
                document.getElementById('stat2').textContent = '0';
                document.getElementById('stat3').textContent = '0.0';

                document.getElementById('studentCoursesList').innerHTML = '<div class="col-12"><p class="text-white-50 fs-5">Вы пока не записались ни на один курс. Самое время перейти в <a href="index.html" class="text-neon">каталог</a>!</p></div>';

            } else if (user.role === 'teacher') {
                studentTabBtn.parentElement.style.display = 'none';
                teacherTabBtn.click();

                document.getElementById('statLabel1').textContent = 'Мои курсы';
                document.getElementById('statLabel2').textContent = 'Студентов';

                const tbody = document.getElementById('teacherCoursesTable');
                if (tbody) {
                    fetch(`http://localhost:4000/courses?teacherName=${encodeURIComponent(user.name)}`)
                        .then(res => res.json())
                        .then(courses => {
                            tbody.innerHTML = ''; 

                            document.getElementById('stat1').textContent = courses.length;
                            
                            if (courses.length > 0) {
                                let totalRating = 0;
                                courses.forEach(c => totalRating += c.rating);
                                document.getElementById('stat3').textContent = (totalRating / courses.length).toFixed(1);
                                document.getElementById('stat2').textContent = courses.length * 42; 
                            } else {
                                document.getElementById('stat2').textContent = '0';
                                document.getElementById('stat3').textContent = '0.0';
                                tbody.innerHTML = '<tr><td colspan="4" class="text-center text-white-50 py-4">У вас пока нет созданных курсов.</td></tr>';
                                return;
                            }

                            courses.forEach(course => {
                                const priceText = course.price === 0 ? 'Бесплатно' : `${course.price} ₽`;
                                const stars = '★'.repeat(course.rating) + '☆'.repeat(5 - course.rating);
                                
                                tbody.innerHTML += `
                                    <tr>
                                        <td class="text-white fw-bold">${course.title}</td>
                                        <td class="text-white-50">${priceText}</td>
                                        <td class="text-warning">${stars}</td>
                                        <td class="text-end">
                                            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteCourse(${course.id})">Удалить</button>
                                        </td>
                                    </tr>
                                `;
                            });
                        })
                        .catch(err => console.error(err));
                }
            }
        }
    }

    const createCourseForm = document.getElementById('createCourseForm');
    if (createCourseForm) {
        createCourseForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const userJson = localStorage.getItem('user');
            if (!userJson) return;
            const user = JSON.parse(userJson);

            const title = document.getElementById('ccTitle').value;
            const desc = document.getElementById('ccDesc').value;
            const price = Number(document.getElementById('ccPrice').value) || 0;
            const fileInput = document.getElementById('ccImage');

            const sendDataToServer = async (imageUrl) => {
                const newCourse = {
                    title: title,
                    desc: desc,
                    price: price,
                    category: "lang", 
                    categoryLabel: "Разное",
                    level: "beginner", 
                    levelLabel: "Новичок",
                    rating: 5,
                    reviews: 0,
                    image: imageUrl,
                    teacherName: user.name, 
                    teacherRole: "Преподаватель",
                    teacherAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=a855f7&color=fff`
                };

                try {
                    const response = await fetch('http://localhost:4000/courses', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        },
                        body: JSON.stringify(newCourse)
                    });

                    if (!response.ok) throw new Error('Ошибка при создании курса');

                    alert('Курс успешно создан!');
                    window.location.href = 'index.html'; 
                } catch (error) {
                    alert(error.message);
                }
            };

            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                
                reader.onloadend = () => {
                    sendDataToServer(reader.result);
                };
                
                reader.readAsDataURL(file);
            } else {
                sendDataToServer("img/course1.png");
            }
        });
    }

    window.deleteCourse = async function(courseId) {
        if (confirm('Вы точно хотите навсегда удалить этот курс?')) {
            try {
                const response = await fetch(`http://localhost:4000/courses/${courseId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (!response.ok) throw new Error('Ошибка при удалении курса');

                window.location.reload();
            } catch (error) {
                alert(error.message);
            }
        }
    };
 
});

