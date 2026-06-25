import SkeletonCard from '@/components/hotels/SkeletonCard';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5">
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-16" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-12" />
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16" />
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-20" />
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
            </div>
          </aside>
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
