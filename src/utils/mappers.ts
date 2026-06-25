import { Product, CountryData, RootProductResponse, RootCountryResponse } from '@/types/api';
import { Hotel } from '@/store/slices/hotelSlice';

function capitalizeTag(tag: string): string {
  return tag
    .replace(/-/g, ' ')
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

const FALLBACK_DESTINATIONS = [
  'Paris, France', 'London, United Kingdom', 'New York, United States',
  'Tokyo, Japan', 'Dubai, United Arab Emirates', 'Sydney, Australia',
  'Rome, Italy', 'Barcelona, Spain', 'Berlin, Germany', 'Toronto, Canada',
  'Bangkok, Thailand', 'Singapore, Singapore', 'Istanbul, Turkey',
  'Amsterdam, Netherlands', 'Lisbon, Portugal', 'Prague, Czech Republic',
  'Buenos Aires, Argentina', 'Cairo, Egypt', 'Mumbai, India', 'Seoul, South Korea',
];

function pickLocation(product: Product, countryData?: CountryData[]): string {
  if (countryData && countryData.length > 0) {
    const index = product.id % countryData.length;
    const country = countryData[index];
    if (country.cities.length > 0) {
      const cityIndex = product.id % countryData.length;
      const city = country.cities[cityIndex % country.cities.length];
      return `${city}, ${country.country}`;
    }
    return country.country;
  }
  const fallbackIndex = product.id % FALLBACK_DESTINATIONS.length;
  return FALLBACK_DESTINATIONS[fallbackIndex];
}

function buildAmenities(tags: string[]): string[] {
  const base = ['Free Wi-Fi', 'Room Service', 'Air Conditioning'];

  const mapped = (tags ?? [])
    .filter((tag): tag is string => Boolean(tag))
    .map(capitalizeTag);

  if (mapped.length === 0) {
    return base;
  }

  return mapped;
}

export function mapProductToHotel(product: Product, countryData?: CountryData[]): Hotel {
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.thumbnail].filter(Boolean);

  return {
    id: String(product.id),
    name: product.title ?? 'Unnamed Hotel',
    destination: pickLocation(product, countryData),
    images,
    pricePerNight: product.price ?? 0,
    rating: product.rating ?? 0,
    availableRooms: product.stock ?? 0,
    amenities: buildAmenities(product.tags ?? []),
    description: product.description ?? '',
  };
}

export async function fetchHotelsFromMockAPIs(): Promise<Hotel[]> {
  const [productRes, countryRes] = await Promise.all([
    fetch('https://dummyjson.com/products?limit=20'),
    fetch('https://countriesnow.space/api/v0.1/countries'),
  ]);

  if (!productRes.ok) {
    throw new Error('Failed to fetch products');
  }

  const productData: RootProductResponse = await productRes.json();
  let countryDataArray: CountryData[] = [];

  try {
    if (countryRes.ok) {
      const countryData: RootCountryResponse = await countryRes.json();
      countryDataArray = countryData.data ?? [];
    }
  } catch {
    countryDataArray = [];
  }

  return productData.products.map((product) =>
    mapProductToHotel(product, countryDataArray.length > 0 ? countryDataArray : undefined)
  );
}
