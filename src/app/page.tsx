import SearchFormClient from '@/components/home/SearchFormClient';
import HomePageSections from '@/components/home/HomePageSections';

export const metadata = {
  title: 'StayFinder - Find Your Perfect Stay',
  description: 'Discover amazing hotels at the best prices. Your next unforgettable journey starts here.',
};

export default function Home() {
  return (
    <>
      <SearchFormClient />
      <HomePageSections />
    </>
  );
}
