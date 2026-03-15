export function initDashboard() {
    if (!window.location.href.includes("dashboard")) return;

    const profileName = document.getElementById("profileName");
    if (!profileName) return;

    const currentUserData = localStorage.getItem("edu_current_user");
    if (!currentUserData) {
        alert("Войдите в систему");
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(currentUserData)

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
        passwordForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const oldPass = document.getElementById("oldPassword").value;
            const newPass = document.getElementById("newPassword").value;

            if (oldPass !== user.password) {
                alert("Неверный текущий пароль!");
                return;
            }

            let allUsers = JSON.parse(localStorage.getItem('edu_users')) || [];
            let userIndex = allUsers.findIndex(u => u.email === user.email);
            
            if (userIndex !== -1) {
                allUsers[userIndex].password = newPass;
                localStorage.setItem('edu_users', JSON.stringify(allUsers));
                
                user.password = newPass;
                localStorage.setItem('edu_current_user', JSON.stringify(user));
                
                alert("Пароль успешно изменен!");
                passwordForm.reset();
            }
        });
    }

    const certsContainer = document.getElementById("certsContainer");
    if (!user.certificates || user.certificates.length === 0) {
        certsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted">У вас пока нет сертификатов. Пройдите курс до конца, чтобы получить его!</p>
            </div>
        `;
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(event) {
            event.preventDefault();
            if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
                localStorage.removeItem("edu_current_user");
                window.location.href = "index.html";
            }
        });
    }
}