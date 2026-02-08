"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/AuthProvider";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  Wallet,
  ShieldCheck,
  UserCheck,
  X,
  Banknote,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LOGO_URL =
  "https://res.cloudinary.com/djnboqpze/image/upload/v1770406971/esirs_zcttct.jpg";

const navigation = [
  {
    key: "dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    key: "agents",
    href: "/agents",
    icon: UserCheck,
  },
  {
    key: "users",
    href: "/users",
    icon: Users,
  },
  {
    key: "admins",
    href: "/admins",
    icon: ShieldCheck,
  },
  {
    key: "transactions",
    href: "/transactions",
    icon: Wallet,
  },
  {
    key: "remittance",
    href: "/remittance",
    icon: Banknote,
  },
  {
    key: "settings",
    href: "/settings",
    icon: Settings,
  },
];

type SidebarProps = {
  isCollapsed: boolean;
};

const navigationLabels: Record<string, string> = {
  dashboard: "Dashboard",
  agents: "Agents",
  users: "Users",
  admins: "Admins",
  transactions: "Transactions",
  remittance: "Remittance",
  settings: "Settings",
};

export function Sidebar({ isCollapsed }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={toggleMobile}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out lg:relative lg:z-auto",
          isCollapsed ? "w-20" : "w-[300px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <div className="flex items-center gap-2 transition-opacity duration-300">
              <div className="flex size-8 items-center justify-center rounded-md bg-white p-1">
                <Image
                  src={LOGO_URL}
                  alt="ESiRS logo"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-sidebar-foreground">ESiRS</span>
                  <span className="text-xs text-sidebar-foreground/70">Admin Console</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(`${item.href}/`) && item.href !== "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-4 text-sm font-medium transition-all duration-200",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/60",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground/75",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 shrink-0 transition-transform duration-200",
                      "group-hover:scale-110",
                    )}
                  />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-200">
                      {navigationLabels[item.key] ?? item.key}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <span className="ml-auto size-2 rounded-full bg-sidebar-foreground/80 transition-all duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-4">
            <Button
              variant="ghost"
              className={cn(
                "group w-full justify-start gap-3 text-sidebar-foreground/75 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center",
              )}
              onClick={logout}
            >
              <LogOut className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              {!isCollapsed && <span>Log out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-30 lg:hidden"
        onClick={toggleMobile}
      >
        {isMobileOpen ? (
          <X className="size-5 transition-transform duration-200" />
        ) : (
          <Menu className="size-5 transition-transform duration-200" />
        )}
      </Button>
    </>
  );
}
