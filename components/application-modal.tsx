"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle, Loader2, Upload, UserPlus, X } from "lucide-react";
import { createBrowserSupabaseClient, isBrowserSupabaseConfigured } from "@/lib/supabase/client";

type ApplicationModalProps = {
  buttonLabel?: string;
  openOnMount?: boolean;
};

type FormState = {
  name: string;
  age: string;
  birth_date: string;
  game_nickname: string;
  game_id: string;
  invited_by: string;
  nationality: string;
  languages: string;
  location: string;
  device: string;
  ult_skill: string;
  sns_skill: string;
  first_impression: string;
};

const emptyForm: FormState = {
  name: "",
  age: "",
  birth_date: "",
  game_nickname: "",
  game_id: "",
  invited_by: "",
  nationality: "",
  languages: "",
  location: "",
  device: "",
  ult_skill: "",
  sns_skill: "",
  first_impression: ""
};

function uniqueName(file: File) {
  const extension = file.name.split(".").pop() || "jpg";
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  return `applications/${id}.${extension.toLowerCase()}`;
}

export function ApplicationModal({ buttonLabel = "Заполнить анкету", openOnMount = false }: ApplicationModalProps) {
  const [open, setOpen] = useState(openOnMount);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabaseReady = useMemo(() => isBrowserSupabaseConfigured(), []);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      let photoUrl: string | null = null;
      const supabase = createBrowserSupabaseClient();

      if (supabase && photo) {
        if (!photo.type.startsWith("image/")) {
          throw new Error("Загрузить можно только изображение.");
        }

        if (photo.size > 5 * 1024 * 1024) {
          throw new Error("Фото должно быть меньше 5 МБ.");
        }

        const filePath = uniqueName(photo);
        const { error: uploadError } = await supabase.storage.from("member-photos").upload(filePath, photo, {
          cacheControl: "3600",
          upsert: false
        });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from("member-photos").getPublicUrl(filePath);
        photoUrl = data.publicUrl;
      }

      if (supabase) {
        const { error: insertError } = await supabase.from("applications").insert({
          name: form.name.trim(),
          age: Number(form.age),
          birth_date: form.birth_date,
          game_nickname: form.game_nickname.trim(),
          game_id: form.game_id.trim(),
          invited_by: form.invited_by.trim() || null,
          nationality: form.nationality.trim() || null,
          languages: form.languages.trim() || null,
          location: form.location.trim() || null,
          device: form.device.trim() || null,
          ult_skill: form.ult_skill.trim() || null,
          sns_skill: form.sns_skill.trim() || null,
          first_impression: form.first_impression.trim() || null,
          photo_url: photoUrl,
          status: "pending"
        });

        if (insertError) {
          throw insertError;
        }
      }

      setForm(emptyForm);
      setPhoto(null);
      setMessage(
        supabaseReady
          ? "Анкета отправлена на проверку. Она появится на сайте только после одобрения администрацией."
          : "Демо-режим: форма выглядит и работает, но для реальной отправки нужно подключить Supabase."
      );
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Не удалось отправить анкету.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button type="button" className="button-primary" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" aria-hidden />
        {buttonLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-md">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-gold/30 bg-[#07080d] shadow-royal">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-gold-soft">Анкета кандидата</p>
                <h2 className="font-display text-2xl text-white">Вступление в Континенталь</h2>
              </div>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-silver hover:text-white"
                onClick={() => setOpen(false)}
                aria-label="Закрыть анкету"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <form onSubmit={submitApplication} className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm text-silver">Имя *</span>
                  <input required value={form.name} onChange={(event) => updateField("name", event.target.value)} className="field" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-silver">Возраст *</span>
                  <input required min="10" max="99" type="number" value={form.age} onChange={(event) => updateField("age", event.target.value)} className="field" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-silver">Дата рождения *</span>
                  <input required type="date" value={form.birth_date} onChange={(event) => updateField("birth_date", event.target.value)} className="field" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-silver">Ник в игре *</span>
                  <input required value={form.game_nickname} onChange={(event) => updateField("game_nickname", event.target.value)} className="field" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-silver">ID в игре *</span>
                  <input required value={form.game_id} onChange={(event) => updateField("game_id", event.target.value)} className="field" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-silver">Кто позвал / откуда взялся</span>
                  <input value={form.invited_by} onChange={(event) => updateField("invited_by", event.target.value)} className="field" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-silver">Нация</span>
                  <input value={form.nationality} onChange={(event) => updateField("nationality", event.target.value)} className="field" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-silver">Языки</span>
                  <input value={form.languages} onChange={(event) => updateField("languages", event.target.value)} className="field" placeholder="Русский, Казахский" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-silver">Откуда ты</span>
                  <input value={form.location} onChange={(event) => updateField("location", event.target.value)} className="field" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-silver">Устройство</span>
                  <input value={form.device} onChange={(event) => updateField("device", event.target.value)} className="field" placeholder="Android, iPhone, iPad" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-silver">Хорошо играешь ли ульт</span>
                  <input value={form.ult_skill} onChange={(event) => updateField("ult_skill", event.target.value)} className="field" />
                </label>
                <label>
                  <span className="mb-2 block text-sm text-silver">Хорошо играешь ли СНС</span>
                  <input value={form.sns_skill} onChange={(event) => updateField("sns_skill", event.target.value)} className="field" />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-silver">Первое впечатление о гильдии</span>
                <textarea
                  value={form.first_impression}
                  onChange={(event) => updateField("first_impression", event.target.value)}
                  className="field min-h-28 resize-y"
                />
              </label>

              <label className="block rounded-lg border border-dashed border-gold/35 bg-gold/5 p-4">
                <span className="mb-2 flex items-center gap-2 text-sm text-silver">
                  <Upload className="h-4 w-4 text-gold" aria-hidden />
                  Фото
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-silver file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black"
                />
              </label>

              <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm leading-6 text-silver">
                Отправляя анкету, ты соглашаешься, что указанные данные могут быть опубликованы на сайте гильдии после проверки администрацией.
              </p>

              {message ? (
                <p className="flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                  <CheckCircle className="h-4 w-4" aria-hidden />
                  {message}
                </p>
              ) : null}

              {error ? <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}

              <div className="flex flex-wrap justify-end gap-3">
                <button type="button" className="button-secondary" onClick={() => setOpen(false)}>
                  Закрыть
                </button>
                <button type="submit" className="button-primary" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <UserPlus className="h-4 w-4" aria-hidden />}
                  Отправить на проверку
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
