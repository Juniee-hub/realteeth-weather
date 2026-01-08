import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const qs = req.url?.split("?")[1] ?? ""
    const params = new URLSearchParams(qs)

    // 프론트에서 key를 보내지 않아도 서버가 주입
    if (!params.get("key") && process.env.VWORLD_KEY) {
        params.set("key", process.env.VWORLD_KEY)
    }

    const url = `https://api.vworld.kr/req/address?${params.toString()}`

    const upstream = await fetch(url)
    res.status(upstream.status)
    res.setHeader("content-type", upstream.headers.get("content-type") || "application/json")
    res.send(await upstream.text())
}
