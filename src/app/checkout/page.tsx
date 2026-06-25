'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addBooking, clearCurrentBooking } from '@/store/slices/bookingSlice';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft, CheckCircle, Calendar, Users, BedDouble, CreditCard, User, Mail, Phone, ChevronRight, Home, MapPin } from 'lucide-react';
import Link from 'next/link';

interface GuestInfoData {
  fullName: string;
  email: string;
  phone: string;
}

const STEPS = ['Review Details', 'Guest Info', 'Confirmation'] as const;
type Step = typeof STEPS[number];

function StepIndicator({ currentStep }: { currentStep: Step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                STEPS.indexOf(currentStep) >= index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-sm font-medium hidden sm:block ${
                STEPS.indexOf(currentStep) >= index
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {step}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-0.5 rounded transition-colors ${
                STEPS.indexOf(currentStep) > index
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SuccessAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="h-14 w-14 text-green-600 dark:text-green-400" strokeWidth={1.5} />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-green-200 dark:border-green-800 animate-ping opacity-20" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        Your hotel reservation has been successfully confirmed. A confirmation email will be sent to your inbox.
      </p>
    </div>
  );
}

export default function CheckoutPage() {
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>('Review Details');
  const [bookingReference, setBookingReference] = useState<string>('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const booking = useAppSelector((state) => state.booking.currentBooking);
  const search = useAppSelector((state) => state.search);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestInfoData>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
    },
  });

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Active Booking</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please select a hotel room to proceed with your booking.</p>
          <Link
            href="/bookings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const nights = search.checkIn && search.checkOut
    ? Math.max(1, Math.ceil((new Date(search.checkOut).getTime() - new Date(search.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  const handleGuestInfoSubmit = async (data: GuestInfoData) => {
    const ref = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingReference(ref);

    dispatch(addBooking({
      ...booking,
      id: ref,
      status: 'confirmed',
      updatedAt: new Date().toISOString(),
    }));
    showToast('Booking confirmed successfully!', 'success');
    dispatch(clearCurrentBooking());
    setStep('Confirmation');
    router.push('/bookings');
  };

  const handleNext = () => {
    if (step === 'Review Details') {
      setStep('Guest Info');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'Review Details':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hotel</p>
                  <p className="font-medium text-gray-900 dark:text-white">Hotel ID: {booking.hotelId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Check-in / Check-out</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    {' — '}
                    {new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{nights} night{nights !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guests & Rooms</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.guests} guest{booking.guests !== 1 ? 's' : ''} · {booking.rooms} room{booking.rooms !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${booking.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              Next: Guest Info
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        );

      case 'Guest Info':
        return (
          <form onSubmit={handleSubmit(handleGuestInfoSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    {...register('fullName', {
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email address' },
                    })}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <input
                    type="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: { value: /^\+?[\d\s\-()]{10,}$/, message: 'Please enter a valid phone number' },
                    })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('Review Details')}
                className="flex-1 py-3.5 px-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                Confirm Booking
                <CheckCircle className="h-4 w-4" />
              </button>
            </div>
          </form>
        );

      case 'Confirmation':
        return (
          <div className="space-y-6">
            <SuccessAnimation />

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Booking Reference</p>
                <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">{bookingReference}</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hotel</p>
                  <p className="font-medium text-gray-900 dark:text-white">Hotel ID: {booking.hotelId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dates</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' — '}
                    {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guests & Rooms</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.guests} guest{booking.guests !== 1 ? 's' : ''} · {booking.rooms} room{booking.rooms !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Paid</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">${booking.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

              <Link
                href="/bookings"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                <Home className="h-4 w-4" />
                Go to My Bookings
              </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/hotels')}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hotels
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete your booking in {STEPS.length} simple steps</p>
          </div>

          <StepIndicator currentStep={step} />

          {renderStep()}
        </div>
      </div>
    </div>
  );
}
