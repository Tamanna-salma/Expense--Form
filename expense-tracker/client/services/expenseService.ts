import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ExpenseData {
  _id?: string;
  title: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Shopping' | 'Others';
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export const expenseService = {
  // Fetch all expenses
  getExpenses: async (): Promise<ExpenseData[]> => {
    const response = await api.get('/expenses');
    return response.data.data;
  },

  // Create a new expense
  createExpense: async (expense: Omit<ExpenseData, '_id'>): Promise<ExpenseData> => {
    const response = await api.post('/expenses', expense);
    return response.data.data;
  },

  // Update an existing expense by ID
  updateExpense: async (id: string, expense: Partial<Omit<ExpenseData, '_id'>>): Promise<ExpenseData> => {
    const response = await api.patch(`/expenses/${id}`, expense);
    return response.data.data;
  },

  // Delete an expense by ID
  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};
