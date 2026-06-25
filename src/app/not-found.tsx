import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <p className="text-8xl font-bold text-blue-600 dark:text-blue-400 mb-2">404</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Oops! The page you are looking for doesn’t exist or has been moved. Let’s get you back on track.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

          <Link
            href="/hotels"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <Search className="h-4 w-4" />
            Browse Hotels
          </Link>
        </div>
      </div>
    </div>
  );
}
