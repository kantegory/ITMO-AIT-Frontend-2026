document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("transactionsTable");
    const paginationContainer = document.getElementById("paginationContainer");
    if (!tableBody) return;

    let allTransactions = [];
    let filteredTransactions = [];
    let currentPage = 1;
    const itemsPerPage = 5;

    async function fetchTransactions() {
        try {
            const response = await fetch("http://localhost:3000/transactions");
            if (response.ok) {
                allTransactions = await response.json();
                allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
                filteredTransactions = [...allTransactions];
                renderPage();
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    }

    function renderPage() {
        tableBody.innerHTML = "";

        if (filteredTransactions.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='4' class='text-center text-muted py-4'>Транзакции не найдены</td></tr>";
            paginationContainer.innerHTML = "";
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToShow = filteredTransactions.slice(startIndex, endIndex);

        itemsToShow.forEach(tr => {
            const dateObj = new Date(tr.date);
            const formattedDate = dateObj.toLocaleDateString("ru-RU");
            const isExpense = tr.type === "expense";
            const amountColor = isExpense ? "text-danger" : "text-success";
            const amountPrefix = isExpense ? "- " : "+ ";
            const icon = getCategoryIcon(tr.category);

            tableBody.innerHTML += `
                <tr>
                    <td class="text-muted small">${formattedDate}</td>
                    <td class="fw-bold">${tr.title}</td>
                    <td><span class="badge bg-light text-dark border"><i class="bi ${icon} me-1"></i> ${tr.categoryName}</span></td>
                    <td class="${amountColor} text-end fw-bold">${amountPrefix}${tr.amount.toLocaleString('ru-RU')} ₽</td>
                </tr>
            `;
        });

        renderPagination();
    }

    function renderPagination() {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = `page-item ${i === currentPage ? "active" : ""}`;

            const a = document.createElement("a");
            a.className = "page-link";
            a.href = "#";
            a.textContent = i;

            a.addEventListener("click", (e) => {
                e.preventDefault();
                currentPage = i;
                renderPage();
            });

            li.appendChild(a);
            paginationContainer.appendChild(li);
        }
    }

    function getCategoryIcon(category) {
        const icons = { food: "bi-cart", salary: "bi-briefcase", transport: "bi-car-front", entertainment: "bi-controller", other: "bi-wallet2" };
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

        filteredTransactions = allTransactions.filter(tr => {
            const matchName = tr.title.toLowerCase().includes(searchText);
            const matchType = (selectedType === "all") || (tr.type === selectedType);
            const matchCategory = (selectedCategory === "all") || (tr.category === selectedCategory);
            const matchAmount = tr.amount >= minAmount && tr.amount <= maxAmount;
            let matchDate = true;
            if (startDate) matchDate = matchDate && (tr.date >= startDate);
            if (endDate) matchDate = matchDate && (tr.date <= endDate);

            return matchName && matchType && matchCategory && matchAmount && matchDate;
        });

        currentPage = 1;
        renderPage();
    }

    [searchInput, typeFilter, categoryFilter, minAmountInput, maxAmountInput, startDateInput, endDateInput].forEach(elem => {
        elem.addEventListener(elem.type === 'text' || elem.type === 'number' ? 'input' : 'change', applyFilters);
    });

    filterForm.addEventListener("submit", (e) => { e.preventDefault(); applyFilters(); });
    fetchTransactions();
});