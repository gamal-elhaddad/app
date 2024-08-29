import { createSlice } from '@reduxjs/toolkit';
import { IUser } from 'src/types/apps/user';

interface StateType {
  user: { token: string, data: IUser } | undefined
}

const initialState: StateType = {
  user: undefined
};

export const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setUser: (state: StateType, action) => {
      state.user = action.payload?.data;
    },
    logout: (state: StateType) => {
      state.user = undefined;
    }
  },
});

export const { setUser, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
