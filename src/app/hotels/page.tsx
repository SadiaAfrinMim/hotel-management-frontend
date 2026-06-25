import { fetchHotelsFromMockAPIs } from '@/utils/mappers';
import HotelsListingClient from '@/components/hotels/HotelsListingClient';
import type { Hotel } from '@/store/slices/hotelSlice';

export const metadata = {
  title: 'Browse Hotels | StayFinder',
  description: 'Explore our curated collection of hotels. Filter by price, rating, and amenities to find your perfect stay.',
};

export default async function HotelsPage() {
  let hotels: Hotel[] = [];
  try {
    hotels = await fetchHotelsFromMockAPIs();
  } catch {
    hotels = [];
  }

  return <HotelsListingClient initialHotels={hotels} />;
}
