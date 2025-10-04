"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";

const HasStoreContext = createContext<{ hasStore: boolean | null }>({ hasStore: null });

export const HasStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasStore, setHasStore] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the cookie - note the exact name from your screenshot
        const token = getCookie('better-auth.jwt');
        console.log('All cookies:', document.cookie);


        
        if (!token) {
          console.warn('No auth token found');
          setHasStore(false);
          return;
        }

        console.log('Token found, making request...');

        const res = await fetch("http://localhost:8000/api/has-store", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Store status check failed:', res.status, errorText);
          setHasStore(false);
          return;
        }
        
        const data = await res.json();
        console.log('Store status:', data);
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