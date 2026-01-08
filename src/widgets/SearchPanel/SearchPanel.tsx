import { useMemo, useState } from "react"
import { Card } from "../../shared/ui/Card"
import { Button } from "../../shared/ui/Button"
import { useLocationSearch } from "../../features/location-search/model/useLocationSearch"
// import { geocodeKR } from "../../entities/weather/api/openweather.api"
import { geocodeKR } from "../../entities/location/api/geocoder.api"
import { useFavoritesActions } from "../../features/favorites/model/favorites.query"

export function SearchPanel({ onSelect }: {
    onSelect: (v: { id: string; name: string; lat: number; lon: number }) => void
}) {
    const [keyword, setKeyword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const { loading, results } = useLocationSearch(keyword)

    const hint = useMemo(() => {
        if (!keyword.trim()) return "예: 서울특별시 / 종로구 / 청운동"
        if (loading) return "행정구역 로딩 중…"
        return results.length ? "아래 목록에서 선택하세요." : "일치하는 장소가 없습니다."
    }, [keyword, loading, results.length])
    const normalizeDistrict = (s: string) => s.replace(/-/g, " ").replace(/\s+/g, " ").trim()
    const handlePick = async (fullName: string) => {
        setError(null)
        // 1) OpenWeather Geocoding으로 좌표 확보 (대한민국 한정)
        const query = normalizeDistrict(fullName) // ✅ 하이픈 -> 공백
        const geo = await geocodeKR(query)
        if (!geo) {
            setError("해당 장소의 정보가 제공되지 않습니다.")
            return
        }

        const id = fullName
        onSelect({ id, name: fullName, lat: geo.lat, lon: geo.lon })
    }
    const actions = useFavoritesActions()
    const addFavorite = async (fullName: string) => {
        setError(null)
        const query = normalizeDistrict(fullName) // ✅ 하이픈 -> 공백
        const geo = await geocodeKR(query)
        if (!geo) {
            setError("해당 장소의 정보가 제공되지 않습니다.")
            return
        }
        try {
            actions.add({
                id: fullName,
                query: fullName,
                alias: fullName.split(" ").at(-1) ?? fullName,
                lat: geo.lat,
                lon: geo.lon,
            })
            // 빠른 UX를 위해 keyword 유지
            setError(null)
        } catch (e: any) {
            setError(e?.message ?? "즐겨찾기 추가 실패")
        }
    }

    return (
        <Card className="space-y-3">
            <div className="text-lg font-semibold">장소 검색</div>

            <input
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                placeholder="시/군/구/동 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            <div className="text-sm text-gray-600">{hint}</div>
            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="max-h-64 overflow-auto rounded-xl border">
                {results.map((r) => (
                    <div key={r.id} className="flex items-center justify-between gap-2 border-b p-3 last:border-b-0">
                        <button className="text-left text-sm hover:underline" onClick={() => handlePick(r.fullName)}>
                            {r.fullName}
                        </button>
                        <Button onClick={() => addFavorite(r.fullName)}>즐겨찾기 +</Button>
                    </div>
                ))}
            </div>
        </Card>
    )
}
