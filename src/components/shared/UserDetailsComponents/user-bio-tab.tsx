"use client";

import { type ReactNode } from "react";
import { BarcodeDialog } from "./barcode-dialog";
import type { IUser } from "@/services/user-service";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  isLoading: boolean;
  user?: IUser | null;
  entityLabel?: string;
};

type BadgeTone = "positive" | "negative" | "neutral";

function StatusBadge({ tone, label }: { tone: BadgeTone; label: string }) {
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";
  const toneStyles = {
    positive: "bg-emerald-100 text-emerald-700",
    negative: "bg-rose-100 text-rose-700",
    neutral: "bg-slate-100 text-slate-700",
  };

  return <span className={`${base} ${toneStyles[tone]}`}>{label}</span>;
}

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}</span>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function VerificationTick({ verified, label }: { verified?: boolean | null; label: string }) {
  if (!verified) return null;
  return (
    <span
      className="inline-flex size-4 items-center justify-center rounded-full bg-sky-500 text-white"
      aria-label={`${label} verified`}
      title={`${label} verified`}
    >
      <Check className="size-3" strokeWidth={3} />
    </span>
  );
}

export function UserBioTab({ isLoading, user, entityLabel = "user" }: Props) {
  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading {entityLabel}...
      </div>
    );
  }

  if (!isLoading && !user) {
    const label = entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1);
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">{label} not found.</div>
    );
  }

  const isBasicUser = user?.type === "BASIC";
  const remittanceStartDateValue = isBasicUser
    ? (user?.remittanceStartDate ?? "—")
    : "Not applicable";
  const remittanceAmountValue = isBasicUser
    ? (user?.scheduledRemittanceAmount ?? "—")
    : "Not applicable";
  const remittanceOutstandingValue = isBasicUser
    ? (user?.remittanceOutstanding ?? "—")
    : "Not applicable";

  return (
    <Card className="flex flex-row">
      <div className="flex-1 flex flex-col gap-6 rounded-2xl p-6 text-sm">
        <div className="grid gap-4">
          <InfoItem label="Name" value={user?.name ?? "—"} />
          <InfoItem
            label="Email"
            value={
              <span className="inline-flex items-center gap-2">
                <span>{user?.email ?? "—"}</span>
                <VerificationTick verified={user?.emailVerified} label="Email" />
              </span>
            }
          />
          <InfoItem
            label="Phone"
            value={
              <span className="inline-flex items-center gap-2">
                <span>{user?.phone ?? "—"}</span>
                <VerificationTick verified={user?.phoneVerified} label="Phone" />
              </span>
            }
          />
          <InfoItem label="NIN" value={user?.nin ?? "—"} />
          <InfoItem
            label="Status"
            value={
              user?.status ? (
                <StatusBadge
                  tone={user.status === "ACTIVE" ? "positive" : "neutral"}
                  label={user.status}
                />
              ) : (
                "—"
              )
            }
          />
          <InfoItem
            label="Account Creation Date"
            value={user?.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6 rounded-2xl p-6 text-sm">
        <BarcodeDialog value={user?.barcodeValue} label="User barcode" />

        <div className="grid gap-4">
          <InfoItem label="Barcode value" value={user?.barcodeValue ?? "—"} />
          <InfoItem label="Remittance start date" value={remittanceStartDateValue} />
          <InfoItem label="Remittance amount" value={remittanceAmountValue} />
          <InfoItem label="Remittance outstanding" value={remittanceOutstandingValue} />
        </div>
      </div>
    </Card>
  );
}
