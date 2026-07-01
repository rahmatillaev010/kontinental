import { BookOpen, Crown, ScrollText, Shield, Star } from "lucide-react";
import { getSiteContent } from "@/lib/data";
import { getContentItem } from "@/lib/site-content";

export default async function HistoryPage() {
  const content = await getSiteContent();
  const intro = getContentItem(content, "history_intro");
  const code = getContentItem(content, "history_code");
  const timeline = [
    { icon: Crown, item: getContentItem(content, "history_foundation") },
    { icon: Shield, item: getContentItem(content, "history_structure") },
    { icon: ScrollText, item: getContentItem(content, "history_archive") },
    { icon: Star, item: getContentItem(content, "history_future") }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="section-code">
          <BookOpen className="h-4 w-4" aria-hidden />
          //Архив гильдии
        </p>
        <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">{intro.title}</h1>
        <p className="mt-4 leading-8 text-silver">{intro.body}</p>
      </div>

      <section className="grid gap-5 md:grid-cols-2">
        {timeline.map((item) => {
          const Icon = item.icon;

          return (
            <article className="royal-border portal-step rounded-lg p-6" key={item.item.key}>
              <Icon className="mb-5 h-7 w-7 text-gold" aria-hidden />
              <h2 className="font-display text-2xl text-white">{item.item.title}</h2>
              <p className="mt-3 leading-7 text-silver">{item.item.body}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-12 rounded-lg border border-gold/25 bg-gradient-to-br from-royal/35 to-black/30 p-6">
        <h2 className="font-display text-3xl text-white">{code.title}</h2>
        <p className="mt-4 max-w-4xl leading-8 text-silver">{code.body}</p>
      </section>
    </main>
  );
}
