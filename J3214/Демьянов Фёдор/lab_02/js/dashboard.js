document.addEventListener('DOMContentLoaded', async () => {
    // Проверка авторизации (Route Guard)

    const currentUser = window.auth.requireAuth();
    if (!currentUser) return;

    // Получение свежих данных пользователя с сервера
    let user = currentUser;
    try {
        user = await window.api.get(`/users/${currentUser.id}`);
        window.auth.setCurrentUser(user);
    } catch (e) {
        console.warn('Работаем с кэшированной сессией');
    }

    // Заполнение профиля исследователя
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setText('userName', user.name);
    setText('userCode', `Код: ${user.code}`);
    setText('userClass', user.class || 'Cadet Class');

    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl && user.avatarUrl) avatarEl.src = user.avatarUrl;
    // Дополнительный бейдж DeepSpace Member
    const deepSpaceBadge = document.getElementById('userDeepSpaceBadge');
    if (deepSpaceBadge) {
        deepSpaceBadge.classList.toggle('d-none', !user.isDeepSpaceMember);
    }

    // Привязка кнопки выхода
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        window.auth.logout();
    });

    // Инициализация тумблеров жизнеобеспечения из базы
    const gravSwitch = document.getElementById('gravSwitch');
    const foodSwitch = document.getElementById('foodSwitch');
    const dimSwitch = document.getElementById('dimSwitch');

    if (user.cabinSettings) {
        if (gravSwitch) gravSwitch.checked = !!user.cabinSettings.gravity;
        if (foodSwitch) foodSwitch.checked = !!user.cabinSettings.hypoallergenicFood;
        if (dimSwitch) dimSwitch.checked = !!user.cabinSettings.windowDimming;
    }


    // Обработка переключения тумблеров через PATCH без перезагрузки страницы
    const toastElement = document.getElementById('telemetryToast');
    const toast = toastElement ? new bootstrap.Toast(toastElement, { delay: 3000 }) : null;
    const toastMessage = document.getElementById('toastMessage');

    async function updateCabinSetting(settingKey, isChecked, labelName, inputElement) {
        const currentSettings = user.cabinSettings || {};
        const updatedSettings = {
            ...currentSettings,
            [settingKey]: isChecked
        };

        try {
            // Отправляем частичное обновление сущности
            const updatedUser = await window.api.patch(`/users/${user.id}`, {
                cabinSettings: updatedSettings
            });

            user = updatedUser;
            window.auth.setCurrentUser(updatedUser);

            if (toast && toastMessage) {
                const stateText = isChecked ? 'АКТИВИРОВАН' : 'ДЕАКТИВИРОВАН';
                toastMessage.textContent = `${labelName}: статус изменен на [${stateText}]`;
                toast.show();
            }
        } catch (error) {
            // В случае сетевого сбоя возвращаем тумблер на место
            inputElement.checked = !isChecked;
            alert('Сбой связи с сервером при попытке обновить параметры каюты');
        }
    }

    gravSwitch?.addEventListener('change', (e) => updateCabinSetting('gravity', e.target.checked, 'Режим гравитации', e.target));
    foodSwitch?.addEventListener('change', (e) => updateCabinSetting('hypoallergenicFood', e.target.checked, 'Гипоаллергенный рацион', e.target));
    dimSwitch?.addEventListener('change', (e) => updateCabinSetting('windowDimming', e.target.checked, 'Затемнение иллюминатора', e.target));

    // Загрузка билетов и журнала экспедиций
    const flightCard = document.getElementById('activeFlightCard');
    const noFlightsMessage = document.getElementById('noFlightsMessage');
    const tableBody = document.getElementById('bookingsTableBody');

    try {
        const bookings = await window.api.get(`/bookings?userId=${user.id}`);

        if (!bookings || bookings.length === 0) {
            // Если у кадета еще нет забронированных полетов
            if (flightCard) flightCard.classList.add('d-none');
            if (noFlightsMessage) noFlightsMessage.classList.remove('d-none');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center py-4 text-muted-custom fs-7">
                            Записи в бортовом журнале отсутствуют. Выберите миссию в каталоге.
                        </td>
                    </tr>
                `;
            }
            return;
        }

        // Берем последний рейс
        const activeBooking = bookings[bookings.length - 1];

        if (flightCard) {
            flightCard.classList.remove('d-none');
            if (noFlightsMessage) noFlightsMessage.classList.add('d-none');

            setText('flightCodeHeader', `Ближайший рейс // ${activeBooking.tourCode || 'EXP'}`);
            setText('flightStatusBadge', activeBooking.status || 'Подтвержден');
            setText('flightOriginCode', activeBooking.origin || 'EAR');
            setText('flightOriginName', activeBooking.originName || 'Земля (КК)');
            setText('flightDestCode', activeBooking.destination || 'ORB');
            setText('flightDestName', activeBooking.destinationName || activeBooking.route || 'Орбита');
            setText('flightCountdown', activeBooking.countdown || activeBooking.date);
            setText('flightGate', activeBooking.gate || 'A-12');
            setText('flightCabin', activeBooking.cabin || 'Модуль 1');

            // Наполнение модального окна посадочного сертификата
            setText('ticketModalLabel', `Посадочный сертификат // ${activeBooking.tourCode || 'EXP'}`);
            setText('modalFlightTitle', `${activeBooking.origin || 'EAR'} → ${activeBooking.destination || 'ORB'}`);
            setText('modalPassenger', user.name);
            setText('modalUserId', user.code);
            setText('modalGate', activeBooking.gate || 'Gateway A-12');
            setText('modalCabin', activeBooking.cabin || 'Каюта 1-й категории');
            setText('modalSerialNo', `SERIAL NO: ${activeBooking.serialNo || 'NT-DEFAULT'}`);
        }

        // Рендер таблицы бортового журнала
        if (tableBody) {
            tableBody.innerHTML = bookings.map(b => `
                <tr class="border-bottom border-secondary border-opacity-25">
                    <td class="py-3 text-main">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-rocket-takeoff text-secondary"></i>
                            <span>${b.route || `${b.origin} → ${b.destination}`}</span>
                        </div>
                    </td>
                    <td class="py-3 text-muted-custom fs-7">${b.date}</td>
                    <td class="py-3 text-main fs-7">${b.ship || 'Nova Shuttle'}</td>
                    <td class="py-3 text-end">
                        <span class="${b.statusBadge || 'badge-gold'} px-2 py-1 fs-7 rounded">${b.status || 'Ожидает старта'}</span>
                    </td>
                </tr>
            `).join('');
        }

    } catch (err) {
        console.error('Ошибка загрузки рейсов:', err);
    }
});