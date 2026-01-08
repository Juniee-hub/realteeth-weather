import { useNavigate } from "react-router-dom"
import { CurrentLocationWeather } from "../../features/current-location-weather/ui/CurrentLocationWeather"
import { SearchPanel } from "../../widgets/SearchPanel/SearchPanel"
import { FavoriteGrid } from "../../widgets/FavoriteGrid/FavoriteGrid"

export function HomePage() {
    const nav = useNavigate()

    return (
        <div className="mx-auto max-w-5xl space-y-4 p-4">
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Weather App</h1>
                <div className="text-sm text-gray-500">React + TS + FSD + Query</div>
            </header>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <CurrentLocationWeather />
                <SearchPanel />
            </div>

            <FavoriteGrid />
        </div>
    )
}
