'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/custom/Navbar';
import Summary from '../components/custom/Summary';
import ExpenseForm from '../components/custom/ExpenseForm';
import { ExpenseFormValues } from '../components/custom/ExpenseForm';
import ExpenseList from '../components/custom/ExpenseList';
import Toast from '../components/custom/Toast';
import ConfirmDialog from '../components/custom/ConfirmDialog';
import { expenseService, ExpenseData } from '../services/expenseService';

export default function HomePage() {
  // ── Data & loading ───────────────────────────────────────────────────────────
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ── Edit state ───────────────────────────────────────────────────────────────
  const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);

  // ── Delete state ─────────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<ExpenseData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Toast ────────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') =>
    setToast({ message, type });

  // ── Fetch all expenses ───────────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ── Create ───────────────────────────────────────────────────────────────────
  const handleCreate = async (data: ExpenseFormValues) => {
    const newExpense = await expenseService.createExpense(data);
    setExpenses((prev) => [newExpense, ...prev]);
    showToast('Expense added successfully!', 'success');
  };

  // ── Update ───────────────────────────────────────────────────────────────────
  const handleUpdate = async (data: ExpenseFormValues) => {
    if (!editingExpense?._id) return;
    const updated = await expenseService.updateExpense(editingExpense._id, data);
    setExpenses((prev) =>
      prev.map((exp) => (exp._id === updated._id ? updated : exp))
    );
    setEditingExpense(null);
    showToast('Expense updated successfully!', 'success');
  };

  // Single handler passed to the form — delegates to create or update
  const handleFormSubmit = async (data: ExpenseFormValues) => {
    try {
      if (editingExpense) {
        await handleUpdate(data);
      } else {
        await handleCreate(data);
      }
    } catch (err: any) {
      showToast(
        err.response?.data?.message || err.message || 'Something went wrong',
        'error'
      );
      throw err; // re-throw so form knows submission failed
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDeleteRequest = (expense: ExpenseData) => {
    setDeleteTarget(expense);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?._id) return;
    setIsDeleting(true);
    setDeletingId(deleteTarget._id);
    try {
      await expenseService.deleteExpense(deleteTarget._id);
      setExpenses((prev) => prev.filter((exp) => exp._id !== deleteTarget._id));
      showToast('Expense deleted successfully!', 'success');
    } catch (err: any) {
      showToast(
        err.response?.data?.message || err.message || 'Failed to delete expense',
        'error'
      );
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) setDeleteTarget(null);
  };

  // ── Computed total ───────────────────────────────────────────────────────────
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ── Left column: Summary + Form ──────────────────────────────────── */}
          <div className="space-y-6 lg:col-span-1">
            <Summary total={totalExpenses} />
            <ExpenseForm
              onSubmitSuccess={handleFormSubmit}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
            />
          </div>

          {/* ── Right column: Expense list ───────────────────────────────────── */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Expense History
              </h3>
              <ExpenseList
                expenses={expenses}
                loading={loading}
                error={error}
                deletingId={deletingId}
                onEdit={setEditingExpense}
                onDelete={handleDeleteRequest}
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
        onCancel={handleDeleteCancel}
      />

      {/* ── Toast notifications ───────────────────────────────────────────────── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
