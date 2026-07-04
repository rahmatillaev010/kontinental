import type { Metadata } from "next";
import { Users } from "lucide-react";
import { MembersAccessGate } from "@/components/members-access-gate";
import { SectionHeading } from "@/components/section-heading";
import { getMembers, getRoles } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Участники",
  description: "Закрытый состав участников Континенталя с поиском, фильтрами и профилями игроков.",
  path: "/members"
});

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const [members, roles] = await Promise.all([getMembers("active"), getRoles()]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Users}
        eyebrow="Состав"
        title="Участники"
        description="Раздел закрыт кодом доступа. После входа можно искать игроков по имени, нику или ID, фильтровать по должности, устройству и языкам."
      />

      <section className="mt-12">
        <MembersAccessGate members={members} roles={roles} />
      </section>
    </main>
  );
}
