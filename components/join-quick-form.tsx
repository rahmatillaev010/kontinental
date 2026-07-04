"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { createBrowserSupabaseClient, isBrowserSupabaseConfigured } from "@/lib/supabase/client";

export function JoinQuickForm() {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabaseReady = useMemo(() => isBrowserSupabaseConfigured(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const numericAge = Number(age);
      const currentYear = new Date().getFullYear();
      const birthDate = `${currentYear - numericAge}-01-01`;

      if (supabase) {
        const { error: insertError } = await supabase.from("applications").insert({
          name: name.trim(),
          age: numericAge,
          birth_date: birthDate,
          game_nickname: name.trim(),
          game_id: gameId.trim(),
          first_impression: "Короткая заявка со страницы вступления.",
          status: "pending"
        });

        if (insertError) {
          throw insertError;
        }
      }

      setName("");
      setGameId("");
      setAge("");
      setMessage(supabaseReady ? "Заявка отправлена в админку. Администрация рассмотрит её и свяжется с вами." : "Демо-режим: форма готова, но для реальной отправки нужно подключить Supabase.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Не удалось отправить заявку.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
      <label>
        <span className="mb-2 block text-sm font-semibold text-silver">Имя *</span>
        <input required value={name} onChange={(event) => setName(event.target.value)} className="field" />
      </label>
      <label>
        <span className="mb-2 block text-sm font-semibold text-silver">Айди *</span>
        <input required value={gameId} onChange={(event) => setGameId(event.target.value)} className="field" />
      </label>
      <label>
        <span className="mb-2 block text-sm font-semibold text-silver">Возраст *</span>
        <input required min="10" max="99" type="number" value={age} onChange={(event) => setAge(event.target.value)} className="field" />
      </label>

      {message ? (
        <p className="flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100 md:col-span-3">
          <CheckCircle className="h-4 w-4" aria-hidden />
          {message}
        </p>
      ) : null}

      {error ? <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100 md:col-span-3">{error}</p> : null}

      <button type="submit" className="button-primary md:col-span-3" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
        Отправить заявку
      </button>
    </form>
  );
}
