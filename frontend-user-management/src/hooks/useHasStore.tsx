"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";

const HasStoreContext = createContext<{ hasStore: boolean | null }>({ hasStore: null });

export const HasStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasStore, setHasStore] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie('better-auth.jwt');
        
        if (!token) {
          console.warn('No auth token found');
          setHasStore(false);
          return;
        }

        // Use the correct API URL
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/has-store`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Store status check failed:', res.status, errorText);
          setHasStore(false);
          return;
        }
        
        const data = await res.json();
        setHasStore(data.hasStore);
      } catch (err) {
        console.error('Error checking store status:', err);
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