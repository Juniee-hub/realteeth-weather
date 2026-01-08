import { useEffect, useState } from "react"

export function useCurrentCoords() {
    const [state, setState] = useState<{
        lat?: number
        lon?: number
        error?: string
        loading: boolean
    }>({ loading: true })

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({ loading: false, error: "이 브라우저는 위치 기능을 지원하지 않습니다." })
            return
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setState({ loading: false, lat: pos.coords.latitude, lon: pos.coords.longitude })
            },
            (err) => {
                setState({ loading: false, error: err.message || "위치 권한이 필요합니다." })
            },
            { enableHighAccuracy: false, timeout: 8000 },
        )
    }, [])

    return state
}
