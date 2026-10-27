// components/CartCount.tsx

"use client";

import { useCart } from "@/context/CartContext";

export default function CartCount() {
  const { totalCount } = useCart();
  return <p>장바구니 ({totalCount})</p>;
}
