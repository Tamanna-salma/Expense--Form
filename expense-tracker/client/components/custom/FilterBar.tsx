'use client';

import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export type CategoryFilter = 'All' | 'Food' | 'Transport' | 'Shopping' | 'Others';

export interface FilterState {
  category: CategoryFilter;
  startDate: string;
  endDate: string;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

const CATEGORIES: CategoryFilter[] = ['All', 'Food', 'Transport', 'Shopping', 'Others'];

const categoryColors: Record<CategoryFilter, string> = {
  All: 'bg-indigo-600 text-white border-indigo-600',
  Food: 'bg-amber-500 text-white border-amber-500',
  Transport: 'bg-sky-500 text-white border-sky-500',
  Shopping: 'bg-purple-500 text-white border-purple-500',
  Others: 'bg-slate-500 text-white border-slate-500',
};

const categoryInactiveColors: Record<CategoryFilter, string> = {
  All: 'text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-900/50 dark:hover:bg-indigo-950/30',
  Food: 'text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-900/50 dark:hover:bg-amber-950/30',
  Transport: 'text-sky-600 border-sky-200 hover:bg-sky-50 dark:text-sky-400 dark:border-sky-900/50 dark:hover:bg-sky-950/30',
  Shopping: 'text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-900/50 dark:hover:bg-purple-950/30',
  Others: 'text-slate-600 border-slate-200 hover:bg-slate-50 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-900',
};

export default function FilterBar({ filters, onChange, totalCount, filteredCount }: FilterBarProps) {
  const hasActiveFilter =
    filters.category !== 'All' || filters.startDate !== '' || filters.endDate !== '';

  const clearFilters = () =>
    onChange({ category: 'All', startDate: '', endDate: '' });

  const inputClass =
    'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300';

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
          Filters
          {hasActiveFilter && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              {filteredCount !== totalCount ? filteredCount : ''}
            </span>
          )}
        </div>
        {hasActiveFilter && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => onChange({ ...filters, category: cat })}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                isActive ? categoryColors[cat] : categoryInactiveColors[cat]
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="startDate"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            From
          </label>
          <input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            To
          </label>
          <input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Result count */}
      {hasActiveFilter && (
        <p className="mt-3 text-xs text-slate-400">
          Showing <span className="font-bold text-slate-700 dark:text-slate-300">{filteredCount}</span> of{' '}
          <span className="font-bold text-slate-700 dark:text-slate-300">{totalCount}</span> expenses
        </p>
      )}
    </div>
  );
}
