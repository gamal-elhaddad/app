import { createSlice } from '@reduxjs/toolkit';
import { Booking } from 'src/types/apps/booking';

interface StateType {
  bookings: Booking[]
  scheduleConfig: {
    from_date: string,
    to_date: string,
    showAllPitches: boolean
  }
}

const initialState: StateType = {
  bookings: [],
  scheduleConfig: {
    from_date: "",
    to_date: "",
    showAllPitches: false
  }
};

export const ConfigSlice = createSlice({
  name: 'Schedule',
  initialState,
  reducers: {
    setScheduleConfig: (state: StateType, action) => {
      state.scheduleConfig = action.payload
    },
    setBookings: (state: StateType, action) => {
      state.bookings = action.payload
    }
  },
});

export const {
  setBookings,
  setScheduleConfig
} = ConfigSlice.actions;

export default ConfigSlice.reducer;
