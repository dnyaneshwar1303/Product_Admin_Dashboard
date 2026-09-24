export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="animate-pulse">

        <div className="h-14 bg-gray-200 border-b" />

        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-6 px-6 py-4 border-b"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-lg" />

            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>

            <div className="w-20 h-4 bg-gray-200 rounded" />

            <div className="w-16 h-4 bg-gray-200 rounded" />
          </div>
        ))}

      </div>
    </div>
  );
}