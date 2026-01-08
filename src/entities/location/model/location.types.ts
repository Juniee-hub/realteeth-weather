export type KoreaLocation = {
    id: string              // 내부 ID (우리가 생성/가공)
    name: string            // 표시 이름 (예: 청운동)
    fullName: string        // 검색용 전체명 (예: 서울특별시 종로구 청운동)
    lat?: number            // 없으면 geocoding 사용
    lon?: number
}
