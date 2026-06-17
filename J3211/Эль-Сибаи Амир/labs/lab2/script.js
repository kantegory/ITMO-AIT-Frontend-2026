const API_URL = 'http://127.0.0.1:3000';

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function updateNavigation() {
    const user = getCurrentUser();
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        const text = link.textContent.trim();
        if (user) {
            if (text === 'Sign In' || text === 'Register') link.style.display = 'none';
        } else {
            if (text === 'My Account') link.style.display = 'none';
        }
    });
}

function initAuthPages() {
    const isLogin = window.location.pathname.includes('login.html');
    const isRegister = window.location.pathname.includes('register.html');

    if (isLogin) {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value.trim();
                try {
                    const res = await fetch(`${API_URL}/users`);
                    const users = await res.json();
                    const user = users.find(u => u.email === email && u.password === password);
                    if (user) {
                        localStorage.setItem('user', JSON.stringify(user));
                        window.location.href = 'dashboard.html';
                    } else { alert('Invalid email or password!'); }
                } catch (err) { alert('Server error!'); }
            });
        }
    }

    if (isRegister) {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const password = document.getElementById('password').value;
                if (password !== document.getElementById('confirmPassword').value) {
                    alert('Passwords do not match!'); return;
                }
                const newUser = {
                    firstName: document.getElementById('firstName').value.trim(),
                    lastName: document.getElementById('lastName').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    password: password,
                    role: document.getElementById('accountType').value
                };
                try {
                    await fetch(`${API_URL}/users`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(newUser)
                    });
                    alert('Success! Please Sign In.');
                    window.location.href = 'login.html';
                } catch (err) { console.error(err); }
            });
        }
    }
}

async function initTicketsPage() {
    const roundFilter = document.getElementById('roundFilter');
    const searchInput = document.getElementById('searchInput');
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');

    if (!roundFilter || !applyBtn) return;

    try {
        const res = await fetch(`${API_URL}/matches`);
        const matches = await res.json();
        const grids = document.querySelectorAll('.results-grid');
        const leg1Grid = grids[0]; const leg2Grid = grids[1];

        leg1Grid.innerHTML = ''; leg2Grid.innerHTML = '';

        matches.forEach(m => {
            const cardHTML = `
                <div class="ticket-card" data-round="${m.roundId}" data-teams="${m.left.toLowerCase()} ${m.right.toLowerCase()}">
                    <div class="result-row" style="background:${m.grad}">
                        <span class="club-left" style="${m.leftStyle || ''}">${m.left}</span>
                        <span class="result-score" style="${m.scoreStyle || ''}">vs</span>
                        <span class="club-right" style="${m.rightStyle || ''}">${m.right}</span>
                    </div>
                    <div class="ticket-info"><span>${m.date}</span><a href="ticket.html?match=${m.id}" class="btn btn-sm btn-primary">Buy</a></div>
                </div>`;
            if (m.roundId === 'QF1') leg1Grid.innerHTML += cardHTML;
            else if (m.roundId === 'QF2') leg2Grid.innerHTML += cardHTML;
        });

        const performFilter = () => {
            const round = roundFilter.value;
            const search = searchInput.value.toLowerCase();
            document.querySelectorAll('.ticket-card').forEach(card => {
                const mRound = !round || card.dataset.round === round;
                const mSearch = !search || card.dataset.teams.includes(search);
                card.style.display = (mRound && mSearch) ? '' : 'none';
            });
        };

        applyBtn.onclick = performFilter;

        if (resetBtn) {
            resetBtn.onclick = () => {
                roundFilter.value = '';
                searchInput.value = '';
                performFilter();
            };
        }
    } catch (e) { console.error(e); }
}

async function initTicketPage() {
    const matchCard = document.getElementById('matchCard');
    if (!matchCard) return;
    const key = new URLSearchParams(window.location.search).get('match') || 'psg-liverpool';
    try {
        const res = await fetch(`${API_URL}/matches/${key}`);
        const m = await res.json();
        matchCard.style.background = m.grad;
        matchCard.innerHTML = `<span class="club-left" style="${m.leftStyle || ''}">${m.left}</span><span class="result-score" style="${m.scoreStyle || ''}">vs</span><span class="club-right" style="${m.rightStyle || ''}">${m.right}</span>`;

        document.getElementById('infoRound').textContent = m.round;
        document.getElementById('infoDate').textContent = m.date;
        document.getElementById('infoVenue').textContent = m.venue;
        document.getElementById('infoLeg1').textContent = m.leg1;
        document.getElementById('infoLeg2').textContent = m.leg2;

        const sel = document.getElementById('category');
        sel.innerHTML = '';
        ['Standard', 'Business', 'VIP Box'].forEach((label, i) => {
            const opt = document.createElement('option');
            opt.value = m.prices[i]; opt.textContent = `${label} - ${m.prices[i]} EUR`; sel.appendChild(opt);
        });

        const qtyInp = document.getElementById('qty');
        const updateT = () => {
            const total = sel.value * qtyInp.value;
            document.getElementById('totalPrice').textContent = total + " EUR";
            document.getElementById('modalMatch').textContent = m.left + " vs " + m.right;
            document.getElementById('modalDate').textContent = m.date;
            document.getElementById('modalCategory').textContent = sel.options[sel.selectedIndex].text.split(' - ')[0];
            document.getElementById('modalQty').textContent = qtyInp.value;
            document.getElementById('modalTotal').textContent = total + " EUR";
        };
        sel.onchange = updateT; qtyInp.oninput = updateT; updateT();

        const user = getCurrentUser();
        if (user) {
            const footer = document.querySelector('.modal-footer');
            footer.innerHTML = `<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-success" id="buyFinal">Confirm Purchase</button>`;
            document.getElementById('buyFinal').onclick = async () => {
                const ticket = {
                    userId: user.id, matchId: m.id, left: m.left, right: m.right,
                    leftStyle: m.leftStyle || '', rightStyle: m.rightStyle || '', scoreStyle: m.scoreStyle || '',
                    grad: m.grad, date: m.date, category: sel.options[sel.selectedIndex].text.split(' - ')[0],
                    total: parseInt(sel.value) * parseInt(qtyInp.value),
                    status: 'Active', qty: parseInt(qtyInp.value)
                };
                await fetch(`${API_URL}/tickets`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(ticket)});
                window.location.href = 'dashboard.html';
            };
        }
    } catch(e) { console.error(e); }
}

async function initDashboardPage() {
    const dashTabs = document.getElementById('dashTabs');
    if (!dashTabs) return;

    const user = getCurrentUser();
    if (!user) { window.location.href = 'login.html'; return; }

    const editFirstName = document.getElementById('editFirstName');
    const editLastName = document.getElementById('editLastName');
    const editEmail = document.getElementById('editEmail');
    const welcomeText = document.getElementById('welcomeText');

    if (welcomeText) welcomeText.innerHTML = `Welcome, <strong>${user.firstName} ${user.lastName}</strong>.`;
    if (editFirstName) editFirstName.value = user.firstName || "";
    if (editLastName) editLastName.value = user.lastName || "";
    if (editEmail) editEmail.value = user.email || "";

    document.getElementById('saveProfileBtn').onclick = async () => {
        const updated = { ...user, firstName: editFirstName.value, lastName: editLastName.value, email: editEmail.value };
        await fetch(`${API_URL}/users/${user.id}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updated)});
        localStorage.setItem('user', JSON.stringify(updated));
        alert('Profile saved!');
        location.reload();
    };

    document.getElementById('changePassBtn').onclick = async () => {
        const p1 = document.getElementById('newPassword').value;
        if (p1 && p1 === document.getElementById('confirmNewPassword').value) {
            await fetch(`${API_URL}/users/${user.id}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ password: p1 })});
            alert('Password updated!');
            document.getElementById('newPassword').value = ''; document.getElementById('confirmNewPassword').value = '';
        } else { alert('Passwords mismatch!'); }
    };

    document.getElementById('signOutBtn').onclick = () => { localStorage.removeItem('user'); };

    const sellMatchSelect = document.getElementById('sellMatch');
    if (sellMatchSelect) {
        const mRes = await fetch(`${API_URL}/matches`);
        const matches = await mRes.json();
        sellMatchSelect.innerHTML = '<option value="">Select match...</option>';
        matches.forEach(m => {
            const opt = document.createElement('option');
            opt.value = `${m.left} vs ${m.right} · ${m.date}`; opt.textContent = opt.value; sellMatchSelect.appendChild(opt);
        });
    }

    if (user.role === 'organizer') {
        document.getElementById('sellTabItem').style.display = 'block';
        document.getElementById('becomeOrgBtn').style.display = 'none';
        loadListings();
    }
    loadUserTickets(user.id);
}

async function loadUserTickets(userId) {
    const res = await fetch(`${API_URL}/tickets?userId=${userId}`);
    const tickets = await res.json();
    const grid = document.getElementById('userTicketsGrid');
    let spent = 0, refunds = 0;

    grid.innerHTML = tickets.map(t => {
        if (t.status === 'Active') spent += t.total; else refunds++;
        return `
            <div class="ticket-card" style="${t.status === 'Refunded' ? 'opacity:0.5' : ''}">
                <div class="result-row" style="background:${t.grad}">
                    <span class="club-left" style="${t.leftStyle || ''}">${t.left}</span>
                    <span class="result-score" style="${t.scoreStyle || ''}">vs</span>
                    <span class="club-right" style="${t.rightStyle || ''}">${t.right}</span>
                </div>
                <div class="ticket-info">
                    <span>${t.category} (${t.qty})</span><strong>€${t.total}</strong>
                    ${t.status === 'Active' ? `<button class="btn btn-sm btn-outline-danger" onclick="doRefund('${t.id}')">Refund</button>` : `<span class="badge bg-secondary">Refunded</span>`}
                </div>
            </div>`;
    }).join('');

    document.getElementById('statTickets').textContent = tickets.length;
    document.getElementById('statSpent').textContent = `€${spent}`;
    document.getElementById('statRefunds').textContent = refunds;
}

window.doRefund = async (id) => {
    await fetch(`${API_URL}/tickets/${id}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({status: 'Refunded'})});
    window.location.reload();
};

window.becomeOrganizer = async function() {
    const user = getCurrentUser();
    await fetch(`${API_URL}/users/${user.id}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ role: 'organizer' })});
    user.role = 'organizer'; localStorage.setItem('user', JSON.stringify(user));
    document.getElementById('sellTabItem').style.display = 'block';
    document.getElementById('becomeOrgBtn').style.display = 'none';
    alert('You are now an organizer!');
};

async function loadListings() {
    const user = getCurrentUser();
    const res = await fetch(`${API_URL}/listings?userId=${user.id}`);
    const list = await res.json();
    const tbody = document.getElementById('listingRows');
    tbody.innerHTML = list.map(l => `
        <tr><td>${l.match}</td><td>${l.category}</td><td>€${l.price}</td><td>${l.qty}</td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="removeListing('${l.id}')">Remove</button></td></tr>
    `).join('');
    document.getElementById('myListingsTable').style.display = list.length ? 'block' : 'none';
}

window.listTickets = async () => {
    const user = getCurrentUser();
    const newItem = {
        userId: user.id, match: document.getElementById('sellMatch').value,
        category: document.getElementById('sellCategory').value,
        price: document.getElementById('sellPrice').value, qty: document.getElementById('sellQty').value
    };
    await fetch(`${API_URL}/listings`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newItem)});
    loadListings();
};

window.removeListing = async (id) => {
    await fetch(`${API_URL}/listings/${id}`, { method: 'DELETE' });
    loadListings();
};

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    initAuthPages();
    initTicketsPage();
    initTicketPage();
    initDashboardPage();
});