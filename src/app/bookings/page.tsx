'use client';

import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Users, BedDouble, CreditCard, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function BookingsPage() {
  const bookings = useAppSelector((state) => state.booking.bookings);
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'cancelled':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {bookings.length === 0
              ? 'No bookings yet. Start by searching for a hotel!'
              : `You have ${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bookings found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You haven't made any reservations yet. Browse our available hotels and book your perfect stay.
            </p>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              Search Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {booking.hotelName || `Hotel ID: ${booking.hotelId}`}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {booking.id}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border capitalize w-fit ${
                        getStatusColor(booking.status)
                      }`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Check-in</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(booking.checkIn).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Check-out</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(booking.checkOut).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CreditCard className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Paid</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          ${booking.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span>
                        {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="h-3.5 w-3.5" />
                      <span>
                        {booking.rooms} room{booking.rooms !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="ml-auto">
                      {new Date(booking.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
