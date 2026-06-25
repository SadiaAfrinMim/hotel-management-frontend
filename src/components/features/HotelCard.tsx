import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Users, BedDouble, Wifi, Coffee, Waves, Dumbbell, Tv, Car } from 'lucide-react';
import { Hotel } from '@/store/slices/hotelSlice';
import UrgencyBadge from '@/components/ui/UrgencyBadge';

interface HotelCardProps {
  hotel: Hotel;
}

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'wifi': Wifi,
  'free wifi': Wifi,
  'pool': Waves,
  'gym': Dumbbell,
  'tv': Tv,
  'parking': Car,
  'coffee': Coffee,
};

function getAmenityIcon(amenity: string) {
  const key = amenity.toLowerCase();
  for (const [k, Icon] of Object.entries(AMENITY_ICONS)) {
    if (key.includes(k)) return Icon;
  }
  return null;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const imageSrc = hotel.images?.[0]
    ? hotel.images[0].startsWith('http')
      ? hotel.images[0]
      : `https://cdn.dummyjson.com${hotel.images[0]}`
    : '/placeholder.jpg';

  const score = hotel.rating >= 9 ? 'Exceptional' : hotel.rating >= 8 ? 'Excellent' : hotel.rating >= 7 ? 'Very Good' : 'Good';

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-1">
      <div className="relative h-52 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img
          src={imageSrc}
          alt={hotel.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-3 right-3">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-lg border border-white/50 dark:border-gray-700/50">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">{hotel.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="absolute top-3 left-3">
          <UrgencyBadge availableRooms={hotel.availableRooms} />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-base">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-1">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
              <span className="text-xs line-clamp-1">{hotel.destination}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">per night</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${hotel.pricePerNight.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
            <Users className="h-3.5 w-3.5" />
            <span>Up to {hotel.availableRooms} rooms</span>
          </div>
          {hotel.amenities?.[0] && (
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
              {(() => {
                const Icon = getAmenityIcon(hotel.amenities[0]);
                return Icon ? <Icon className="h-3.5 w-3.5" /> : <BedDouble className="h-3.5 w-3.5" />;
              })()}
              <span className="line-clamp-1">{hotel.amenities[0]}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
              <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {hotel.rating.toFixed(1)} {score}
              </span>
            </div>
          </div>
          <Link
            href={`/hotels/${hotel.id}`}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95"
          >
            View Deal
          </Link>
        </div>
      </div>
    </div>
  );
}
