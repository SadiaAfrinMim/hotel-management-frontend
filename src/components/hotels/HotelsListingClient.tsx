'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Hotel } from '@/store/slices/hotelSlice';
import { setSearch } from '@/store/slices/searchSlice';
import {
  ArrowLeft, Search, SlidersHorizontal, Star, X, ChevronLeft, ChevronRight, MapPin,
  ShieldCheck, Zap, CalendarX, Sparkles, TrendingUp, Award
} from 'lucide-react';
import HotelCard from '@/components/features/HotelCard';
import SkeletonCard from '@/components/hotels/SkeletonCard';
import PriceRangeSlider from '@/components/hotels/PriceRangeSlider';
import MapPreviewCard from '@/components/ui/MapPreviewCard';
import QuickFilterTags, { DEFAULT_QUICK_TAGS } from '@/components/ui/QuickFilterTags';
import { Controller, useForm } from 'react-hook-form';

interface FilterFormData {
  search: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: string;
}

const ITEMS_PER_PAGE = 6;

interface HotelsListingClientProps {
  initialHotels: Hotel[];
}

export default function HotelsListingClient({ initialHotels }: HotelsListingClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const search = useAppSelector((state) => state.search);
  const [hotels] = useState<Hotel[]>(initialHotels);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [activeQuickTags, setActiveQuickTags] = useState<string[]>([]);
  const [featuredScroll, setFeaturedScroll] = useState(0);

  const { register, control, watch, setValue, reset } = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      minPrice: 0,
      maxPrice: 2000,
      minRating: 0,
      sortBy: 'price-asc',
    },
  });

  const watchedSearch = watch('search');
  const watchedMinPrice = watch('minPrice');
  const watchedMaxPrice = watch('maxPrice');
  const watchedMinRating = watch('minRating');
  const watchedSortBy = watch('sortBy');

  const handleQuickTagToggle = (label: string) => {
    setActiveQuickTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const destinationName = search.destination
    ? search.destination.split(',')[0].trim()
    : 'the world';

  const avgRating = hotels.length > 0
    ? (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1)
    : '0.0';

  const filteredAndSortedHotels = useMemo(() => {
    let result = [...hotels];

    if (search.destination) {
      const term = search.destination.toLowerCase();
      result = result.filter((h) => h.destination.toLowerCase().includes(term));
    }

    if (watchedSearch.trim()) {
      const term = watchedSearch.toLowerCase();
      result = result.filter((h) =>
        h.name.toLowerCase().includes(term) ||
        h.destination.toLowerCase().includes(term) ||
        h.amenities.some((a) => a.toLowerCase().includes(term))
      );
    }

    if (activeQuickTags.length > 0) {
      result = result.filter((hotel) => {
        const amenities = hotel.amenities.map((a) => a.toLowerCase());
        const rating = hotel.rating;
        return activeQuickTags.every((tag) => {
          const t = tag.toLowerCase();
          if (t === 'pool') return amenities.some((a) => a.includes('pool'));
          if (t === 'free breakfast') return amenities.some((a) => a.includes('breakfast') || a.includes('coffee'));
          if (t === 'superb 4.5+') return rating >= 4.5;
          if (t === 'free cancellation') return true;
          return false;
        });
      });
    }

    result = result.filter((h) => h.pricePerNight >= watchedMinPrice && h.pricePerNight <= watchedMaxPrice);
    if (watchedMinRating > 0) result = result.filter((h) => h.rating >= watchedMinRating);

    const [sortFieldRaw, sortDir] = watchedSortBy.split('-') as [string, 'asc' | 'desc'];
    const fieldMap: Record<string, keyof Hotel> = { price: 'pricePerNight', rating: 'rating', name: 'name' };
    const sortField = fieldMap[sortFieldRaw] || 'pricePerNight';
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [hotels, search.destination, watchedSearch, watchedMinPrice, watchedMaxPrice, watchedMinRating, watchedSortBy, activeQuickTags]);

  const totalPages = Math.ceil(filteredAndSortedHotels.length / ITEMS_PER_PAGE);
  const paginatedHotels = filteredAndSortedHotels.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [watchedSearch, watchedMinPrice, watchedMaxPrice, watchedMinRating, watchedSortBy, search.destination, activeQuickTags]);

  const handleClearFilters = () => {
    reset({ search: '', minPrice: 0, maxPrice: 2000, minRating: 0, sortBy: 'price-asc' });
    setActiveQuickTags([]);
    dispatch(setSearch({ destination: '' }));
  };

  const hasActiveFilters = search.destination || watchedSearch || watchedMinPrice > 0 || watchedMaxPrice < 2000 || watchedMinRating > 0 || activeQuickTags.length > 0;

  const featuredHotels = [...hotels].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const scrollFeatured = (direction: 'left' | 'right') => {
    setFeaturedScroll((prev) => direction === 'left' ? Math.max(0, prev - 1) : Math.min(featuredHotels.length - 3, prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-950/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? 'Hide' : 'Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside
            className={`${
              showFilters ? 'flex' : 'hidden'
            } lg:flex flex-col w-full lg:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-6 lg:self-start`}
          >
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-800/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900 dark:text-white text-base tracking-tight">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </button>
                )}
              </div>

              <MapPreviewCard location={search.destination || undefined} />

              {search.destination && (
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/60 dark:border-blue-800/60 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-900 dark:text-blue-100 font-bold">{search.destination}</span>
                  </div>
                  <button
                    onClick={() => dispatch(setSearch({ destination: '' }))}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Search Hotel</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    {...register('search')}
                    placeholder="Hotel name, amenity..."
                    className="w-full pl-10 pr-3 py-3 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Price Range</label>
                <Controller
                  name="minPrice"
                  control={control}
                  render={() => (
                    <PriceRangeSlider
                      min={0}
                      max={2000}
                      value={[watchedMinPrice, watchedMaxPrice]}
                      onChange={(range) => {
                        setValue('minPrice', range[0]);
                        setValue('maxPrice', range[1]);
                      }}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Minimum Rating</label>
                <select
                  {...register('minRating', { valueAsNumber: true })}
                  className="w-full px-3 py-3 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                >
                  <option value={0}>Any rating</option>
                  <option value={2}>2+ Stars</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Sort By</label>
                <select
                  {...register('sortBy')}
                  className="w-full px-3 py-3 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="rating-asc">Rating: Low to High</option>
                </select>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0 space-y-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2Zy4uLgo=')] opacity-10" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Premium Collection</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
                  Discover premium stays in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-amber-300">{destinationName}</span>
                </h1>
                <p className="text-blue-100/80 text-base sm:text-lg max-w-2xl mb-6">
                  Curated luxury accommodations with world-class amenities and unmatched hospitality.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                    <span className="text-sm font-bold text-white">✨ {filteredAndSortedHotels.length}+ verified properties</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-white">Avg. {avgRating} rating</span>
                  </div>
                </div>
              </div>
            </div>

            {featuredHotels.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Trending Hot Deals</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollFeatured('left')}
                      className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => scrollFeatured('right')}
                      className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex gap-5 overflow-hidden">
                    {featuredHotels.slice(featuredScroll, featuredScroll + 4).map((hotel) => (
                      <div
                        key={hotel.id}
                        className="flex-1 min-w-0 group relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]"
                        onClick={() => router.push(`/hotels/${hotel.id}`)}
                      >
                        <div className="relative h-56 w-full">
                          <img
                            src={hotel.images?.[0] || '/placeholder.jpg'}
                            alt={hotel.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Featured
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h3 className="text-white font-bold text-base mb-1 line-clamp-1">{hotel.name}</h3>
                            <div className="flex items-center gap-1.5 text-white/80 mb-2">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="text-xs line-clamp-1">{hotel.destination}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-white/60">per night</p>
                                <p className="text-lg font-bold text-white">${hotel.pricePerNight.toFixed(2)}</p>
                              </div>
                              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md rounded-lg px-2.5 py-1.5">
                                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-xs font-bold text-white">{hotel.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <QuickFilterTags
              tags={DEFAULT_QUICK_TAGS.map((t) => ({ ...t, active: activeQuickTags.includes(t.label) }))}
              onToggle={handleQuickTagToggle}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {loading ? 'Loading...' : `${filteredAndSortedHotels.length} hotel${filteredAndSortedHotels.length !== 1 ? 's' : ''} found`}
              </p>
              {hasActiveFilters && (
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                  Filters active
                </span>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200/80 dark:border-red-800/80 rounded-2xl p-6 text-center">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {!error && (
              <>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : paginatedHotels.length === 0 ? (
                  <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100/80 dark:border-gray-800/80 p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <Search className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No hotels found</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedHotels.map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                  </div>
                )}

                {totalPages > 1 && !loading && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1.5 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Prev
                    </button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-11 h-11 rounded-xl text-sm font-bold transition-all ${
                            currentPage === i + 1
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110'
                              : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1.5 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100/80 dark:border-gray-800/80 shadow-[0_-4px_20px_rgb(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Best Price</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Guaranteed</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Instant</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Confirmation</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-50 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                  <CalendarX className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Free Cancel</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">On most rooms</p>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              {filteredAndSortedHotels.length} properties available
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}
