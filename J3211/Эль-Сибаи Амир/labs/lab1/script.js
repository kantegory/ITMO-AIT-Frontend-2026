function initTicketsPage() {
    var roundFilter = document.getElementById('roundFilter');
    var searchInput = document.getElementById('searchInput');
    if (!roundFilter) return;
    function applyFilters() {
        var round  = roundFilter.value;
        var search = searchInput.value.toLowerCase();
        document.querySelectorAll('.ticket-card').forEach(function(card) {
            var matchRound  = !round  || card.dataset.round === round;
            var matchSearch = !search || card.dataset.teams.includes(search);
            card.style.display = (matchRound && matchSearch) ? '' : 'none';
        });
        var leg1 = document.getElementById('leg1Title');
        var leg2 = document.getElementById('leg2Title');
        if (leg1) leg1.style.display = document.querySelector('[data-round="QF1"]:not([style*="none"])') ? '' : 'none';
        if (leg2) leg2.style.display = document.querySelector('[data-round="QF2"]:not([style*="none"])') ? '' : 'none';
    }
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', function() {
        roundFilter.value = '';
        searchInput.value = '';
        applyFilters();
    });
}
var matches = {
    'psg-liverpool': {
        venue: 'Parc des Princes, Paris, France',
        left: 'PSG', leftStyle: '',
        right: 'Liverpool', rightStyle: 'color:#5dbd6e;',
        grad: 'linear-gradient(to right,#003f7f 50%,#c8102e 50%)',
        round: 'Quarter-Final · Leg 1', date: '8 Apr 2026, 22:00',
        leg1: '8 Apr 2026, 22:00', leg2: '14 Apr 2026, 22:00',
        prices: [145, 450, 990]
    },
    'liverpool-psg': {
        venue: 'Anfield, Liverpool, England',
        left: 'Liverpool', leftStyle: 'color:#5dbd6e;',
        right: 'PSG', rightStyle: '',
        grad: 'linear-gradient(to right,#c8102e 50%,#003f7f 50%)',
        round: 'Quarter-Final · Leg 2', date: '14 Apr 2026, 22:00',
        leg1: '8 Apr 2026, 22:00', leg2: '14 Apr 2026, 22:00',
        prices: [160, 500, 1100]
    },
    'realmadrid-bayern': {
        venue: 'Estadio Bernabéu, Madrid, Spain',
        left: 'Real Madrid', leftStyle: 'color:#000;',
        right: 'Bayern', rightStyle: '',
        grad: 'linear-gradient(to right,#ffffff 50%,#dc052d 50%)',
        scoreStyle: 'color:#000;background:rgba(0,0,0,0.1);',
        round: 'Quarter-Final · Leg 1', date: '7 Apr 2026, 22:00',
        leg1: '7 Apr 2026, 22:00', leg2: '15 Apr 2026, 22:00',
        prices: [160, 500, 1100]
    },
    'bayern-realmadrid': {
        venue: 'Allianz Arena, Munich, Germany',
        left: 'Bayern', leftStyle: '',
        right: 'Real Madrid', rightStyle: 'color:#000;',
        grad: 'linear-gradient(to right,#dc052d 50%,#ffffff 50%)',
        scoreStyle: 'color:#000;background:rgba(0,0,0,0.1);',
        round: 'Quarter-Final · Leg 2', date: '15 Apr 2026, 22:00',
        leg1: '7 Apr 2026, 22:00', leg2: '15 Apr 2026, 22:00',
        prices: [175, 550, 1200]
    },
    'barcelona-atletico': {
        venue: 'Spotify Camp Nou, Barcelona, Spain',
        left: 'Barcelona', leftStyle: 'color:#003da5;',
        right: 'Atlético', rightStyle: '',
        grad: 'linear-gradient(to right,#a50044 50%,#ce1126 50%)',
        round: 'Quarter-Final · Leg 1', date: '8 Apr 2026, 22:00',
        leg1: '8 Apr 2026, 22:00', leg2: '14 Apr 2026, 22:00',
        prices: [155, 480, 1000]
    },
    'atletico-barcelona': {
        venue: 'Riyadh Air Metropolitano, Madrid, Spain',
        left: 'Atlético', leftStyle: '',
        right: 'Barcelona', rightStyle: 'color:#003da5;',
        grad: 'linear-gradient(to right,#ce1126 50%,#a50044 50%)',
        round: 'Quarter-Final · Leg 2', date: '14 Apr 2026, 22:00',
        leg1: '8 Apr 2026, 22:00', leg2: '14 Apr 2026, 22:00',
        prices: [155, 480, 1000]
    },
    'sporting-arsenal': {
        venue: 'Estádio José Alvalade, Lisbon, Portugal',
        left: 'Sporting', leftStyle: '',
        right: 'Arsenal', rightStyle: '',
        grad: 'linear-gradient(to right,#006600 50%,#ef0107 50%)',
        round: 'Quarter-Final · Leg 1', date: '8 Apr 2026, 22:00',
        leg1: '8 Apr 2026, 22:00', leg2: '14 Apr 2026, 22:00',
        prices: [120, 400, 890]
    },
    'arsenal-sporting': {
        venue: 'Emirates Stadium, London, England',
        left: 'Arsenal', leftStyle: '',
        right: 'Sporting', rightStyle: '',
        grad: 'linear-gradient(to right,#ef0107 50%,#006600 50%)',
        round: 'Quarter-Final · Leg 2', date: '14 Apr 2026, 22:00',
        leg1: '8 Apr 2026, 22:00', leg2: '14 Apr 2026, 22:00',
        prices: [130, 420, 920]
    }
};
var matchReviews = {
    'psg-liverpool': [
        { stars: '⭐⭐⭐⭐⭐', text: 'Ambiance incroyable au Parc des Princes, frissons garantis!', author: 'Jean-Pierre M.' },
        { stars: '⭐⭐⭐⭐⭐', text: 'Meilleure nuit de ma vie. PSG en mode champion!', author: 'Sophie L.' },
        { stars: '⭐⭐⭐⭐', text: 'Super organisation, accès facile, superbe soirée.', author: 'Antoine D.' },
    ],
    'liverpool-psg': [
        { stars: '⭐⭐⭐⭐⭐', text: 'Anfield was absolutely electric. Goosebumps all night!', author: 'James W.' },
        { stars: '⭐⭐⭐⭐⭐', text: 'The atmosphere was unlike anything I have ever experienced.', author: 'Sarah T.' },
        { stars: '⭐⭐⭐⭐', text: 'Smooth entry, great seats. Would buy again without hesitation.', author: 'Oliver H.' },
    ],
    'realmadrid-bayern': [
        { stars: '⭐⭐⭐⭐⭐', text: 'El Bernabéu rugió como nunca. Noche mágica e inolvidable.', author: 'Carlos R.' },
        { stars: '⭐⭐⭐⭐⭐', text: 'La afición del Madrid es lo mejor del mundo. Increíble.', author: 'María G.' },
        { stars: '⭐⭐⭐⭐', text: 'Organización perfecta y ambiente espectacular en el estadio.', author: 'Alejandro P.' },
    ],
    'bayern-realmadrid': [
        { stars: '⭐⭐⭐⭐⭐', text: 'Die Allianz Arena hat uns getragen — unglaubliche Stimmung!', author: 'Klaus H.' },
        { stars: '⭐⭐⭐⭐⭐', text: 'Ein Abend für die Ewigkeit. Bayern hat alles gegeben.', author: 'Lena S.' },
        { stars: '⭐⭐⭐⭐', text: 'Tolle Organisation, tolle Atmosphäre. Gerne wieder!', author: 'Hans M.' },
    ],
    'barcelona-atletico': [
        { stars: '⭐⭐⭐⭐⭐', text: 'Camp Nou bajo las estrellas — una noche espectacular!', author: 'Jordi F.' },
        { stars: '⭐⭐⭐⭐⭐', text: 'La mejor entrada que he comprado. Todo perfecto.', author: 'Marta C.' },
        { stars: '⭐⭐⭐⭐', text: 'Ambiente increíble, el Camp Nou siempre impresiona.', author: 'Pau V.' },
    ],
    'atletico-barcelona': [
        { stars: '⭐⭐⭐⭐⭐', text: 'El Metropolitano rugió como nunca. Pasión pura y dura.', author: 'Miguel Á.' },
        { stars: '⭐⭐⭐⭐⭐', text: 'Una noche que no voy a olvidar en mi vida. Brutal.', author: 'Lucía R.' },
        { stars: '⭐⭐⭐⭐', text: 'Acceso rápido, buenas vistas, ambiente de primer nivel.', author: 'Diego M.' },
    ],
    'sporting-arsenal': [
        { stars: '⭐⭐⭐⭐⭐', text: 'Alvalade em chamas! Uma noite verdadeiramente inesquecível.', author: 'João M.' },
        { stars: '⭐⭐⭐⭐⭐', text: 'O Sporting mostrou ao mundo do que é capaz. Que noite!', author: 'Ana S.' },
        { stars: '⭐⭐⭐⭐', text: 'Organização excelente e um ambiente de sonho no estádio.', author: 'Rui P.' },
    ],
    'arsenal-sporting': [
        { stars: '⭐⭐⭐⭐⭐', text: 'Emirates was loud from the first whistle. Unreal night!', author: 'Oliver T.' },
        { stars: '⭐⭐⭐⭐⭐', text: 'Best match I have attended. The crowd never stopped singing.', author: 'Emma K.' },
        { stars: '⭐⭐⭐⭐', text: 'Seamless experience, great atmosphere. Highly recommend.', author: 'Harry B.' },
    ],
};
function initTicketPage() {
    var matchCard = document.getElementById('matchCard');
    if (!matchCard) return;
    var key = new URLSearchParams(window.location.search).get('match') || 'psg-liverpool';
    var m = matches[key] || matches['psg-liverpool'];
    matchCard.style.background = m.grad;
    matchCard.innerHTML =
        '<span class="club-left" style="' + (m.leftStyle || '') + '">' + m.left + '</span>' +
        '<span class="result-score" style="' + (m.scoreStyle || '') + '">vs</span>' +
        '<span class="club-right" style="' + (m.rightStyle || '') + '">' + m.right + '</span>';
    document.getElementById('infoRound').textContent = m.round;
    document.getElementById('infoDate').textContent  = m.date;
    document.getElementById('infoVenue').textContent = m.venue || 'TBA';
    document.getElementById('infoLeg1').textContent  = m.leg1;
    document.getElementById('infoLeg2').textContent  = m.leg2;
    document.title = 'UCL Tickets - ' + m.left + ' vs ' + m.right;
    var sel = document.getElementById('category');
    var labels = ['Standard', 'Business', 'VIP Box'];
    m.prices.forEach(function(p, i) {
        var opt = document.createElement('option');
        opt.value = p;
        opt.textContent = labels[i] + ' - ' + p + ' EUR';
        sel.appendChild(opt);
    });
    document.getElementById('modalMatch').textContent = m.left + ' vs ' + m.right;
    document.getElementById('modalDate').textContent  = m.date;
    function updateTotal() {
        var price = parseInt(sel.value);
        var qty   = parseInt(document.getElementById('qty').value) || 1;
        var cat   = sel.options[sel.selectedIndex].text.split(' - ')[0];
        document.getElementById('totalPrice').textContent    = (price * qty) + ' EUR';
        document.getElementById('modalCategory').textContent = cat;
        document.getElementById('modalQty').textContent      = qty;
        document.getElementById('modalTotal').textContent    = (price * qty) + ' EUR';
    }
    sel.addEventListener('change', updateTotal);
    document.getElementById('qty').addEventListener('input', updateTotal);
    updateTotal();
    var revs = matchReviews[key] || [];
    document.getElementById('reviewsList').innerHTML = revs.length
        ? revs.map(function(r) {
            return '<div class="mb-3 pb-3 border-bottom" style="border-color:#1e3a5f!important">'
                + '<div>' + r.stars + ' <strong>' + r.author + '</strong></div>'
                + '<div class="text-muted mt-1">' + r.text + '</div>'
                + '</div>';
          }).join('')
        : '<p class="text-muted">No reviews yet.</p>';
}
function initDashboardPage() {
    if (!document.getElementById('dashTabs')) return;
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('role') === 'organizer') {
        document.getElementById('sellTabItem').style.display = '';
        document.getElementById('becomeOrgBtn').style.display = 'none';
    }
}
function requestRefund(btn) {
    btn.textContent = 'Refunded';
    btn.disabled = true;
    btn.classList.remove('btn-outline-danger');
    btn.classList.add('btn-info');
    btn.closest('.ticket-card').style.opacity = '0.6';
}
function listTickets() {
    var match    = document.getElementById('sellMatch').value;
    var category = document.getElementById('sellCategory').value;
    var price    = document.getElementById('sellPrice').value;
    var qty      = document.getElementById('sellQty').value;
    if (!match || !price || !qty) return;
    var tbody = document.getElementById('listingRows');
    var row   = tbody.insertRow();
    row.innerHTML = '<td>' + match + '</td>'
                  + '<td>' + category + '</td>'
                  + '<td>&#8364;' + price + '</td>'
                  + '<td>' + qty + '</td>'
                  + '<td><span class="badge bg-success">Active</span></td>'
                  + '<td><button class="btn btn-sm btn-outline-danger" onclick="removeRow(this)">Remove</button></td>';
    document.getElementById('myListingsTable').style.display = '';
    document.getElementById('sellMatch').value = '';
    document.getElementById('sellPrice').value = '';
    document.getElementById('sellQty').value   = '';
}
function removeRow(btn) {
    btn.closest('tr').remove();
    if (!document.getElementById('listingRows').rows.length) {
        document.getElementById('myListingsTable').style.display = 'none';
    }
}
function becomeOrganizer() {
    document.getElementById('sellTabItem').style.display = '';
    document.getElementById('becomeOrgBtn').textContent = 'Organizer ✓';
    document.getElementById('becomeOrgBtn').disabled = true;
    document.getElementById('becomeOrgBtn').classList.replace('btn-outline-warning', 'btn-success');
}
document.addEventListener('DOMContentLoaded', function() {
    initTicketsPage();
    initTicketPage();
    initDashboardPage();
});