"use client";

import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  // Retrieve the stored value from local storage
  const getStoredValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  };

  // Initialize state with the stored value or the initial value
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Use useEffect to update local storage whenever the state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  // Return the state and a function to update it

  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue((prevValue) => {
      const valueToStore = value instanceof Function ? value(prevValue) : value;
      return valueToStore;
    });
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
