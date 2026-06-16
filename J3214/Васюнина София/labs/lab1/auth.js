document.addEventListener('DOMContentLoaded', () => {
    const regForm = document.getElementById('regForm');
    const loginForm = document.getElementById('loginForm');

    // registration
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(regForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:3000/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem('accessToken', result.accessToken);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    
                    window.location.href = 'index.html';
                } else {
                    alert('error ' + result);
                }
            } catch (error) {
                alert('server not active. check json-server');
            }
        });
    }

    // loggging in
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem('accessToken', result.accessToken);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    
                    window.location.href = 'profile.html'; 
                } else {
                    alert('invalif login or passowrd');
                }
            } catch (error) {
                alert('error while enterimg. try later');
            }
        });
    }
});