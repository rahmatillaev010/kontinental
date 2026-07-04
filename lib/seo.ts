import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://kontinental-guild.vercel.app").replace(/\/$/, "");
const previewImage = "/og/kontinental-preview.png";

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

export const defaultSeo = {
  siteUrl,
  previewImage,
  siteName: "Континенталь",
  description: "Закрытый портал элитной гильдии Free Fire."
};

export function createPageMetadata({ title, description, path }: PageMeta): Metadata {
  const url = `${siteUrl}${path}`;
  const fullTitle = title.includes("Континенталь") ? title : `${title} | Континенталь`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: defaultSeo.siteName,
      locale: "ru_RU",
      type: "website",
      images: [
        {
          url: `${siteUrl}${previewImage}`,
          width: 1200,
          height: 630,
          alt: "Континенталь — закрытый портал элитной гильдии Free Fire"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${siteUrl}${previewImage}`]
    }
  };
}

export const publicRoutes = [
  { path: "/", title: "Континенталь", description: "Главная сцена закрытого портала элитной гильдии Free Fire." },
  { path: "/rules", title: "Вступление", description: "Правила вступления, критерии и анкета кандидата в гильдию Континенталь." },
  { path: "/combat", title: "МЯСО / КВ", description: "Боевые правила, форматы комнат и заявка на МЯСО или КВ против Континенталя." },
  { path: "/leader", title: "Лидер", description: "Профиль лидера Континенталя, срок пребывания, описание и официальные соцсети." },
  { path: "/roles", title: "Руководство", description: "Руководство гильдии Континенталь: роли, обязанности, статистика и профили." },
  { path: "/members", title: "Участники", description: "Закрытый состав участников Континенталя с поиском, фильтрами и профилями игроков." },
  { path: "/history", title: "История", description: "История, кодекс и архивные этапы развития гильдии Континенталь." },
  { path: "/archive", title: "Архив", description: "Архив участников, которые ранее состояли в гильдии Континенталь." },
  { path: "/gallery", title: "Галерея", description: "Галерея моментов, скриншотов и визуальной истории гильдии Континенталь." }
];
