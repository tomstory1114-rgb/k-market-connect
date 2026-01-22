export default function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      {/* 이미지 스켈레톤 */}
      <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-gray-200 animate-pulse"></div>

      {/* 컨텐츠 스켈레톤 */}
      <div className="space-y-3">
        {/* 태그 영역 */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* 제목 */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>

        {/* 가격 */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}