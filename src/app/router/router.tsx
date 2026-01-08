import { createBrowserRouter } from "react-router-dom"
import { HomePage } from "../../pages/home/HomePage"
import { WeatherDetailPage } from "../../pages/weather/WeatherDetailPage"

export const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/weather/:locationId", element: <WeatherDetailPage /> },
])
 