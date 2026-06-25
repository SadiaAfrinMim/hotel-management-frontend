export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="h-64 sm:h-80 md:h-96 w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              ))}
            </div>
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
