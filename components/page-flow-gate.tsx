"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowDown, ArrowUpRight, Crown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

const flow = [
  { href: "/", label: "Главная", note: "вход в портал" },
  { href: "/history", label: "История", note: "архив Континенталя" },
  { href: "/leader", label: "Лидер", note: "профиль главы" },
  { href: "/members", label: "Участники", note: "состав гильдии" },
  { href: "/roles", label: "Руководство", note: "штаб и должности" },
  { href: "/gallery", label: "Галерея", note: "моменты гильдии" },
  { href: "/rules", label: "Вступление", note: "путь кандидата" },
  { href: "/combat", label: "МЯСО / КВ", note: "режимы и заявки" },
  { href: "/archive", label: "Архив", note: "бывшие участники" }
];

export function PageFlowGate() {
  const pathname = usePathname();
  const router = useRouter();
  const gateRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef<number | null>(null);
  const wheelPower = useRef(0);
  const lastWheelAt = useRef(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const currentIndex = useMemo(() => flow.findIndex((item) => item.href === pathname), [pathname]);
  const current = currentIndex >= 0 ? flow[currentIndex] : null;
  const next = currentIndex >= 0 ? flow[(currentIndex + 1) % flow.length] : null;

  useEffect(() => {
    setLeaving(false);
    wheelPower.current = 0;
    lastWheelAt.current = 0;
  }, [pathname]);

  useEffect(() => {
    const element = gateRef.current;
    if (!element || !next) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setReady(Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.38));
      },
      { threshold: [0, 0.38, 0.72] }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [next]);

  useEffect(() => {
    if (!next) return;
    const nextHref = next.href;

    function goNext() {
      if (!ready || leaving) return;
      setLeaving(true);
      window.setTimeout(() => router.push(nextHref), 360);
    }

    function onWheel(event: WheelEvent) {
      const documentHeight = document.documentElement.scrollHeight;
      const bottomDistance = documentHeight - (window.scrollY + window.innerHeight);
      const isPressedToBottom = bottomDistance < 18;
      if (!isPressedToBottom || event.deltaY <= 0) {
        wheelPower.current = 0;
        return;
      }

      const now = Date.now();
      if (now - lastWheelAt.current > 900) wheelPower.current = 0;
      lastWheelAt.current = now;
      wheelPower.current += Math.min(140, event.deltaY);
      if (wheelPower.current > 420) goNext();
    }

    function onTouchStart(event: TouchEvent) {
      touchStart.current = event.touches[0]?.clientY ?? null;
    }

    function onTouchEnd(event: TouchEvent) {
      const start = touchStart.current;
      const end = event.changedTouches[0]?.clientY ?? null;
      touchStart.current = null;
      if (start === null || end === null) return;
      const documentHeight = document.documentElement.scrollHeight;
      const bottomDistance = documentHeight - (window.scrollY + window.innerHeight);
      if (bottomDistance < 18 && start - end > 120) goNext();
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [leaving, next, ready, router]);

  if (!current || !next || pathname.startsWith("/admin")) return null;

  return (
    <section ref={gateRef} className={clsx("flow-gate", ready && "is-ready", leaving && "is-leaving")}>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="section-code">
            <Crown className="h-4 w-4" aria-hidden />
            маршрут портала
          </p>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">Переход в следующий раздел</h2>
          <p className="mt-4 max-w-xl leading-8 text-silver">
            Докрутил страницу до конца? Сделай ещё один скролл вниз, и портал сам откроет следующий зал.
          </p>
        </div>

        <div className="flow-gate-panel">
          <div className="flow-gate-orbit" aria-hidden>
            <ArrowDown className="h-8 w-8" />
          </div>
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-[0.2em] text-gold-soft">Сейчас</p>
            <h3 className="mt-2 font-display text-3xl text-white">{current.label}</h3>
            <p className="mt-1 text-silver">{current.note}</p>
          </div>
          <div className="flow-gate-line" aria-hidden />
          <Link href={next.href} className="flow-gate-next">
            <span>
              <span className="block text-sm uppercase tracking-[0.2em] text-gold-soft">Дальше</span>
              <strong>{next.label}</strong>
              <span>{next.note}</span>
            </span>
            <ArrowUpRight className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
