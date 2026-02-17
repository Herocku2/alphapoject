import { createSlice } from "@reduxjs/toolkit";


export const baseSlice = createSlice({
  name: "base",
  initialState: {
    isAuthenticated: null
  },
  reducers: {
    // handle dark mode
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    
  },
});

export const {
    setIsAuthenticated
} = baseSlice.actions;

export default baseSlice.reducer;
