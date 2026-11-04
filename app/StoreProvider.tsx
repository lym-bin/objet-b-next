//app/StoreProvider.tsx

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { loadFromStorage } from "@/store/cartSlice";
import { loadItems } from "@/store/cartStorage";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  // 하이드레이션이 끝난 뒤(마운트 후) 한 번: 금고 → 장부, 깃발 올리기
  useEffect(() => {
    store.dispatch(loadFromStorage(loadItems()));
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
