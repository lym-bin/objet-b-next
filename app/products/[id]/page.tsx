//app /products/[id]/page.tsx
// 서버 컴포넌트: 주소의 id로 상품 하나를 찾아서 보여줌
import { notFound } from "next/navigation";
import { getProductById, PRODUCTS } from "@/data/ProductsData";
import Image from "next/image";
import type { Metadata } from "next";
// 빌드할 때 이 번호들로 상세 페이지를 미리 만들어줌 (SSG)
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) return {}; // 없는 상품이면 기본값(layout)을 그대로 둠.

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [`/${product.imgSrc}`],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

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
