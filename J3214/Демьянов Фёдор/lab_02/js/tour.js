document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id') || 'moon';

    let currentTour = null;

    try {
        currentTour = await window.api.get(`/tours/${tourId}`);
    } catch (err) {
        console.warn(`Экспедиция с id=${tourId} не найдена на сервере. Загрузка Луны по умолчанию.`);
        try {
            currentTour = await window.api.get('/tours/moon');
        } catch (e) {
            alert('Не удалось загрузить данные миссии. Проверьте запуск сервера.');
            return;
        }
    }

    // Наполнение базовой текстовой информации
    document.getElementById('pageTitle').textContent = `${currentTour.title} | NovaTransit`;
    document.getElementById('tourTitle').textContent = currentTour.title;
    document.getElementById('tourDesc').textContent = currentTour.desc;
    document.getElementById('tourBadge').textContent = currentTour.badge;
    document.getElementById('tourBadge').className = `${currentTour.badgeClass} px-2 py-1 fs-7 rounded`;
    document.getElementById('tourCode').textContent = currentTour.code;
    document.getElementById('tourBasePriceDisplay').textContent = `${currentTour.price.toLocaleString('ru-RU')} $`;

    document.getElementById('tourWindow').textContent = currentTour.window;
    document.getElementById('tourSeats').textContent = currentTour.seats;
    document.getElementById('tourShip').textContent = currentTour.ship;

    document.getElementById('specDistance').textContent = currentTour.specs.distance;
    document.getElementById('specGravity').textContent = currentTour.specs.gravity;
    document.getElementById('specGforce').textContent = currentTour.specs.gforce;
    document.getElementById('specRadiation').textContent = currentTour.specs.radiation;

    // Наполнение слайдера
    currentTour.slides.forEach((slide, idx) => {
        const i = idx + 1;
        const img = document.getElementById(`slideImg${i}`);
        const title = document.getElementById(`slideTitle${i}`);
        const desc = document.getElementById(`slideDesc${i}`);
        if (img) img.src = slide.img;
        if (title) title.textContent = slide.title;
        if (desc) desc.textContent = slide.desc;
    });

    // Наполнение таймлайна полета
    const timelineContainer = document.getElementById('timelineContainer');
    timelineContainer.innerHTML = '';
    currentTour.timeline.forEach((step, idx) => {
        const isLast = idx === currentTour.timeline.length - 1;
        const dotClass = isLast ? 'text-main' : 'text-secondary';
        const dotSize = isLast ? '10px' : '8px';
        timelineContainer.innerHTML += `
            <div class="position-relative ${isLast ? '' : 'mb-4'}">
                <i class="bi bi-circle-fill ${dotClass} position-absolute top-0 start-0 translate-middle" style="font-size: ${dotSize};"></i>
                <h6 class="text-main mb-1">${step.time} // ${step.title}</h6>
                <p class="text-muted-custom fs-7 mb-0">${step.desc}</p>
            </div>
        `;
    });

    // Подготовка модального окна бронирования
    const dateSelect = document.getElementById('flightDate');
    dateSelect.innerHTML = '<option value="" selected disabled>Выберите окно старта</option>';
    currentTour.dates.forEach(d => {
        dateSelect.innerHTML += `<option value="${d}">${d}</option>`;
    });

    // Автозаполнение ФИО и почты, если пользователь уже авторизован
    const currentUser = window.auth ? window.auth.getCurrentUser() : null;
    const cadetNameInput = document.getElementById('cadetName');
    const cadetEmailInput = document.getElementById('cadetEmail');
    if (currentUser) {
        if (cadetNameInput) cadetNameInput.value = currentUser.name;
        if (cadetEmailInput) cadetEmailInput.value = currentUser.email;
    }

    // Калькулятор стоимости
    const basePrice = currentTour.price;
    const totalPriceElem = document.getElementById('totalPrice');
    const checkboxes = document.querySelectorAll('.extra-option');
    const bookingForm = document.getElementById('bookingForm');

    function calculateTotal() {
        let total = basePrice;
        checkboxes.forEach(cb => {
            if (cb.checked) total += parseInt(cb.value, 10);
        });
        return total;
    }

    function updatePrice() {
        totalPriceElem.textContent = `${calculateTotal().toLocaleString('ru-RU')} $`;
    }
    updatePrice();

    checkboxes.forEach(cb => cb.addEventListener('change', updatePrice));

    // Отправка бронирования на json-server (POST /bookings)
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!bookingForm.checkValidity()) {
            bookingForm.classList.add('was-validated');
            return;
        }

        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Оформление...';

        const finalPrice = calculateTotal();
        const selectedDate = dateSelect.value;
        const serialNumber = `NT-${Math.floor(1000 + Math.random() * 9000)}-2026-${currentTour.code.replace(/[^a-zA-Z0-9]/g, '')}`;

        // Формируем запись бронирования
        const newBooking = {
            userId: currentUser ? currentUser.id : null,
            tourId: currentTour.id,
            tourCode: currentTour.code.split(' // ')[0] || currentTour.code,
            route: `Земля → ${currentTour.title.split(' ')[0]}`,
            origin: "EAR",
            originName: "Земля (КК)",
            destination: currentTour.destination.toUpperCase(),
            destinationName: currentTour.title,
            date: selectedDate,
            countdown: "30 дн. 10:00",
            ship: currentTour.ship,
            gate: "Gateway A-12",
            cabin: "Каюта 1-й категории",
            status: "Ожидает старта",
            statusBadge: "badge-gold",
            totalPrice: finalPrice,
            serialNo: serialNumber,
            active: true
        };

        try {
            await window.api.post('/bookings', newBooking);

            const modalEl = document.getElementById('bookingModal');
            bootstrap.Modal.getInstance(modalEl).hide();

            alert(`Место успешно забронировано! Номер сертификата: ${serialNumber}. Данные синхронизированы с вашим терминалом.`);

            // Если авторизован - переводим в кабинет, чтобы увидеть рейс
            if (currentUser) {
                window.location.href = 'dashboard.html';
            } else {
                bookingForm.reset();
                bookingForm.classList.remove('was-validated');
                updatePrice();
            }
        } catch (err) {
            alert(`Ошибка бронирования: ${err.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Подтвердить бронь';
        }
    });
});