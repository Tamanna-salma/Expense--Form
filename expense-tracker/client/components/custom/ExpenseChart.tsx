'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExpenseData } from '../../services/expenseService';
import { BarChart3 } from 'lucide-react';

interface ExpenseChartProps {
  expenses: ExpenseData[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f59e0b',       // amber-500
  Transport: '#0ea5e9',  // sky-500
  Shopping: '#a855f7',   // purple-500
  Others: '#64748b',     // slate-500
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { total: number } }>;
}) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-lg dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
        <p className="text-sm text-slate-500">
          ${value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Aggregate amounts by category
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const data = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center text-center">
        <BarChart3 className="h-8 w-8 text-slate-300 dark:text-slate-700" />
        <p className="mt-2 text-sm text-slate-400">No data to display</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={CATEGORY_COLORS[entry.name] || '#94a3b8'}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
