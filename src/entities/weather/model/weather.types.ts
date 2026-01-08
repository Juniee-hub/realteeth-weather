export type WeatherInfo = {
    locationName: string
    currentTemp: number
    minTemp: number
    maxTemp: number
    hourly: Array<{ time: number; temp: number }> // 비어 있을 수 있음
    description?: string
}
