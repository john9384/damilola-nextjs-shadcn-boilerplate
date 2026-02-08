"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type BarcodeDialogProps = {
  value?: string | null;
  label?: string;
};

export function BarcodeDialog({ value, label = "Barcode" }: BarcodeDialogProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [printUrl, setPrintUrl] = useState<string | null>(null);

  const hasValue = Boolean(value);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      setPrintUrl(null);
      return;
    }

    let cancelled = false;
    const options = {
      margin: 2,
      color: { dark: "#0b0b0b", light: "#ffffff" },
    };

    Promise.all([
      QRCode.toDataURL(value, { ...options, width: 180 }),
      QRCode.toDataURL(value, { ...options, width: 320 }),
    ])
      .then(([small, large]) => {
        if (cancelled) return;
        setPreviewUrl(small);
        setPrintUrl(large);
      })
      .catch(() => {
        if (cancelled) return;
        setPreviewUrl(null);
        setPrintUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [value]);

  const handlePrint = () => {
    if (!printUrl || typeof window === "undefined") return;
    const printWindow = window.open("", "_blank", "width=420,height=560");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>Print Barcode</title></head>
        <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;">
          <img src="${printUrl}" alt="${label}" style="max-width:90%;height:auto;" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const preview = useMemo(() => {
    if (!hasValue) {
      return (
        <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-4">
          <span className="text-xs text-muted-foreground h-40 w-40">No barcode available.</span>
        </div>
      );
    }

    return (
      <div className="rounded-2xl p-4 shadow-sm w-[fit-content]">
        {previewUrl ? (
          <img src={previewUrl} alt={label} className="h-40 w-40" />
        ) : (
          <div className="h-40 w-40 animate-pulse rounded-xl bg-muted" />
        )}
      </div>
    );
  }, [hasValue, label, previewUrl]);

  if (!hasValue) {
    return preview;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-left w-[fit-content]">{preview}</span>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>Scan or print this code for device access.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center">
          {printUrl ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <img src={printUrl} alt={label} className="h-56 w-56" />
            </div>
          ) : (
            <div className="h-56 w-56 animate-pulse rounded-2xl bg-muted" />
          )}
        </div>
        <Button type="button" onClick={handlePrint} disabled={!printUrl}>
          Print barcode
        </Button>
      </DialogContent>
    </Dialog>
  );
}
