import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Users, BedDouble } from 'lucide-react';
import { Hotel } from '@/store/slices/hotelSlice';

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
        <Image
          src={hotel.images?.[0] ?? '/placeholder.jpg'}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-gray-900 dark:text-white">
            {hotel.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 text-sm sm:text-base">
            {hotel.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-3">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{hotel.destination}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>Up to {hotel.availableRooms} rooms</span>
          </div>
          {hotel.amenities?.[0] && (
            <div className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{hotel.amenities[0]}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">per night</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ${hotel.pricePerNight.toFixed(2)}
            </p>
          </div>
          <Link href={`/hotels/${hotel.id}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors text-center">
            View Deal
          </Link>
        </div>
      </div>
    </div>
  );
}
