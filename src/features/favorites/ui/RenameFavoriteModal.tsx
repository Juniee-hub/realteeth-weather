import { useState } from "react"
import { Card } from "../../../shared/ui/Card"
import { Button } from "../../../shared/ui/Button"

export function RenameFavoriteModal({
                                        open,
                                        initial,
                                        onClose,
                                        onSave,
                                    }: {
    open: boolean
    initial: string
    onClose: () => void
    onSave: (v: string) => void
}) {
    const [v, setV] = useState(initial)
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <Card className="w-full max-w-sm space-y-3">
                <div className="text-lg font-semibold">별칭 수정</div>
                <input className="w-full rounded-xl border px-3 py-2" value={v}
                       onChange={(e) => setV(e.target.value)} />
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>취소</Button>
                    <Button className="bg-black text-blue-600 hover:bg-black/90"
                            onClick={() => onSave(v.trim() || initial)}>
                        저장
                    </Button>
                </div>
            </Card>
        </div>
    )
}
