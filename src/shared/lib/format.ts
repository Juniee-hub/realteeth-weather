export const formatTemp = (v: number) => `${Math.round(v)}°`
export const formatTime = (unixSec: number) => {
    const d = new Date(unixSec * 1000)
    const hh = String(d.getHours()).padStart(2, "0")
    return `${hh}:00`
}
