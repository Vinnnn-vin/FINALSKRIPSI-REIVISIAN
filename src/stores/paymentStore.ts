// src\stores\paymentStore.ts
/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from 'zustand';
import { Payment, PaymentCreationData, TransactionHistory } from '@/types';

interface PaymentState {
  payments: Payment[];
  transactionHistory: TransactionHistory[];
  selectedPayment: Payment | null;
  isLoading: boolean;
  error: string | null;
}

interface PaymentActions {
  // Course purchase flow
  initiateCoursePayment: (courseId: number) => Promise<{ paymentUrl: string; paymentId: number }>;
  checkPaymentStatus: (paymentId: number) => Promise<boolean>;
  
  // Transaction history
  fetchTransactionHistory: () => Promise<void>;
  fetchPaymentsByUser: (userId?: number) => Promise<void>;
  
  // Admin functions
  fetchAllPayments: () => Promise<void>;
  generateSalesReport: (startDate: string, endDate: string) => Promise<void>;
  
  clearError: () => void;
  setSelectedPayment: (payment: Payment | null) => void;
}

export const usePaymentStore = create<PaymentState & PaymentActions>((set, get) => ({
  payments: [],
  transactionHistory: [],
  selectedPayment: null,
  isLoading: false,
  error: null,

  initiateCoursePayment: async (courseId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId }),
      });
      
      if (!response.ok) throw new Error('Failed to initiate payment');
      
      const result = await response.json();
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initiate payment',
        isLoading: false,
      });
      throw error;
    }
  },

  checkPaymentStatus: async (paymentId: number) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/status`);
      if (!response.ok) throw new Error('Failed to check payment status');
      
      const data = await response.json();
      
      set((state) => ({
        payments: state.payments.map(p => 
          p.payment_id === paymentId ? { ...p, status: data.status } : p
        ),
        selectedPayment: state.selectedPayment?.payment_id === paymentId ? 
          { ...state.selectedPayment, status: data.status } : state.selectedPayment,
      }));

      return data.status === 'completed';
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to check payment status',
      });
      return false;
    }
  },

  fetchTransactionHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/payments/history');
      if (!response.ok) throw new Error('Failed to fetch transaction history');
      
      const data = await response.json();
      set({
        transactionHistory: data.transactions,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch transaction history',
        isLoading: false,
      });
    }
  },

  fetchPaymentsByUser: async (userId?: number) => {
    set({ isLoading: true, error: null });
    try {
      const url = userId ? `/api/payments?userId=${userId}` : '/api/payments';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch payments');
      
      const data = await response.json();
      set({
        payments: data.payments,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch payments',
        isLoading: false,
      });
    }
  },

  fetchAllPayments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/admin/payment');
      if (!response.ok) throw new Error('Failed to fetch all payments');
      
      const data = await response.json();
      set({
        payments: data.payments,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch all payments',
        isLoading: false,
      });
    }
  },

  generateSalesReport: async (startDate: string, endDate: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/admin/reports/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate }),
      });
      
      if (!response.ok) throw new Error('Failed to generate sales report');
      
      // This would typically trigger a download or return report data
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${startDate}-${endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to generate sales report',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  setSelectedPayment: (payment: Payment | null) => set({ selectedPayment: payment }),
}));