import { Card } from "../../../shared/ui/Card"
import { formatTemp } from "../../../shared/lib/format"
import { useCurrentCoords } from "../model/useCurrentCoords"
import { useWeatherByGrid } from "../../weather-query/model/useWeather"
import { latLonToGrid } from "../../../shared/lib/kmaGrid.ts"
import { formatHHMM } from "../../../pages/weather/WeatherDetailPage.tsx"

export function CurrentLocationWeather() {
    const { lat, lon, loading, error } = useCurrentCoords()
    const { nx, ny } = latLonToGrid(lat as number, lon as number)
    const q = useWeatherByGrid(nx, ny, "현재 위치")

    return (
        <Card className="space-y-2">
            <div className="text-lg font-semibold">현재 위치 날씨</div>

            {loading && <div className="text-sm text-gray-500">위치 확인 중…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}

            {q.isLoading && <div className="text-sm text-gray-500">날씨 불러오는 중…</div>}
            {q.isError && <div className="text-sm text-red-600">날씨 정보를 불러오지 못했습니다.</div>}

            {q.data && (
                <>
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-3xl font-bold">{formatTemp(q.data.currentTemp)}</div>
                            <div className="text-sm text-gray-600">{q.data.description}</div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <div>최저 {formatTemp(q.data.minTemp)}</div>
                            <div>최고 {formatTemp(q.data.maxTemp)}</div>
                        </div>
                    </div>
                    <div className="text-base font-semibold">시간대별 기온 (24h)</div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {q.data.hourly.map((h) => (
                            <div key={h.time} className="rounded-xl border p-2 text-center">
                                <div className="text-xs text-gray-500">{formatHHMM(h.time)}</div>
                                <div className="font-semibold">{formatTemp(h.temp)}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </Card>
    )
}
