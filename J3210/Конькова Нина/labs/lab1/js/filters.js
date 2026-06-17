document.addEventListener('DOMContentLoaded', function () {
    // Кэшируем ссылки на узлы интерфейса, чтобы не искать их в дереве при каждом вводе буквы
    const searchInput = document.getElementById('tableSearch');
    const statusSelect = document.getElementById('statusSelect');
    const accRange = document.getElementById('accRange');
    const accValDisplay = document.getElementById('accVal');
    const dateFilter = document.getElementById('dateFilter');
    const expTable = document.getElementById('expTable');

    // Фильтрация
    function filterTable() {
        if (!expTable) return;

        const rows = expTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
        const statusTerm = statusSelect ? statusSelect.value : "All";
        const minAcc = accRange ? parseFloat(accRange.value) : 0;
        const selectedDate = dateFilter ? dateFilter.value : "";

        // Синхронизируем визуальное значение рядом с ползунком
        if (accValDisplay) {
            accValDisplay.textContent = minAcc.toFixed(2);
        }

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const name = row.cells[0].textContent.toLowerCase();
            const acc = parseFloat(row.cells[2].textContent) || 0;
            const status = row.cells[3].textContent.trim();
            const dateInTable = row.cells[4].textContent.trim();

            const matchesSearch = name.includes(searchTerm);
            const matchesStatus = (statusTerm === "All" || status === statusTerm);
            const matchesAcc = acc >= minAcc;
            const matchesDate = !selectedDate || dateInTable === selectedDate;

            row.style.display = (matchesSearch && matchesStatus && matchesAcc && matchesDate) ? "" : "none";
        }
    }

    if (searchInput) searchInput.addEventListener('input', filterTable);
    if (statusSelect) statusSelect.addEventListener('change', filterTable);
    if (accRange) accRange.addEventListener('input', filterTable);
    if (dateFilter) dateFilter.addEventListener('change', filterTable);
});