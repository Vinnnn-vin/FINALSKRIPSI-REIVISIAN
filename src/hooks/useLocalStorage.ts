/* eslint-disable @typescript-eslint/no-unused-vars */
// File: hooks/useLocalStorage.ts
// Utility hook untuk menyimpan data ke localStorage dengan type safety
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // State untuk menyimpan nilai localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Return initialValue jika di server-side
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Ambil nilai dari localStorage
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // Fungsi untuk set nilai ke localStorage dan state
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Jika value adalah function, panggil dengan current value
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Simpan ke localStorage jika di client-side
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
};