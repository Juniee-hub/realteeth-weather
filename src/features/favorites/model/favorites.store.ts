import { storage } from "../../../shared/lib/storage"

export type Favorite = {
    id: string           // locationId
    query: string        // 검색어/주소
    alias: string        // 별칭
    lat: number
    lon: number
}

const KEY = "favorites_v1"
const MAX = 6

export const favoritesStore = {
    list(): Favorite[] {
        return storage.get<Favorite[]>(KEY, [])
    },
    add(next: Favorite) {
        const cur = favoritesStore.list()
        if (cur.some((c) => c.id === next.id)) return
        if (cur.length >= MAX) throw new Error("즐겨찾기는 최대 6개까지 추가할 수 있습니다.")
        storage.set(KEY, [next, ...cur])
    },
    remove(id: string) {
        const cur = favoritesStore.list()
        storage.set(KEY, cur.filter((c) => c.id !== id))
    },
    rename(id: string, alias: string) {
        const cur = favoritesStore.list()
        storage.set(KEY, cur.map((c) => (c.id === id ? { ...c, alias } : c)))
    },
}
