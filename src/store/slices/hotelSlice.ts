import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
  description: string;
}

export interface Filters {
  priceRange?: [number, number];
  minRating?: number;
  amenities?: string[];
}

export interface Sorting {
  field: keyof Hotel;
  direction: 'asc' | 'desc';
}

interface HotelState {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  sorting: Sorting;
}

const initialState: HotelState = {
  hotels: [],
  loading: false,
  error: null,
  filters: {},
  sorting: { field: 'price', direction: 'asc' },
};

export const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    setHotels: (state, action: PayloadAction<Hotel[]>) => {
      state.hotels = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    },
    setSorting: (state, action: PayloadAction<Sorting>) => {
      state.sorting = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  setHotels,
  setLoading,
  setError,
  setFilters,
  setSorting,
  clearFilters,
} = hotelSlice.actions;

export default hotelSlice.reducer;
