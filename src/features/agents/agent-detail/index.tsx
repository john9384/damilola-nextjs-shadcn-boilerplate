"use client";

import { UserDetailsTabs } from "@/components/shared/UserDetailsComponents";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/hooks/use-users";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TransactionsTable } from "@/features/transactions/transactions-table";
import { RemittanceTable } from "@/features/remittance/remittance-table";

export function AgentDetailPage() {
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
      <UserDetailsTabs
        user={data}
        isLoading={isLoading}
        entityLabel="agent"
        transactionsContent={
          <TransactionsTable lockedFilters={{ agentId: id }} />
        }
        remittanceContent={<RemittanceTable lockedFilters={{ userId: id }} />}
      />
    </div>
  );
}
