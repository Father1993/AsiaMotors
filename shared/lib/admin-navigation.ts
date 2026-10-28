export function adminReturnTo(value: unknown, base: '/admin' | '/admin/requests' | '/admin/blog' = '/admin') {
    return typeof value === 'string' &&
        value.length < 2048 &&
        !value.includes('#') &&
        (value === base || value.startsWith(base + '?'))
        ? value
        : base
}
