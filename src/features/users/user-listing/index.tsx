"use client";

import { TableContainer } from "@/components/shared/table/table-container";
import { TableHeader } from "@/components/shared/table/table-header";
import { TablePagination } from "@/components/shared/table/table-pagination";
import { AddUserDialog } from "@/components/shared/AddUserDialog";
import { useFetchUser } from "@/hooks/use-users";
import Link from "next/link";
import { useMemo, useState } from "react";

export function UserListingPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { list: data, isLoading, refetch } = useFetchUser("BASIC");

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!data) return [];
    const items = data.items ?? [];
    if (!normalized) return items;
    return items.filter((user) =>
      `${user.name ?? ""} ${user.email} ${user.phone ?? ""}`.toLowerCase().includes(normalized),
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
          <h1 className="text-2xl font-bold text-primary">Users</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts.</p>
        </div>
        <AddUserDialog userType="BASIC" onCreated={refetch} />
      </header>

      <TableContainer
        header={
          <TableHeader
            searchValue={search}
            onSearchChange={setSearch}
            onSortClick={() => undefined}
            onFilterClick={() => undefined}
            searchPlaceholder="Search users"
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
          <div className="py-10 text-center text-sm text-muted-foreground">Loading users...</div>
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
                {rows.map((user) => (
                  <tr key={user.id} className="border-t border-border">
                    <td className="py-3 font-medium">{user.name ?? "—"}</td>
                    <td>{user.email}</td>
                    <td>{user.phone ?? "—"}</td>
                    <td>{user.status}</td>
                    <td>
                      <Link
                        className="text-primary underline-offset-4 hover:underline"
                        href={`/users/${user.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="py-6 text-center text-muted-foreground" colSpan={5}>
                      No users found.
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
