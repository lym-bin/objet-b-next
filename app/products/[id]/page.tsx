//app /products/[id]/page.tsx
// 서버 컴포넌트: 주소의 id로 상품 하나를 찾아서 보여줌
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/ProductsData";
import Image from "next/image";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    notFound();
  }
  return (
    <main>
      <div className="relative aspect-[3/4] w-full max-w-md">
        <Image
          src={`/${product.imgSrc}`}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 448px"
          preload
          className="object-cover"
        />
      </div>
      <h1>{product.name}</h1>
      <p>{`${product.price.toLocaleString()}원`}</p>
      <p>{product.description}</p>
    </main>
  );
}
