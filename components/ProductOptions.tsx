"use client"; // 움직이는 조각: 파일 맨 첫 줄

import { useState } from "react";
import type { ColorOption } from "@/data/OptionsData";

interface ProductOptionsProps {
  colors: ColorOption[];
  sizes: string[];
}

export default function ProductOptions({ colors, sizes }: ProductOptionsProps) {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSeletedSize] = useState("");

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
              onClick={() => setSeletedSize(size)}
              aria-pressed={selectedSize === size}
              className={`border px-3 py-1 ${selectedSize === size ? "border-black font-bold" : "border-gray-300"}`}
            >
              {size}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
