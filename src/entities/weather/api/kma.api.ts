import { http } from "../../../shared/api/axios"
import type { WeatherInfo } from "../model/weather.types"

const SERVICE_KEY = import.meta.env.VITE_DATA_GO_KR_SERVICE_KEY as string

type KmaItem = {
    baseDate: string
    baseTime: string
    category: string
    fcstDate: string
    fcstTime: string
    fcstValue: string
    nx: number
    ny: number
}

function pickBaseTime(now = new Date()) {
    // 동네예보 발표시각(대표): 02,05,08,11,14,17,20,23
    const baseTimes = ["2300", "2000", "1700", "1400", "1100", "0800", "0500", "0200"]
    const hhmm = String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0")

    let baseTime = "0200"
    for (const t of baseTimes) {
        if (hhmm >= t) {
            baseTime = t
            break
        }
    }

    // 새벽(00~01시대)에는 전날 23시 발표분을 써야 안정적
    const baseDate = new Date(now)
    if (hhmm < "0200") {
        baseDate.setDate(baseDate.getDate() - 1)
        baseTime = "2300"
    }

    const y = baseDate.getFullYear()
    const m = String(baseDate.getMonth() + 1).padStart(2, "0")
    const d = String(baseDate.getDate()).padStart(2, "0")
    return { base_date: `${y}${m}${d}`, base_time: baseTime }
}

export async function getWeatherByGrid(nx: number, ny: number, locationName: string): Promise<WeatherInfo> {
    if (!SERVICE_KEY) throw new Error("기상청 단기예보 서비스키가 필요합니다.")

    const { base_date, base_time } = pickBaseTime()

    const url =
        "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"

    const { data } = await http.get<any>(url, {
        params: {
            serviceKey: SERVICE_KEY,
            pageNo: 1,
            numOfRows: 1000,
            dataType: "JSON",
            base_date,
            base_time,
            nx,
            ny,
        },
    })

    const items: KmaItem[] = data?.response?.body?.items?.item ?? []

    // 오늘 날짜
    const today = base_date

    // 시간대별 TMP(오늘 것만)
    const hourlyTmp = items
        .filter((it) => it.category === "TMP" && it.fcstDate === today)
        .map((it) => ({ time: Number(it.fcstTime), temp: Number(it.fcstValue) }))
        .sort((a, b) => a.time - b.time)
        .slice(0, 24)
        .map((h) => ({
            // 기존 UI가 unix time 기준이면 바꿔야 하지만,
            // 간단히 "HHMM"을 초로 변환하지 않고 WeatherInfo를 time:number로 유지(표시 함수만 수정)
            time: h.time,
            temp: h.temp,
        }))

    const tmx = items.find((it) => it.category === "TMX" && it.fcstDate === today)?.fcstValue
    const tmn = items.find((it) => it.category === "TMN" && it.fcstDate === today)?.fcstValue

    // 현재 기온은 TMP 중 “가장 가까운 시간”으로 대체
    const nowHH = String(new Date().getHours()).padStart(2, "0")
    const near = hourlyTmp.find((h) => String(h.time).padStart(4, "0").startsWith(nowHH)) ?? hourlyTmp[0]
    const currentTemp = near?.temp ?? Number(tmn ?? tmx ?? 0)

    // 최저/최고 없으면 TMP로 계산
    const tmpValues = hourlyTmp.map((h) => h.temp)
    const minTemp = tmn ? Number(tmn) : (tmpValues.length ? Math.min(...tmpValues) : currentTemp)
    const maxTemp = tmx ? Number(tmx) : (tmpValues.length ? Math.max(...tmpValues) : currentTemp)

    return {
        locationName,
        currentTemp,
        minTemp,
        maxTemp,
        hourly: hourlyTmp.map((h) => ({ time: h.time, temp: h.temp })),
        description: undefined, // 기상청 단기예보는 SKY/PTY 등으로 별도 매핑 가능(필요하면 추가)
    }
}
