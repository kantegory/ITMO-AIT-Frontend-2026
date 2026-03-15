document.addEventListener('DOMContentLoaded', function() {
    const searchResultsBody = document.getElementById('searchResultsBody');

    if (!searchResultsBody) return;

    const categoryFilter = document.getElementById('searchCategory');
    const dateFromFilter = document.getElementById('filterDateFrom');
    const dateToFilter = document.getElementById('filterDateTo');
    const sumMinFilter = document.getElementById('filterSumMin');
    const sumMaxFilter = document.getElementById('filterSumMax');
    const todayObject = new Date();
    const todayString = todayObject.toISOString().split("T")[0];

    dateFromFilter.max = todayString;
    dateToFilter.max = todayString;

    function performSearch() {
        const transactionsList = USERS.userData.transactions;

        const filteredResults = transactionsList.filter(function(transaction) {
            const isCategoryMatched = !categoryFilter.value || transaction.category === categoryFilter.value;
            const isDateFromMatched = !dateFromFilter.value || transaction.date >= dateFromFilter.value;
            const isDateToMatched = !dateToFilter.value || transaction.date <= dateToFilter.value;

            const absoluteSum = Math.abs(transaction.sum);
            const isSumMinMatched = isNaN(parseFloat(sumMinFilter.value)) || absoluteSum >= parseFloat(sumMinFilter.value);
            const isSumMaxMatched = isNaN(parseFloat(sumMaxFilter.value)) || absoluteSum <= parseFloat(sumMaxFilter.value);

            return isCategoryMatched && isDateFromMatched && isDateToMatched && isSumMinMatched && isSumMaxMatched;
        });

        const emptyMessage = document.getElementById('emptySearchMessage');
        const searchTable = document.getElementById('searchTable');

        if (filteredResults.length === 0) {
            emptyMessage.style.display = 'block';
            searchTable.style.display = 'none';
        } else {
            emptyMessage.style.display = 'none';
            searchTable.style.display = 'table';

            searchResultsBody.innerHTML = filteredResults.map(function(transaction) {
                const isIncome = transaction.sum > 0;
                const textColorClass = isIncome ? 'text-income' : 'text-expense';
                const sumPrefix = isIncome ? '+' : '';

                return `
                <tr>
                    <td>${transaction.date}</td>
                    <td>${transaction.account}</td>
                    <td>${transaction.desc || '-'}</td>
                    <td>${transaction.category}</td>
                    <td class="${textColorClass}">
                        ${sumPrefix}${transaction.sum.toFixed(2)}
                    </td>
                </tr>`;
            }).join('');
        }
    }

    const currentCategories = USERS.userData.categories;

    const categoryOptionsHTML = currentCategories.map(function(categoryName) {
        return `<option value="${categoryName}">${categoryName}</option>`;
    }).join('');

    categoryFilter.innerHTML = `
        <option value="">[ ВСЕ_КАТЕГОРИИ ]</option>
        <option value="РАЗНОЕ">РАЗНОЕ</option>
        ${categoryOptionsHTML}
    `;

    const allFilterElements = [
        categoryFilter,
        dateFromFilter,
        dateToFilter,
        sumMinFilter,
        sumMaxFilter
    ];

    allFilterElements.forEach(function(element) {
        element.addEventListener('input', performSearch);
    });

    const resetButton = document.getElementById('resetFilters');
    if (resetButton) {
        resetButton.onclick = function() {
            allFilterElements.forEach(function(element) {
                element.value = '';
            });
            performSearch();
        };
    }

    performSearch();
});