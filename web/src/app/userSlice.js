import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    loggedIn: false,
  },
  reducers: {
    signIn: (state, action) => {
      state.user = action.payload;
      state.loggedIn = true;
    },
    signOut: (state) => {
      state.user = {};
      state.loggedIn = false;
    },
  },
});

export const { signIn, signOut } = userSlice.actions;
export default userSlice.reducer;
