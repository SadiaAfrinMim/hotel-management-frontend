'use client';

import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, MapPin, Calendar, Users, BedDouble, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const booking = useAppSelector((state) => state.booking.currentBooking);
  const router = useRouter();

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Active Booking</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please select a hotel room to proceed with your booking.</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            Browse Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Confirmed</h1>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hotel ID</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.hotelId}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Check-in / Check-out</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' — '}
                  {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Guests / Rooms</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {booking.guests} guest{booking.guests !== 1 ? 's' : ''} · {booking.rooms} room{booking.rooms !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">${booking.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Booking ID</p>
            <p className="font-mono text-sm text-gray-900 dark:text-white break-all">{booking.id}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Status: <span className="capitalize text-yellow-600 dark:text-yellow-400 font-medium">{booking.status}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
