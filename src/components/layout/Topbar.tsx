"use client";

import { Menu, Settings, LogOut, ChevronDown, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { setCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/AuthProvider";
import { routing } from "@/i18n/routing";

type TopbarProps = {
  onToggle: () => void;
};

export function Topbar({ onToggle }: TopbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("topbar");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-16 items-center justify-between border-sidebar-border px-4 bg-white sticky top-0 z-10">
      <Button
        variant="ghost"
        size="icon"
        className="size-8 hover:bg-[rgba(2,138,15,0.25)] text-sidebar-foreground"
        onClick={onToggle}
      >
        <Menu className="size-4" color="black" />
      </Button>

      <div className="flex items-center gap-4">
        <DropdownMenu
          trigger={
            <button className="flex items-center gap-2 rounded-full border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Globe className="size-3.5" />
              <span className="uppercase">{locale}</span>
            </button>
          }
          align="right"
          contentClassName="w-44"
        >
          {routing.locales.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => {
                setCookie(routing.cookieName, option, { path: "/" });
                router.refresh();
              }}
              className={`flex items-center justify-between ${
                option === locale ? "text-gray-900 font-semibold" : ""
              }`}
            >
              <span className="uppercase">{option}</span>
              {option === locale ? <span className="text-xs">{t("current")}</span> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>

        <DropdownMenu
          trigger={
            <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center size-9 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                {user?.name ? getInitials(user.name) : "U"}
              </div>
              <ChevronDown className="size-4 text-gray-600" />
            </button>
          }
          align="right"
        >
          <DropdownMenuHeader>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name || t("userFallback")}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{user?.email || ""}</p>
            </div>
          </DropdownMenuHeader>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              router.push("/profile");
            }}
            className="flex items-center gap-2"
          >
            <Settings className="size-4" />
            {t("profileSettings")}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="size-4" />
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>
  );
}
