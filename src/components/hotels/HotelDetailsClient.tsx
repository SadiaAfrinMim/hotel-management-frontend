'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentBooking } from '@/store/slices/bookingSlice';
import { Hotel } from '@/store/slices/hotelSlice';
import { Booking } from '@/store/slices/bookingSlice';
import { Star, MapPin, Users, BedDouble, Wifi, Coffee, Car, Tv, Waves, Dumbbell, UtensilsCrossed, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface HotelDetailsClientProps {
  hotel: Hotel;
}

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'wifi': Wifi,
  'free wifi': Wifi,
  'room service': Coffee,
  'coffee': Coffee,
  'parking': Car,
  'tv': Tv,
  'pool': Waves,
  'gym': Dumbbell,
  'restaurant': UtensilsCrossed,
};

function getAmenityIcon(amenity: string) {
  const key = amenity.toLowerCase();
  for (const [k, Icon] of Object.entries(AMENITY_ICONS)) {
    if (key.includes(k)) return Icon;
  }
  return null;
}

const ROOM_TYPES = [
  { name: 'Standard Room', multiplier: 1, description: 'Cozy room with essential amenities' },
  { name: 'Deluxe Room', multiplier: 1.4, description: 'Spacious room with premium amenities' },
  { name: 'Executive Suite', multiplier: 1.8, description: 'Luxurious suite with exclusive access' },
];

export default function HotelDetailsClient({ hotel }: HotelDetailsClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.search);

  const images = hotel.images?.length ? hotel.images : ['/placeholder.jpg'];
  const nights = search.checkIn && search.checkOut
    ? Math.max(1, Math.ceil((new Date(search.checkOut).getTime() - new Date(search.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  const selectedRoom = ROOM_TYPES[selectedRoomIndex];
  const pricePerNight = hotel.pricePerNight * selectedRoom.multiplier;
  const subtotal = pricePerNight * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handleBooking = () => {
    const booking: Booking = {
      id: `${hotel.id}-${Date.now()}`,
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn: search.checkIn || new Date().toISOString().split('T')[0],
      checkOut: search.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      guests: search.guests,
      rooms: search.rooms,
      totalPrice: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    dispatch(setCurrentBooking(booking));
    router.push('/checkout');
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Hotels
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-200">
            <Image
              src={images[selectedImageIndex]}
              alt={hotel.name}
              fill
              priority
              className="object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-white" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-800 dark:text-white" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === selectedImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{hotel.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {hotel.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Excellent</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">per night</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${hotel.pricePerNight.toFixed(2)}
                </p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {hotel.description}
            </p>

            {hotel.amenities?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {hotel.amenities.map((amenity) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        {Icon ? (
                          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Types</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ROOM_TYPES.map((room, idx) => (
                  <div
                    key={room.name}
                    onClick={() => setSelectedRoomIndex(idx)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRoomIndex === idx
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{room.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{room.description}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      ${(hotel.pricePerNight * room.multiplier).toFixed(2)} / night
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Breakdown</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>${pricePerNight.toFixed(2)} x {nights} night{nights !== 1 ? 's' : ''} ({selectedRoom.name})</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Taxes & Fees (12%)</span>
                  <span className="font-medium">${taxes.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between text-gray-900 dark:text-white font-semibold text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total for {search.rooms} room{search.rooms !== 1 ? 's' : ''}, {search.guests} guest{search.guests !== 1 ? 's' : ''}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</p>
              </div>
              <button
                onClick={handleBooking}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                Select Room & Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
