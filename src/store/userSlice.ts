// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppUser = {
  _id: string;
  email: string;
  isBusiness?: boolean;
  isAdmin?: boolean;
  name?: { first?: string; middle?: string; last?: string };
  image?: { url?: string; alt?: string };
};

type UserState = AppUser | null;

const initialState: UserState = null;

const userSlice = createSlice({
  name: "user",
  initialState: initialState as UserState,
  reducers: {
    setUser: (_state: UserState, action: PayloadAction<AppUser | null>): UserState =>
      action.payload,

    clearUser: (): UserState => null,

    updateUserImage: (
      state: UserState,
      action: PayloadAction<{ url: string; alt?: string }>
    ): UserState => {
      if (!state) return state;
      const next: AppUser = {
        ...state,
        image: {
          url: action.payload.url,
          alt: action.payload.alt ?? state.image?.alt ?? "",
        },
      };
      return next;
    },
  },
});

export const { setUser, clearUser, updateUserImage } = userSlice.actions;
export default userSlice.reducer;
