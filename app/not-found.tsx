// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">페이지를 찾을 수 없습니다.</h1>
      <p className="text-zinc-600">주소가 바뀌었거나, 없는 페이지입니다.</p>
      <Link href="/" className="rounded-full bg-black px-6 py-3 text-white">
        홈으로 이동하기
      </Link>
    </main>
  );
}
