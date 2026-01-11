import { http } from "../../../shared/api/axios"

const GEO_KEY = import.meta.env.VITE_DATA_GO_KR_GEOCODER_KEY as string

export async function geocodeKR(address: string): Promise<{ lat: number; lon: number } | null> {
    const url = "/api/vworld"

    const { data } = await http.get<any>(url, {
        params: {
            service: "address",
            request: "GetCoord",
            format: "json",
            key: GEO_KEY,
            address,
            type: "PARCEL",
        },
    })

    const point = data?.response?.result?.point
    if (!point) return null
    return { lon: Number(point.x), lat: Number(point.y) }
}
