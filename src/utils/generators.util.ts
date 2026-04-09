export function generateId() {
    return Math.floor(Math.random() * 1000000);
}

export function generateDate() {
    return new Date().toISOString().split('T')[0];
}

export function generateHour() {
    return new Date().toISOString().split('T')[1];
}