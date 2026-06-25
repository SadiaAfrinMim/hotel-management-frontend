'use client';

import { useState } from 'react';
import { MapPin, X } from 'lucide-react';

export default function MapPreviewCard({ location = 'London' }: { location?: string }) {
  const [showOverlay, setShowOverlay] = useState(false);

  const mapQuery = encodeURIComponent(location);
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative w-full h-52 rounded-2xl overflow-hidden group cursor-pointer">
      {!showOverlay ? (
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
          onClick={() => setShowOverlay(true)}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(99,102,241,0.08) 20px),
                repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(99,102,241,0.08) 20px)`,
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping absolute inset-0" />
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-xl relative z-10">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl px-3 py-2 border border-white/50 dark:border-gray-700/50">
              <p className="text-xs font-semibold text-gray-900 dark:text-white">View on map</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Click to expand · {location}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col rounded-2xl">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {location}
            </span>
            <button
              onClick={() => setShowOverlay(false)}
              className="p-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <X className="h-3.5 w-3.5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          <div className="flex-1 relative">
            <iframe
              src={mapSrc}
              className="absolute inset-0 w-full h-full rounded-b-2xl"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${location}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
