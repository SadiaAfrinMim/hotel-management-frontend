'use client';

import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Star, Users, BedDouble } from 'lucide-react';

export default function HotelsPage() {
  const search = useAppSelector((state) => state.search);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hotels in {search.destination || 'All Destinations'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {new Date(search.checkIn).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
            {' — '}
            {new Date(search.checkOut).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            {' · '}
            {search.guests} guest{search.guests !== 1 ? 's' : ''}
            {' · '}
            {search.rooms} room{search.rooms !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Hotel listing coming soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This page will display the filtered hotel results matching your search criteria.
            The Redux search state is correctly dispatched from the landing page.
          </p>
        </div>
      </div>
    </div>
  );
}
