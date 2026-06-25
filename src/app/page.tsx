'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearch } from '@/store/slices/searchSlice';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, BedDouble, Search, ChevronDown, X, Check } from 'lucide-react';
import { CountryData } from '@/types/api';

interface DestinationOption {
  label: string;
  value: string;
  city: string;
  country: string;
}

interface SearchFormData {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

function Combobox({
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled,
}: {
  options: DestinationOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (option: DestinationOption) => {
      onChange(option.value);
      setSearch(option.label);
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange('');
      setSearch('');
      inputRef.current?.focus();
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {!value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown className="h-4 w-4 transition-transform" />
          </div>
        )}
      </div>

      {isOpen && !disabled && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500">No destinations found</li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                  index === highlightedIndex
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{option.label}</span>
                </span>
                {value === option.value && <Check className="h-4 w-4 text-blue-600" />}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default function Home() {
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useAppSelector((state) => state.ui.theme);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormData>({
    defaultValues: {
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      rooms: 1,
    },
  });

   useEffect(() => {
    async function loadDestinations() {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries');
        const data: { data: CountryData[] } = await res.json();
        const seen = new Set<string>();
        const options: DestinationOption[] = [];
        for (const country of data.data) {
          for (const city of country.cities) {
            const value = `${city}, ${country.country}`;
            if (!seen.has(value)) {
              seen.add(value);
              options.push({
                label: value,
                value,
                city,
                country: country.country,
              });
            }
          }
        }
        setDestinations(options);
      } catch (error) {
        console.error('Failed to load destinations:', error);
      } finally {
        setIsLoadingDestinations(false);
      }
    }
    loadDestinations();
  }, []);

  const onSubmit = async (data: SearchFormData) => {
    dispatch(
      setSearch({
        destination: data.destination,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
        rooms: data.rooms,
      })
    );
    router.push('/hotels');
  };

  const today = new Date().toISOString().split('T')[0];

  const bgClass = theme === 'dark'
    ? 'bg-gray-950'
    : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50';

  const cardClass = theme === 'dark'
    ? 'bg-gray-900 border-gray-800'
    : 'bg-white border-gray-100';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Find Your Perfect
              <span className="text-blue-600"> Stay</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover amazing hotels at the best prices. Your next unforgettable journey starts here.
            </p>
          </div>

          <div className={`rounded-2xl border shadow-xl p-6 sm:p-8 ${cardClass}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Destination
                  </label>
                  <Controller
                    name="destination"
                    control={control}
                    rules={{ required: 'Please select a destination' }}
                    render={({ field }) => (
                      <Combobox
                        options={destinations}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search city or country..."
                        icon={MapPin}
                        disabled={isLoadingDestinations}
                      />
                    )}
                  />
                  {errors.destination && (
                    <p className="text-sm text-red-500">{errors.destination.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      {...register('checkIn', {
                        required: 'Check-in date is required',
                        validate: (value) => {
                          if (value && value < today) {
                            return 'Check-in date cannot be in the past';
                          }
                          return true;
                        },
                      })}
                      min={today}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.checkIn && (
                    <p className="text-sm text-red-500">{errors.checkIn.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      {...register('checkOut', {
                        required: 'Check-out date is required',
                        validate: (value) => {
                          const checkIn = document.querySelector(
                            'input[name="checkIn"]'
                          ) as HTMLInputElement;
                          if (checkIn && value && value <= checkIn.value) {
                            return 'Check-out must be after check-in';
                          }
                          return true;
                        },
                      })}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.checkOut && (
                    <p className="text-sm text-red-500">{errors.checkOut.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="number"
                      {...register('guests', {
                        required: 'Number of guests is required',
                        min: { value: 1, message: 'At least 1 guest is required' },
                        max: { value: 20, message: 'Maximum 20 guests allowed' },
                        valueAsNumber: true,
                      })}
                      min={1}
                      max={20}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.guests && (
                    <p className="text-sm text-red-500">{errors.guests.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rooms
                  </label>
                  <div className="relative max-w-xs">
                    <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="number"
                      {...register('rooms', {
                        required: 'Number of rooms is required',
                        min: { value: 1, message: 'At least 1 room is required' },
                        max: { value: 10, message: 'Maximum 10 rooms allowed' },
                        valueAsNumber: true,
                      })}
                      min={1}
                      max={10}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.rooms && (
                    <p className="text-sm text-red-500">{errors.rooms.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoadingDestinations}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                <Search className="h-5 w-5" />
                {isSubmitting ? 'Searching...' : 'Search Hotels'}
              </button>
            </form>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className={`rounded-xl p-6 border ${cardClass}`}>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Top Destinations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Access {destinations.length.toLocaleString()}+ cities worldwide
              </p>
            </div>
            <div className={`rounded-xl p-6 border ${cardClass}`}>
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Best Prices</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Guaranteed lowest rates for every budget
              </p>
            </div>
            <div className={`rounded-xl p-6 border ${cardClass}`}>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                <BedDouble className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Hotel Confirmed</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Instant booking confirmation & free cancellation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
