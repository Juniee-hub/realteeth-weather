import { useEffect, useMemo, useState } from "react"
import { loadKoreaDistricts } from "../../../entities/location/model/loadKoreaDistricts"
import type { KoreaLocation } from "../../../entities/location/model/location.types"

export function useLocationSearch(keyword: string) {
    const [all, setAll] = useState<KoreaLocation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        loadKoreaDistricts()
            .then((v) => mounted && setAll(v))
            .finally(() => mounted && setLoading(false))
        return () => {
            mounted = false
        }
    }, [])

    const results = useMemo(() => {
        const k = keyword.trim()
        if (!k) return []
        const lower = k.toLowerCase()
        return all
            .filter((x) => x.fullName.toLowerCase().includes(lower))
            .slice(0, 20)
    }, [keyword, all])

    return { loading, results }
}
