import type { VercelRequest, VercelResponse } from "@vercel/node"
import https from "node:https"

function httpsGet(url: string): Promise<{ status: number; headers: Record<string, any>; body: string }> {
    return new Promise((resolve, reject) => {
        const req = https.request(
            url,
            {
                method: "GET",
                family: 4, // ✅ IPv4 강제
                headers: { accept: "application/json" },
            },
            (resp) => {
                let data = ""
                resp.setEncoding("utf8")
                resp.on("data", (chunk) => (data += chunk))
                resp.on("end", () =>
                    resolve({
                        status: resp.statusCode || 500,
                        headers: resp.headers as any,
                        body: data,
                    }),
                )
            },
        )
        req.on("error", reject)
        req.end()
    })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const qs = req.url?.split("?")[1] ?? ""
        const params = new URLSearchParams(qs)

        if (params.get("request")?.toLowerCase() === "getcoord") {
            params.set("request", "getCoord")
        }

        if (!params.get("key") && process.env.VWORLD_KEY) {
            params.set("key", process.env.VWORLD_KEY)
        }

        const url = `https://api.vworld.kr/req/address?${params.toString()}`
        const out = await httpsGet(url)

        res.status(out.status)
        res.setHeader("content-type", out.headers["content-type"] || "application/json")
        res.send(out.body)
    } catch (e: any) {
        res.status(500).json({
            message: e?.message ?? String(e),
            name: e?.name,
            stack: e?.stack,
            node: process.version,
        })
    }
}
