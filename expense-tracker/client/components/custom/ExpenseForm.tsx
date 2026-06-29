'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, PlusCircle, Pencil, X } from 'lucide-react';
import { ExpenseData } from '../../services/expenseService';

const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  category: z.enum(['Food', 'Transport', 'Shopping', 'Others'] as const),
  date: z.string().min(1, 'Date is required'),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  // Called when form is submitted for Create or Edit
  onSubmitSuccess: (data: ExpenseFormValues) => Promise<void>;
  // When set, form enters "edit" mode pre-filled with this data
  editingExpense?: ExpenseData | null;
  // Called when the user clicks Cancel while editing
  onCancelEdit?: () => void;
}

export default function ExpenseForm({
  onSubmitSuccess,
  editingExpense,
  onCancelEdit,
}: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = Boolean(editingExpense);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      amount: undefined,
      category: 'Others',
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Sync form values whenever editingExpense changes
  React.useEffect(() => {
    if (editingExpense) {
      reset({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        // Normalise ISO date string to YYYY-MM-DD for the date input
        date: new Date(editingExpense.date).toISOString().split('T')[0],
      });
    } else {
      reset({
        title: '',
        amount: undefined,
        category: 'Others',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingExpense, reset]);

  const onSubmit = async (values: ExpenseFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmitSuccess(values);
      // Only reset to blank form after a successful create (not edit, handled by parent)
      if (!isEditing) {
        reset({
          title: '',
          amount: undefined,
          category: 'Others',
          date: new Date().toISOString().split('T')[0],
        });
      }
    } catch {
      // Error surfaced via toast in parent — form stays populated so user can retry
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `mt-1 block w-full rounded-lg border px-3.5 py-2 text-sm shadow-sm transition-colors
    focus:outline-none focus:ring-2
    ${
      hasError
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
    }`;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          {isEditing ? (
            <>
              <Pencil className="h-5 w-5 text-indigo-600" />
              Edit Expense
            </>
          ) : (
            <>
              <PlusCircle className="h-5 w-5 text-indigo-600" />
              Add New Expense
            </>
          )}
        </h3>

        {/* Cancel edit button */}
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            aria-label="Cancel editing"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Weekly Groceries"
            {...register('title')}
            className={inputClass(Boolean(errors.title))}
          />
          {errors.title && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Amount ($)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('amount')}
            className={inputClass(Boolean(errors.amount))}
          />
          {errors.amount && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            id="category"
            {...register('category')}
            className={inputClass(Boolean(errors.category))}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Others">Others</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Date
          </label>
          <input
            id="date"
            type="date"
            {...register('date')}
            className={inputClass(Boolean(errors.date))}
          />
          {errors.date && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.date.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${
            isEditing
              ? 'bg-amber-500 shadow-amber-500/10 hover:bg-amber-600'
              : 'bg-indigo-600 shadow-indigo-600/10 hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Saving...'}
            </>
          ) : isEditing ? (
            <>
              <Pencil className="h-4 w-4" />
              Update Expense
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
}
