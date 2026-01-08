import type { KoreaLocation } from "./location.types"

export async function loadKoreaDistricts(): Promise<KoreaLocation[]> {
    const res = await fetch("/korea_districts.json")
    const raw = await res.json()

    const items: KoreaLocation[] = []
    const push = (fullName: string) => {
        const trimmed = fullName.replace(/\s+/g, " ").trim()
        if (!trimmed) return
        const name = trimmed.split(" ").at(-1) ?? trimmed
        items.push({
            id: trimmed, // 간단히 fullName을 ID로 사용
            name,
            fullName: trimmed,
        })
    }

    // 1) 배열이면: 각 요소의 문자열 필드 조합
    if (Array.isArray(raw)) {
        for (const it of raw) {
            if (typeof it === "string") push(it)
            else if (it && typeof it === "object") {
                const values = Object.values(it).filter((v) => typeof v === "string") as string[]
                if (values.length) push(values.join(" "))
            }
        }
        return uniq(items)
    }

    // 2) 객체면: 재귀적으로 문자열들을 수집
    const collectStrings: string[] = []
    const walk = (node: unknown) => {
        if (!node) return
        if (typeof node === "string") collectStrings.push(node)
        else if (Array.isArray(node)) node.forEach(walk)
        else if (typeof node === "object") Object.values(node as any).forEach(walk)
    }
    walk(raw)

    // 문자열이 너무 많을 수 있어 "시/군/구/동" 조합 텍스트 형태를 우선 사용
    for (const s of collectStrings) {
        if (s.includes("시") || s.includes("구") || s.includes("동") || s.includes("군")) push(s)
    }

    return uniq(items)
}

function uniq(list: KoreaLocation[]) {
    const m = new Map<string, KoreaLocation>()
    for (const it of list) m.set(it.id, it)
    return [...m.values()]
}
