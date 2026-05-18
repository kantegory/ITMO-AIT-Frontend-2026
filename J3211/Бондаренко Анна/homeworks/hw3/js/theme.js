initTheme = function () {
    const themeBtn = document.querySelector('#theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    const updateButtonText = function (theme) {
        if (themeBtn) {
            themeBtn.innerText = theme === 'light' ? '[ DARK_MODE ]' : '[ LIGHT_MODE ]';
        }
    };

    updateButtonText(currentTheme);

    if (themeBtn) {
        themeBtn.onclick = function () {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            updateButtonText(newTheme);
            location.reload();
        };
    }
};

initTheme();