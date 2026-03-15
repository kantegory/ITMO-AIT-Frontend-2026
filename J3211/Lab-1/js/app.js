document.addEventListener('DOMContentLoaded', function () {
    console.log('LabelFlow Frontend App Init');

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            new bootstrap.Modal(document.getElementById('authModal')).show();
        });
    }

    const registrationForm = document.getElementById('registrationForm');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    const regPasswordError = document.getElementById('regPasswordError');
    if (registrationForm && regPassword && regConfirmPassword && regPasswordError) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (regPassword.value.trim() !== regConfirmPassword.value.trim()) {
                regPasswordError.classList.remove('d-none');
            } else {
                regPasswordError.classList.add('d-none');
                new bootstrap.Modal(document.getElementById('regModal')).show();
            }
        });
        regConfirmPassword.addEventListener('input', () => regPasswordError.classList.add('d-none'));
    }

    const newProjectForm = document.getElementById('newProjectForm');
    const projectsContainer = document.getElementById('projectsContainer');
    if (newProjectForm && projectsContainer) {
        newProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const projectName = document.getElementById('projectName').value.trim();
            const projectType = document.getElementById('projectType').value;

            if (projectName) {
                const newCol = document.createElement('div');
                newCol.className = 'col-md-6 col-lg-4';

                let badgeStyle = projectType === 'polygon' ? 'bg-success' : (projectType === 'classification' ? 'bg-info text-dark' : 'bg-primary');
                let typeText = projectType === 'polygon' ? 'Segmentation' : (projectType === 'classification' ? 'Classification' : 'Bounding Box');

                newCol.innerHTML = `
                  <div class="card h-100 border-0 shadow-sm" style="animation: fadeIn 0.5s;">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold mb-0">${projectName}</h5>
                        <span class="badge ${badgeStyle}">${typeText}</span>
                      </div>
                      <p class="text-muted small mb-3">0 изображений • Только что</p>
                      <a href="annotation.html" class="btn btn-outline-primary btn-sm w-100">Начать разметку</a>
                    </div>
                  </div>
                `;
                projectsContainer.prepend(newCol);
                bootstrap.Modal.getInstance(document.getElementById('newProjectModal')).hide();
                newProjectForm.reset();
            }
        });
    }

    const profileForm = document.getElementById('profileForm');
    const profileName = document.getElementById('profileName');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileDisplayName = document.getElementById('profileDisplayName');

    if (profileForm && profileName && profileAvatar) {
        const updateInitials = (name) => {
            const parts = name.trim().split(' ');
            let initials = (parts[0] ? parts[0][0] : '') + (parts[1] ? parts[1][0] : '');
            profileAvatar.textContent = initials.toUpperCase() || 'U';
        };

        profileName.addEventListener('input', (e) => {
            updateInitials(e.target.value);
            profileDisplayName.textContent = e.target.value || 'Без имени';
        });

        profileForm.addEventListener('submit', (e) => e.preventDefault());
    }

    const profilePasswordForm = document.getElementById('profilePasswordForm');
    if (profilePasswordForm) {
        profilePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const p1 = document.getElementById('newPassword').value;
            const p2 = document.getElementById('confirmNewPassword').value;
            const errorLabel = document.getElementById('profilePasswordError');
            const successLabel = document.getElementById('profilePasswordSuccess');

            errorLabel.classList.add('d-none');
            successLabel.classList.add('d-none');

            if (p1 !== p2) {
                errorLabel.classList.remove('d-none');
            } else if (p1 !== "") {
                successLabel.classList.remove('d-none');
                profilePasswordForm.reset();
            }
        });
    }

    const searchForm = document.getElementById('searchForm');
    const searchResults = document.getElementById('searchResults');
    if (searchForm && searchResults) {
        const allProjects =[
            { name: "Autonomous Driving", type: "BBox" },
            { name: "Medical MRI Scans", type: "Polygon" },
            { name: "Document Analysis", type: "Classification" },
            { name: "Satellite Imagery", type: "Polygon" },
            { name: "Retail Shelf Monitor", type: "BBox" }
        ];

        const renderProjects = (projects) => {
            searchResults.innerHTML = '';
            if (projects.length === 0) {
                searchResults.innerHTML = '<div class="col-12"><p class="text-muted text-center py-5">Проекты не найдены. Попробуйте изменить фильтры.</p></div>';
                return;
            }
            projects.forEach(p => {
                const badgeClass = p.type === 'Polygon' ? 'bg-success' : (p.type === 'Classification' ? 'bg-info text-dark' : 'bg-primary');
                searchResults.innerHTML += `
                    <div class="col-md-6 col-lg-4">
                      <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body">
                          <h5 class="fw-bold mb-2">${p.name}</h5>
                          <span class="badge ${badgeClass} mb-3">${p.type}</span>
                          <a href="annotation.html" class="btn btn-outline-primary btn-sm w-100">Перейти</a>
                        </div>
                      </div>
                    </div>
                `;
            });
        };

        renderProjects(allProjects);

        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const q = document.getElementById('searchInput').value.toLowerCase();
            const t = document.getElementById('filterType').value;

            const filtered = allProjects.filter(p => {
                const matchName = p.name.toLowerCase().includes(q);
                const matchType = t === "" || p.type === t;
                return matchName && matchType;
            });
            renderProjects(filtered);
        });

        document.getElementById('resetSearchBtn').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            document.getElementById('filterType').value = '';
            renderProjects(allProjects);
        });
    }

    const saveAnnotationBtn = document.getElementById('saveAnnotationBtn');
    if (saveAnnotationBtn) {
        saveAnnotationBtn.addEventListener('click', function() {
            const toastEl = document.getElementById('saveToast');
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        });

        const classListBtns = document.querySelectorAll('#classList .list-group-item');
        classListBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                classListBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

});