document.addEventListener("DOMContentLoaded", async () => {

    const incomeEl = document.getElementById("totalIncome");
    const expenseEl = document.getElementById("totalExpense");
    const incomeTitleEl = document.getElementById("incomeTitle");
    const expenseTitleEl = document.getElementById("expenseTitle");
    const bigTitleEl = document.getElementById("biggestTxTitle");
    const bigAmountEl = document.getElementById("biggestTxAmount");
    const bigDateEl = document.getElementById("biggestTxDate");
    const limitsContainer = document.getElementById("limitsContainer");

    const analyticsAlert = document.getElementById("analyticsAlert");
    const analyticsIcon = document.getElementById("analyticsIcon");
    const analyticsText = document.getElementById("analyticsText");

    if (!incomeEl) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
    }

    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

    if (incomeTitleEl) incomeTitleEl.innerHTML = `<i class="bi bi-arrow-up-circle text-success me-1"></i> Доходы за ${monthNames[currentMonth]}`;
    if (expenseTitleEl) expenseTitleEl.innerHTML = `<i class="bi bi-arrow-down-circle text-danger me-1"></i> Расходы за ${monthNames[currentMonth]}`;

    const categoryLimits = {
        "Продукты": { limit: 30000, icon: "bi-cart" },
        "Развлечения": { limit: 40000, icon: "bi-controller" },
        "Транспорт": { limit: 15000, icon: "bi-car-front" },
        "Разное": { limit: 10000, icon: "bi-wallet2" }
    };

    try {
        const response = await fetch("http://localhost:3000/transactions");
        const allTransactions = await response.json();

        let totalIncome = 0;
        let totalExpense = 0;
        let prevMonthExpense = 0;
        let biggestExpense = { amount: 0, title: "-", date: "" };
        const categoriesData = {};

        allTransactions.forEach(tr => {
            const txDate = new Date(tr.date);
            const m = txDate.getMonth();
            const y = txDate.getFullYear();

            if (m === currentMonth && y === currentYear) {
                if (tr.type === "income") {
                    totalIncome += tr.amount;
                } else if (tr.type === "expense") {
                    totalExpense += tr.amount;
                    if (tr.amount > biggestExpense.amount) biggestExpense = tr;
                    categoriesData[tr.categoryName] = (categoriesData[tr.categoryName] || 0) + tr.amount;
                }
            }
            else if (m === prevMonth && y === prevYear) {
                if (tr.type === "expense") {
                    prevMonthExpense += tr.amount;
                }
            }
        });

        if (analyticsAlert && analyticsIcon && analyticsText) {
            if (prevMonthExpense === 0) {
                analyticsAlert.style.backgroundColor = "#e9ecef";
                analyticsIcon.className = "bi bi-info-circle-fill fs-3 text-secondary me-3";
                analyticsText.innerHTML = `В прошлом месяце у вас не было трат. Начинаем собирать статистику!`;
            } else {
                if (totalExpense > prevMonthExpense) {
                    const diffPercent = Math.round(((totalExpense - prevMonthExpense) / prevMonthExpense) * 100);
                    analyticsAlert.style.backgroundColor = "#f8d7da";
                    analyticsIcon.className = "bi bi-exclamation-triangle-fill fs-3 text-danger me-3";
                    analyticsText.innerHTML = `В этом месяце вы потратили на <strong>${diffPercent}% больше</strong>, чем в прошлом. Пора включить режим экономии!`;
                } else if (totalExpense < prevMonthExpense) {
                    const diffPercent = Math.round(((prevMonthExpense - totalExpense) / prevMonthExpense) * 100);
                    analyticsAlert.style.backgroundColor = "#cafad3";
                    analyticsIcon.className = "bi bi-lightbulb-fill fs-3 text-success me-3";
                    analyticsText.innerHTML = `Ваши расходы в этом месяце на <strong>${diffPercent}% меньше</strong>, чем в прошлом! Так держать!`;
                } else {
                    analyticsAlert.style.backgroundColor = "#fff3cd";
                    analyticsIcon.className = "bi bi-bar-chart-fill fs-3 text-warning me-3";
                    analyticsText.innerHTML = `Ваши расходы идут точно по графику прошлого месяца.`;
                }
            }
        }

        incomeEl.textContent = `${totalIncome.toLocaleString('ru-RU')} ₽`;
        expenseEl.textContent = `${totalExpense.toLocaleString('ru-RU')} ₽`;

        if (biggestExpense.amount > 0) {
            bigTitleEl.textContent = biggestExpense.title;
            bigAmountEl.textContent = `- ${biggestExpense.amount.toLocaleString('ru-RU')} ₽`;
            const bDate = new Date(biggestExpense.date);
            bigDateEl.textContent = bDate.toLocaleDateString("ru-RU", { day: 'numeric', month: 'long' });
        } else {
            bigTitleEl.textContent = "Нет данных";
            bigAmountEl.textContent = "0 ₽";
            bigDateEl.textContent = "-";
        }

        if (limitsContainer) {
            limitsContainer.innerHTML = "";
            const allExpenseCategories = new Set([...Object.keys(categoryLimits), ...Object.keys(categoriesData)]);

            allExpenseCategories.forEach(catName => {
                const spent = categoriesData[catName] || 0;
                const catInfo = categoryLimits[catName] || { limit: 10000, icon: "bi-tag" };
                const limit = catInfo.limit;

                const percent = Math.min((spent / limit) * 100, 100).toFixed(1);

                let barColor = "bg-success";
                if (percent >= 50) barColor = "bg-warning";
                if (percent >= 85) barColor = "bg-danger";

                limitsContainer.innerHTML += `
                    <div class="mb-4">
                        <div class="d-flex justify-content-between small mb-1">
                            <span><i class="bi ${catInfo.icon} me-1"></i> ${catName} (Лимит: ${limit.toLocaleString('ru-RU')} ₽)</span>
                            <span class="${barColor.replace('bg-', 'text-')} fw-bold">${spent.toLocaleString('ru-RU')} ₽ <span class="text-muted fw-normal">/ ${percent}%</span></span>
                        </div>
                        <div class="progress" style="height: 15px; border-radius: 10px;">
                            <div class="progress-bar ${barColor}" style="width: ${percent}%;"></div>
                        </div>
                    </div>
                `;
            });
        }

        const ctxEl = document.getElementById('expenseChart');
        const legendContainer = document.getElementById('chartLegend');

        if (ctxEl && Object.keys(categoriesData).length > 0) {
            const labels = Object.keys(categoriesData);
            const data = Object.values(categoriesData);
            const bgColors = ['#fdc003', '#0d6efd', '#0dcaf0', '#dc3545', '#198754', '#6c757d'];

            new Chart(ctxEl.getContext('2d'), {
                type: 'doughnut',
                data: { labels: labels, datasets: [{ data: data, backgroundColor: bgColors, borderWidth: 2, hoverOffset: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });

            if (legendContainer && totalExpense > 0) {
                legendContainer.innerHTML = "";
                labels.forEach((catName, index) => {
                    const amount = categoriesData[catName];
                    const percent = Math.round((amount / totalExpense) * 100);
                    const color = bgColors[index % bgColors.length];
                    legendContainer.innerHTML += `
                        <div class="d-flex justify-content-between small mb-2 align-items-center">
                            <span><span class="d-inline-block rounded-circle me-2 shadow-sm" style="width:12px; height:12px; background-color: ${color};"></span>${catName}</span>
                            <span class="fw-bold">${percent}%</span>
                        </div>
                    `;
                });
            }
        } else {
            if (legendContainer) legendContainer.innerHTML = "<div class='text-muted small text-center'>Нет данных за этот месяц</div>";
            if (ctxEl) {
                new Chart(ctxEl.getContext('2d'), {
                    type: 'doughnut',
                    data: { labels: ['Пусто'], datasets: [{ data: [1], backgroundColor: ['#e9ecef'], borderWidth: 0 }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }
                });
            }
        }

    } catch (error) {
        console.error("Ошибка загрузки отчетов:", error);
    }
});