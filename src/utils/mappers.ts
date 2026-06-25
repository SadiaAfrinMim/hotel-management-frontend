import { Product, CountryData, RootProductResponse, RootCountryResponse } from '@/types/api';
import { Hotel } from '@/store/slices/hotelSlice';

function capitalizeTag(tag: string): string {
  return tag
    .replace(/-/g, ' ')
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function pickLocation(product: Product, countryData?: CountryData[]): string {
  if (countryData && countryData.length > 0) {
    const index = product.id % countryData.length;
    const country = countryData[index];
    if (country.cities.length > 0) {
      const cityIndex = product.id % country.cities.length;
      return `${country.cities[cityIndex]}, ${country.country}`;
    }
    return country.country;
  }
  return product.category ?? 'Unknown Destination';
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

  if (!productRes.ok || !countryRes.ok) {
    throw new Error('Failed to fetch mock APIs');
  }

  const productData: RootProductResponse = await productRes.json();
  const countryData: RootCountryResponse = await countryRes.json();

  return productData.products.map((product) =>
    mapProductToHotel(product, countryData.data)
  );
}
