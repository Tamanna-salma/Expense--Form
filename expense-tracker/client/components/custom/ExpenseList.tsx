'use client';

import React from 'react';
import { ExpenseData } from '../../services/expenseService';
import { Loader2, AlertCircle, Inbox, Calendar, Tag, Pencil, Trash2 } from 'lucide-react';

interface ExpenseListProps {
  expenses: ExpenseData[];
  loading: boolean;
  error: string | null;
  deletingId: string | null;       // ID of the expense currently being deleted
  onEdit: (expense: ExpenseData) => void;
  onDelete: (expense: ExpenseData) => void;
}

export default function ExpenseList({
  expenses,
  loading,
  error,
  deletingId,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  const getCategoryBadgeClass = (category: string) => {
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
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Retrieving expenses...</p>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-red-50/50 p-6 text-center dark:border-slate-800/80 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h4 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
          API Connection Error
        </h4>
        <p className="mt-1 max-w-md text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (expenses.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-white p-6 text-center dark:border-slate-800/80 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
          <Inbox className="h-6 w-6" />
        </div>
        <h4 className="mt-3 text-base font-bold text-slate-900 dark:text-white">No Expenses Found</h4>
        <p className="mt-1 text-sm text-slate-500">
          Start logging your expenses by filling the form.
        </p>
      </div>
    );
  }

  // ── Action buttons shared between table row and mobile card ──────────────────
  const ActionButtons = ({ expense }: { expense: ExpenseData }) => {
    const isDeleting = deletingId === expense._id;
    return (
      <div className="flex items-center gap-1.5">
        {/* Edit */}
        <button
          onClick={() => onEdit(expense)}
          disabled={isDeleting}
          aria-label={`Edit expense: ${expense.title}`}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-amber-950/30 dark:hover:text-amber-400"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(expense)}
          disabled={isDeleting}
          aria-label={`Delete expense: ${expense.title}`}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* ── Desktop Table ─────────────────────────────────────────────────────── */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm md:block dark:border-slate-800/80 dark:bg-slate-900">
        <table className="w-full border-collapse text-left text-sm text-slate-500">
          <thead className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800">
            <tr>
              <th scope="col" className="px-6 py-4">Title</th>
              <th scope="col" className="px-6 py-4">Category</th>
              <th scope="col" className="px-6 py-4">Date</th>
              <th scope="col" className="px-6 py-4 text-right">Amount</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                  deletingId === expense._id ? 'opacity-50' : ''
                }`}
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {expense.title}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getCategoryBadgeClass(expense.category)}`}
                  >
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

      {/* ── Mobile Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className={`rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-opacity dark:border-slate-800/80 dark:bg-slate-900 ${
              deletingId === expense._id ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-semibold text-slate-900 dark:text-white">
                  {expense.title}
                </h4>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getCategoryBadgeClass(expense.category)}`}
                  >
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
