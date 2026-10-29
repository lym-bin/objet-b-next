// components/Header.tsx
import Link from "next/link";
import CartCount from "@/components/CartCount";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/" className="text-lg font-semibold">
        Objet & B
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link href="/products">Shop</Link>
        <CartCount />
      </nav>
    </header>
  );
}
