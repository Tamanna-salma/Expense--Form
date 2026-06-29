'use client';

import React from 'react';
import { Wallet } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Expense Tracker
          </span>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Personal Finance Manager
        </div>
      </div>
    </header>
  );
}
