'use client';

import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Dialog panel */}
      <div
        className="relative w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-slate-800/80 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>

        {/* Content */}
        <h2
          id="confirm-dialog-title"
          className="mt-4 text-base font-bold text-slate-900 dark:text-white"
        >
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{message}</p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/10 transition-all hover:bg-red-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
