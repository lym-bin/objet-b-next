// store/store.ts
import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import cartReducer, { addItem } from "./cartSlice";
import { saveItems } from "./cartStorage";

export const makeStore = () => {
  // 장부마다 기록원 한 명 (장부를 요청마다 따로 만드니까 기록원도 같이)
  const listener = createListenerMiddleware();

  listener.startListening({
    actionCreator: addItem, //
    effect: (action, api) => {
      // 처리가 끝난 뒤의 장부 읽기
      const state = api.getState() as { cart: ReturnType<typeof cartReducer> };
      if (!state.cart.isLoaded) return;
      saveItems(state.cart.items);
    },
  });

  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    // 기록원을 창구 앞에 배치 (RTK 공식 문서 방식)
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listener.middleware),
  });
};

// 타입 3줄 (TypeScript용: 장부 모양을 다른 파일에서 쓰려고)
export type AppStore = ReturnType<typeof makeStore>; // 장부 자체의 타입
export type RootState = ReturnType<AppStore["getState"]>; // 장부 안 내용의 전체의 타입
export type AppDispatch = AppStore["dispatch"]; // 창구(dispatch)의 타입
