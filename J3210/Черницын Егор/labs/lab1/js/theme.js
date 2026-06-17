const currentTheme = localStorage.getItem('mff_theme') || 'light';

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeToggle');

    themeBtn?.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('mff_theme', newTheme);

        const newTextColor = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || (newTheme === 'dark' ? '#f8f9fa' : '#212529');

        if (typeof Chart !== 'undefined') {
            const incomeChart = Chart.getChart('incomeChart');
            if (incomeChart) {
                incomeChart.options.plugins.legend.labels.color = newTextColor;
                incomeChart.update();
            }

            const expensesChart = Chart.getChart('expensesChart');
            if (expensesChart) {
                expensesChart.options.plugins.legend.labels.color = newTextColor;
                expensesChart.update();
            }
        }
    });
});