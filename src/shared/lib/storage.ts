export const storage = {
    get<T>(key: string, fallback: T): T {
        try {
            const raw = localStorage.getItem(key)
            if (!raw) return fallback
            return JSON.parse(raw) as T
        } catch {
            return fallback
        }
    },
    set(key: string, value: unknown) {
        localStorage.setItem(key, JSON.stringify(value))
    },
}
