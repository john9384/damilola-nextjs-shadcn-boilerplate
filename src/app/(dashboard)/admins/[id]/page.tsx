"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAdmin } from "@/features/admin/api/admin-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", id],
    queryFn: () => getAdmin(id),
    enabled: Boolean(id),
  });

  return (
    <div className="space-y-6 text-foreground">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Admin profile</h1>
          <p className="text-sm text-muted-foreground">View admin details.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admins">Back to admins</Link>
        </Button>
      </header>

      {isLoading ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          Loading admin...
        </div>
      ) : data ? (
        <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 text-sm">
          <div>
            <span className="text-muted-foreground">Name</span>
            <div className="font-medium">{data.name ?? "—"}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Email</span>
            <div className="font-medium">{data.email}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Status</span>
            <div className="font-medium">{data.status}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Role</span>
            <div className="font-medium">{data.role}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Created at</span>
            <div className="font-medium">{new Date(data.createdAt).toLocaleString()}</div>
          </div>
        </div>
      ) : (
        <div className="py-10 text-center text-sm text-muted-foreground">
          Admin not found.
        </div>
      )}
    </div>
  );
}
