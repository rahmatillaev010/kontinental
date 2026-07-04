"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Archive,
  BookOpen,
  ChevronRight,
  Crown,
  GalleryHorizontal,
  Menu,
  ScrollText,
  Settings,
  Shield,
  Swords,
  UserPlus,
  Users,
  X
} from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import clsx from "clsx";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/", label: "Главная", note: "Королевский зал", icon: Crown, code: "I" },
  { href: "/rules", label: "Вступление", note: "Анкета и правила", icon: UserPlus, code: "II" },
  { href: "/combat", label: "МЯСО / КВ", note: "Боевые режимы", icon: Swords, code: "III" },
  { href: "/leader", label: "Лидер", note: "Профиль главы", icon: Shield, code: "IV" },
  { href: "/roles", label: "Руководство", note: "Штаб гильдии", icon: ScrollText, code: "V" },
  { href: "/members", label: "Участники", note: "Закрытый состав", icon: Users, code: "VI" },
  { href: "/history", label: "История", note: "Кодекс и хроника", icon: BookOpen, code: "VII" },
  { href: "/archive", label: "Архив", note: "Бывшие участники", icon: Archive, code: "VIII" },
  { href: "/gallery", label: "Галерея", note: "Музей моментов", icon: GalleryHorizontal, code: "IX" }
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [supabase] = useState<SupabaseClient | null>(() => createBrowserSupabaseClient());
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const visibleNavItems = isAdmin ? [...navItems, { href: "/admin", label: "Админ", note: "Закрытое управление", icon: Settings, code: "CMS" }] : navItems;
  const hoveredItem = visibleNavItems.find((item) => item.href === hoveredHref) ?? visibleNavItems.find((item) => item.href === pathname) ?? visibleNavItems[0];

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => setSession(currentSession));

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    async function checkAdmin() {
      if (!supabase || !session) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle();
      setIsAdmin(Boolean(data) && !error);
    }

    checkAdmin();
  }, [session, supabase]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (href === pathname) {
      setOpen(false);
      return;
    }

    event.preventDefault();
    setOpen(false);
    window.dispatchEvent(new CustomEvent("kontinental:navigate-start", { detail: { href } }));
    window.setTimeout(() => router.push(href), 340);
  }

  return (
    <>
      <aside className="site-launcher hidden lg:flex" onMouseLeave={() => setHoveredHref(null)}>
        <Link href="/" className="launcher-brand" onClick={(event) => navigate(event, "/")}>
          <span className="launcher-brand-mark">
            <Crown className="h-6 w-6" aria-hidden />
          </span>
          <span className="launcher-brand-copy">
            <span>Континенталь</span>
            <small>закрытый портал</small>
          </span>
        </Link>

        <nav className="launcher-menu" aria-label="Основные разделы">
          {visibleNavItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => navigate(event, item.href)}
                onMouseEnter={() => setHoveredHref(item.href)}
                className={clsx("launcher-item", active && "is-active")}
                aria-current={active ? "page" : undefined}
              >
                <span className="launcher-item-icon">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="launcher-item-copy">
                  <span>{item.label}</span>
                  <small>{item.note}</small>
                </span>
                <span className="launcher-item-code">{item.code}</span>
              </Link>
            );
          })}
        </nav>

        <div className="launcher-hover-panel" aria-hidden>
          <p>{hoveredItem.code}</p>
          <strong>{hoveredItem.label}</strong>
          <span>{hoveredItem.note}</span>
          <ChevronRight className="h-5 w-5" />
        </div>
      </aside>

      <header className="mobile-launcher lg:hidden">
        <Link href="/" className="flex items-center gap-3" onClick={(event) => navigate(event, "/")}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/40 bg-gold/10 text-gold-soft">
            <Crown className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block font-display text-xl text-white">Континенталь</span>
            <span className="block text-xs uppercase tracking-[0.22em] text-silver/70">закрытый портал</span>
          </span>
        </Link>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-silver"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {open ? (
        <div className="mobile-launcher-menu lg:hidden">
          <nav className="grid gap-2 sm:grid-cols-2" aria-label="Мобильные разделы">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(event) => navigate(event, item.href)}
                  className={clsx("mobile-launcher-item", active && "is-active")}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold-soft">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-bold text-white">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-silver">{item.note}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </>
  );
}
