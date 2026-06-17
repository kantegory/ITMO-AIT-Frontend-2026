document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE = 'http://localhost:3000';
    
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (!eventId) {
        alert('Мероприятие не выбрано!');
        window.location.href = 'index.html';
        return;
    }

    let selectedSeatName = "Ряд 1, Место 1";

    const seats = document.querySelectorAll('.seat:not(.occupied)');
    
    if (seats.length > 0) {
        seats[0].classList.add('selected');
        if (seats[0].hasAttribute('title')) {
            selectedSeatName = seats[0].getAttribute('title');
        }
        document.getElementById('modal-selected-seat').innerText = selectedSeatName;
    }

    seats.forEach(seat => {
        seat.addEventListener('click', (e) => {
            seats.forEach(s => s.classList.remove('selected'));
            e.target.classList.add('selected');
            
            selectedSeatName = e.target.getAttribute('title') || "Выбранное место";

            document.getElementById('modal-selected-seat').innerText = selectedSeatName;
        });
    });

    try {
        const response = await axios.get(`${API_BASE}/events/${eventId}`);
        const event = response.data;

        document.getElementById('page-title').innerText = event.title + " — Билеты.ру";
        document.getElementById('type-page-link').innerText = event.typePage;
        document.getElementById('type-page-link').href = event.typePageLink;
        document.getElementById('current-page').innerText = event.title;
        document.getElementById('event-title').innerText = event.title;
        document.getElementById('event-description').innerText = event.fullDescription;
        document.getElementById('event-image').src = event.image;
        
        document.getElementById('sidebar-date').innerText = event.date;
        document.getElementById('sidebar-place').innerText = event.place;
        document.getElementById('sidebar-price').innerText = `от ${event.price.toLocaleString()} ₽`;

        document.getElementById('modal-event-title').innerText = event.title;
        document.getElementById('modal-event-place').innerText = event.place;
        document.getElementById('modal-total-price').innerText = `${event.price.toLocaleString()} ₽`;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        alert('Не удалось загрузить данные мероприятия. Проверьте json-server.');
    }

    document.getElementById('order-form').addEventListener('submit', async (e) => {
        e.preventDefault();
    });
});