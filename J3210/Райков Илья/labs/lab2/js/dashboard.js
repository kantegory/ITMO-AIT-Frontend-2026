import { getCurrentUser, getAuthToken } from "./session.js";

export async function initDashboard() {
    if (!window.location.href.includes("dashboard")) return;

    const profileName = document.getElementById("profileName");
    if (!profileName) return;

    const localUser = getCurrentUser();
    const token = getAuthToken();

    if (!localUser || !token) {
        alert("Войдите в систему");
        window.location.href = "login.html";
        return;
    }

    let user;
    try {
        const response = await fetch(`http://127.0.0.1:3000/users/${localUser.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Token expired");
        
        user = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    const fullName = `${user.firstName} ${user.lastName}`;
    document.getElementById("profileName").textContent = fullName;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("courseCount").textContent = user.courses ? user.courses.length : 0;
    document.getElementById("certCount").textContent = user.certificates ? user.certificates.length : 0;

    document.getElementById("profileAvatar").src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff&size=120`;

    const coursesContainer = document.getElementById("coursesContainer");

    if (!user.courses || user.courses.length === 0) {
        coursesContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-journal-x text-muted" style="font-size: 3rem;"></i>
                <h4 class="mt-3 text-muted">У вас пока нет курсов</h4>
                <p class="text-muted mb-4">Перейдите в каталог, чтобы выбрать свой первый курс!</p>
                <a href="index.html" class="btn btn-primary">Перейти в каталог</a>
            </div>
        `;
    } else {
        coursesContainer.innerHTML = user.courses.map(course => `
            <div class="col-md-6 col-xl-4">
                <div class="card h-100 course-card shadow-sm border-0">
                    <img src="${course.imgSrc}" class="card-img-top" alt="Course" style="height: 160px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${course.title}</h5>
                        <div class="mb-3 mt-auto pt-3 border-top">
                            <div class="d-flex justify-content-between small mb-1 text-muted">
                                <span>Прогресс: 0%</span>
                            </div>
                            <div class="progress" style="height: 6px;">
                                <div class="progress-bar bg-primary" style="width: 0%;"></div>
                            </div>
                        </div>
                        <button class="btn btn-outline-primary w-100" onclick="alert('Открытие плеера курса...')">Продолжить</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    const passwordForm = document.getElementById("changePasswordForm");
    if (passwordForm) {
        passwordForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const oldPassInput = document.getElementById("oldPassword").value;
            const newPassInput = document.getElementById("newPassword").value;
            const submitBtn = passwordForm.querySelector('button[type="submit"]');

            if (oldPassInput === newPassInput) {
                alert("Новый пароль не может совпадать со старым!");
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Проверка...';

            try {
                const checkRes = await fetch('http://127.0.0.1:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        email: user.email, 
                        password: oldPassInput 
                    })
                });

                if (!checkRes.ok) {
                    alert("Текущий пароль введен неверно!");
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Сохранить изменения';
                    return;
                }

                const patchRes = await fetch(`http://127.0.0.1:3000/users/${user.id}`, {
                    method: 'PATCH',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ password: newPassInput })
                });

                if (patchRes.ok) {
                    alert("Пароль успешно изменен!");
                    passwordForm.reset();
                } else {
                    alert("Ошибка при сохранении нового пароля");
                }

            } catch (err) {
                console.error(err);
                alert("Ошибка связи с сервером");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Сохранить изменения';
            }
        });
    }
}