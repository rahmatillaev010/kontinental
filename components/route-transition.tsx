"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RoyalEntryGate } from "@/components/royal-entry-gate";

export function RouteTransition() {
  const pathname = usePathname();
  const timeoutRef = useRef<number | null>(null);
  const homeGateTimeoutRef = useRef<number | null>(null);
  const homeGateActiveRef = useRef(false);
  const [active, setActive] = useState(false);
  const [homeGateActive, setHomeGateActive] = useState(false);
  const [homeGateKey, setHomeGateKey] = useState(0);

  function startHomeGate() {
    homeGateActiveRef.current = true;
    setActive(false);
    setHomeGateKey((key) => key + 1);
    setHomeGateActive(true);

    if (homeGateTimeoutRef.current) window.clearTimeout(homeGateTimeoutRef.current);
    homeGateTimeoutRef.current = window.setTimeout(() => {
      homeGateActiveRef.current = false;
      setHomeGateActive(false);
    }, 9000);
  }

  useEffect(() => {
    function start(event: Event) {
      const href = event instanceof CustomEvent ? event.detail?.href : null;
      if (href === "/") {
        startHomeGate();
        return;
      }

      setActive(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setActive(false), 720);
    }

    window.addEventListener("kontinental:navigate-start", start);
    return () => {
      window.removeEventListener("kontinental:navigate-start", start);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (homeGateTimeoutRef.current) window.clearTimeout(homeGateTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/" && !homeGateActiveRef.current) {
      startHomeGate();
    }
  }, [pathname]);

  useEffect(() => {
    if (!active) return;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setActive(false), 260);
  }, [active, pathname]);

  return (
    <>
      <div className={active ? "route-transition is-active" : "route-transition"} aria-hidden>
        <div className="route-transition-portal" />
        <div className="route-transition-hall" />
        <div className="route-transition-flare" />
        <div className="route-transition-particles" />
      </div>
      {homeGateActive ? <RoyalEntryGate key={homeGateKey} /> : null}
    </>
  );
}
