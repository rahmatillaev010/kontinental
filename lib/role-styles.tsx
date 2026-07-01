import type { LucideIcon } from "lucide-react";
import { Badge, BookOpen, Crown, MessageCircle, Shield, Star, UserCheck, Users } from "lucide-react";
import { Role } from "@/lib/types";

export type RoleVisual = {
  Icon: LucideIcon;
  cardClass: string;
  badgeClass: string;
  railClass: string;
};

const fallbackVisual: RoleVisual = {
  Icon: Users,
  cardClass: "border-slate-700/70 bg-gradient-to-br from-[#171923] to-[#090a0f] shadow-black/30",
  badgeClass: "border-slate-500/40 bg-slate-500/10 text-slate-100",
  railClass: "bg-slate-500"
};

export const roleVisuals: Record<string, RoleVisual> = {
  leader: {
    Icon: Crown,
    cardClass: "border-[#f1d78b]/70 bg-gradient-to-br from-[#151008] via-[#08090d] to-[#050507] shadow-royal-strong",
    badgeClass: "border-[#e3c980]/60 bg-[#e3c980]/12 text-[#f7e8ad]",
    railClass: "bg-[#e3c980]"
  },
  "chat-manager": {
    Icon: MessageCircle,
    cardClass: "border-[#c9a45d]/40 bg-gradient-to-br from-[#171923] to-[#08090d] shadow-[#c9a45d]/10",
    badgeClass: "border-[#c9a45d]/45 bg-[#c9a45d]/10 text-[#f1d78b]",
    railClass: "bg-[#c9a45d]"
  },
  "chat-manager-female": {
    Icon: MessageCircle,
    cardClass: "border-[#d69b46]/45 bg-gradient-to-br from-[#1a1714] to-[#08090d] shadow-[#d69b46]/10",
    badgeClass: "border-[#d69b46]/45 bg-[#d69b46]/10 text-[#ffd390]",
    railClass: "bg-[#d69b46]"
  },
  deputy: {
    Icon: Crown,
    cardClass: "border-[#c9a45d]/45 bg-gradient-to-br from-[#10213f] to-[#06070a] shadow-[#10213f]/40",
    badgeClass: "border-[#c9a45d]/45 bg-[#10213f]/70 text-[#f1d78b]",
    railClass: "bg-[#c9a45d]"
  },
  "officer-i": {
    Icon: Shield,
    cardClass: "border-[#936b3d]/55 bg-gradient-to-br from-[#23180e] to-[#07080c] shadow-[#936b3d]/12",
    badgeClass: "border-[#936b3d]/55 bg-[#936b3d]/12 text-[#e7c797]",
    railClass: "bg-[#936b3d]"
  },
  "officer-ii": {
    Icon: Shield,
    cardClass: "border-[#a7623f]/50 bg-gradient-to-br from-[#21120c] to-[#08090d] shadow-[#a7623f]/12",
    badgeClass: "border-[#a7623f]/50 bg-[#a7623f]/12 text-[#edb48d]",
    railClass: "bg-[#a7623f]"
  },
  "officer-iii": {
    Icon: Shield,
    cardClass: "border-[#bcc4ce]/42 bg-gradient-to-br from-[#1a1d22] to-[#08090d] shadow-[#bcc4ce]/10",
    badgeClass: "border-[#bcc4ce]/45 bg-[#bcc4ce]/10 text-[#e5e7eb]",
    railClass: "bg-[#bcc4ce]"
  },
  "advisor-i": {
    Icon: BookOpen,
    cardClass: "border-[#c9a45d]/38 bg-gradient-to-br from-[#0d261c] to-[#07080c] shadow-[#0d3b2a]/20",
    badgeClass: "border-[#c9a45d]/45 bg-[#0d3b2a]/50 text-[#f1d78b]",
    railClass: "bg-[#c9a45d]"
  },
  "checker-i": {
    Icon: UserCheck,
    cardClass: "border-[#3f6da7]/45 bg-gradient-to-br from-[#0d1b35] to-[#07080c] shadow-[#10213f]/30",
    badgeClass: "border-[#6f91c9]/45 bg-[#10213f]/55 text-[#d7e6ff]",
    railClass: "bg-[#6f91c9]"
  },
  "checker-ii": {
    Icon: UserCheck,
    cardClass: "border-[#7e5aa6]/45 bg-gradient-to-br from-[#1b1130] to-[#07080c] shadow-[#2b1647]/30",
    badgeClass: "border-[#9f7acb]/45 bg-[#2b1647]/55 text-[#eadcff]",
    railClass: "bg-[#9f7acb]"
  },
  member: {
    Icon: Badge,
    cardClass: "border-[#c9a45d]/25 bg-gradient-to-br from-[#171923] to-[#08090d] shadow-black/30",
    badgeClass: "border-[#c9a45d]/35 bg-[#c9a45d]/8 text-[#f1d78b]",
    railClass: "bg-[#c9a45d]"
  },
  rookie: {
    Icon: Star,
    cardClass: "border-[#555c68]/45 bg-gradient-to-br from-[#141720] to-[#08090d] shadow-black/25",
    badgeClass: "border-[#6b7280]/45 bg-[#6b7280]/12 text-[#d1d5db]",
    railClass: "bg-[#6b7280]"
  }
};

export function getRoleVisual(role?: Role | null) {
  if (!role) {
    return fallbackVisual;
  }

  return roleVisuals[role.slug] ?? fallbackVisual;
}
