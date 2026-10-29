// utils/calculateAmount.ts
// 브라우저가 보낸 금액 대신, 상품 번호와 수량만으로 서버가 합계를 다시 계산하는 함수
import { PRODUCTS } from "@/data/ProductsData";
import { MAX_QTY } from "@/data/OrderRules";

// 상품 번호와 수량으로 서버가 직접 합계를 계산(브라우저가 보낸 가격은 믿지 않음)
// 없는 상품이거나 수량이 이상하면 null
export function calculateAmount(
  items: { productId: number; qty: number }[],
): number | null {
  let total = 0;
  for (const item of items) {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    const isValidQty =
      Number.isInteger(item.qty) && item.qty >= 1 && item.qty <= MAX_QTY;
    if (!product || !isValidQty) return null;
    total += product.price * item.qty;
  }
  return total;
}
