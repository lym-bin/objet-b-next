// components/ProductCard.tsx
import type { Product } from "@/data/ProductsData";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, imgSrc, price } = product;
  return (
    <li>
      <img src={`/${imgSrc}`} alt={name} />
      <p>{name}</p>
      <p>{`${price.toLocaleString()}원`}</p>
    </li>
  );
}
