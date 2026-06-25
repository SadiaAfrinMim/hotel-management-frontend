'use client';

import { createContext, useContext, ReactNode } from 'react';

interface DestinationOption {
  label: string;
  value: string;
  city: string;
  country: string;
}

interface HomeContextValue {
  destinations: DestinationOption[];
  isLoadingDestinations: boolean;
}

export const HomeContext = createContext<HomeContextValue>({
  destinations: [],
  isLoadingDestinations: true,
});

export function useHomeContext() {
  return useContext(HomeContext);
}

export function HomeProvider({
  children,
  destinations,
  isLoadingDestinations,
}: {
  children: ReactNode;
  destinations: DestinationOption[];
  isLoadingDestinations: boolean;
}) {
  return (
    <HomeContext.Provider value={{ destinations, isLoadingDestinations }}>
      {children}
    </HomeContext.Provider>
  );
}
