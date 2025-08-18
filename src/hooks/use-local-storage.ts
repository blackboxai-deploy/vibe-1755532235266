'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  useEffect(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      if (item) {
        const parsedValue = JSON.parse(item);
        // Handle date strings by converting them back to Date objects
        if (Array.isArray(parsedValue)) {
          const processedValue = parsedValue.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }));
          setStoredValue(processedValue as T);
        } else {
          setStoredValue(parsedValue);
        }
      }
    } catch (error) {
      // If error also return initialValue
      console.log(`Error loading ${key} from localStorage:`, error);
      setStoredValue(initialValue);
    } finally {
      setIsLoaded(true);
    }
  }, [key, initialValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue, isLoaded] as const;
}