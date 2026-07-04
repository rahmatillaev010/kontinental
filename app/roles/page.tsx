import type { Metadata } from "next";
import { Crown } from "lucide-react";
import { LeadershipCard } from "@/components/leadership-card";
import { SectionHeading } from "@/components/section-heading";
import { getLeadershipProfiles } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Руководство",
  description: "Руководство гильдии Континенталь: роли, обязанности, статистика и профили.",
  path: "/roles"
});

export default async function RolesPage() {
  const leaders = await getLeadershipProfiles();

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Crown}
        eyebrow="Командный центр"
        title="Руководство"
        description="Персональные карточки руководителей Континенталя: должности, обязанности, таймер в роли и официальные социальные сети."
      />

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        {leaders.map((leader) => (
          <LeadershipCard leader={leader} key={leader.id} />
        ))}
      </section>
    </main>
  );
}
