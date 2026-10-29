// app/api/amount/route.ts
// 화면 없이 상품 번호와 수량을 받아, 서버가 계산한 합계를 JSON으로 돌려주는 창구
import { calculateAmount } from "@/utils/calculateAmount";

interface AmountBody {
  items: { productId: number; qty: number }[]; // 가격은 안 받고 "무엇을 몇 개"만 받음
}

// POST 요청이 오면 실행되는 함수
export async function POST(request: Request) {
  const { items } = (await request.json()) as AmountBody;

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json(
      { message: "주문 상품 정보가 없어요." },
      { status: 400 },
    );
  }

  const amount = calculateAmount(items);
  if (amount === null) {
    return Response.json(
      { message: "주문 상품 정보가 올바르지 않아요." },
      { status: 400 },
    );
  }

  return Response.json({ amount });
}
