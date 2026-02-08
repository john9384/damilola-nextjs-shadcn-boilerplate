"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { UserBioTab } from "./user-bio-tab";
import type { IUser } from "@/services/user-service";
import { UserDetailsPlaceholder } from "./user-details-placeholder";

type UserDetailsTabsProps = {
  isLoading: boolean;
  user?: IUser | null;
  entityLabel?: string;
  className?: string;
};

export function UserDetailsTabs({
  isLoading,
  user,
  entityLabel,
  className,
}: UserDetailsTabsProps) {
  const triggerClassName =
    "flex-none rounded-full border-0 px-5 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground";

  return (
    <Tabs defaultValue="bio" className={cn("space-y-6", className)}>
      <TabsList className="w-fit gap-2 rounded-full border-0 bg-muted/50 p-1">
        <TabsTrigger value="bio" className={triggerClassName}>
          Bio
        </TabsTrigger>
        <TabsTrigger value="transactions" className={triggerClassName}>
          Transactions
        </TabsTrigger>
        <TabsTrigger value="remittance" className={triggerClassName}>
          Remittance
        </TabsTrigger>
        <TabsTrigger value="settings" className={triggerClassName}>
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="bio">
        <UserBioTab user={user} isLoading={isLoading} entityLabel={entityLabel} />
      </TabsContent>
      <TabsContent value="transactions">
        <UserDetailsPlaceholder>Transactions view coming soon.</UserDetailsPlaceholder>
      </TabsContent>
      <TabsContent value="remittance">
        <UserDetailsPlaceholder>
          {user?.type === "AGENT" ? "Remittance not applicable for agents." : "Coming soon."}
        </UserDetailsPlaceholder>
      </TabsContent>
      <TabsContent value="settings">
        <UserDetailsPlaceholder>Settings view coming soon.</UserDetailsPlaceholder>
      </TabsContent>
    </Tabs>
  );
}
