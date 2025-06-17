import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = {
  _id: string;
  isBusiness: boolean;
  isAdmin: boolean;
  iat?: number;
} | null;

const initialState: UserType = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => action.payload,
    clearUser: () => null,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
