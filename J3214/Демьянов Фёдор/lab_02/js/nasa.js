document.addEventListener('DOMContentLoaded', async () => {
    // Поиск элементов контейнера и индикатора загрузки
    const apodContainer = document.getElementById('nasaApodContent');
    const apodSpinner = document.getElementById('nasaApodSpinner');
    if (!apodContainer) return;

    // Ключ Nasa API
    const NASA_API_KEY = 'P0idgW3S2na0dTo54cnyQO0QGj75cHfl0J3G8Wnk';
    const NASA_APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

    try {
        // Отправка сетевого запроса к стороннему серверу
        const response = await fetch(NASA_APOD_URL);

        if (!response.ok) {
            throw new Error(`Ошибка NASA API: ${response.status} ${response.statusText}`);
        }

        // Десериализация полученного JSON-ответа
        const data = await response.json();

        // Скрытие анимации загрузки
        if (apodSpinner) apodSpinner.classList.add('d-none');

        // Определение типа медиаконтента: снимок или видеоролик
        const mediaUrl = data.hdurl || data.url;
        const mediaHtml = data.media_type === 'video'
            ? `<iframe src="${mediaUrl}" class="w-100 rounded mb-3" style="height: 420px;" frameborder="0" allowfullscreen></iframe>`
            : `<div class="overflow-hidden rounded mb-3 position-relative bg-black bg-opacity-25 d-flex align-items-center justify-content-center" style="height: 420px;">
                 <img src="${mediaUrl}" alt="${data.title}" class="w-100 h-100 rounded" style="object-fit: cover; max-height: 420px;">
               </div>`;

        // Формирование и вставка разметки с данными из API в DOM-дерево
        apodContainer.innerHTML = `
            ${mediaHtml}
            <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <h6 class="text-main mb-0 fs-5 fw-bold">${data.title}</h6>
                <span class="text-muted-custom fs-7 letter-spacing-2">${data.date}</span>
            </div>
            <p class="text-muted-custom fs-7 mb-0" style="line-height: 1.6;" title="${data.explanation}">
                ${data.explanation}
            </p>
        `;
    } catch (error) {
        // Обработка ошибок
        console.warn('Сбой подключения к NASA APOD, переключение на резервный манифест:', error);

        if (apodSpinner) apodSpinner.classList.add('d-none');

        // Отказоустойчивость показ локального архивного кадра
        apodContainer.innerHTML = `
            <div class="overflow-hidden rounded mb-3" style="height: 420px;">
                <img src="assets/images/earth-1.jpg" alt="Резервный снимок" class="w-100 h-100 rounded" style="object-fit: cover; max-height: 420px;">
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="text-main mb-0 fs-5 fw-bold">Орбитальная панорама Земли (Автономный архив)</h6>
                <span class="badge-silver px-2 py-1 fs-7 rounded">Offline Mode</span>
            </div>
            <p class="text-muted-custom fs-7 mb-0">
                Связь с внешним шлюзом NASA временно недоступна. Отображаются архивные данные орбитального телескопа NovaTransit.
            </p>
        `;
    }
});