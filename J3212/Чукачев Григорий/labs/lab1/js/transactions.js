document.addEventListener("DOMContentLoaded", () => {

    const tableBody = document.getElementById("transactionsTable");
    if (!tableBody) return;

    let allTransactions = [];

    async function fetchTransactions() {
        try {
            const response = await fetch("http://localhost:3000/transactions");
            if (response.ok) {
                allTransactions = await response.json();
                renderTable(allTransactions);
            }
        } catch (error) {
            console.error("Ошибка загрузки транзакций:", error);
            tableBody.innerHTML = "<tr><td colspan='4' class='text-center text-danger'>Ошибка соединения с сервером</td></tr>";
        }
    }

    function renderTable(transactions) {
        tableBody.innerHTML = "";

        if (transactions.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='4' class='text-center text-muted py-4'>Транзакции не найдены</td></tr>";
            return;
        }

        transactions.forEach(tr => {
            const dateObj = new Date(tr.date);
            const formattedDate = dateObj.toLocaleDateString("ru-RU");

            const isExpense = tr.type === "expense";
            const amountColor = isExpense ? "text-danger" : "text-success";
            const amountPrefix = isExpense ? "- " : "+ ";
            const icon = getCategoryIcon(tr.category);

            const rowHTML = `
                <tr>
                    <td class="text-muted small">${formattedDate}</td>
                    <td class="fw-bold">${tr.title}</td>
                    <td><span class="badge bg-light text-dark border"><i class="bi ${icon} me-1"></i> ${tr.categoryName}</span></td>
                    <td class="${amountColor} text-end fw-bold">${amountPrefix}${tr.amount.toLocaleString('ru-RU')} ₽</td>
                </tr>
            `;
            tableBody.innerHTML += rowHTML;
        });
    }

    function getCategoryIcon(category) {
        const icons = {
            food: "bi-cart",
            salary: "bi-briefcase",
            transport: "bi-car-front",
            entertainment: "bi-controller",
            other: "bi-wallet2"
        };
        return icons[category] || "bi-tag";
    }


    const filterForm = document.getElementById("filterForm");
    const searchInput = document.getElementById("searchInput");
    const typeFilter = document.getElementById("typeFilter");
    const categoryFilter = document.getElementById("categoryFilter");

    const minAmountInput = document.getElementById("minAmount");
    const maxAmountInput = document.getElementById("maxAmount");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");

    function applyFilters() {
        const searchText = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedCategory = categoryFilter.value;

        const minAmount = minAmountInput.value ? Number(minAmountInput.value) : 0;
        const maxAmount = maxAmountInput.value ? Number(maxAmountInput.value) : Infinity;

        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        const filteredData = allTransactions.filter(tr => {
            const matchName = tr.title.toLowerCase().includes(searchText);

            const matchType = (selectedType === "all") || (tr.type === selectedType);

            const matchCategory = (selectedCategory === "all") || (tr.category === selectedCategory);

            const matchAmount = tr.amount >= minAmount && tr.amount <= maxAmount;

            let matchDate = true;
            if (startDate) {
                matchDate = matchDate && (tr.date >= startDate);
            }
            if (endDate) {
                matchDate = matchDate && (tr.date <= endDate);
            }

            return matchName && matchType && matchCategory && matchAmount && matchDate;
        });

        renderTable(filteredData);
    }

    const filterElements = [
        searchInput, typeFilter, categoryFilter,
        minAmountInput, maxAmountInput,
        startDateInput, endDateInput
    ];

    filterElements.forEach(elem => {
        if (elem.type === 'text' || elem.type === 'number') {
            elem.addEventListener("input", applyFilters);
        } else {
            elem.addEventListener("change", applyFilters);
        }
    });

    filterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        applyFilters();
    });

    fetchTransactions();
});