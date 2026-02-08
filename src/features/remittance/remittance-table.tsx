"use client";

import { useEffect, useMemo, useState } from "react";
import { useRemittances } from "@/hooks/use-remittance";
import type { RemittanceFilters } from "@/services/remittance-service";
import { TableContainer } from "@/components/shared/table/table-container";
import { TableHeader } from "@/components/shared/table/table-header";
import { TablePagination } from "@/components/shared/table/table-pagination";
import { TextInput } from "@/components/shared/form/TextInput";

type RemittanceTableProps = {
  lockedFilters?: Partial<RemittanceFilters>;
  showHeader?: boolean;
  title?: string;
  description?: string;
  pageSize?: number;
};

export function RemittanceTable({
  lockedFilters,
  showHeader = false,
  title = "Remittance",
  description = "Review remittance records and payment status.",
  pageSize = 20,
}: RemittanceTableProps) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    barCode: "",
    userId: "",
    startDate: "",
    endDate: "",
  });

  const lockedKey = useMemo(() => JSON.stringify(lockedFilters ?? {}), [lockedFilters]);

  useEffect(() => {
    setPage(1);
  }, [filters, lockedKey]);

  const queryFilters = useMemo(
    () => ({
      page,
      limit: pageSize,
      barCode: filters.barCode.trim() || undefined,
      userId: filters.userId.trim() || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      ...lockedFilters,
    }),
    [filters, lockedFilters, page, pageSize],
  );

  const { data, isLoading } = useRemittances(queryFilters);
  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).filter((value) => (value ?? "").toString().trim().length > 0)
        .length,
    [filters],
  );

  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(totalItems, page * pageSize);

  const rows = useMemo(() => data?.items ?? [], [data?.items]);

  return (
    <div className="space-y-6 text-foreground">
      {showHeader ? (
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </header>
      ) : null}

      <TableContainer
        header={
          <TableHeader
            searchValue={filters.barCode}
            onSearchChange={(value) =>
              setFilters((prev) => ({ ...prev, barCode: value }))
            }
            onSortClick={() => undefined}
            onFilterClick={() => undefined}
            searchPlaceholder="Search by barcode"
            filterContent={
              <div className="grid gap-4">
                <TextInput
                  label="User ID (optional)"
                  id="remittance-user-id"
                  value={lockedFilters?.userId ?? filters.userId}
                  onChange={(event) =>
                    lockedFilters?.userId
                      ? undefined
                      : setFilters((prev) => ({ ...prev, userId: event.target.value }))
                  }
                  disabled={Boolean(lockedFilters?.userId)}
                />
                <TextInput
                  label="From date (optional)"
                  id="remittance-start-date"
                  type="date"
                  value={filters.startDate}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, startDate: event.target.value }))
                  }
                />
                <TextInput
                  label="To date (optional)"
                  id="remittance-end-date"
                  type="date"
                  value={filters.endDate}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, endDate: event.target.value }))
                  }
                />
              </div>
            }
            isFilterActive={activeFilterCount > 0}
            filterCount={activeFilterCount}
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
            Loading remittance...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-3">User ID</th>
                  <th>Status</th>
                  <th>Amount due</th>
                  <th>Amount paid</th>
                  <th>Remittance date</th>
                  <th>Transaction</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((record) => (
                  <tr key={record.id} className="border-t border-border">
                    <td className="py-3 font-medium">{record.userId}</td>
                    <td>{record.paymentStatus}</td>
                    <td>{record.amountDue}</td>
                    <td>{record.amountPaid}</td>
                    <td>{record.remittanceDate}</td>
                    <td>{record.transactionId ?? "—"}</td>
                    <td>{new Date(record.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="py-6 text-center text-muted-foreground" colSpan={7}>
                      No remittance records found.
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
