export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-end justify-between">
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-12" />
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-16" />
          </div>
          <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}
