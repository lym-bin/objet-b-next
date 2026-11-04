//store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

// 장부 만드는 기계: 부를 때마다 새 장부(store)를 만들어 줌
export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

// 타입 3줄 (TypeScript용: 장부 모양을 다른 파일에서 쓰려고)
export type AppStore = ReturnType<typeof makeStore>; // 장부 자체의 타입
export type RootState = ReturnType<AppStore["getState"]>; // 장부 안 내용의 전체의 타입
export type AppDispatch = AppStore["dispatch"]; // 창구(dispatch)의 타입
