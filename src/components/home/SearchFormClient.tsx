'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearch } from '@/store/slices/searchSlice';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { MapPin, Calendar, Users, BedDouble, Search, ChevronDown, X, Check, Sparkles } from 'lucide-react';
import { CountryData } from '@/types/api';
import { HomeProvider } from './HomeContext';
import TrustBadges from './TrustBadges';
import GlobalDestinations from './GlobalDestinations';
import StatsCounter from './StatsCounter';
import Testimonials from './Testimonials';
import NewsletterCTA from './NewsletterCTA';

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
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIsSearching(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearch(val);
      setIsSearching(false);
    }, 150);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

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
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSearching}
          className="w-full pl-11 pr-11 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        />
        {value && !isSearching && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isSearching && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
        {!value && !isSearching && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown className="h-4 w-4 transition-transform" />
          </div>
        )}
      </div>

      {isOpen && !disabled && !isSearching && (
        <ul className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-4 text-sm text-gray-500">No destinations found</li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                  index === highlightedIndex
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center gap-3">
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

export default function SearchFormClient() {
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useAppSelector((state) => state.ui.theme);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

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
        const maxPerCountry = 20;
        const maxTotal = 500;

        for (const country of data.data) {
          if (options.length >= maxTotal) break;
          const cities = country.cities.slice(0, maxPerCountry);
          for (const city of cities) {
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
            if (options.length >= maxTotal) break;
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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(heroTitleRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0);
      tl.to(formCardRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.15);
    });

    return () => ctx.revert();
  }, []);

  return (
    <HomeProvider destinations={destinations} isLoadingDestinations={isLoadingDestinations}>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-400/[0.08] rounded-full blur-3xl animate-float" />
            <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-indigo-400/[0.08] rounded-full blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-400/[0.04] rounded-full blur-3xl animate-float" style={{ animationDelay: '4s', animationDuration: '12s' }} />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-28">
            <div ref={heroTitleRef} className="text-center mb-10 sm:mb-14 opacity-0 translate-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">Premium Hotel Booking</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-5 leading-[1.1]">
                Find Your Perfect
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600"> Stay</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Discover handpicked hotels, resorts & apartments at exclusive prices. Book direct and save more.
              </p>
            </div>

            <div ref={formCardRef} className="max-w-5xl mx-auto opacity-0 translate-y-6">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-gray-100/80 dark:border-gray-800/80 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                        <MapPin className="h-4 w-4 text-blue-600" />
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
                            placeholder="Where are you going?"
                            icon={MapPin}
                            disabled={isLoadingDestinations}
                          />
                        )}
                      />
                      {errors.destination && (
                        <p className="text-sm text-red-500 font-medium">{errors.destination.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Check-in Date
                      </label>
                      <div className="relative">
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
                          className="w-full h-12 pl-11 pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all shadow-sm"
                        />
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.checkIn && (
                        <p className="text-sm text-red-500 font-medium">{errors.checkIn.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Check-out Date
                      </label>
                      <div className="relative">
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
                          className="w-full h-12 pl-11 pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all shadow-sm"
                        />
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.checkOut && (
                        <p className="text-sm text-red-500 font-medium">{errors.checkOut.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                          <Users className="h-4 w-4 text-blue-600" />
                          Guests
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            {...register('guests', {
                              required: 'Guests required',
                              min: { value: 1, message: 'Min 1' },
                              max: { value: 20, message: 'Max 20' },
                              valueAsNumber: true,
                            })}
                            min={1}
                            max={20}
                            className="w-full h-12 pl-11 pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all shadow-sm"
                          />
                          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.guests && (
                          <p className="text-xs text-red-500 font-medium">{errors.guests.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                          <BedDouble className="h-4 w-4 text-blue-600" />
                          Rooms
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            {...register('rooms', {
                              required: 'Rooms required',
                              min: { value: 1, message: 'Min 1' },
                              max: { value: 10, message: 'Max 10' },
                              valueAsNumber: true,
                            })}
                            min={1}
                            max={10}
                            className="w-full h-12 pl-11 pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all shadow-sm"
                          />
                          <BedDouble className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.rooms && (
                          <p className="text-xs text-red-500 font-medium">{errors.rooms.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoadingDestinations}
                    className="w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 text-base"
                  >
                    {isSubmitting || isLoadingDestinations ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        Search Hotels
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeProvider>
  );
}
