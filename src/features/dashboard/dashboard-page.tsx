"use client";

import * as React from "react";
import { AppLoader } from "@/components/shared/AppLoader";
import { CheckInput } from "@/components/shared/form/CheckInput";
import { DateInput } from "@/components/shared/form/DateInput";
import { DocumentUploadInput } from "@/components/shared/form/DocumentUploadInput";
import { ImageUpload } from "@/components/shared/form/ImageUpload";
import { PasswordInput } from "@/components/shared/form/PasswordInput";
import PhoneNumberInput from "@/components/shared/form/PhoneInput";
import { RadioInput } from "@/components/shared/form/RadioInput";
import { SelectInput } from "@/components/shared/form/SelectInput";
import { TextAreaInput } from "@/components/shared/form/TextAreaInput";
import { TextInput } from "@/components/shared/form/TextInput";
import { TableContainer } from "@/components/shared/table/table-container";
import { TableHeader } from "@/components/shared/table/table-header";
import { TablePagination } from "@/components/shared/table/table-pagination";

const sampleRows = [
  { name: "Ada Lovelace", role: "Admin", status: "Active", lastActive: "2h ago" },
  { name: "Miles Davis", role: "Viewer", status: "Inactive", lastActive: "5d ago" },
  { name: "Grace Hopper", role: "Editor", status: "Active", lastActive: "1d ago" },
  { name: "Hiro Tanaka", role: "Viewer", status: "Active", lastActive: "3h ago" },
  { name: "Zara Mensah", role: "Editor", status: "Inactive", lastActive: "2w ago" },
  { name: "Jean Park", role: "Admin", status: "Active", lastActive: "8h ago" },
  { name: "Abel Nwosu", role: "Viewer", status: "Active", lastActive: "4d ago" },
  { name: "Lina Ortega", role: "Editor", status: "Active", lastActive: "30m ago" },
];

export function DashboardPage() {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [role, setRole] = React.useState("");
  const [contactMethod, setContactMethod] = React.useState("email");
  const [receiveUpdates, setReceiveUpdates] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [documentUrl, setDocumentUrl] = React.useState<string | undefined>(undefined);
  const [documentName, setDocumentName] = React.useState<string | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(undefined);

  const [searchValue, setSearchValue] = React.useState("");
  const [isSortAsc, setIsSortAsc] = React.useState(true);
  const [activeOnly, setActiveOnly] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredRows = React.useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();
    let rows = sampleRows;

    if (activeOnly) {
      rows = rows.filter((row) => row.status === "Active");
    }

    if (normalized) {
      rows = rows.filter((row) =>
        `${row.name} ${row.role} ${row.status}`.toLowerCase().includes(normalized),
      );
    }

    const sorted = [...rows].sort((a, b) => a.name.localeCompare(b.name));
    return isSortAsc ? sorted : sorted.reverse();
  }, [activeOnly, isSortAsc, searchValue]);

  const pageSize = 5;
  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageStartIndex = (currentPage - 1) * pageSize;
  const pageRows = filteredRows.slice(pageStartIndex, pageStartIndex + pageSize);
  const startIndex = totalItems === 0 ? 0 : pageStartIndex + 1;
  const endIndex = totalItems === 0 ? 0 : pageStartIndex + pageRows.length;

  return (
    <div className="space-y-10 text-foreground">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Example usage of shared form, table, and feedback components.
        </p>
      </header>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Form components</h2>
          <p className="text-sm text-muted-foreground">
            These inputs are wired with local state to demonstrate typical usage.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Full name"
            id="fullName"
            placeholder="Ada Lovelace"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          <TextInput
            label="Email address"
            id="email"
            type="email"
            placeholder="ada@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <PasswordInput
            label="Password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <PhoneNumberInput
            label="Phone number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <SelectInput
            label="Role"
            name="role"
            placeholder="Select a role"
            value={role}
            onChange={setRole}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Editor", value: "editor" },
              { label: "Viewer", value: "viewer" },
            ]}
          />
          <DateInput label="Start date" value={startDate} onChange={setStartDate} />
          <RadioInput
            name="contactMethod"
            label="Preferred contact"
            description="Pick one option to see the component behavior."
            value={contactMethod}
            onChange={setContactMethod}
            orientation="horizontal"
            options={[
              { label: "Email", value: "email" },
              { label: "Phone", value: "phone" },
              { label: "Chat", value: "chat" },
            ]}
          />
          <CheckInput
            name="updates"
            checkboxLabel="Send me product updates"
            checked={receiveUpdates}
            onChange={setReceiveUpdates}
          />
          <div className="md:col-span-2">
            <TextAreaInput
              label="About you"
              value={about}
              onChange={(event) => setAbout(event.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <DocumentUploadInput
              label="Supporting document"
              description="Upload a PDF or DOC file to preview the component."
              value={documentUrl}
              fileName={documentName}
              onUpload={(url, name) => {
                setDocumentUrl(url);
                setDocumentName(name);
              }}
              onRemove={() => {
                setDocumentUrl(undefined);
                setDocumentName(undefined);
              }}
            />
          </div>
          <div className="md:col-span-2">
            <ImageUpload
              label="Profile image"
              description="Try dragging a file onto the upload area."
              value={avatarUrl}
              onUpload={setAvatarUrl}
              onRemove={() => setAvatarUrl(undefined)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Table components</h2>
          <p className="text-sm text-muted-foreground">
            The table header, container, and pagination are connected to sample data.
          </p>
        </div>

        <TableContainer
          header={
            <TableHeader
              searchValue={searchValue}
              onSearchChange={(value) => {
                setSearchValue(value);
                setCurrentPage(1);
              }}
              onSortClick={() => setIsSortAsc((prev) => !prev)}
              onFilterClick={() => {
                setActiveOnly((prev) => !prev);
                setCurrentPage(1);
              }}
              isSortActive
              isFilterActive={activeOnly}
              filterCount={activeOnly ? 1 : 0}
              searchPlaceholder="Search team members"
            />
          }
          footer={
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                      No matching results.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={`${row.name}-${row.role}`} className="border-b border-border">
                      <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.role}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            row.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.lastActive}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TableContainer>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Feedback component</h2>
          <p className="text-sm text-muted-foreground">
            Use the loader to indicate in-flight states in dashboards and widgets.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="h-24">
            <AppLoader loading color="#0EA5E9" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Loading data...</p>
        </div>
      </section>
    </div>
  );
}
