"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetUser } from "@/hooks/use-users";

export default function AgentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useGetUser("AGENT", id);

  return (
    <div className="space-y-6 text-foreground">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Agent profile</h1>
          <p className="text-sm text-muted-foreground">View agent details.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/agents">Back to agents</Link>
        </Button>
      </header>

      {isLoading ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          Loading agent...
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
            <span className="text-muted-foreground">Phone</span>
            <div className="font-medium">{data.phone ?? "—"}</div>
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
          Agent not found.
        </div>
      )}
    </div>
  );
}
