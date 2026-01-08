import { Card } from "../../shared/ui/Card"
import { FavoriteCard } from "../../features/favorites/ui/FavoriteCard"
import { useFavorites } from "../../features/favorites/model/favorites.query"

export function FavoriteGrid() {
    const { data: items = [] } = useFavorites()

    return (
        <Card className="space-y-3">
            <div className="flex items-baseline justify-between">
                <div className="text-lg font-semibold">즐겨찾기</div>
                <div className="text-sm text-gray-600">{items.length}/6</div>
            </div>

            {items.length === 0 ? (
                <div className="text-sm text-gray-600">즐겨찾기한 장소가 없습니다.</div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((f) => (
                        <FavoriteCard key={f.id} fav={f} onChanged={function (): void {
                            throw new Error("Function not implemented.")
                        }} />
                    ))}
                </div>
            )}
        </Card>
    )
}
