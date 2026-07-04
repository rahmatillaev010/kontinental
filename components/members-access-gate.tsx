"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { KeyRound, ShieldCheck, Users } from "lucide-react";
import { MemberGrid } from "@/components/member-grid";
import type { MemberWithRole, Role } from "@/lib/types";

const storageKey = "kontinental-members-access";

type MembersAccessGateProps = {
  members?: MemberWithRole[];
  roles?: Role[];
  children?: ReactNode;
};

export function MembersAccessGate({ members = [], roles = [], children }: MembersAccessGateProps) {
  const [code, setCode] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const accessCode = (process.env.NEXT_PUBLIC_MEMBERS_ACCESS_CODE || "kontinental").trim();

  useEffect(() => {
    setAllowed(window.localStorage.getItem(storageKey) === "granted");
    setChecked(true);
  }, []);

  function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (code.trim().toLowerCase() !== accessCode.toLowerCase()) {
      setError("Код неверный. Попроси правильный код у лидера или руководства.");
      return;
    }

    window.localStorage.setItem(storageKey, "granted");
    setAllowed(true);
    setError("");
  }

  if (checked && allowed) {
    return children ?? <MemberGrid members={members} roles={roles} />;
  }

  return (
    <div className="access-gate royal-border mx-auto max-w-3xl rounded-lg p-6 sm:p-8">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg border border-gold/40 bg-gold/10 text-gold-soft">
        <KeyRound className="h-7 w-7" aria-hidden />
      </div>
      <p className="text-sm uppercase tracking-[0.22em] text-gold-soft">Закрытый просмотр</p>
      <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Состав открывается по коду</h2>
      <p className="mt-4 leading-7 text-silver">
        Код доступа выдаёт лидер или руководство. Если код введён правильно, ты увидишь участников, поиск, фильтры и карточки игроков.
      </p>

      <form onSubmit={submitCode} className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label>
          <span className="mb-2 block text-sm text-silver">Код доступа</span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="field"
            placeholder="Введи код от лидера"
            autoComplete="off"
          />
        </label>
        <button type="submit" className="button-primary self-end">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          Открыть
        </button>
      </form>

      {error ? <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/rules" className="button-secondary">
          Заполнить анкету
        </Link>
        <a href="https://t.me/glkontinental" target="_blank" rel="noreferrer" className="button-secondary">
          Telegram-канал
        </a>
        <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-silver">
          <Users className="h-4 w-4 text-gold" aria-hidden />
          Доступ выдаёт руководство
        </span>
      </div>
    </div>
  );
}
