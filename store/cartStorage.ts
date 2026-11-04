//store/cartStorage.ts
import type { CartItem } from "@/context/CartContext";

export const CART_STORAGE_KEY = "objet-b-cart";

// 금고 -> 배열 (CartContext의 loadItem을 그대로 옮기기)
export function loadItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

// 배열 -> 금고
export function saveItems(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // 저장 실패해도 앱은 계속 동작
  }
}
