import { ScrollText } from "lucide-react";
import clsx from "clsx";
import { SectionHeading } from "@/components/section-heading";
import { getRoles } from "@/lib/data";
import { getRoleVisual } from "@/lib/role-styles";

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        icon={ScrollText}
        eyebrow="Иерархия"
        title="Руководство"
        description="Здесь показана структура гильдии: лидер, управляющие, офицеры, проверяющие и участники. Названия, порядок и описания меняются в админ-панели."
      />

      <section className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => {
          const visual = getRoleVisual(role);
          const Icon = visual.Icon;

          return (
            <article className={clsx("relative overflow-hidden rounded-lg border p-5", visual.cardClass)} key={role.id}>
              <div className={clsx("absolute left-0 top-0 h-full w-1", visual.railClass)} />
              <Icon className="mb-5 h-7 w-7 text-gold-soft" aria-hidden />
              <p className="mb-2 text-sm text-silver">Порядок: {role.sort_order}</p>
              <h2 className="font-display text-2xl text-white">{role.name}</h2>
              <p className="mt-3 leading-7 text-silver">{role.description || "Описание можно добавить в админ-панели."}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
