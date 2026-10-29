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

import { MAX_QTY } from "@/data/OrderRules";

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

// localStorage에서 문자열을 꺼내 배열로 바꿈 (없으면 빈 배열). try/catch = 데이터가 깨졌거나 localstorage를 못 쓸때 앱이 안 죽게
function loadItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); // 기본 상품 빈 배열(서버에는 localstorage가 없기 때문에 브라우저와 맞춤)
  const [isLoaded, setIsLoaded] = useState(false); // 금고에서 로드 됐는지? 깃발 (처음 false). 로드 전엔 저장을 막아 빈 배열로 저장 방지

  // 마운트 직후 실행 (서버에선 실행 안 됨): 금고 → 장부로 옮기고 깃발 올림
  // 하이드레이션을 맞추려고 일부러 화면을 state와 맞춰 한번 더 그리는 거라 아래 lint 규칙만 끔
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadItems());
    setIsLoaded(true);
  }, []);

  // items가 변경될 때마다 로컬스토리지에 동기화 (단, 초기 로딩이 끝나기 전 빈 배열로 덮어씌워지는 현상 방지)
  // isLoaded(깃발)이 로드 됐을 때 실행
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
    const id = `${item.productId}-${item.color}-${item.size}`; // id 이름표 만들기
    setItems((prev) => {
      // prev 함수형 업데이트
      const existing = prev.find((i) => i.id === id); // 존재 하는지
      if (existing) {
        // 있으면: 더하고 20에서 멈춤(서버는 21개 이상이 추가되면 결제 멈춤)
        return prev.map((i) =>
          i.id === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + item.qty) } : i,
        );
      }
      return [...prev, { ...item, id }]; // 새 줄 추가
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
