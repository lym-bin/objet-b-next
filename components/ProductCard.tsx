// components/ProductCard.tsx
import type { Product } from "@/data/ProductsData";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, imgSrc, price } = product;
  return (
    <li>
      <div className="relative aspect-[3/4]">
        <Image
          src={`/${imgSrc}`}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="mt-2">
        <p className="font-medium">{name}</p>
        <p className="text-gray-600">{`${price.toLocaleString()}원`}</p>
      </div>
    </li>
  );
}
