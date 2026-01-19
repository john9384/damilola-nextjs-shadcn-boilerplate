export const routing = {
  locales: ["en", "fr", "es"],
  defaultLocale: "en",
  cookieName: "NEXT_LOCALE",
} as const;

export type Locale = (typeof routing.locales)[number];
