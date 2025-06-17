import { configureStore } from "@reduxjs/toolkit";
import  useReducer  from "./userSlice";


export const store = configureStore({
    reducer:{
        user:useReducer,
    },
})


export type RootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;