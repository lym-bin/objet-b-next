"use client"; // 움직이는 조각: 파일 맨 첫 줄

import { useState } from "react";
import type { ColorOption } from "@/data/OptionsData";
import type { Product } from "@/data/ProductsData";
import { useCart } from "@/context/CartContext";

interface ProductOptionsProps {
  product: Pick<Product, "id" | "name" | "price" | "imgSrc">; // Omit의 반대 이것만 고른다.
  colors: ColorOption[];
  sizes: string[];
}

const MAX_QTY = 20;

export default function ProductOptions({
  product,
  colors,
  sizes,
}: ProductOptionsProps) {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const canAdd = selectedColor !== "" && selectedSize !== "";
  const { addItem } = useCart();

  return (
    <div>
      <p>색상: {selectedColor || "선택 안 함"}</p>
      <ul className="flex gap-2">
        {colors.map((color) => (
          <li key={color.value}>
            <button
              type="button"
              onClick={() => setSelectedColor(color.value)}
              aria-pressed={selectedColor === color.value} // 화면 낭독기: "눌림"/"안 눌림"
              className={`border px-3 py-1 ${
                // 삼항 분기 고른 값과 버튼값이 같으면 bold 아니면 gray
                selectedColor === color.value
                  ? "border-black font-bold"
                  : "border-gray-300"
              }`}
            >
              {color.label}
            </button>
          </li>
        ))}
      </ul>
      <p>사이즈: {selectedSize || "선택 안 함"}</p>
      <ul className="flex gap-2">
        {sizes.map((size) => (
          <li key={size}>
            <button
              type="button"
              onClick={() => setSelectedSize(size)}
              aria-pressed={selectedSize === size}
              className={`border px-3 py-1 ${selectedSize === size ? "border-black font-bold" : "border-gray-300"}`}
            >
              {size}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setQty((prev) => Math.max(1, prev - 1))} // 1 빼되, 1 아래로는 안 감
          disabled={qty <= 1}
          aria-label="수량 줄이기"
        >
          −
        </button>
        <span>{qty}</span>
        <button
          type="button"
          onClick={() => setQty((prev) => Math.min(MAX_QTY, prev + 1))} // 1 더하되, 20 위로는 안 감
          disabled={qty >= MAX_QTY}
          aria-label="수량 늘리기"
        >
          +
        </button>
      </div>

      <div>
        <button
          type="button"
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              imgSrc: product.imgSrc,
              color: selectedColor,
              size: selectedSize,
              qty,
            })
          }
          disabled={!canAdd}
        >
          담기
        </button>
        {!canAdd && <p>색상과 사이즈를 선택해 주세요</p>}
      </div>
    </div>
  );
}
