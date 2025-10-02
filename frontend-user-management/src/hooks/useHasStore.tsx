"use client"
import { createContext, useContext, useEffect, useState } from "react";

const HasStoreContext = createContext<{ hasStore: boolean | null }>({ hasStore: null });

export const HasStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasStore, setHasStore] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/has-store");
        const data = await res.json();
        setHasStore(data.hasStore); 
      } catch (err) {
        console.error(err);
        setHasStore(false);
      }
    };
    fetchData();
  }, []);

  return (
    <HasStoreContext.Provider value={{ hasStore }}>
      {children}
    </HasStoreContext.Provider>
  );
};

export const useHasStore = () => useContext(HasStoreContext);