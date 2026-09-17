(function() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('ml-pipeline-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.removeAttribute('data-theme');
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('theme-toggle');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');

            if (currentTheme === 'dark') {
                html.removeAttribute('data-theme');
                localStorage.setItem('ml-pipeline-theme', 'light');
            } 
            else {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('ml-pipeline-theme', 'dark');
            }
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const savedTheme = localStorage.getItem('ml-pipeline-theme');
        if (!savedTheme) {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        }
    });
});