// context/CartContext.tsx
// 클라이언트 컴포넌트

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string; // productId-color-size
  productId: number;
  name: string;
  price: number; // 단가 (총액은 계산으로)
  color: string;
  size: string;
  qty: number;
  imgSrc: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  totalCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "objet-b-cart";
const MAX_QTY = 20; // TO-BE M5에서 한곳으로

function loadItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); // 기본 상품 빈 배열
  const [isLoaded, setIsLoaded] = useState(false); // 로컬스토리지 동기화(state와 localstorage 데이터) 완료 여부 (Hydration / 초기 로딩 방어)

  // 마운트 직후(클라이언트 환경), 로컬스토리지에서 기존 장바구니 데이터를 불러와 상태 초기화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadItems());
    setIsLoaded(true);
  }, []);

  // items가 변경될 때마다 로컬스토리지에 동기화 (단, 초기 로딩이 끝나기 전 빈 배열로 덮어씌워지는 현상 방지)
  useEffect(() => {
    // 아직 초기 데이터가 로드되지 않았다면 저장 로직을 타지 않고 즉시 중단(return)
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // 저장 실패해도 앱은 계속 동작
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<CartItem, "id">) => {
    const id = `${item.productId}-${item.color}-${item.size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + item.qty) } : i,
        );
      }
      return [...prev, { ...item, id }];
    });
  };

  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    //Provider throw Error
    throw new Error("CartProvider 내부에서만");
  }
  return ctx;
}
