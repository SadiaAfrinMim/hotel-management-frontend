import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

const initialState: SearchState = {
  destination: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
  rooms: 1,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setDestination: (state, action: PayloadAction<string>) => {
      state.destination = action.payload;
    },
    setCheckIn: (state, action: PayloadAction<string>) => {
      state.checkIn = action.payload;
    },
    setCheckOut: (state, action: PayloadAction<string>) => {
      state.checkOut = action.payload;
    },
    setGuests: (state, action: PayloadAction<number>) => {
      state.guests = action.payload;
    },
    setRooms: (state, action: PayloadAction<number>) => {
      state.rooms = action.payload;
    },
    setSearch: (state, action: PayloadAction<Partial<SearchState>>) => {
      return { ...state, ...action.payload };
    },
    clearSearch: () => initialState,
  },
});

export const {
  setDestination,
  setCheckIn,
  setCheckOut,
  setGuests,
  setRooms,
  setSearch,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
