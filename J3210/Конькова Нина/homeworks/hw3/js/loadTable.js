async function loadTableData() {
    const table = document.getElementById('expTable');
    if (!table) return;

    const response = await fetch('http://localhost:3000/experiments');
    const data = await response.json();

    const tbody = table.querySelector('tbody');
    tbody.innerHTML = data.map(exp => `
        <tr>
            <td>${exp.name}</td>
            <td><code>${exp.id}</code></td>
            <td>${exp.accuracy}</td>
            <td><span class="badge ${exp.status === 'Finished' ? 'bg-success' : 'bg-warning'}">${exp.status}</span></td>
            <td>${exp.date}</td>
            <td><a href="experiment.html" class="btn btn-sm btn-outline-primary">Open</a></td>
        </tr>
    `).join('');
}