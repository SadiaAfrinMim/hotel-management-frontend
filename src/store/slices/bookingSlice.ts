import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Booking {
  id: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface BookingState {
  currentBooking: Booking | null;
  bookings: Booking[];
}

const getStoredBookings = (): Booking[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('bookings');
  return stored ? JSON.parse(stored) : [];
};

const initialState: BookingState = {
  currentBooking: null,
  bookings: getStoredBookings(),
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<Booking>) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    cancelBooking: (state, action: PayloadAction<string>) => {
      const booking = state.bookings.find(b => b.id === action.payload);
      if (booking) {
        booking.status = 'cancelled';
      }
    },
    removeBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter(b => b.id !== action.payload);
    },
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
  },
});

export const {
  setCurrentBooking,
  clearCurrentBooking,
  addBooking,
  cancelBooking,
  removeBooking,
  setBookings,
} = bookingSlice.actions;

export default bookingSlice.reducer;
