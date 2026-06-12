import { ref, reactive, computed, watch } from 'vue';
import useApi from './useApi';

const allCourses = ref([]);
const loading = ref(false);
const error = ref(null);

const filters = reactive({
    subject: '',
    level: [],
    maxPrice: 15000,
    sort: 'popular'
});

const pagination = reactive({
    currentPage: 1,
    perPage: 6
});

export default function useCourses() {
    const api = useApi();

    watch(
        () => [filters.subject, filters.level, filters.maxPrice],
        () => {
            pagination.currentPage = 1;
        },
        { deep: true }
    );

    function sanitizeCourseData(courseArray) {
        const fallbackImages = [
            'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500', 
            'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=500',
            'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500'
        ];

        if (!Array.isArray(courseArray)) return [];

        return courseArray.map((course, index) => {
            let currentImage = course.image;
            if (typeof currentImage === 'string') {
                const isInvalid = /^\s*data:/i.test(currentImage) || 
                                  currentImage.includes('svg+xml') || 
                                  currentImage.includes('<svg');
                if (isInvalid) currentImage = null;
            }
            return {
                ...course,
                image: currentImage || fallbackImages[index % fallbackImages.length]
            };
        });
    }

    async function fetchCourses() {
        if (allCourses.value.length > 0) return;

        loading.value = true;
        error.value = null;
        try {
            const response = await api.get('/courses', {});
            if (response && response.data && Array.isArray(response.data)) {
                allCourses.value = sanitizeCourseData(response.data);
            } else {
                allCourses.value = [];
            }
        } catch (err) {
            error.value = err.message;
            allCourses.value = [];
            console.error('Ошибка загрузки данных:', err);
        } finally {
            loading.value = false;
        }
    }

    const filteredCourses = computed(() => {
        let result = [...allCourses.value];

        if (filters.subject) {
            result = result.filter(c => 
                c.subject === filters.subject || 
                c.category === filters.subject ||
                c.subjectName === filters.subject
            );
        }
        
        if (filters.level && filters.level.length > 0) {
            result = result.filter(c => 
                filters.level.includes(c.level) || 
                filters.level.includes(c.levelName) ||
                (c.level === 'beginner' && filters.level.includes('Начальный')) ||
                (c.level === 'intermediate' && filters.level.includes('Средний')) ||
                (c.level === 'advanced' && filters.level.includes('Продвинутый'))
            );
        }
        
        result = result.filter(c => (Number(c.price) || 0) <= filters.maxPrice);

        if (filters.sort === 'price-asc') {
            result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        } else if (filters.sort === 'price-desc') {
            result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        } else if (filters.sort === 'rating') {
            result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        } else {
            result.sort((a, b) => (Number(b.students) || 0) - (Number(a.students) || 0));
        }

        return result;
    });

    const totalCourses = computed(() => filteredCourses.value.length);

    const courses = computed(() => {
        const start = (pagination.currentPage - 1) * pagination.perPage;
        const end = start + pagination.perPage;
        return filteredCourses.value.slice(start, end);
    });

    function resetFilters() {
        filters.subject = '';
        filters.level = [];
        filters.maxPrice = 15000;
        filters.sort = 'popular';
        pagination.currentPage = 1;
    }

    return {
        courses,
        loading,
        error,
        filters,
        pagination,
        totalCourses,
        fetchCourses,
        resetFilters
    };
}