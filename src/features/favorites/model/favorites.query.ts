import { useQuery, useQueryClient } from "@tanstack/react-query"
import { type Favorite, favoritesStore } from "./favorites.store"

const KEY = ["favorites"] as const

export function useFavorites() {
    return useQuery<Favorite[]>({
        queryKey: KEY,
        queryFn: async () => favoritesStore.list(),
        initialData: favoritesStore.list(),
        staleTime: Infinity,
    })
}

export function useFavoritesActions() {
    const qc = useQueryClient()

    const refresh = () => {
        // localStorage 변경 후 캐시를 즉시 갱신
        qc.setQueryData(KEY, favoritesStore.list())
        // 또는 qc.invalidateQueries({ queryKey: KEY })
    }

    return {
        add: (fav: Favorite) => {
            favoritesStore.add(fav)
            refresh()
        },
        remove: (id: string) => {
            favoritesStore.remove(id)
            refresh()
        },
        rename: (id: string, alias: string) => {
            favoritesStore.rename(id, alias)
            refresh()
        },
        refresh,
    }
}
