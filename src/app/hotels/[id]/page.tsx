import { notFound } from 'next/navigation';
import HotelDetailsClient from '@/components/hotels/HotelDetailsClient';
import { mapProductToHotel } from '@/utils/mappers';

interface HotelPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: HotelPageProps) {
  const { id } = await params;
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { title: 'Hotel Not Found' };
    const product = await res.json();
    const hotel = mapProductToHotel(product);
    return {
      title: `${hotel.name} | Hotel Booking`,
      description: hotel.description,
    };
  } catch {
    return { title: 'Hotel Not Found' };
  }
}

export default async function HotelPage({ params }: HotelPageProps) {
  const { id } = await params;
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) notFound();
    const product = await res.json();
    const hotel = mapProductToHotel(product);
    return <HotelDetailsClient hotel={hotel} />;
  } catch {
    notFound();
  }
}
