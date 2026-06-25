'use client';

import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

interface UrgencyBadgeProps {
  availableRooms: number;
}

export default function UrgencyBadge({ availableRooms }: UrgencyBadgeProps) {
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (availableRooms < 5) {
      const interval = setInterval(() => {
        setIsUrgent((prev) => !prev);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [availableRooms]);

  if (availableRooms >= 5) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-500 ${
        isUrgent
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 scale-105'
          : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
      }`}
    >
      <Flame className={`h-3.5 w-3.5 ${isUrgent ? 'animate-pulse' : ''}`} />
      <span>Only {availableRooms} room{availableRooms !== 1 ? 's' : ''} left at this price!</span>
    </div>
  );
}
