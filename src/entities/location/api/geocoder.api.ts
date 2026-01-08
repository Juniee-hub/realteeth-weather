import { http } from "../../../shared/api/axios"

const GEO_KEY = import.meta.env.VITE_DATA_GO_KR_GEOCODER_KEY as string

export async function geocodeKR(address: string): Promise<{ lat: number; lon: number } | null> {
    if (!GEO_KEY) throw new Error("국토교통부 지오코더 서비스키가 필요합니다.")

    const url = "/api/vworld"

    const { data } = await http.get<any>(url, {
        params: {
            service: "address",
            request: "GetCoord",
            format: "json",
            key: GEO_KEY,
            address,
            // type: "ROAD", // 도로명 우선 (필요 시 PARCEL로 폴백)
            type: "PARCEL",
        },
    })

    const point = data?.response?.result?.point
    if (!point) return null
    return { lon: Number(point.x), lat: Number(point.y) }
}
