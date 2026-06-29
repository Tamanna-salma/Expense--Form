'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface SummaryProps {
  total: number;
  count: number;
  filteredTotal?: number;
  filteredCount?: number;
  isFiltered?: boolean;
}

export default function Summary({
  total,
  count,
  filteredTotal,
  filteredCount,
  isFiltered = false,
}: SummaryProps) {
  const displayTotal = isFiltered && filteredTotal !== undefined ? filteredTotal : total;
  const displayCount = isFiltered && filteredCount !== undefined ? filteredCount : count;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      {/* Decorative glow */}
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {isFiltered ? 'Filtered Total' : 'Total Expenses'}
          </p>
          <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            ${displayTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
          <p className="mt-1.5 text-xs font-medium text-slate-400">
            {displayCount} {displayCount === 1 ? 'expense' : 'expenses'}
            {isFiltered && count !== displayCount && (
              <span className="ml-1 text-slate-300 dark:text-slate-600">
                (of {count} total)
              </span>
            )}
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <TrendingUp className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
