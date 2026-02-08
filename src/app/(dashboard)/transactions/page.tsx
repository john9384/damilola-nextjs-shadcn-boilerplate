"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listTransactions } from "@/services/user-service";
import { TableContainer } from "@/components/shared/table/table-container";
import { TableHeader } from "@/components/shared/table/table-header";
import { TablePagination } from "@/components/shared/table/table-pagination";
import { TextInput } from "@/components/shared/form/TextInput";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [agentId, setAgentId] = useState("");

  const pageSize = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", page, agentId, search],
    queryFn: () =>
      listTransactions({
        page,
        limit: pageSize,
        agentId: agentId.trim() || undefined,
        reference: search.trim() || undefined,
      }),
  });

  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(totalItems, page * pageSize);

  const rows = useMemo(() => data?.items ?? [], [data?.items]);

  return (
    <div className="space-y-8 text-foreground">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-primary">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Monitor all remittance activity. Filter by agent or reference.
        </p>
      </header>

      <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-2">
        <TextInput
          label="Agent ID (optional)"
          id="agent-id-filter"
          value={agentId}
          onChange={(event) => setAgentId(event.target.value)}
        />
        <TextInput
          label="Reference (optional)"
          id="reference-filter"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <TableContainer
        header={
          <TableHeader
            searchValue={search}
            onSearchChange={setSearch}
            onSortClick={() => undefined}
            onFilterClick={() => undefined}
            searchPlaceholder="Search by reference"
          />
        }
        footer={
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setPage}
            onPageSizeChange={() => undefined}
          />
        }
      >
        {isLoading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading transactions...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-3">Reference</th>
                  <th>Type</th>
                  <th>Channel</th>
                  <th>Amount</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((tx) => (
                  <tr key={tx.id} className="border-t border-border">
                    <td className="py-3 font-medium">{tx.reference ?? "—"}</td>
                    <td>{tx.type}</td>
                    <td>{tx.channel}</td>
                    <td>{tx.amount}</td>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="py-6 text-center text-muted-foreground" colSpan={5}>
                      No transactions found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </TableContainer>
    </div>
  );
}
