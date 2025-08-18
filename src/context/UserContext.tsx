"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Types for store and counter
type Store = {
  id: string;
  name: string;
};

type Counter = {
  id: string;
  name: string;
  storeId: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string; // "ADMIN", "MANAGER", etc.
  stores: Store[]; // Assigned stores
  counters: Counter[]; // Assigned counters
  image?: string; // Optional user image
  // add other fields as needed
};

type UserContextType = {
  user: User | null;
  activeStore: Store | null;
  activeCounter: Counter | null;
  setActiveStore: (store: Store) => void;
  setActiveCounter: (counter: Counter) => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeStore, setActiveStore] = useState<Store | null>(null);
  const [activeCounter, setActiveCounter] = useState<Counter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info, assigned stores and counters
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        if (data && data.id) {
          // Fetch stores and counters based on role
          let stores: Store[] = [];
          let counters: Counter[] = [];

          if (data.role === "ADMIN") {
            // Admin: fetch all stores and counters in organization
            const storesRes = await fetch(
              `/api/store?action=getStores&organizationId=${data.organizationId}`
            );
            stores = await storesRes.json();
            const countersRes = await fetch(
              `/api/counter?action=getCounters&organizationId=${data.organizationId}`
            );
            counters = await countersRes.json();
          } else {
            // Non-admin: fetch only assigned stores/counters
            const storesRes = await fetch(`/api/user/stores?userId=${data.id}`);
            stores = await storesRes.json();
            const countersRes = await fetch(
              `/api/user/counters?userId=${data.id}`
            );
            counters = await countersRes.json();
          }

          const userObj: User = {
            ...data,
            stores,
            counters,
          };
          setUser(userObj);

          // Set default active store/counter
          if (stores.length > 0) setActiveStore(stores[0]);
          else setActiveStore(null);

          // For sales page, set counter if available
          if (counters.length > 0) setActiveCounter(counters[0]);
          else setActiveCounter(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // If activeStore changes, reset activeCounter if not in that store
  useEffect(() => {
    if (activeStore && user) {
      const countersInStore = user.counters.filter(
        (c) => c.storeId === activeStore.id
      );
      if (
        activeCounter &&
        activeCounter.storeId !== activeStore.id &&
        countersInStore.length > 0
      ) {
        setActiveCounter(countersInStore[0]);
      }
      if (countersInStore.length === 0) setActiveCounter(null);
    }
  }, [activeStore, user]);

  const value: UserContextType = {
    user,
    activeStore,
    activeCounter,
    setActiveStore,
    setActiveCounter,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
