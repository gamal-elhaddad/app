import { createSlice } from '@reduxjs/toolkit';
import { DayOff } from 'src/types/apps/dayoff';
import { Discount } from 'src/types/apps/discount';
import { Pitch, Price, Stadium } from 'src/types/apps/stadium';

interface StateType {
  stadiums: Stadium[],
  selectedStadium: Stadium | undefined,
  pitches: Pitch[],
  pitch: Pitch | undefined
  femaleFriendly: Price[] | undefined
  discounts: {
    [key: string]: Discount[]
  },
  daysOff: DayOff[]
}

const initialState: StateType = {
  stadiums: [],
  selectedStadium: undefined,
  pitches: [],
  pitch: undefined,
  femaleFriendly: undefined,
  discounts: {
    "10-12-1990": []
  },
  daysOff: [],
};

export const ConfigSlice = createSlice({
  name: 'Config',
  initialState,
  reducers: {
    setStadiums: (state: StateType, action) => {
      state.stadiums = action?.payload.map((item: Stadium) => ({
        ...item,
        name: item.title
      }))
    },
    setSelectedStadium: (state: StateType, action) => {
      state.selectedStadium = action.payload
    },
    setPitches: (state: StateType, action) => {
      state.pitches = action?.payload
    },
    setPitch: (state: StateType, action) => {
      state.pitch = action.payload
    },
    setFemaleFriendly: (state: StateType, action) => {
      state.femaleFriendly = action.payload
    },
    setDaysOff: (state: StateType, action) => {
      state.daysOff = action.payload
    },
    setDiscounts: (state: StateType, action) => {
      state.discounts = action.payload
    },
    resetSchedule: (state: StateType) => {
      state.discounts = {
        "10-12-1990": []
      },
        state.daysOff = []
      state.femaleFriendly = undefined
    },
  },
});

export const {
  setStadiums,
  setSelectedStadium,
  setPitches,
  setPitch,
  setFemaleFriendly,
  setDaysOff,
  setDiscounts,
  resetSchedule,
} = ConfigSlice.actions;

export default ConfigSlice.reducer;
