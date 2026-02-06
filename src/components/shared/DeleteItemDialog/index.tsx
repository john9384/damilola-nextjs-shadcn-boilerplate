"use client";

import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type DeleteItemDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  loadingLabel?: string;
  cancelLabel?: string;
  trigger?: React.ReactNode;
  triggerLabel?: string;
  isLoading?: boolean;
  confirmDisabled?: boolean;
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onConfirm: () => void;
};

export const DeleteItemDialog = React.memo(function DeleteItemDialog({
  open,
  onOpenChange,
  title = "Delete item",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  loadingLabel = "Deleting...",
  cancelLabel = "Cancel",
  trigger,
  triggerLabel,
  isLoading = false,
  confirmDisabled = false,
  confirmVariant = "destructive",
  onConfirm,
}: DeleteItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {(trigger || triggerLabel) && (
        <DialogTrigger asChild>
          {trigger ?? <Button variant="destructive">{triggerLabel}</Button>}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading || confirmDisabled}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
