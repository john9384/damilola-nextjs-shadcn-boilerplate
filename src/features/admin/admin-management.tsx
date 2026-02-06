"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AddUserDialog } from "@/components/shared/AddUserDialog";
import { DeleteItemDialog } from "@/components/shared/DeleteItemDialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  listAdmins,
  type AdminUser,
  type PaginatedUsers,
  updateAdminStatus,
} from "@/features/admin/api/admin-api";
import { TableContainer } from "@/components/shared/table/table-container";
import { TableHeader } from "@/components/shared/table/table-header";
import { TablePagination } from "@/components/shared/table/table-pagination";

type ConfirmationAction = "suspend" | "remove" | null;

export function AdminManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [confirmationAction, setConfirmationAction] = useState<ConfirmationAction>(null);

  const { data, isLoading, refetch } = useQuery<PaginatedUsers>({
    queryKey: ["admins"],
    queryFn: listAdmins,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "SUSPENDED" | "ACTIVE" }) =>
      updateAdminStatus(id, status),
    onSuccess: (updated) => {
      setSelectedAdmin(updated);
      refetch();
      setConfirmationAction(null);
    },
  });

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!data) return [];
    const items = data.items ?? [];
    if (!normalized) return items;
    return items.filter((admin) =>
      `${admin.name ?? ""} ${admin.email}`.toLowerCase().includes(normalized),
    );
  }, [data, search]);

  const pageSize = 10;
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(totalItems, page * pageSize);
  const rows = filtered.slice(startIndex - 1, endIndex);

  const handleRowClick = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setSheetOpen(true);
  };

  const handleStatusUpdate = (status: "SUSPENDED" | "ACTIVE") => {
    if (!selectedAdmin || statusMutation.isPending) return;
    statusMutation.mutate({ id: selectedAdmin.id, status });
  };

  const confirmationCopy = {
    suspend: {
      title: "Suspend admin",
      description: "This will revoke access for this admin until reactivated.",
      cta: "Yes, suspend",
      status: "SUSPENDED" as const,
    },
    remove: {
      title: "Remove admin",
      description: "This will restore the admin to active access.",
      cta: "Yes, remove",
      status: "ACTIVE" as const,
    },
  };

  const currentConfirmation = confirmationAction ? confirmationCopy[confirmationAction] : null;

  return (
    <div className="space-y-8 text-foreground">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">Admins</h1>
          <p className="text-sm text-muted-foreground">Admin user management.</p>
        </div>
        <AddUserDialog userType="ADMIN" onCreated={refetch} />
      </header>

      <TableContainer
        header={
          <TableHeader
            searchValue={search}
            onSearchChange={setSearch}
            onSortClick={() => undefined}
            onFilterClick={() => undefined}
            searchPlaceholder="Search admins"
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
          <div className="py-10 text-center text-sm text-muted-foreground">Loading admins...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-3">Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((admin) => (
                  <tr
                    key={admin.id}
                    className="cursor-pointer border-t border-border transition hover:bg-muted/50"
                    onClick={() => handleRowClick(admin)}
                  >
                    <td className="py-3 font-medium">{admin.name ?? "—"}</td>
                    <td>{admin.email}</td>
                    <td>{admin.status}</td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="py-6 text-center text-muted-foreground" colSpan={3}>
                      No admins found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </TableContainer>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Admin details</SheetTitle>
            <SheetDescription>Review admin profile and take action.</SheetDescription>
          </SheetHeader>
          {selectedAdmin ? (
            <div className="space-y-4 px-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name</span>
                <div className="font-medium">{selectedAdmin.name ?? "—"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Email</span>
                <div className="font-medium">{selectedAdmin.email}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Status</span>
                <div className="font-medium">{selectedAdmin.status}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Role</span>
                <div className="font-medium">{selectedAdmin.role}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Created at</span>
                <div className="font-medium">
                  {new Date(selectedAdmin.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 text-sm text-muted-foreground">
              Select an admin to view details.
            </div>
          )}
          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmationAction("suspend")}
              disabled={!selectedAdmin}
            >
              Suspend admin
            </Button>
            <Button
              variant="destructive"
              onClick={() => setConfirmationAction("remove")}
              disabled={!selectedAdmin}
            >
              Remove admin
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <DeleteItemDialog
        open={Boolean(confirmationAction)}
        onOpenChange={(open) => {
          if (!open) setConfirmationAction(null);
        }}
        title={currentConfirmation?.title ?? "Confirm action"}
        description={currentConfirmation?.description ?? ""}
        confirmLabel={currentConfirmation?.cta ?? "Confirm"}
        loadingLabel="Updating..."
        confirmVariant={confirmationAction === "remove" ? "destructive" : "default"}
        isLoading={statusMutation.isPending}
        confirmDisabled={!currentConfirmation}
        onConfirm={() => currentConfirmation && handleStatusUpdate(currentConfirmation.status)}
      />
    </div>
  );
}
