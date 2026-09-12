(function () {
    if (document.getElementById('loginModal')) return;

    const markup = `
<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title fs-5" id="loginModalLabel">Вход</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <form id="loginForm">
                    <div class="mb-3">
                        <label for="loginEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="loginEmail" name="email" required autocomplete="email">
                    </div>
                    <div class="mb-3">
                        <label for="loginPassword" class="form-label">Пароль</label>
                        <input type="password" class="form-control" id="loginPassword" name="password" required autocomplete="current-password">
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Войти</button>
                </form>
            </div>
            <div class="modal-footer justify-content-center">
                <span class="text-muted">Нет аккаунта?</span>
                <button type="button" class="btn btn-link p-0" data-bs-toggle="modal" data-bs-target="#registerModal">Зарегистрироваться</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title fs-5" id="registerModalLabel">Регистрация</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
            </div>
            <div class="modal-body">
                <form id="registerForm">
                    <div class="mb-3">
                        <label for="registerName" class="form-label">Имя</label>
                        <input type="text" class="form-control" id="registerName" name="name" required autocomplete="name">
                    </div>
                    <div class="mb-3">
                        <label for="registerEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="registerEmail" name="email" required autocomplete="email">
                    </div>
                    <div class="mb-3">
                        <label for="registerPassword" class="form-label">Пароль</label>
                        <input type="password" class="form-control" id="registerPassword" name="password" required autocomplete="new-password" minlength="6">
                    </div>
                    <div class="mb-3">
                        <label for="registerPasswordConfirm" class="form-label">Подтвердите пароль</label>
                        <input type="password" class="form-control" id="registerPasswordConfirm" name="passwordConfirm" required autocomplete="new-password" minlength="6">
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Зарегистрироваться</button>
                </form>
            </div>
            <div class="modal-footer justify-content-center">
                <span class="text-muted">Уже есть аккаунт?</span>
                <button type="button" class="btn btn-link p-0" data-bs-toggle="modal" data-bs-target="#loginModal">Войти</button>
            </div>
        </div>
    </div>
</div>
`;

    document.body.insertAdjacentHTML('beforeend', markup);

    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
    });

    document.getElementById('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const password = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('registerPasswordConfirm').value;
        if (password !== confirm) {
            document.getElementById('registerPasswordConfirm').setCustomValidity('Пароли не совпадают');
            document.getElementById('registerPasswordConfirm').reportValidity();
            return;
        }
        document.getElementById('registerPasswordConfirm').setCustomValidity('');
    });

    document.getElementById('registerPasswordConfirm').addEventListener('input', function () {
        this.setCustomValidity('');
    });
})();
