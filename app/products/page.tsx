// app/products/page.tsx
// 서버 컴포넌트: 아무것도 안 붙히면 기본이 서버. 상호 작용이 없으니 그대로 둠
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/ProductsData";

export default function ProductsPage() {
  return (
    <main>
      <h1>상품 목록</h1>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </main>
  );
}
