"use client";

import { useMemo, useState } from "react";
import { TableContainer } from "@/components/shared/table/table-container";
import { TableHeader } from "@/components/shared/table/table-header";
import { TablePagination } from "@/components/shared/table/table-pagination";
import { AddUserDialog } from "@/components/shared/AddUserDialog";
import Link from "next/link";
import { useFetchUser } from "@/hooks/use-users";

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { list: data, isLoading, refetch } = useFetchUser("AGENT");

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!data) return [];
    const items = data.items ?? [];
    if (!normalized) return items;
    return items.filter((agent) =>
      `${agent.name ?? ""} ${agent.email} ${agent.phone ?? ""}`.toLowerCase().includes(normalized),
    );
  }, [data, search]);

  const pageSize = 10;
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(totalItems, page * pageSize);
  const rows = filtered.slice(startIndex - 1, endIndex);

  return (
    <div className="space-y-8 text-foreground">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">Agent management</h1>
          <p className="text-sm text-muted-foreground">
            Create agents and review their profile details.
          </p>
        </div>
        <AddUserDialog userType="AGENT" onCreated={refetch} />
      </header>

      <TableContainer
        header={
          <TableHeader
            searchValue={search}
            onSearchChange={setSearch}
            onSortClick={() => undefined}
            onFilterClick={() => undefined}
            searchPlaceholder="Search agents"
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
          <div className="py-10 text-center text-sm text-muted-foreground">Loading agents...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-3">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((agent) => (
                  <tr key={agent.id} className="border-t border-border">
                    <td className="py-3 font-medium">{agent.name ?? "—"}</td>
                    <td>{agent.email}</td>
                    <td>{agent.phone ?? "—"}</td>
                    <td>{agent.status}</td>
                    <td>
                      <Link
                        className="text-primary underline-offset-4 hover:underline"
                        href={`/agents/${agent.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="py-6 text-center text-muted-foreground" colSpan={5}>
                      No agents found.
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
