"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, LayoutList, Plus, X } from "lucide-react";

interface Counter {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface StoreType {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  stateCode?: string;
  isActive: boolean;
  isDefault: boolean;
  counters: Counter[];
}

const fetchStores = async (organizationId: string) => {
  const storesRes = await fetch(`/api/store?organizationId=${organizationId}&action=getStores`);
  return await storesRes.json();
};

const createStore = async (organizationId: string, data: Partial<StoreType>) => {
  const res = await fetch(`/api/store?action=create store`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, organizationId }),
  });
  return await res.json();
};

const createCounter = async (organizationId: string, storeId: string, data: Partial<Counter>) => {
  const res = await fetch(`/api/store?action=create counter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, organizationId, storeId }),
  });
  return await res.json();
};

const StoresPage = () => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState<string | null>(null);

  // Store form state
  const [storeForm, setStoreForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    gstin: "",
    stateCode: "",
  });

  // Counter form state
  const [counterForm, setCounterForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const organizationId = localStorage.getItem("organizationId");
    if (!organizationId) return;
    setLoading(true);
    fetchStores(organizationId).then((data) => {
      setStores(data);
      setLoading(false);
    });
  }, []);

  // Create Store handler
  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    const organizationId = localStorage.getItem("organizationId");
    if (!organizationId) return;
    const newStore = await createStore(organizationId, storeForm);
    setStores((prev) => [...prev, { ...newStore, counters: [] }]);
    setShowStoreModal(false);
    setStoreForm({ name: "", address: "", phone: "", email: "", gstin: "", stateCode: "" });
  };

  // Create Counter handler
  const handleCreateCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    const organizationId = localStorage.getItem("organizationId");
    if (!organizationId || !showCounterModal) return;
    const newCounter = await createCounter(organizationId, showCounterModal, counterForm);
    setStores((prev) =>
      prev.map((store) =>
        store.id === showCounterModal
          ? { ...store, counters: [...store.counters, newCounter] }
          : store
      )
    );
    setShowCounterModal(null);
    setCounterForm({ name: "", description: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", damping: 18 }}
      className="max-w-2xl mx-auto p-8 rounded-xl shadow-lg bg-[color:var(--card)]"
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold mb-8 text-[color:var(--primary)]"
      >
        Stores & Counters
      </motion.h1>

      <button
        className="flex items-center gap-2 px-4 py-2 mb-6 rounded bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-medium shadow hover:scale-105 transition"
        onClick={() => setShowStoreModal(true)}
      >
        <Plus className="h-5 w-5" />
        Create Store
      </button>

      {loading ? (
        <div className="text-[color:var(--muted-foreground)] text-center">Loading...</div>
      ) : stores.length === 0 ? (
        <div className="text-[color:var(--muted-foreground)] text-center">No stores found.</div>
      ) : (
        <div className="space-y-6">
          {stores.map((store) => (
            <motion.div
              key={store.id}
              whileHover={{ scale: 1.02, boxShadow: "0px 4px 16px var(--shadow-md)" }}
              className="rounded-lg border border-[color:var(--sidebar-border)] bg-[color:var(--sidebar)] p-4"
            >
              <div className="flex items-center gap-4 mb-2">
                <Store className="h-7 w-7 text-[color:var(--primary)]" />
                <div>
                  <div className="font-semibold text-lg text-[color:var(--foreground)]">{store.name}</div>
                  <div className="text-sm text-[color:var(--muted-foreground)]">{store.address}</div>
                  <div className="text-xs text-[color:var(--muted-foreground)]">{store.phone}</div>
                </div>
                <button
                  className="ml-auto flex items-center gap-1 px-3 py-1 rounded bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-sm font-medium shadow hover:scale-105 transition"
                  onClick={() => setShowCounterModal(store.id)}
                >
                  <Plus className="h-4 w-4" />
                  Add Counter
                </button>
              </div>
              <div className="ml-10">
                <div className="font-medium text-[color:var(--primary)] mb-1 flex items-center gap-2">
                  <LayoutList className="h-5 w-5" />
                  Counters
                </div>
                {store.counters.length === 0 ? (
                  <div className="text-sm text-[color:var(--muted-foreground)]">No counters found.</div>
                ) : (
                  <ul className="space-y-2">
                    {store.counters.map((counter) => (
                      <li
                        key={counter.id}
                        className="flex items-center gap-3 rounded px-3 py-2 bg-[color:var(--card)] border border-[color:var(--sidebar-border)]"
                      >
                        <span className="font-semibold text-[color:var(--foreground)]">{counter.name}</span>
                        {counter.description && (
                          <span className="text-xs text-[color:var(--muted-foreground)]">{counter.description}</span>
                        )}
                        <span
                          className={`ml-auto text-xs px-2 py-0.5 rounded ${
                            counter.isActive
                              ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                              : "bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
                          }`}
                        >
                          {counter.isActive ? "Active" : "Inactive"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Store Modal */}
      <AnimatePresence>
        {showStoreModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          >
            <motion.form
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              onSubmit={handleCreateStore}
              className="bg-[color:var(--card)] rounded-xl shadow-xl p-8 w-full max-w-md relative"
            >
              <button
                type="button"
                className="absolute top-4 right-4 text-[color:var(--muted-foreground)]"
                onClick={() => setShowStoreModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold mb-4 text-[color:var(--primary)]">Create Store</h2>
              <input
                className="w-full mb-3 px-3 py-2 rounded border border-[color:var(--sidebar-border)] bg-[color:var(--card)] text-[color:var(--foreground)]"
                placeholder="Store Name"
                required
                value={storeForm.name}
                onChange={e => setStoreForm(f => ({ ...f, name: e.target.value }))}
              />
              <input
                className="w-full mb-3 px-3 py-2 rounded border border-[color:var(--sidebar-border)] bg-[color:var(--card)] text-[color:var(--foreground)]"
                placeholder="Address"
                value={storeForm.address}
                onChange={e => setStoreForm(f => ({ ...f, address: e.target.value }))}
              />
              <input
                className="w-full mb-3 px-3 py-2 rounded border border-[color:var(--sidebar-border)] bg-[color:var(--card)] text-[color:var(--foreground)]"
                placeholder="Phone"
                value={storeForm.phone}
                onChange={e => setStoreForm(f => ({ ...f, phone: e.target.value }))}
              />
              <input
                className="w-full mb-3 px-3 py-2 rounded border border-[color:var(--sidebar-border)] bg-[color:var(--card)] text-[color:var(--foreground)]"
                placeholder="Email"
                value={storeForm.email}
                onChange={e => setStoreForm(f => ({ ...f, email: e.target.value }))}
              />
              <input
                className="w-full mb-3 px-3 py-2 rounded border border-[color:var(--sidebar-border)] bg-[color:var(--card)] text-[color:var(--foreground)]"
                placeholder="GSTIN"
                value={storeForm.gstin}
                onChange={e => setStoreForm(f => ({ ...f, gstin: e.target.value }))}
              />
              <input
                className="w-full mb-6 px-3 py-2 rounded border border-[color:var(--sidebar-border)] bg-[color:var(--card)] text-[color:var(--foreground)]"
                placeholder="State Code"
                value={storeForm.stateCode}
                onChange={e => setStoreForm(f => ({ ...f, stateCode: e.target.value }))}
              />
              <button
                type="submit"
                className="w-full py-2 rounded bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold shadow hover:scale-105 transition"
              >
                Create Store
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Counter Modal */}
      <AnimatePresence>
        {showCounterModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          >
            <motion.form
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              onSubmit={handleCreateCounter}
              className="bg-[color:var(--card)] rounded-xl shadow-xl p-8 w-full max-w-md relative"
            >
              <button
                type="button"
                className="absolute top-4 right-4 text-[color:var(--muted-foreground)]"
                onClick={() => setShowCounterModal(null)}
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold mb-4 text-[color:var(--primary)]">Create Counter</h2>
              <input
                className="w-full mb-3 px-3 py-2 rounded border border-[color:var(--sidebar-border)] bg-[color:var(--card)] text-[color:var(--foreground)]"
                placeholder="Counter Name"
                required
                value={counterForm.name}
                onChange={e => setCounterForm(f => ({ ...f, name: e.target.value }))}
              />
              <input
                className="w-full mb-6 px-3 py-2 rounded border border-[color:var(--sidebar-border)] bg-[color:var(--card)] text-[color:var(--foreground)]"
                placeholder="Description"
                value={counterForm.description}
                onChange={e => setCounterForm(f => ({ ...f, description: e.target.value }))}
              />
              <button
                type="submit"
                className="w-full py-2 rounded bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold shadow hover:scale-105 transition"
              >
                Create Counter
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StoresPage;