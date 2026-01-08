import { useQuery } from "@tanstack/react-query"
import { getWeatherByGrid } from "../../../entities/weather/api/kma.api"

export function useWeatherByGrid(nx?: number, ny?: number, locationName?: string) {
    return useQuery({
        queryKey: ["kma-weather", nx, ny, locationName],
        enabled: typeof nx === "number" && typeof ny === "number" && !!locationName,
        queryFn: () => getWeatherByGrid(nx!, ny!, locationName!),
    })
}
