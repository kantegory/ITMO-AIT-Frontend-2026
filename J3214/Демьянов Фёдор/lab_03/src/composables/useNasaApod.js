import { ref } from 'vue';

export function useNasaApod() {
    const apodData = ref(null);
    const isLoading = ref(true);
    const isOffline = ref(false);

    const API_KEY = 'P0idgW3S2na0dTo54cnyQO0QGj75cHfl0J3G8Wnk';
    const PRIMARY_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&thumbs=true`;
    const FALLBACK_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(PRIMARY_URL);

    const fetchApod = async () => {
        isLoading.value = true;
        isOffline.value = false;

        // Проверка кэша сессии
        const cached = sessionStorage.getItem('nasa_apod_cache');
        if (cached) {
            try {
                apodData.value = JSON.parse(cached);
                isLoading.value = false;
                return;
            } catch (e) {
                sessionStorage.removeItem('nasa_apod_cache');
            }
        }

        try {
            let response = await fetch(PRIMARY_URL);
            if (!response.ok) {
                response = await fetch(FALLBACK_URL);
            }
            if (!response.ok) throw new Error('Шлюз NASA недоступен');

            const data = await response.json();
            apodData.value = data;
            sessionStorage.setItem('nasa_apod_cache', JSON.stringify(data));
        } catch (error) {
            console.warn('Активирован автономный архив телеметрии:', error);
            isOffline.value = true;
            apodData.value = {
                title: 'Орбитальная панорама Земли (Автономный архив)',
                date: 'Offline Cache',
                explanation: 'Внешний шлюз временно недоступен. Отображаются архивные данные орбитального телескопа NovaTransit.',
                media_type: 'image',
                url: 'assets/images/earth-1.jpg'
            };
        } finally {
            isLoading.value = false;
        }
    };

    return {
        apodData,
        isLoading,
        isOffline,
        fetchApod
    };
}