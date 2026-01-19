"use client";

import { useTranslations } from "next-intl";

export function DashboardPage() {
  const t = useTranslations("dashboard");
  return (
    <div className="text-foreground">
      <h1 className="text-2xl font-bold text-primary">{t("title")}</h1>
    </div>
  );
}
