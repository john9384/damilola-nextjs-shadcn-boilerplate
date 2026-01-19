import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

function resolveLocaleFromHeader(header: string | null) {
  if (!header) return routing.defaultLocale;

  const locales = header
    .split(",")
    .map((entry) => entry.split(";")[0]?.trim())
    .filter(Boolean);

  for (const locale of locales) {
    const baseLocale = locale.split("-")[0] ?? locale;
    if (routing.locales.includes(locale as never)) return locale;
    if (routing.locales.includes(baseLocale as never)) return baseLocale;
  }

  return routing.defaultLocale;
}

export default function middleware(request: NextRequest) {
  const cookieLocale = request.cookies.get(routing.cookieName)?.value;
  const resolvedLocale =
    cookieLocale && routing.locales.includes(cookieLocale as never)
      ? cookieLocale
      : resolveLocaleFromHeader(request.headers.get("accept-language"));

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-intl-locale", resolvedLocale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (!cookieLocale || cookieLocale !== resolvedLocale) {
    response.cookies.set(routing.cookieName, resolvedLocale, { path: "/" });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
