// File: hooks/usePayments.ts
// Hook untuk mengelola pembayaran - langsung return store tanpa auto-fetch
import { usePaymentStore } from '@/stores/paymentStore';

export const usePayments = () => {
  const store = usePaymentStore();
  return store;
};