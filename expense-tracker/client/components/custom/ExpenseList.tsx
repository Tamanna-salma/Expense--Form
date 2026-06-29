'use client';

import React from 'react';
import { ExpenseData } from '../../services/expenseService';
import { AlertCircle, Inbox, Calendar, Tag, Pencil, Trash2, Loader2 } from 'lucide-react';

interface ExpenseListProps {
  expenses: ExpenseData[];
  loading: boolean;
  error: string | null;
  deletingId: string | null;
  onEdit: (expense: ExpenseData) => void;
  onDelete: (expense: ExpenseData) => void;
}

// ── Skeleton loader rows ────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 w-36 rounded-md bg-slate-100 dark:bg-slate-800" /></td>
      <td className="px-6 py-4"><div className="h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-800" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 rounded-md bg-slate-100 dark:bg-slate-800" /></td>
      <td className="px-6 py-4 text-right"><div className="ml-auto h-4 w-16 rounded-md bg-slate-100 dark:bg-slate-800" /></td>
      <td className="px-6 py-4"><div className="ml-auto h-7 w-28 rounded-lg bg-slate-100 dark:bg-slate-800" /></td>
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 rounded-md bg-slate-100 dark:bg-slate-800" />
          <div className="flex gap-2">
            <div className="h-4 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-20 rounded-md bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
        <div className="h-5 w-14 rounded-md bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="h-7 w-16 rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="h-7 w-16 rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function getCategoryBadgeClass(category: string) {
  switch (category) {
    case 'Food':
      return 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30';
    case 'Transport':
      return 'bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/30';
    case 'Shopping':
      return 'bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200/60 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800/40';
  }
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function ExpenseList({
  expenses,
  loading,
  error,
  deletingId,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 md:block">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 dark:border-slate-800">
              <tr>
                {['Title', 'Category', 'Date', 'Amount', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
        {/* Mobile skeleton */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center dark:border-slate-800/80 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h4 className="mt-3 text-base font-bold text-slate-900 dark:text-white">Connection Error</h4>
        <p className="mt-1 max-w-sm text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (expenses.length === 0) {
    return (
      <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-white p-6 text-center dark:border-slate-800/80 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
          <Inbox className="h-6 w-6" />
        </div>
        <h4 className="mt-3 text-base font-bold text-slate-900 dark:text-white">No Expenses Found</h4>
        <p className="mt-1 text-sm text-slate-400">
          Try adjusting your filters or add a new expense.
        </p>
      </div>
    );
  }

  // ── Action buttons ──────────────────────────────────────────────────────────
  const ActionButtons = ({ expense }: { expense: ExpenseData }) => {
    const isCurrentlyDeleting = deletingId === expense._id;
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onEdit(expense)}
          disabled={isCurrentlyDeleting}
          aria-label={`Edit ${expense.title}`}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(expense)}
          disabled={isCurrentlyDeleting}
          aria-label={`Delete ${expense.title}`}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
        >
          {isCurrentlyDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          {isCurrentlyDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* ── Desktop table ─────────────────────────────────────────────────────── */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm md:block dark:border-slate-800/80 dark:bg-slate-900">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-800">
            <tr>
              {['Title', 'Category', 'Date', 'Amount', 'Actions'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                    h === 'Amount' || h === 'Actions' ? 'text-right' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                  deletingId === expense._id ? 'opacity-40' : ''
                }`}
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {expense.title}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getCategoryBadgeClass(expense.category)}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{formatDate(expense.date)}</td>
                <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                  ${expense.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <ActionButtons expense={expense} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className={`rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-opacity dark:border-slate-800/80 dark:bg-slate-900 ${
              deletingId === expense._id ? 'opacity-40' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-semibold text-slate-900 dark:text-white">{expense.title}</h4>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getCategoryBadgeClass(expense.category)}`}>
                    <Tag className="h-3 w-3" />
                    {expense.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(expense.date)}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-base font-bold text-slate-900 dark:text-white">
                ${expense.amount.toFixed(2)}
              </span>
            </div>
            <div className="mt-3 flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800">
              <ActionButtons expense={expense} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
