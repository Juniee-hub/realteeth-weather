import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const query = req.query
        const params = new URLSearchParams()

        // 기존 쿼리 파라미터 복사
        for (const [key, value] of Object.entries(query)) {
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, v))
            } else if (value) {
                params.append(key, value)
            }
        }

        // VWorld API 특이사항 처리: getCoord (대소문자 구분 확인 필요할 수 있음)
        if (params.get("request")?.toLowerCase() === "getcoord") {
            params.set("request", "getCoord")
        }

        // 환경 변수에서 키 설정 (클라이언트에서 안 보냈을 경우)
        if (!params.get("key") && process.env.VWORLD_KEY) {
            params.set("key", process.env.VWORLD_KEY)
        }

        const targetUrl = `https://api.vworld.kr/req/address?${params.toString()}`

        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            return res.status(response.status).json({
                message: "VWorld API error",
                status: response.status,
                details: errorText,
            })
        }

        const data = await response.json()
        res.status(200).json(data)
    } catch (e: any) {
        res.status(500).json({
            message: e?.message ?? String(e),
            name: e?.name,
            stack: e?.stack,
        })
    }
}
