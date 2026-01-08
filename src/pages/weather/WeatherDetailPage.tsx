import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Card } from "../../shared/ui/Card"
import { formatTemp } from "../../shared/lib/format"
import { useWeatherByGrid } from "../../features/weather-query/model/useWeather"
import { favoritesStore } from "../../features/favorites/model/favorites.store"
import { latLonToGrid } from "../../shared/lib/kmaGrid.ts"

// eslint-disable-next-line react-refresh/only-export-components
export const formatHHMM = (hhmm: number | string) => {
    const s = String(hhmm).padStart(4, "0") // 900 -> "0900"
    return `${s.slice(0, 2)}:${s.slice(2, 4)}`
}

export function WeatherDetailPage() {
    const nav = useNavigate()
    const params = useParams()
    const location = useLocation()
    const locationId = decodeURIComponent(params.locationId ?? "")
    // Home에서 navigate state로 좌표를 전달했을 수도 있음
    const state = (location.state as any) ?? null

    // 즐겨찾기에서 들어온 경우: 저장된 좌표 사용
    const fav = favoritesStore.list().find((f) => f.id === locationId)
    const lat = state?.lat ?? fav?.lat
    const lon = state?.lon ?? fav?.lon
    const name = state?.name ?? fav?.alias ?? locationId

    const { nx, ny } = latLonToGrid(lat as number, lon as number)
    const q = useWeatherByGrid(nx, ny, name)

    return (
        <div className="mx-auto max-w-3xl space-y-4 p-4">
            <Card className="space-y-2">
                <span className={'cursor-pointer'} onClick={() => nav('/')}>뒤로</span>
            </Card>
            <Card className="space-y-2">
                <div className="text-lg font-semibold">{name}</div>
                <div className="text-sm text-gray-600">{locationId}</div>
            </Card>

            {q.isLoading && <Card>날씨 불러오는 중…</Card>}
            {q.isError && <Card className="text-red-600">해당 장소의 정보가 제공되지 않습니다.</Card>}

            {q.data && (
                <>
                    <Card className="flex items-end justify-between">
                        <div>
                            <div className="text-4xl font-bold">{formatTemp(q.data.currentTemp)}</div>
                            <div className="text-sm text-gray-600">{q.data.description}</div>
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                            <div>최저 {formatTemp(q.data.minTemp)}</div>
                            <div>최고 {formatTemp(q.data.maxTemp)}</div>
                        </div>
                    </Card>

                    <Card className="space-y-2">
                        <div className="text-base font-semibold">시간대별 기온 (24h)</div>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                            {q.data.hourly.map((h) => (
                                <div key={h.time} className="rounded-xl border p-2 text-center">
                                    <div className="text-xs text-gray-500">{formatHHMM(h.time)}</div>
                                    <div className="font-semibold">{formatTemp(h.temp)}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </>
            )}
        </div>
    )
}
