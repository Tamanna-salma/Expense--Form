'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Navbar from '../components/custom/Navbar';
import Summary from '../components/custom/Summary';
import ExpenseForm, { ExpenseFormValues } from '../components/custom/ExpenseForm';
import ExpenseList from '../components/custom/ExpenseList';
import Toast from '../components/custom/Toast';
import ConfirmDialog from '../components/custom/ConfirmDialog';
import FilterBar, { FilterState } from '../components/custom/FilterBar';
import ExpenseChart from '../components/custom/ExpenseChart';
import { expenseService, ExpenseData } from '../services/expenseService';
import { BarChart3 } from 'lucide-react';

const DEFAULT_FILTERS: FilterState = { category: 'All', startDate: '', endDate: '' };

export default function HomePage() {
  // ── Data ─────────────────────────────────────────────────────────────────────
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Filters ───────────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // ── Edit ──────────────────────────────────────────────────────────────────────
  const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);

  // ── Delete ────────────────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<ExpenseData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Toast ─────────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  // ── Fetch all expenses ────────────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch expenses. Is the server running?';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  // ── Client-side filtering (no extra API calls) ────────────────────────────────
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      // Category filter
      if (filters.category !== 'All' && exp.category !== filters.category) return false;

      // Start date filter
      if (filters.startDate) {
        const expDate = new Date(exp.date);
        const start = new Date(filters.startDate);
        start.setHours(0, 0, 0, 0);
        if (expDate < start) return false;
      }

      // End date filter
      if (filters.endDate) {
        const expDate = new Date(exp.date);
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (expDate > end) return false;
      }

      return true;
    });
  }, [expenses, filters]);

  const isFiltered =
    filters.category !== 'All' || filters.startDate !== '' || filters.endDate !== '';

  const filteredTotal = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // ── Create ────────────────────────────────────────────────────────────────────
  const handleCreate = async (data: ExpenseFormValues) => {
    const newExpense = await expenseService.createExpense(data);
    setExpenses((prev) => [newExpense, ...prev]);
    showToast('Expense added successfully!', 'success');
  };

  // ── Update ────────────────────────────────────────────────────────────────────
  const handleUpdate = async (data: ExpenseFormValues) => {
    if (!editingExpense?._id) return;
    const updated = await expenseService.updateExpense(editingExpense._id, data);
    setExpenses((prev) => prev.map((exp) => (exp._id === updated._id ? updated : exp)));
    setEditingExpense(null);
    showToast('Expense updated successfully!', 'success');
  };

  const handleFormSubmit = async (data: ExpenseFormValues) => {
    try {
      if (editingExpense) {
        await handleUpdate(data);
      } else {
        await handleCreate(data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      showToast(msg, 'error');
      throw err;
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);
    setDeletingId(deleteTarget._id);
    try {
      await expenseService.deleteExpense(deleteTarget._id);
      setExpenses((prev) => prev.filter((exp) => exp._id !== deleteTarget._id));
      showToast('Expense deleted successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete expense';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── Left column ──────────────────────────────────────────────────── */}
          <div className="space-y-5 lg:col-span-1">
            <Summary
              total={totalExpenses}
              count={expenses.length}
              filteredTotal={filteredTotal}
              filteredCount={filteredExpenses.length}
              isFiltered={isFiltered}
            />

            <ExpenseForm
              onSubmitSuccess={handleFormSubmit}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
            />

            {/* Analytics chart */}
            {!loading && expenses.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <BarChart3 className="h-4 w-4 text-indigo-500" />
                  Spending by Category
                </h3>
                <ExpenseChart expenses={expenses} />
              </div>
            )}
          </div>

          {/* ── Right column ─────────────────────────────────────────────────── */}
          <div className="space-y-5 lg:col-span-2">
            <FilterBar
              filters={filters}
              onChange={setFilters}
              totalCount={expenses.length}
              filteredCount={filteredExpenses.length}
            />

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Expense History
              </h3>
              <ExpenseList
                expenses={filteredExpenses}
                loading={loading}
                error={error}
                deletingId={deletingId}
                onEdit={setEditingExpense}
                onDelete={setDeleteTarget}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ── Confirm delete dialog ─────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Expense"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { if (!isDeleting) setDeleteTarget(null); }}
      />

      {/* ── Toast ────────────────────────────────────────────────────────────── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
