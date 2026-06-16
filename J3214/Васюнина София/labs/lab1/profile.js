document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    displayUserData(user);
    renderLikedModels();

    const editForm = document.getElementById('editProfileForm');
    if (editForm) {
        document.getElementById('edit-firstname').value = user.firstName;
        document.getElementById('edit-lastname').value = user.lastName;

        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const updatedData = {
                ...user,
                firstName: document.getElementById('edit-firstname').value,
                lastName: document.getElementById('edit-lastname').value
            };

            try {
                const response = await fetch(`http://localhost:3000/users/${user.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData)
                });

                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(updatedData));
                    displayUserData(updatedData);
                    bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
                }
            } catch (error) {
                alert('Error updating profile');
            }
        });
    }
});

function displayUserData(user) {
    document.getElementById('profile-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('profile-email').textContent = user.email;
    const avatar = document.querySelector('.avatar-lg');
    if (avatar) avatar.textContent = user.firstName.charAt(0).toUpperCase();
}

function renderLikedModels() {
    const likedModels = JSON.parse(localStorage.getItem('likedModels')) || [];
    const container = document.querySelector('.row.g-4');
    
    if (likedModels.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">You haven\'t liked any models yet.</div>';
        return;
    }

    container.innerHTML = likedModels.map(model => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 bg-transparent border-secondary text-white">
                <div class="card-body">
                    <h6 class="text-info">${model.id.split('/').pop()}</h6>
                    <p class="small text-secondary">${model.author || 'AI Hub'}</p>
                    <button class="btn btn-sm btn-outline-danger" onclick="unlikeModel('${model.id}')">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

window.unlikeModel = function(modelId) {
    let liked = JSON.parse(localStorage.getItem('likedModels')) || [];
    liked = liked.filter(m => m.id !== modelId);
    localStorage.setItem('likedModels', JSON.stringify(liked));
    renderLikedModels();
};

window.saveSelectedModel = function(modelId) {
    const likedModels = JSON.parse(localStorage.getItem('likedModels')) || [];
    const model = likedModels.find(m => m.id === modelId);
    if (model) {
        localStorage.setItem('selectedModel', JSON.stringify(model));
    }
};