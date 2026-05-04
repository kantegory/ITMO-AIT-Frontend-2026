window.initSearchPage = function () {
    const resultsBody = document.getElementById('searchResultsBody');

    if (!resultsBody) {
        return;
    }

    const categorySelect = document.getElementById('searchCategory');
    const dateFromInput = document.getElementById('filterDateFrom');
    const dateToInput = document.getElementById('filterDateTo');
    const sumMinInput = document.getElementById('filterSumMin');
    const sumMaxInput = document.getElementById('filterSumMax');

    const todayObject = new Date();
    const todayString = todayObject.toISOString().split("T")[0];

    dateFromInput.max = todayString;
    dateToInput.max = todayString;

    function performSearch() {
        const transactions = window.USERS.userData.transactions;

        const filteredTransactions = transactions.filter(function (transaction) {
                const isCategoryMatch = (
                    !categorySelect.value ||
                    transaction.category === categorySelect.value
                );
                const isDateFromMatch = (
                    !dateFromInput.value ||
                    transaction.date >= dateFromInput.value
                );
                const isDateToMatch = (
                    !dateToInput.value ||
                    transaction.date <= dateToInput.value
                );

                const amount = transaction.sum;

                const isSumMinMatch = (
                    isNaN(parseFloat(sumMinInput.value)) ||
                    amount >= parseFloat(sumMinInput.value)
                );
                const isSumMaxMatch = (
                    isNaN(parseFloat(sumMaxInput.value)) ||
                    amount <= parseFloat(sumMaxInput.value)
                );

                return (
                    isCategoryMatch &&
                    isDateFromMatch &&
                    isDateToMatch &&
                    isSumMinMatch &&
                    isSumMaxMatch
                );
            }
        );

        const emptyMessage = document.getElementById('emptySearchMessage');
        const resultsTable = document.getElementById('searchTable');

        if (filteredTransactions.length === 0) {
            if (emptyMessage) {
                emptyMessage.style.display = 'block';
            }
            if (resultsTable) {
                resultsTable.style.display = 'none';
            }
        } else {
            if (emptyMessage) {
                emptyMessage.style.display = 'none';
            }
            if (resultsTable) {
                resultsTable.style.display = 'table';
            }

            resultsBody.innerHTML = filteredTransactions.map(function (transaction) {
                    const isIncome = transaction.sum > 0;
                    const statusClass = isIncome ? 'text-income' : 'text-expense';
                    const amountPrefix = isIncome ? '+' : '';

                    return `
                    <tr>
                        <td>${transaction.date}</td>
                        <td>${transaction.account}</td>
                        <td>${transaction.desc || '-'}</td>
                        <td>${transaction.category}</td>
                        <td class="${statusClass}">
                            ${amountPrefix}${transaction.sum.toFixed(2)}
                        </td>
                    </tr>
                `;
                }
            ).join('');
        }
    }

    const categories = window.USERS.userData.categories;

    const categoryOptions = categories.map(function (category) {
            const categoryName = category.name || category;
            return `
            <option value="${categoryName}">
                ${categoryName}
            </option>
        `;
        }
    ).join('');

    categorySelect.innerHTML = `
    <option value="">[ ВСЕ_КАТЕГОРИИ ]</option>
    <option value="РАЗНОЕ">РАЗНОЕ</option>
    ${categoryOptions}
`;

    const filterInputs = [
        categorySelect,
        dateFromInput,
        dateToInput,
        sumMinInput,
        sumMaxInput
    ];

    filterInputs.forEach(function (input) {
            input.addEventListener('input', performSearch);
        }
    );

    const resetButton = document.getElementById('resetFilters');

    if (resetButton) {
        resetButton.onclick = function () {
            filterInputs.forEach(function (input) {
                    input.value = '';
                }
            );
            performSearch();
        };
    }
    performSearch();
};