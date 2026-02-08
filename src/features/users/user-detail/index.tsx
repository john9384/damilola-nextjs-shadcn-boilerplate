"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetUser } from "@/hooks/use-users";
import { UserDetailsTabs } from "@/components/shared/UserDetailsComponents";

export function UserDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useGetUser("BASIC", id);

  return (
    <div className="space-y-6 text-foreground">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">User profile</h1>
          <p className="text-sm text-muted-foreground">View user details.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/users">Back to users</Link>
        </Button>
      </header>

      <UserDetailsTabs user={data} isLoading={isLoading} entityLabel="user" />
    </div>
  );
}
