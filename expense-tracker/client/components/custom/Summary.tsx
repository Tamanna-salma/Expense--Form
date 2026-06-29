'use client';

import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

interface SummaryProps {
  total: number;
}

export default function Summary({ total }: SummaryProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      {/* Background soft glowing orb */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <TrendingUp className="h-6 w-6" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
        <span>Current Billing Period Status</span>
      </div>
    </div>
  );
}
