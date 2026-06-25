import { mapProductToHotel } from '@/utils/mappers';
import type { Product, CountryData } from '@/types/api';

const mockProduct: Product = {
  id: 1,
  title: 'Grand Plaza Hotel',
  description: 'A luxurious stay in the heart of the city.',
  category: 'Skincare',
  price: 299.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 12,
  tags: ['free-wifi', 'pool', 'gym'],
  brand: 'PlazaBrand',
  sku: 'SKU-001',
  weight: 1.5,
  dimensions: { width: 10, height: 5, depth: 2 },
  warrantyInformation: '1 year',
  shippingInformation: 'Free shipping',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '30 days',
  minimumOrderQuantity: 1,
  meta: {
    createdAt: '2024-01-01',
    updatedAt: '2024-06-01',
    barcode: '123456',
    qrCode: 'qr.png',
  },
  images: ['https://cdn.dummyjson.com/product-images/1/1.jpg'],
  thumbnail: 'https://cdn.dummyjson.com/product-images/1/1.jpg',
};

const mockCountries: CountryData[] = [
  {
    iso2: 'US',
    iso3: 'USA',
    country: 'United States',
    cities: ['New York', 'Los Angeles'],
  },
  {
    iso2: 'GB',
    iso3: 'GBR',
    country: 'United Kingdom',
    cities: ['London', 'Manchester'],
  },
];

describe('mapProductToHotel', () => {
  it('should map basic product fields correctly', () => {
    const hotel = mapProductToHotel(mockProduct);

    expect(hotel.id).toBe('1');
    expect(hotel.name).toBe('Grand Plaza Hotel');
    expect(hotel.pricePerNight).toBe(299.99);
    expect(hotel.rating).toBe(4.5);
    expect(hotel.availableRooms).toBe(12);
    expect(hotel.description).toBe('A luxurious stay in the heart of the city.');
    expect(hotel.images).toEqual([
      'https://cdn.dummyjson.com/product-images/1/1.jpg',
    ]);
  });

  it('should use thumbnail fallback when images array is empty', () => {
    const productNoImages = { ...mockProduct, images: [] };
    const hotel = mapProductToHotel(productNoImages);

    expect(hotel.images).toEqual([
      'https://cdn.dummyjson.com/product-images/1/1.jpg',
    ]);
  });

  it('should capitalize tags and replace hyphens with spaces', () => {
    const hotel = mapProductToHotel(mockProduct);

    expect(hotel.amenities).toEqual(['Free Wifi', 'Pool', 'Gym']);
  });

  it('should return fallback amenities when tags are empty', () => {
    const productNoTags = { ...mockProduct, tags: [] };
    const hotel = mapProductToHotel(productNoTags);

    expect(hotel.amenities).toEqual([
      'Free Wi-Fi',
      'Room Service',
      'Air Conditioning',
    ]);
  });

  it('should simulate location from category when no countryData provided', () => {
    const hotel = mapProductToHotel(mockProduct);

    expect(hotel.destination).toBe('Skincare');
  });

  it('should simulate location from countryData when provided', () => {
    const hotel = mapProductToHotel(mockProduct, mockCountries);

    const expectedCity = mockCountries[1].cities[mockProduct.id % mockCountries[1].cities.length];
    const expectedCountry = mockCountries[1].country;

    expect(hotel.destination).toBe(`${expectedCity}, ${expectedCountry}`);
  });

  it('should handle null/undefined fields gracefully', () => {
    const minimalProduct = {
      ...mockProduct,
      title: '',
      description: '',
      price: 0,
      rating: 0,
      stock: 0,
      tags: [],
      images: [],
      thumbnail: '',
    } as unknown as Product;

    const hotel = mapProductToHotel(minimalProduct);

    expect(hotel.name).toBe('');
    expect(hotel.pricePerNight).toBe(0);
    expect(hotel.rating).toBe(0);
    expect(hotel.availableRooms).toBe(0);
    expect(hotel.description).toBe('');
    expect(hotel.images).toEqual([]);
  });
});
