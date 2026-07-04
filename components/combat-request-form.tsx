"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle, Loader2, Send, Shield } from "lucide-react";
import { createBrowserSupabaseClient, isBrowserSupabaseConfigured } from "@/lib/supabase/client";

export function CombatRequestForm() {
  const [guildName, setGuildName] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [description, setDescription] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabaseReady = useMemo(() => isBrowserSupabaseConfigured(), []);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!agreed) {
      setError("Сначала поставь галочку согласия с правилами выбранного режима. Без согласия заявка не отправится.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();

      if (supabase) {
        const { error: insertError } = await supabase.from("combat_requests").insert({
          guild_name: guildName.trim(),
          telegram_username: telegramUsername.trim(),
          description: description.trim() || null,
          rules_agreed: true,
          status: "pending"
        });

        if (insertError) {
          throw insertError;
        }
      }

      setGuildName("");
      setTelegramUsername("");
      setDescription("");
      setAgreed(false);
      setMessage(
        supabaseReady
          ? "Заявка отправлена администрации. После проверки с вами свяжутся в Telegram."
          : "Демо-режим: форма готова, но для реальной отправки нужно подключить Supabase."
      );
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Не удалось отправить заявку.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitRequest} className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="flex min-h-full flex-col justify-center rounded-lg border border-gold/25 bg-black/25 p-7">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-soft shadow-royal">
          <Shield className="h-10 w-10" aria-hidden />
        </div>
        <h2 className="font-display text-4xl text-white">Заявка на МЯСО / КВ</h2>
        <p className="mt-4 leading-8 text-silver">
          Заполните форму ниже, и администрация рассмотрит вашу заявку. После одобрения с вами свяжутся в Telegram.
        </p>
      </div>

      <div className="space-y-4">
        <label>
          <span className="mb-2 block text-sm font-semibold text-silver">Название гильдии *</span>
          <input required value={guildName} onChange={(event) => setGuildName(event.target.value)} className="field" />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-silver">Telegram *</span>
          <input required value={telegramUsername} onChange={(event) => setTelegramUsername(event.target.value)} className="field" placeholder="@username" />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-silver">Описание *</span>
          <textarea required value={description} onChange={(event) => setDescription(event.target.value)} className="field min-h-32 resize-y" />
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gold/25 bg-gold/10 p-4">
          <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-1 h-4 w-4 accent-[#c9a45d]" />
          <span className="text-sm leading-6 text-silver">Я ознакомился с правилами выбранного режима и подтверждаю своё согласие.</span>
        </label>

        {message ? (
          <p className="flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">
            <CheckCircle className="h-4 w-4" aria-hidden />
            {message}
          </p>
        ) : null}

        {error ? <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}

        <button type="submit" className="button-primary w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
          Отправить заявку администрации
        </button>
      </div>
    </form>
  );
}
