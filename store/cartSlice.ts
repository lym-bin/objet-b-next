//store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAX_QTY } from "@/data/OrderRules";
import type { CartItem } from "@/context/CartContext"; // Context 지울 때 옮길 예정

interface CartState {
  items: CartItem[];
  isLoaded: boolean; // 금고에서 불러왔는지 깃발
}

const initialState: CartState = {
  items: [],
  isLoaded: false, // 처음 깃발 상태
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 요청서(actions)의 내용물: action.payload
    addItem(state, action: PayloadAction<Omit<CartItem, "id">>) {
      const item = action.payload;
      const id = `${item.productId}-${item.color}-${item.size}`;
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        existing.qty = Math.min(MAX_QTY, existing.qty + item.qty);
      } else {
        state.items.push({ ...item, id });
      }
    },
    // 금고에서 꺼낸 목록으로 장부를 통째로 바꾸고 깃발 올리기
    loadFromStorage(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.isLoaded = true;
    },
  },
});

export const { addItem, loadFromStorage } = cartSlice.actions;
export default cartSlice.reducer;
