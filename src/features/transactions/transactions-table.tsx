"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactions, type TransactionScope } from "@/hooks/use-transactions";
import type { TransactionFilters } from "@/services/transaction-service";
import { TableContainer } from "@/components/shared/table/table-container";
import { TableHeader } from "@/components/shared/table/table-header";
import { TablePagination } from "@/components/shared/table/table-pagination";
import { TextInput } from "@/components/shared/form/TextInput";
import { SelectInput } from "@/components/shared/form/SelectInput";

type TransactionsTableProps = {
  scope?: TransactionScope;
  lockedFilters?: Partial<TransactionFilters>;
  showHeader?: boolean;
  title?: string;
  description?: string;
  pageSize?: number;
};

export function TransactionsTable({
  scope = "admin",
  lockedFilters,
  showHeader = false,
  title = "Transactions",
  description = "Monitor all remittance activity. Filter by agent or reference.",
  pageSize = 20,
}: TransactionsTableProps) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    reference: "",
    type: "",
    channel: "",
    fromDate: "",
    toDate: "",
  });

  const lockedKey = useMemo(() => JSON.stringify(lockedFilters ?? {}), [lockedFilters]);

  useEffect(() => {
    setPage(1);
  }, [filters, lockedKey]);

  const queryFilters = useMemo(
    () => ({
      page,
      limit: pageSize,
      reference: filters.reference.trim() || undefined,
      type: filters.type || undefined,
      channel: filters.channel || undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
      ...lockedFilters,
    }),
    [filters, lockedFilters, page, pageSize],
  );

  const { data, isLoading } = useTransactions(queryFilters, scope);
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
            searchValue={filters.reference}
            onSearchChange={(value) =>
              setFilters((prev) => ({ ...prev, reference: value }))
            }
            onSortClick={() => undefined}
            onFilterClick={() => undefined}
            searchPlaceholder="Search by reference"
            filterContent={
              <div className="grid gap-4">
                <TextInput
                  label="Reference (optional)"
                  id="reference-filter"
                  value={filters.reference}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, reference: event.target.value }))
                  }
                />
                <SelectInput
                  label="Type (optional)"
                  name="type-filter"
                  value={filters.type}
                  onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
                  options={[
                    { label: "DEBIT", value: "DEBIT" },
                    { label: "CREDIT", value: "CREDIT" },
                  ]}
                  placeholder="Select type"
                />
                <SelectInput
                  label="Channel (optional)"
                  name="channel-filter"
                  value={filters.channel}
                  onChange={(value) => setFilters((prev) => ({ ...prev, channel: value }))}
                  options={[
                    { label: "WALLET", value: "WALLET" },
                    { label: "CASH", value: "CASH" },
                  ]}
                  placeholder="Select channel"
                />
                <TextInput
                  label="From date (optional)"
                  id="from-date-filter"
                  type="date"
                  value={filters.fromDate}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, fromDate: event.target.value }))
                  }
                />
                <TextInput
                  label="To date (optional)"
                  id="to-date-filter"
                  type="date"
                  value={filters.toDate}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, toDate: event.target.value }))
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
