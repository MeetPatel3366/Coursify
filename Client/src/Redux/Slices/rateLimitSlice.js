import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cooldown: 0 // seconds until next request allowed
};

const rateLimitSlice = createSlice({
  name: "rateLimit",
  initialState,
  reducers: {
    setCooldown: (state, action) => {
      state.cooldown = action.payload;
    },
    decrementCooldown: (state) => {
      if (state.cooldown > 0) {
        state.cooldown -= 1;
      }
    }
  }
});

export const { setCooldown, decrementCooldown } = rateLimitSlice.actions;
export default rateLimitSlice.reducer;
