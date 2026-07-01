import Link from "next/link";
import { Crown, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-obsidian/82">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-silver sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/40 bg-gold/10 text-gold-soft">
            <Crown className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-display text-lg text-white">Континенталь</p>
            <p>Закрытый портал гильдии Free Fire.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/application" className="button-secondary">
            Анкета
          </Link>
          <a href="https://t.me/glkontinental" target="_blank" rel="noreferrer" className="button-primary">
            <Send className="h-4 w-4" aria-hidden />
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}
