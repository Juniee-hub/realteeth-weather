import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "../../../shared/ui/Card"
import { Button } from "../../../shared/ui/Button"
import { formatTemp } from "../../../shared/lib/format"
import { useWeatherByGrid } from "../../weather-query/model/useWeather"
import { type Favorite } from "../model/favorites.store"
import { RenameFavoriteModal } from "./RenameFavoriteModal"
import { latLonToGrid } from "../../../shared/lib/kmaGrid.ts"
import { useFavoritesActions } from "../model/favorites.query.ts"

export function FavoriteCard({ fav, onChanged }: { fav: Favorite; onChanged: () => void }) {
    const nav = useNavigate()
    const { nx, ny } = latLonToGrid(fav.lat as number, fav.lon as number)
    const q = useWeatherByGrid(nx, ny, fav.alias)
    const [renameOpen, setRenameOpen] = useState(false)

    const handleClick = () => nav(`/weather/${encodeURIComponent(fav.id)}`)
    const actions = useFavoritesActions()

    return (
        <>
            <Card className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <button className="text-left" onClick={handleClick}>
                        <div className="text-base font-semibold">{fav.alias}</div>
                        <div className="text-xs text-gray-500">{fav.query}</div>
                    </button>

                    <div className="flex gap-1">
                        <Button onClick={() => setRenameOpen(true)}>별칭</Button>
                        <Button
                            onClick={() => {
                                actions.remove(fav.id)
                            }}
                        >
                            삭제
                        </Button>
                    </div>
                </div>

                {q.isLoading && <div className="text-sm text-gray-500">불러오는 중…</div>}
                {q.isError && <div className="text-sm text-red-600">해당 장소의 정보가 제공되지 않습니다.</div>}
                {q.data && (
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold">{formatTemp(q.data.currentTemp)}</div>
                        <div className="text-sm text-gray-600">
                            <div>최저 {formatTemp(q.data.minTemp)}</div>
                            <div>최고 {formatTemp(q.data.maxTemp)}</div>
                        </div>
                    </div>
                )}
            </Card>

            <RenameFavoriteModal
                open={renameOpen}
                initial={fav.alias}
                onClose={() => setRenameOpen(false)}
                onSave={(v) => {
                    actions.rename(fav.id, v)
                    setRenameOpen(false)
                    onChanged()
                }}
            />
        </>
    )
}
