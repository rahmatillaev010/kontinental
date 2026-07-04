import type { Metadata } from "next";
import { LeaderShowcase } from "@/components/leader-showcase";
import { getLeadershipProfiles } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Лидер",
  description: "Профиль лидера Континенталя, срок пребывания, описание и официальные соцсети.",
  path: "/leader"
});

export const dynamic = "force-dynamic";

export default async function LeaderPage() {
  const leaders = await getLeadershipProfiles();
  const leader =
    leaders.find((item) => item.role_title.toLowerCase().includes("лидер") && !item.role_title.toLowerCase().includes("врем")) ??
    leaders[0];

  return (
    <main>
      {leader ? <LeaderShowcase leader={leader} /> : null}
    </main>
  );
}
