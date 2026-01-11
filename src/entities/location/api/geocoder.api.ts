import { jsonp } from "../../../shared/lib/jsonp"

const GEO_KEY = import.meta.env.VITE_DATA_GO_KR_GEOCODER_KEY as string

export async function geocodeKR(address: string): Promise<{ lat: number; lon: number } | null> {
    const url = "https://api.vworld.kr/req/address"

    const data = await jsonp<any>(url, {
        service: "address",
        request: "getCoord",
        format: "json",
        key: GEO_KEY,
        address,
        type: "PARCEL",
    })

    const point = data?.response?.result?.point
    if (!point) return null
    return { lon: Number(point.x), lat: Number(point.y) }
}
