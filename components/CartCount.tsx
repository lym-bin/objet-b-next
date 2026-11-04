// components/CartCount.tsx

"use client";

import { useAppSelector } from "@/store/hooks";

export default function CartCount() {
  // 장부(state) -> cart 페이지 -> items 배열 -> 수량 합계
  const totalCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.qty, 0),
  );
  return <p>장바구니 ({totalCount})</p>;
}
