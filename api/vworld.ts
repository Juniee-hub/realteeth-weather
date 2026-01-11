import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

function setCors(req: VercelRequest, res: VercelResponse) {
    // 운영에서는 * 대신 본인 도메인만 허용 권장
    // 예: const origin = req.headers.origin ?? "";
    // if (origin.endsWith("your-domain.vercel.app")) res.setHeader("Access-Control-Allow-Origin", origin);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCors(req, res);

    // ✅ 프리플라이트 먼저 처리
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    try {
        const query = req.query;
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(query)) {
            if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
            else if (value !== undefined && value !== null && value !== "") params.append(key, String(value));
        }

        if (params.get("request")?.toLowerCase() === "getcoord") {
            params.set("request", "getCoord");
        }

        if (!params.get("key") && process.env.VWORLD_KEY) {
            params.set("key", process.env.VWORLD_KEY);
        }

        const targetUrl = `https://api.vworld.kr/req/address?${params.toString()}`;

        const response = await axios.get(targetUrl, {
            headers: {
                Accept: "application/json",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            timeout: 10000,
            // 일부 환경에서 TLS/압축 이슈 줄이려면 아래도 가끔 도움 됩니다(필수 아님)
            // decompress: true,
            validateStatus: () => true, // VWorld가 4xx 줘도 내용을 그대로 내려보내기 위함
        });

        return res.status(response.status).json(response.data);
    } catch (e: any) {
        console.error("VWorld Proxy Error:", {
            message: e?.message,
            code: e?.code,
            response: e?.response?.data,
            status: e?.response?.status,
        });

        return res.status(e?.response?.status || 500).json({
            message: e?.message ?? String(e),
            name: e?.name,
            code: e?.code,
            details: e?.response?.data,
        });
    }
}
