const API_URL = 'http://127.0.0.1:3000';

function injectIcons() {
    document.querySelectorAll('[data-icon]').forEach(el => {
        if (el.querySelector('.icon')) return;
        const icon = el.getAttribute('data-icon');
        el.insertAdjacentHTML('afterbegin', `<svg class="icon" aria-hidden="true"><use xlink:href="sprite.svg#icon-${icon}"></use></svg>`);
    });
}

function initTheme() {
    const saved = localStorage.getItem('app-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    const nav = document.querySelector('.navbar-nav');
    if (nav) {
        const container = document.createElement('div');
        container.className = 'nav-item d-flex align-items-center ms-lg-3 mt-2 mt-lg-0';
        const iconName = saved === 'light' ? 'moon' : 'theme';
        container.innerHTML = `<button id="themeToggleBtn" class="btn btn-sm btn-outline-light" data-icon="${iconName}"><span id="themeT">${saved === 'light' ? 'Dark' : 'Light'}</span></button>`;
        nav.appendChild(container);
        injectIcons();
        document.getElementById('themeToggleBtn').addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('app-theme', next);
            document.getElementById('themeT').textContent = next === 'light' ? 'Dark' : 'Light';
            const useTag = this.querySelector('use');
            if (useTag) {
                const newIcon = next === 'light' ? 'moon' : 'theme';
                useTag.setAttribute('xlink:href', `sprite.svg#icon-${newIcon}`);
            }
        });
    }
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function updateNavigation() {
    const user = getCurrentUser();
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
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
    const isReg = window.location.pathname.includes('register.html');
    if (isLogin) {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value.trim();
                const pass = document.getElementById('password').value.trim();
                try {
                    const res = await fetch(`${API_URL}/users`);
                    const users = await res.json();
                    const user = users.find(u => u.email === email && u.password === pass);
                    if (user) {
                        localStorage.setItem('user', JSON.stringify(user));
                        window.location.href = 'dashboard.html';
                    } else { alert('Invalid email or password!'); }
                } catch (err) { alert('Server error!'); }
            });
        }
    }
    if (isReg) {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (document.getElementById('password').value !== document.getElementById('confirmPassword').value) {
                    alert('Passwords mismatch!'); return;
                }
                const newUser = {
                    firstName: document.getElementById('firstName').value.trim(),
                    lastName: document.getElementById('lastName').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    password: document.getElementById('password').value,
                    role: document.getElementById('accountType').value
                };
                try {
                    await fetch(`${API_URL}/users`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newUser)});
                    alert('Success! Sign In now.');
                    window.location.href = 'login.html';
                } catch (err) { console.error(err); }
            });
        }
    }
}

async function initTicketsPage() {
    const roundF = document.getElementById('roundFilter');
    const searchI = document.getElementById('searchInput');
    if (!roundF) return;
    try {
        const res = await fetch(`${API_URL}/matches`);
        const matches = await res.json();
        const grids = document.querySelectorAll('.results-grid');
        if (!grids.length) return;
        grids[0].innerHTML = '';
        if (grids[1]) grids[1].innerHTML = '';
        matches.forEach(m => {
            const html = `<div class="ticket-card" data-round="${m.roundId}" data-teams="${m.left.toLowerCase()} ${m.right.toLowerCase()}"><div class="result-row" style="background:${m.grad}"><span class="club-left" style="${m.leftStyle||''}">${m.left}</span><span class="result-score" style="${m.scoreStyle||''}">vs</span><span class="club-right" style="${m.rightStyle||''}">${m.right}</span></div><div class="ticket-info"><span>${m.date}</span><a href="ticket.html?match=${m.id}" class="btn btn-sm btn-primary" aria-label="Buy for ${m.left} vs ${m.right}" data-icon="tickets">Buy</a></div></div>`;
            if (m.roundId === 'QF1') grids[0].innerHTML += html; else if (grids[1]) grids[1].innerHTML += html;
        });
        injectIcons();
        const filter = () => {
            document.querySelectorAll('.ticket-card').forEach(card => {
                const mR = !roundF.value || card.dataset.round === roundF.value;
                const mS = !searchI.value || card.dataset.teams.includes(searchI.value.toLowerCase());
                card.style.display = (mR && mS) ? '' : 'none';
            });
        };
        document.getElementById('applyFilters').onclick = filter;
        document.getElementById('resetFilters').onclick = () => { roundF.value = ''; searchI.value = ''; filter(); };
    } catch (e) {}
}

async function initTicketPage() {
    const card = document.getElementById('matchCard');
    if (!card) return;
    const key = new URLSearchParams(window.location.search).get('match') || 'psg-liverpool';
    try {
        const res = await fetch(`${API_URL}/matches/${key}`);
        const m = await res.json();
        card.style.background = m.grad;
        card.innerHTML = `<span class="club-left" style="${m.leftStyle||''}">${m.left}</span><span class="result-score" style="${m.scoreStyle||''}">vs</span><span class="club-right" style="${m.rightStyle||''}">${m.right}</span>`;
        document.getElementById('infoRound').textContent = m.round;
        document.getElementById('infoDate').textContent = m.date;
        document.getElementById('infoVenue').textContent = m.venue;
        const sel = document.getElementById('category');
        ['Standard', 'Business', 'VIP Box'].forEach((l, i) => {
            const opt = document.createElement('option'); opt.value = m.prices[i]; opt.textContent = `${l} - ${m.prices[i]} EUR`; sel.appendChild(opt);
        });
        const qty = document.getElementById('qty');
        const upd = () => {
            const total = sel.value * qty.value;
            document.getElementById('totalPrice').textContent = total + " EUR";
            document.getElementById('modalMatch').textContent = m.left + " vs " + m.right;
            document.getElementById('modalCategory').textContent = sel.options[sel.selectedIndex].text.split(' - ')[0];
            document.getElementById('modalQty').textContent = qty.value;
            document.getElementById('modalTotal').textContent = total + " EUR";
        };
        sel.onchange = upd; qty.oninput = upd; upd();
        const rev = await (await fetch(`${API_URL}/reviews?matchId=${key}`)).json();
        document.getElementById('reviewsList').innerHTML = rev.map(r => `<div class="mb-3 pb-2 border-bottom"><p>${r.stars} <strong>${r.author}</strong></p><p class="text-muted mb-0">${r.text}</p></div>`).join('') || '<p class="text-muted">No reviews yet.</p>';
        const user = getCurrentUser();
        if (user) {
            const warning = document.querySelector('#confirmModal .text-muted');
            if (warning) warning.style.display = 'none';
            const footer = document.querySelector('.modal-footer');
            footer.innerHTML = `<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-success" id="buyFinal" data-icon="tickets">Confirm Purchase</button>`;
            injectIcons();
            document.getElementById('buyFinal').onclick = async () => {
                const t = { userId: user.id, matchId: m.id, left: m.left, right: m.right, leftStyle: m.leftStyle||'', rightStyle: m.rightStyle||'', scoreStyle: m.scoreStyle||'', grad: m.grad, date: m.date, category: document.getElementById('modalCategory').textContent, total: parseInt(document.getElementById('modalTotal').textContent), status: 'Active', qty: parseInt(qty.value) };
                await fetch(`${API_URL}/tickets`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(t)});
                window.location.href = 'dashboard.html';
            };
        }
    } catch(e) {}
}

async function initDashboardPage() {
    if (!document.getElementById('dashTabs')) return;
    const user = getCurrentUser();
    if (!user) { window.location.href = 'login.html'; return; }
    const editFN = document.getElementById('editFirstName');
    const editLN = document.getElementById('editLastName');
    const editE = document.getElementById('editEmail');
    if (editFN) editFN.value = user.firstName || "";
    if (editLN) editLN.value = user.lastName || "";
    if (editE) editE.value = user.email || "";
    document.getElementById('welcomeText').innerHTML = `Welcome, <strong>${user.firstName} ${user.lastName}</strong>.`;
    document.getElementById('saveProfileBtn').onclick = async () => {
        const u = { ...user, firstName: editFN.value, lastName: editLN.value, email: editE.value };
        await fetch(`${API_URL}/users/${user.id}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(u)});
        localStorage.setItem('user', JSON.stringify(u));
        alert('Saved!'); location.reload();
    };
    document.getElementById('changePassBtn').onclick = async () => {
        const p = document.getElementById('newPassword').value;
        if (p && p === document.getElementById('confirmNewPassword').value) {
            await fetch(`${API_URL}/users/${user.id}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ password: p })});
            alert('Updated!');
        }
    };
    const logBtn = document.getElementById('signOutBtn');
    if (logBtn) {
        logBtn.setAttribute('data-icon', 'logout');
        logBtn.onclick = () => { localStorage.removeItem('user'); };
    }
    const sM = document.getElementById('sellMatch');
    if (sM) {
        const matches = await (await fetch(`${API_URL}/matches`)).json();
        matches.forEach(m => { const o = document.createElement('option'); o.value = `${m.left} vs ${m.right} · ${m.date}`; o.textContent = o.value; sM.appendChild(o); });
    }
    if (user.role === 'organizer') {
        const tab = document.getElementById('sellTabItem');
        if (tab) tab.style.display = 'block';
        const bBtn = document.getElementById('becomeOrgBtn');
        if (bBtn) bBtn.style.display = 'none';
        loadListings();
    }
    loadUserTickets(user.id);
}

async function loadUserTickets(uid) {
    const res = await fetch(`${API_URL}/tickets?userId=${uid}`);
    const tickets = await res.json();
    let s = 0, r = 0;
    const grid = document.getElementById('userTicketsGrid');
    if (!grid) return;
    grid.innerHTML = tickets.map(t => {
        if (t.status === 'Active') s += t.total; else r++;
        return `<div class="ticket-card" style="${t.status==='Refunded'?'opacity:0.5':''}"><div class="result-row" style="background:${t.grad}"><span style="${t.leftStyle||''}">${t.left}</span><span style="${t.scoreStyle||''}">vs</span><span style="${t.rightStyle||''}">${t.right}</span></div><div class="ticket-info"><span>${t.category} (${t.qty})</span><strong>€${t.total}</strong>${t.status==='Active'?`<button class="btn btn-sm btn-outline-danger" onclick="doRefund('${t.id}')">Refund</button>`:`<span class="badge bg-secondary">Refunded</span>`}</div></div>`;
    }).join('');
    document.getElementById('statTickets').textContent = tickets.length;
    document.getElementById('statSpent').textContent = `€${s}`;
    document.getElementById('statRefunds').textContent = r;
}

window.doRefund = async (id) => { await fetch(`${API_URL}/tickets/${id}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({status: 'Refunded'})}); location.reload(); };
window.becomeOrganizer = async () => {
    const u = getCurrentUser();
    await fetch(`${API_URL}/users/${u.id}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ role: 'organizer' })});
    u.role = 'organizer'; localStorage.setItem('user', JSON.stringify(u));
    document.getElementById('sellTabItem').style.display = 'block'; document.getElementById('becomeOrgBtn').style.display = 'none';
};

async function loadListings() {
    const u = getCurrentUser();
    const list = await (await fetch(`${API_URL}/listings?userId=${u.id}`)).json();
    const rows = document.getElementById('listingRows');
    if (!rows) return;
    rows.innerHTML = list.map(l => `<tr><td>${l.match}</td><td>${l.category}</td><td>€${l.price}</td><td>${l.qty}</td><td><button class="btn btn-sm btn-outline-danger" onclick="removeListing('${l.id}')">Remove</button></td></tr>`).join('');
    const tableContainer = document.getElementById('myListingsTable');
    if (tableContainer) tableContainer.style.display = list.length ? 'block' : 'none';
}

window.listTickets = async () => {
    const newItem = { userId: getCurrentUser().id, match: document.getElementById('sellMatch').value, category: document.getElementById('sellCategory').value, price: document.getElementById('sellPrice').value, qty: document.getElementById('sellQty').value };
    await fetch(`${API_URL}/listings`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newItem)});
    loadListings();
};

window.removeListing = async (id) => { await fetch(`${API_URL}/listings/${id}`, { method: 'DELETE' }); loadListings(); };

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    injectIcons();
    updateNavigation();
    initAuthPages();
    initTicketsPage();
    initTicketPage();
    initDashboardPage();
});