export function formatDateAndTime(dateTimeString: any) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateTimeString);
    //@ts-ignore
    return date.toLocaleDateString('ru-RU', options) + ' | ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatDateWithDayOfWeek(dateTimeString: string): string {
    const date = new Date(dateTimeString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${day}.${month} | ${dayOfWeek}`;
}

function extractTimeFromDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Экспортируем объект с функциями
export const dateUtils = {
    formatDateAndTime,
    formatDateWithDayOfWeek,
    extractTimeFromDateTime
};
