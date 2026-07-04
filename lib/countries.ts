export type CountryOption = {
  name: string;
  flag: string;
  aliases: string[];
};

export const countryOptions: CountryOption[] = [
  { name: "Кыргызстан", flag: "🇰🇬", aliases: ["кыргызстан", "киргизия", "кыргыз", "киргиз"] },
  { name: "Россия", flag: "🇷🇺", aliases: ["россия", "рф", "русский", "русская", "русские", "омск", "казань", "новосибирск", "москва"] },
  { name: "Узбекистан", flag: "🇺🇿", aliases: ["узбекистан", "узбек", "узбечка"] },
  { name: "Таджикистан", flag: "🇹🇯", aliases: ["таджикистан", "таджик", "таджичка"] },
  { name: "Армения", flag: "🇦🇲", aliases: ["армения", "армянин", "армянка"] },
  { name: "Казахстан", flag: "🇰🇿", aliases: ["казахстан", "казах", "казашка", "алматы", "астана", "тараз", "шымкент", "караганда", "павлодар"] },
  { name: "Молдова", flag: "🇲🇩", aliases: ["молдова", "молдавия", "молдаванин", "молдаванка"] },
  { name: "Украина", flag: "🇺🇦", aliases: ["украина", "украинец", "украинка", "киев"] }
];

export function getCountryBadge(...values: Array<string | null | undefined>) {
  const source = values
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (!source) return null;

  return countryOptions.find((country) => country.name.toLowerCase() === source || country.aliases.some((alias) => source.includes(alias))) ?? null;
}
