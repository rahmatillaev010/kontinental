"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { Crown, LogIn, LogOut, Settings, ShieldCheck, UserCircle, X } from "lucide-react";
import { createBrowserSupabaseClient, isBrowserSupabaseConfigured } from "@/lib/supabase/client";

export function AccountAccess() {
  const [supabase] = useState<SupabaseClient | null>(() => createBrowserSupabaseClient());
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabaseReady = useMemo(() => isBrowserSupabaseConfigured(), []);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession) {
        setOpen(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    async function checkAdmin() {
      if (!supabase || !session) {
        setIsAdmin(false);
        setChecked(true);
        return;
      }

      setChecked(false);
      const { data, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle();
      setIsAdmin(Boolean(data) && !adminError);
      setChecked(true);
    }

    checkAdmin();
  }, [session, supabase]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("Email или пароль неверный. Введи данные аккаунта из Supabase Auth.");
    }
    setLoading(false);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setOpen(false);
  }

  if (!supabaseReady || !supabase) return null;

  return (
    <>
      <div className="account-dock">
        {session && isAdmin ? (
          <Link href="/admin" className="account-dock-main">
            <Settings className="h-4 w-4" aria-hidden />
            Админ-панель
          </Link>
        ) : (
          <button type="button" className="account-dock-main" onClick={() => setOpen(true)}>
            {session ? <UserCircle className="h-4 w-4" aria-hidden /> : <LogIn className="h-4 w-4" aria-hidden />}
            {session ? "Аккаунт" : "Войти"}
          </button>
        )}

        {session ? (
          <button type="button" className="account-dock-icon" onClick={signOut} aria-label="Выйти">
            <LogOut className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="account-modal">
          <div className="account-card">
            <button type="button" className="account-close" onClick={() => setOpen(false)} aria-label="Закрыть">
              <X className="h-5 w-5" aria-hidden />
            </button>

            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/35 bg-gold/10 text-gold-soft">
                <Crown className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gold-soft">Аккаунт портала</p>
                <h2 className="font-display text-3xl text-white">{session ? "Вы вошли" : "Войти в аккаунт"}</h2>
              </div>
            </div>

            {session ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm text-silver">Аккаунт</p>
                  <p className="mt-1 font-bold text-white">{session.user.email}</p>
                </div>

                <div className="rounded-2xl border border-gold/25 bg-gold/10 p-4">
                  <p className="flex items-center gap-2 font-bold text-gold-soft">
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                    {checked && isAdmin ? "Доступ администратора открыт" : "Обычный аккаунт"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-silver">
                    {checked && isAdmin ? "Теперь кнопка админ-панели видна на сайте." : "Этот аккаунт вошёл, но он не добавлен в список администраторов."}
                  </p>
                </div>

                {isAdmin ? (
                  <Link href="/admin" className="button-primary w-full" onClick={() => setOpen(false)}>
                    <Settings className="h-4 w-4" aria-hidden />
                    Открыть админ-панель
                  </Link>
                ) : null}

                <button type="button" className="button-secondary w-full" onClick={signOut}>
                  <LogOut className="h-4 w-4" aria-hidden />
                  Выйти
                </button>
              </div>
            ) : (
              <form onSubmit={signIn} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm text-silver">Email</span>
                  <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-silver">Пароль</span>
                  <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </label>

                {error ? <p className="rounded-2xl border border-red-400/35 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}

                <button type="submit" className="button-primary w-full" disabled={loading}>
                  <LogIn className="h-4 w-4" aria-hidden />
                  {loading ? "Вхожу..." : "Войти"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
