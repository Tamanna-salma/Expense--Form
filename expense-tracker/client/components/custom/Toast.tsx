'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-sm animate-slide-in items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-100/50 transition-all dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
      <div className={isSuccess ? 'text-emerald-500' : 'text-red-500'}>
        {isSuccess ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {isSuccess ? 'Success' : 'Error'}
        </p>
        <p className="text-sm text-slate-900 dark:text-slate-100 mt-0.5">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
