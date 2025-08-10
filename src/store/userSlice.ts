import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  _id: string;
  isBusiness: boolean;
  isAdmin: boolean;
  email: string;
  phone?: string;
  name?: {
    first: string;
    middle?: string;
    last: string;
  };
  image?: {
    url: string;
    alt: string;
  };
  address?: {
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    zip: string;
  };
} | null;


export type UserType = User | null;

const initialState: UserType = null;


const userSlice = createSlice<UserType>({
  name: "user",
  initialState,
  reducers: {
    setUser: (_state, action: PayloadAction<UserType>) => action.payload,
    clearUser: () => null,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
