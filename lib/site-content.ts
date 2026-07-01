import type { SiteContent } from "@/lib/types";

export const defaultSiteContent: SiteContent[] = [
  {
    id: "home_welcome",
    key: "home_welcome",
    title: "Добро пожаловать в Континенталь",
    body: "Континенталь — легендарная гильдия, в которой собраны самые сильные игроки во всех аспектах ⚜️",
    href: "https://t.me/glkontinental/3",
    sort_order: 1
  },
  {
    id: "home_manifest",
    key: "home_manifest",
    title: "Дружба, дисциплина и победы",
    body: "Дружите, веселитесь, уважайте состав и играйте во благо участников. Ульт и СНС приветствуются, порядок держится руководством.",
    href: null,
    sort_order: 2
  },
  {
    id: "home_guild_info",
    key: "home_guild_info",
    title: "Информация о гильдии",
    body: "Здесь собрана главная информация о Континентале: состав, руководство, правила, история, архив и заявки на вступление.",
    href: null,
    sort_order: 3
  },
  {
    id: "home_join_info",
    key: "home_join_info",
    title: "Вступить в гильдию",
    body: "Заполни анкету, дождись проверки наставителя или администратора, после этого с тобой свяжется руководство.",
    href: null,
    sort_order: 4
  },
  {
    id: "history_intro",
    key: "history_intro",
    title: "История Континенталя",
    body: "Раздел сделан как спокойный архив гильдии: без шума, с уважением к каждому этапу состава.",
    href: null,
    sort_order: 10
  },
  {
    id: "history_foundation",
    key: "history_foundation",
    title: "Основание",
    body: "Континенталь появился как состав, где уважение, дисциплина и командная игра важны не меньше побед.",
    href: null,
    sort_order: 11
  },
  {
    id: "history_structure",
    key: "history_structure",
    title: "Структура",
    body: "Руководство собрано в понятную систему: лидер, управляющие, офицеры, советники, проверяющие и участники.",
    href: null,
    sort_order: 12
  },
  {
    id: "history_archive",
    key: "history_archive",
    title: "Архив",
    body: "Каждый участник получает свою страницу, а история состава сохраняется даже после перехода в архив.",
    href: null,
    sort_order: 13
  },
  {
    id: "history_future",
    key: "history_future",
    title: "Будущее",
    body: "Портал помогает гильдии расти аккуратно: заявки проходят проверку, роли обновляются, состав остаётся живым.",
    href: null,
    sort_order: 14
  },
  {
    id: "history_code",
    key: "history_code",
    title: "Кодекс Континенталя",
    body: "Континенталь держится на простой идее: сильная гильдия начинается с порядка. Здесь ценят честную игру, спокойное общение, участие в жизни состава и уважение к лидеру, администрации и новичкам.",
    href: null,
    sort_order: 15
  }
];

export function getContentItem(items: SiteContent[], key: string) {
  return items.find((item) => item.key === key) ?? defaultSiteContent.find((item) => item.key === key)!;
}

export function mergeSiteContent(items: SiteContent[]) {
  const byKey = new Map(defaultSiteContent.map((item) => [item.key, item]));

  for (const item of items) {
    byKey.set(item.key, {
      ...byKey.get(item.key),
      ...item
    });
  }

  return Array.from(byKey.values()).sort((first, second) => first.sort_order - second.sort_order);
}
