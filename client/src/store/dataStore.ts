import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export type Transaction = { id: string, type: 'income' | 'expense', category: string, amount: number, date: string, recurring?: boolean, receiptUrl?: string, description?: string, status?: 'paid' | 'received' | 'pending_payment' | 'pending_receipt' };
export type Budget = { id: string, category: string, limit: number };
export type Goal = { id: string, name: string, target: number, saved: number };

interface DataState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  loading: boolean;
  error: string | null;
  clearError: () => void;
  loadData: () => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, t: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (b: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, b: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addGoal: (g: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (id: string, g: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('ms_token');
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
    throw new Error(error.error || 'Erro na requisição');
  }

  return response.json();
}

import { categories } from '../mock/data';

export const presetCategories = categories;

const handleApiCall = async (apiCallPromise: Promise<any>, set: (state: Partial<DataState>) => void, get: () => DataState) => {
  set({ loading: true, error: null });
  try {
    await apiCallPromise;
    // After a successful modification, refresh all data
    await get().loadData(); 
  } catch (error: any) {
    console.error("API Call Error:", error);
    set({ error: error.message, loading: false });
  }
};

export const useDataStore = create<DataState>((set, get) => ({
  transactions: [],
  budgets: [],
  goals: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  loadData: async () => {
    const token = localStorage.getItem('ms_token');
    if (!token) {
      set({ transactions: [], budgets: [], goals: [], loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const [transData, budgetsData, goalsData] = await Promise.all([
        apiCall('/transactions'),
        apiCall('/budgets'),
        apiCall('/goals'),
      ]);
      
      set({
        transactions: transData.map((t: any) => ({
          ...t,
          receiptUrl: t.receipt_url,
          id: t.id.toString(),
          amount: parseFloat(t.amount) || 0,
        })),
        budgets: budgetsData.map((b: any) => ({
          ...b,
          id: b.id.toString(),
          limit: parseFloat(b.limit) || 0,
        })),
        goals: goalsData.map((g: any) => ({
          ...g,
          id: g.id.toString(),
          target: parseFloat(g.target) || 0,
          saved: parseFloat(g.saved) || 0,
        })),
        loading: false,
      });
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      set({ error: error.message, loading: false });
    }
  },

  addTransaction: async (t) => {
    await handleApiCall(
      apiCall('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          ...t,
          receipt_url: t.receiptUrl,
          status: t.status || (t.type === 'expense' ? 'paid' : 'received'),
        }),
      }),
      set,
      get
    );
  },

  updateTransaction: async (id, t) => {
    await handleApiCall(
      apiCall(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...t,
          receipt_url: t.receipt_url || t.receiptUrl,
        }),
      }),
      set,
      get
    );
  },

  deleteTransaction: async (id) => {
    await handleApiCall(apiCall(`/transactions/${id}`, { method: 'DELETE' }), set, get);
  },

  addBudget: async (b) => {
    await handleApiCall(
      apiCall('/budgets', {
        method: 'POST',
        body: JSON.stringify(b),
      }),
      set,
      get
    );
  },

  updateBudget: async (id, b) => {
    await handleApiCall(
      apiCall(`/budgets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(b),
      }),
      set,
      get
    );
  },

  deleteBudget: async (id) => {
    await handleApiCall(apiCall(`/budgets/${id}`, { method: 'DELETE' }), set, get);
  },

  addGoal: async (g) => {
    await handleApiCall(
      apiCall('/goals', {
        method: 'POST',
        body: JSON.stringify(g),
      }),
      set,
      get
    );
  },

  updateGoal: async (id, g) => {
    await handleApiCall(
      apiCall(`/goals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(g),
      }),
      set,
      get
    );
  },

  deleteGoal: async (id) => {
    await handleApiCall(apiCall(`/goals/${id}`, { method: 'DELETE' }), set, get);
  },
}));
