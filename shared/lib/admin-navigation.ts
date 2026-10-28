export function adminReturnTo(value: unknown) {
    return typeof value === 'string' && value.length < 2048 && /^\/admin(?:\?[^#]*)?$/.test(value)
        ? value
        : '/admin'
}
