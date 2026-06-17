const upcomingContainer = document.getElementById('upcoming');
const pastContainer = document.getElementById('past');

document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const API_BASE = 'http://localhost:3000';

    try {
        const [ordersResponse, eventsResponse] = await Promise.all([
            axios.get(`${API_BASE}/orders`, { params: { "userId": currentUser.id } }),
            axios.get(`${API_BASE}/events`)
        ]);

        const rawOrders = ordersResponse.data;
        const events = eventsResponse.data;

        const orders = rawOrders.map(order => {
            const foundEvent = events.find(e => e.id === order.eventId);
            return {
                ...order,
                event: foundEvent || null
            };
        });

        document.getElementById('tickets-amount').innerText = `Билетов: ${orders.length}`;

        upcomingContainer.innerHTML = "";
        pastContainer.innerHTML = "";

        const now = new Date();

        const upcomingOrders = orders.filter(order => {
            if (!order.event || !order.event.dateRaw) return false;
            return new Date(order.event.dateRaw) >= now;
        });

        const pastOrders = orders.filter(order => {
            if (!order.event || !order.event.dateRaw) return false;
            return new Date(order.event.dateRaw) < now;
        });

        if (upcomingOrders.length === 0) {
            upcomingContainer.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <h5>По вашему запросу ничего не найдено</h5>
                </div>
            `;
        }

        if (pastOrders.length === 0) {
            pastContainer.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <h5>По вашему запросу ничего не найдено</h5>
                </div>
            `;
        }

        upcomingOrders.forEach(order => {
            const event = order.event;
            const eventDate = new Date(event.dateRaw);
            const cardHtml = `
                <div class="card ticket-card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-2 text-center border-end">
                                <div class="h3 mb-0 fw-bold text-primary">${eventDate.getDate()}</div>
                                <div class="small text-uppercase text-muted">${eventDate.toLocaleString('ru-RU', { month: 'short' })}</div>
                            </div>
                            <div class="col-md-6 ps-4">
                                <h2 class="mb-1">${event.title}</h2>
                                <p class="text-muted mb-0 small">${event.place}</p>
                            </div>
                            <div class="col-md-4 text-md-end mt-3 mt-md-0">
                                <button class="btn btn-sm btn-light border">Заказ <strong>${order.id}</strong></button>
                                <button class="btn btn-sm btn-outline-danger">Вернуть</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            upcomingContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

        pastOrders.forEach(order => {
            const event = order.event;
            const eventDate = new Date(event.dateRaw);
            const cardHtml = `
                <div class="card ticket-card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-2 text-center border-end">
                                <div class="h3 mb-0 fw-bold text-primary">${eventDate.getDate()}</div>
                                <div class="small text-uppercase text-muted">${eventDate.toLocaleString('ru-RU', { month: 'short' })}</div>
                            </div>
                            <div class="col-md-6 ps-4">
                                <h2 class="mb-1">${event.title}</h2>
                                <p class="text-muted mb-0 small">${event.place}</p>
                            </div>
                            <div class="col-md-4 text-md-end mt-3 mt-md-0">
                                <button class="btn btn-sm btn-light border">Заказ <strong>${order.id}</strong></button>
                                <button class="btn btn-sm btn-outline-danger">Вернуть</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            pastContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

    } catch (error) {
        console.error('Ошибка при обработке билетов:', error);
        upcomingContainer.innerHTML = `<div class="col-12 alert alert-danger text-center">Ошибка загрузки данных.</div>`;
        pastContainer.innerHTML = `<div class="col-12 alert alert-danger text-center">Ошибка загрузки данных.</div>`;
    }
});