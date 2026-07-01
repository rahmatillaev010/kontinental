import { LucideIcon } from "lucide-react";

type SectionHeadingProps = {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ icon: Icon, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-gold-soft">
        <Icon className="h-4 w-4" aria-hidden />
        {eyebrow ?? "Континенталь"}
      </div>
      <h1 className="font-display text-4xl text-white sm:text-5xl">{title}</h1>
      {description ? <p className="mt-4 text-base leading-7 text-silver">{description}</p> : null}
    </div>
  );
}
