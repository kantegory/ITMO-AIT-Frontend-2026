// Утилиты форматирования
export function useFormatters() {
    function formatDate(dateString) {
        if (!dateString) return 'Дата уточняется'
        const [year, month, day] = String(dateString).split('-')
        if (!year || !month || !day) return 'Дата уточняется'
        return `${day}.${month}.${year}`
    }

    function getGoalLabel(goal) {
        return { sport: 'Спортивные', fun: 'Развлекательные', study: 'Учебные', ceremony: 'Торжественные' }[goal] || 'Развлекательные'
    }

    function getPlaceLabel(place) {
        return {
            assembly: 'Актовый зал', yard: 'Школьный двор', classroom: 'Школьный класс',
            outside: 'Вне школы', stadium: 'Стадион', gym1: 'Спортивный зал №1', gym2: 'Спортивный зал №2'
        }[place] || 'Актовый зал'
    }

    return { formatDate, getGoalLabel, getPlaceLabel }
}