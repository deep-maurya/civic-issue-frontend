import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  isLoggedIn: Boolean,
  role: "USER" | "ADMIN" | "WORKER"
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  role:"USER"
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<AuthState>
    ) => {
      state.user = action.payload.user;
      state.isLoggedIn = action.payload.isLoggedIn
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
