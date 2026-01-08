import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const qs = req.url?.split("?")[1] ?? ""
        const params = new URLSearchParams(qs)

        // ✅ (중요) request는 문서 예제들이 대부분 getCoord 입니다.
        // 대소문자 때문에 서버측에서 예외가 나는 케이스도 있어서 보정
        if (params.get("request")?.toLowerCase() === "getcoord") {
            params.set("request", "getCoord")
        }

        if (!params.get("key") && process.env.VWORLD_KEY) {
            params.set("key", process.env.VWORLD_KEY)
        }

        const url = `https://api.vworld.kr/req/address?${params.toString()}`

        const upstream = await fetch(url, {
            headers: { accept: "application/json" },
        })

        const text = await upstream.text()
        res.status(upstream.status)
        res.setHeader("content-type", upstream.headers.get("content-type") || "application/json")
        res.send(text)
    } catch (e: any) {
        // ✅ 여기 응답이 보이면 원인이 바로 잡힙니다.
        res.status(500).json({
            message: e?.message ?? String(e),
            name: e?.name,
            stack: e?.stack,
            node: process.version,
            hasEnvKey: Boolean(process.env.VWORLD_KEY),
        })
    }
}
