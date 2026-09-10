"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";
import { useState } from "react";

type DeleteTripDialogProps = {
  tripTitle: string;
  onDelete: () => Promise<void>;
  className?: string;
  showLabel?: boolean;
};

export function DeleteTripDialog({
  tripTitle,
  onDelete,
  className,
  showLabel = false
}: DeleteTripDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const confirmDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await onDelete();
      setOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete this trip.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className={className}
          type="button"
          aria-label={`Delete ${tripTitle}`}
          title="Delete trip"
        >
          <Trash2 aria-hidden="true" size={17} />
          {showLabel ? <span>Delete trip</span> : null}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="delete-trip-overlay" />
        <Dialog.Content className="delete-trip-dialog" aria-describedby="delete-trip-copy">
          <Dialog.Close className="delete-trip-close" aria-label="Close delete confirmation">
            <X aria-hidden="true" size={20} />
          </Dialog.Close>
          <span className="delete-trip-symbol" aria-hidden="true">
            <Trash2 size={24} />
          </span>
          <Dialog.Title>Delete this trip?</Dialog.Title>
          <Dialog.Description className="delete-trip-description" id="delete-trip-copy">
            <strong>{tripTitle || "Untitled trip"}</strong> and its published page will be
            permanently removed. This cannot be undone.
          </Dialog.Description>
          {error ? <p className="delete-trip-error" role="alert">{error}</p> : null}
          <div className="delete-trip-dialog-actions">
            <Dialog.Close type="button" disabled={deleting}>Cancel</Dialog.Close>
            <button type="button" disabled={deleting} onClick={() => void confirmDelete()}>
              {deleting ? "Deleting..." : "Delete trip"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
