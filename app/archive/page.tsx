import type { Metadata } from "next";
import { Archive } from "lucide-react";
import { MemberGrid } from "@/components/member-grid";
import { SectionHeading } from "@/components/section-heading";
import { getMembers, getRoles } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Архив",
  description: "Архив участников, которые ранее состояли в гильдии Континенталь.",
  path: "/archive"
});

export default async function ArchivePage() {
  const [members, roles] = await Promise.all([getMembers("archived"), getRoles()]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Archive}
        eyebrow="Архив"
        title="Архив участников"
        description="Здесь хранятся участники, которые больше не находятся в активном составе. Администратор может восстановить их в панели управления."
      />

      <section className="mt-12">
        <MemberGrid members={members} roles={roles} />
      </section>
    </main>
  );
}
