import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const messagesMap = {
  en: () => import("./messages/en.json"),
  fr: () => import("./messages/fr.json"),
  es: () => import("./messages/es.json"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await messagesMap[locale as keyof typeof messagesMap]()).default,
  };
});
