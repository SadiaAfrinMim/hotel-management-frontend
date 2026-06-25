'use client';

import { useState } from 'react';
import { Coffee, Waves, Star, XCircle } from 'lucide-react';

interface QuickFilterTag {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface QuickFilterTagsProps {
  tags: QuickFilterTag[];
  onToggle: (label: string) => void;
}

export default function QuickFilterTags({ tags, onToggle }: QuickFilterTagsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
      {tags.map((tag) => (
        <button
          key={tag.label}
          onClick={() => onToggle(tag.label)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border ${
            tag.active
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30 scale-105'
              : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
          }`}
        >
          {tag.icon}
          <span>{tag.label}</span>
          {tag.active && <XCircle className="h-3.5 w-3.5 ml-0.5 opacity-80" />}
        </button>
      ))}
    </div>
  );
}

export const DEFAULT_QUICK_TAGS: QuickFilterTag[] = [
  { label: 'Free Breakfast', icon: <Coffee className="h-3.5 w-3.5" /> },
  { label: 'Pool', icon: <Waves className="h-3.5 w-3.5" /> },
  { label: 'Superb 4.5+', icon: <Star className="h-3.5 w-3.5" /> },
  { label: 'Free Cancellation', icon: <XCircle className="h-3.5 w-3.5" /> },
];
