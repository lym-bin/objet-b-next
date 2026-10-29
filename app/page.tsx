import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">Objet & B</h1>
      <p className="text-zinc-600">일상에 어울리는 미니멀리즘 상품</p>
      <Link
        href="/products"
        className="rounded-full bg-black px-6 py-3 text-white"
      >
        매장 둘러보기
      </Link>
    </main>
  );
}
