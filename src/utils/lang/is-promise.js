export default function (value) {
    if (value !== null && typeof value === 'object') {
        return value && typeof value.then === 'function';
    }

    return false;
}
