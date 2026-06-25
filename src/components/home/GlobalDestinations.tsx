'use client';

import { useState, useEffect } from 'react';
import { MapPin, Globe } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { setSearch } from '@/store/slices/searchSlice';
import { useRouter } from 'next/navigation';
import { CountryData } from '@/types/api';

interface DestinationOption {
  label: string;
  value: string;
  city: string;
  country: string;
}

interface GlobalDestinationsProps {
  destinations: DestinationOption[];
  isLoading: boolean;
}

const quickDestinations = ['Paris, France', 'London, United Kingdom', 'New York, United States', 'Tokyo, Japan', 'Dubai, United Arab Emirates', 'Sydney, Australia'];

export default function GlobalDestinations({ destinations, isLoading }: GlobalDestinationsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  if (isLoading) return null;

  return (
    <div className="max-w-5xl mx-auto mt-16 sm:mt-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-full mb-4">
          <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">Global Coverage</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Top destinations worldwide
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          From bustling cities to serene beaches, find the perfect getaway in {destinations.length.toLocaleString()}+ destinations
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickDestinations.map((dest, idx) => (
          <button
            key={idx}
            onClick={() => {
              dispatch(setSearch({ destination: dest }));
              router.push('/hotels');
            }}
            className="group relative h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white/80 group-hover:scale-125 transition-transform duration-300" />
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <span className="text-xs font-bold text-white leading-tight block px-1">{dest.split(',')[0]}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
