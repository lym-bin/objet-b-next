//store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAX_QTY } from "@/data/OrderRules";
import type { CartItem } from "@/context/CartContext"; // Context 지울 때 옮길 예정

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
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
  },
});

export const { addItem } = cartSlice.actions;
export default cartSlice.reducer;
