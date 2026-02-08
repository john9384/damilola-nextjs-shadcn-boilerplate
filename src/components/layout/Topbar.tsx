"use client";

import { Menu, Settings, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/AuthProvider";

type TopbarProps = {
  onToggle: () => void;
};

export function Topbar({ onToggle }: TopbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

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
        className="size-8 text-foreground hover:bg-primary/10"
        onClick={onToggle}
      >
        <Menu className="size-4" />
      </Button>

      <div className="flex items-center gap-4">
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
              <p className="text-sm font-semibold text-gray-900">{user?.name || "Admin user"}</p>
              <p className="text-xs text-gray-500 mt-0.5">{user?.email || ""}</p>
            </div>
          </DropdownMenuHeader>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              router.push("/settings/profile");
            }}
            className="flex items-center gap-2"
          >
            <Settings className="size-4" />
            Profile settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>
  );
}
