"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, BookOpen, Crown, GalleryHorizontal, Menu, ScrollText, Settings, Shield, UserPlus, Users, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Главная", icon: Crown },
  { href: "/history", label: "История", icon: BookOpen },
  { href: "/leader", label: "Лидер", icon: Shield },
  { href: "/members", label: "Участники", icon: Users },
  { href: "/roles", label: "Руководство", icon: ScrollText },
  { href: "/gallery", label: "Галерея", icon: GalleryHorizontal },
  { href: "/rules", label: "Правила", icon: Shield },
  { href: "/application", label: "Анкета", icon: UserPlus },
  { href: "/archive", label: "Архив", icon: Archive },
  { href: "/admin", label: "Админ", icon: Settings }
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-obsidian/86 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/40 bg-gold/10 text-gold-soft">
            <Crown className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block font-display text-xl text-white">Континенталь</span>
            <span className="block text-xs uppercase tracking-[0.22em] text-silver/70">Добро пожаловать</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                  active ? "bg-gold/12 text-gold-soft" : "text-silver hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-silver lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 px-4 py-3 lg:hidden">
          <div className="grid gap-2 sm:grid-cols-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                    active ? "bg-gold/12 text-gold-soft" : "text-silver hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
