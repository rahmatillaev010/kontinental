"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";

export function RoyalEntryGate() {
  const [visible, setVisible] = useState(true);
  const [complete, setComplete] = useState(false);
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setProgress(49), 2000),
      window.setTimeout(() => setProgress(72), 4000),
      window.setTimeout(() => {
        setProgress(100);
        setComplete(true);
      }, 6000),
      window.setTimeout(() => setVisible(false), 8500)
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  if (!visible) return null;

  return (
    <div className={complete ? "royal-entry is-complete" : "royal-entry"} aria-live="polite" aria-label="Королевская загрузка">
      <div className="royal-entry-hall" aria-hidden />
      <div className="royal-entry-crown" aria-hidden>
        <Crown className="h-9 w-9" />
      </div>
      <div className="royal-entry-loader" aria-hidden>
        <div className="royal-entry-loader-percent">
          <strong>{progress}%</strong>
        </div>
        <div className="royal-entry-track">
          <div className="royal-entry-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="royal-entry-loader-status">{complete ? "ВХОД ВЫПОЛНЕН" : "LOADING..."}</div>
      </div>
      <div className="royal-entry-copy">
        <p>{complete ? "Вход выполнен" : "Добро пожаловать в Континенталь"}</p>
        <span>{complete ? "Главная открывается" : "Инициализация главной страницы"}</span>
      </div>
    </div>
  );
}
