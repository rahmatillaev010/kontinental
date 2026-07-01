import { Crown, Shield } from "lucide-react";
import { MemberCard } from "@/components/member-card";
import { SectionHeading } from "@/components/section-heading";
import { getMembers } from "@/lib/data";

export default async function LeaderPage() {
  const members = await getMembers("active");
  const leader = members.find((member) => member.role?.slug === "leader") ?? members[0];

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Crown}
        eyebrow="Главный зал"
        title="Лидер гильдии"
        description="Главная фигура Континенталя, которая держит направление, структуру и тон общения."
      />

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="royal-border rounded-lg p-6">
          <Shield className="mb-5 h-8 w-8 text-gold" aria-hidden />
          <h2 className="font-display text-3xl text-white">Ответственность лидера</h2>
          <p className="mt-4 leading-8 text-silver">
            Лидер отвечает за решения, структуру руководства, атмосферу и финальное слово по важным вопросам состава. На портале эта роль выделена самым дорогим чёрно-золотым стилем.
          </p>
        </div>

        {leader ? <MemberCard member={leader} /> : null}
      </section>
    </main>
  );
}
