import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <ShieldAlert className="mb-5 h-12 w-12 text-gold" aria-hidden />
      <h1 className="font-display text-4xl text-white">Страница не найдена</h1>
      <p className="mt-4 text-silver">В архиве Континенталя нет такой записи.</p>
      <Link href="/" className="button-primary mt-6">
        На главную
      </Link>
    </main>
  );
}
