document.addEventListener('DOMContentLoaded', async () => {
    // Поиск элементов контейнера и индикатора загрузки
    const apodContainer = document.getElementById('nasaApodContent');
    const apodSpinner = document.getElementById('nasaApodSpinner');
    if (!apodContainer) return;

    // Ключ Nasa API
    const API_KEY = 'DEMO_KEY';
    const PRIMARY_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&thumbs=true`;
    const FALLBACK_URL = 'https://corsproxy.io/?' + encodeURIComponent(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&thumbs=true`);

    let data = null;

    try {
        // Отправка сетевого запроса к стороннему серверу
        let response = await fetch(PRIMARY_URL);

        if (!response.ok) {
            console.warn(`NASA API вернул статус ${response.status}. Переключение на резервный канал...`);
            response = await fetch(FALLBACK_URL);
        }

        // Десериализация полученного JSON-ответа
        if (!response.ok) {
            throw new Error(`Сбой внешнего шлюза: ${response.status}`);
        }

        data = await response.json();
    } catch (error) {
        console.warn('Внешний шлюз недоступен, активирован автономный режим:', error);
    } finally {
        // Скрытие анимации загрузки
        if (apodSpinner) apodSpinner.classList.add('d-none');
    }

    if (data && (data.url || data.hdurl)) {
        let mediaHtml = '';
        const url = data.url || data.hdurl;

        if (data.media_type === 'video') {
            const isDirectVideo = /\.(mp4|webm|ogg)($|\?)/i.test(url);
            const isEmbeddable = /youtube\.com\/embed|player\.vimeo\.com/i.test(url);

            if (isDirectVideo) {
                // Прямой видеофайл
                mediaHtml = `
                    <div class="overflow-hidden rounded mb-3 bg-black d-flex align-items-center justify-content-center" style="height: 420px;">
                        <video src="${url}" controls class="w-100 h-100 rounded" style="max-height: 420px; object-fit: contain;" aria-label="Астрономическое видео дня NASA: ${data.title}"></video>
                    </div>
                `;
            } else if (isEmbeddable) {
                // Встраиваемый плеер
                mediaHtml = `<iframe src="${url}" title="Астрономическое видео дня NASA: ${data.title}" class="w-100 rounded mb-3" style="height: 420px;" frameborder="0" allowfullscreen></iframe>`;
            } else {
                // Сторонняя страница 
                const posterUrl = data.thumbnail_url || 'assets/images/earth-1.jpg';
                mediaHtml = `
                    <div class="overflow-hidden rounded mb-3 position-relative bg-black d-flex flex-column align-items-center justify-content-center text-center p-4" style="height: 420px;">
                        <img src="${posterUrl}" alt="" aria-hidden="true" class="position-absolute top-0 start-0 w-100 h-100 opacity-50" style="object-fit: cover; filter: blur(2px);">
                        <div class="position-relative" style="z-index: 2;">
                            <i class="bi bi-play-circle-fill text-light mb-3 d-block" style="font-size: 3.5rem; opacity: 0.9;" aria-hidden="true"></i>
                            <p class="text-main mb-3 fs-5 fw-medium">Астрономическая видеохроника NASA</p>
                            <a href="${url}" target="_blank" rel="noopener noreferrer" class="btn btn-accent py-2 px-4 fs-7 letter-spacing-2 text-uppercase" aria-label="Смотреть видеозапись на внешнем ресурсе (откроется в новой вкладке)">
                                <i class="bi bi-box-arrow-up-right me-2" aria-hidden="true"></i>Смотреть видеозапись
                                <span class="visually-hidden">(откроется в новой вкладке)</span>
                            </a>
                        </div>
                    </div>
                `;
            }
        } else {
            // Обычное изображение
            const imgUrl = data.hdurl || data.url;
            mediaHtml = `
                <div class="overflow-hidden rounded mb-3 position-relative bg-black bg-opacity-25 d-flex align-items-center justify-content-center" style="height: 420px;">
                    <img src="${imgUrl}" alt="${data.title}" class="w-100 h-100 rounded" style="object-fit: cover; max-height: 420px;">
                </div>
            `;
        }

        apodContainer.innerHTML = `
            ${mediaHtml}
            <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <h3 class="text-main mb-0 fs-5 fw-bold">${data.title}</h3>
                <span class="text-muted-custom fs-7 letter-spacing-2">${data.date}</span>
            </div>
            <p class="text-muted-custom fs-7 mb-0" style="line-height: 1.6;" title="${data.explanation}">
                ${data.explanation}
            </p>
        `;
    } else {
        // Отказоустойчивость: показ локального архивного кадра
        apodContainer.innerHTML = `
            <div class="overflow-hidden rounded mb-3" style="height: 420px;">
                <img src="assets/images/earth-1.jpg" alt="Резервный снимок орбиты Земли" class="w-100 h-100 rounded" style="object-fit: cover; max-height: 420px;">
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h3 class="text-main mb-0 fs-5 fw-bold">Орбитальная панорама Земли (Автономный архив)</h3>
                <span class="badge-silver px-2 py-1 fs-7 rounded">Offline Cache</span>
            </div>
            <p class="text-muted-custom fs-7 mb-0">
                Внешний шлюз временно недоступен. Отображаются архивные данные орбитального телескопа NovaTransit.
            </p>
        `;
    }
});