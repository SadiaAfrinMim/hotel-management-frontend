'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setHotels, setLoading, setError, setFilters, setSorting, clearFilters } from '@/store/slices/hotelSlice';
import { fetchHotelsFromMockAPIs } from '@/utils/mappers';
import { Hotel } from '@/store/slices/hotelSlice';
import { ArrowLeft, Search, SlidersHorizontal, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import HotelCard from '@/components/hotels/HotelCard';
import SkeletonCard from '@/components/hotels/SkeletonCard';
import PriceRangeSlider from '@/components/hotels/PriceRangeSlider';
import { Controller, useForm } from 'react-hook-form';

interface FilterFormData {
  search: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: string;
}

const ITEMS_PER_PAGE = 6;

export default function HotelsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { hotels, loading, error, filters, sorting } = useAppSelector((state) => state.hotel);

  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { register, control, watch, setValue, reset, handleSubmit: handleFilterSubmit } = useForm<FilterFormData>({
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

  useEffect(() => {
    async function loadHotels() {
      dispatch(setLoading(true));
      try {
        const mappedHotels = await fetchHotelsFromMockAPIs();
        dispatch(setHotels(mappedHotels));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch hotels'));
      } finally {
        dispatch(setLoading(false));
      }
    }
    loadHotels();
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      setFilters({
        priceRange: [watchedMinPrice, watchedMaxPrice],
        minRating: watchedMinRating,
        amenities: [],
      })
    );
  }, [watchedMinPrice, watchedMaxPrice, watchedMinRating, dispatch]);

  useEffect(() => {
    const [field, direction] = watchedSortBy.split('-') as [string, 'asc' | 'desc'];
    const fieldMap: Record<string, keyof Hotel> = {
      price: 'pricePerNight',
      rating: 'rating',
      name: 'name',
    };
    dispatch(setSorting({ field: fieldMap[field] || 'pricePerNight', direction }));
  }, [watchedSortBy, dispatch]);

  const filteredAndSortedHotels = useMemo(() => {
    let result = [...hotels];

    if (watchedSearch.trim()) {
      const term = watchedSearch.toLowerCase();
      result = result.filter((h) => h.name.toLowerCase().includes(term));
    }

    result = result.filter((h) => h.pricePerNight >= watchedMinPrice && h.pricePerNight <= watchedMaxPrice);

    if (watchedMinRating > 0) {
      result = result.filter((h) => h.rating >= watchedMinRating);
    }

    const [sortFieldRaw, sortDir] = watchedSortBy.split('-') as [string, 'asc' | 'desc'];
    const fieldMap: Record<string, keyof Hotel> = {
      price: 'pricePerNight',
      rating: 'rating',
      name: 'name',
    };
    const sortField = fieldMap[sortFieldRaw] || 'pricePerNight';
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [hotels, watchedSearch, watchedMinPrice, watchedMaxPrice, watchedMinRating, watchedSortBy]);

  const totalPages = Math.ceil(filteredAndSortedHotels.length / ITEMS_PER_PAGE);
  const paginatedHotels = filteredAndSortedHotels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [watchedSearch, watchedMinPrice, watchedMaxPrice, watchedMinRating, watchedSortBy]);

  const handleClearFilters = () => {
    reset({ search: '', minPrice: 0, maxPrice: 2000, minRating: 0, sortBy: 'price-asc' });
    dispatch(clearFilters());
  };

  const hasActiveFilters = watchedSearch || watchedMinPrice > 0 || watchedMaxPrice < 2000 || watchedMinRating > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside
            className={`${
              showFilters ? 'flex' : 'hidden'
            } lg:flex flex-col w-full lg:w-64 flex-shrink-0 space-y-6`}
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Hotel</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    {...register('search')}
                    placeholder="Hotel name..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Rating</label>
                <select
                  {...register('minRating', { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Any rating</option>
                  <option value={2}>2+ Stars</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
                <select
                  {...register('sortBy')}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="rating-asc">Rating: Low to High</option>
                </select>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {loading ? 'Loading...' : `${filteredAndSortedHotels.length} hotel${filteredAndSortedHotels.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {!error && (
              <>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : paginatedHotels.length === 0 ? (
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <Search className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No hotels found</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedHotels.map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                  </div>
                )}

                {totalPages > 1 && !loading && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Prev
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === i + 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
    </div>
  );
}
