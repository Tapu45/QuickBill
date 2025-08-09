"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowsClockwise, ArrowsLeftRight, Plus } from "@phosphor-icons/react";

type Product = {
  id: string;
  name: string;
  code: string;
};

type Warehouse = {
  id: string;
  name: string;
};

type StockTransfer = {
  id: string;
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  reason: string;
  transferDate: string;
  status: string;
  product?: Product;
  fromWarehouse?: Warehouse;
  toWarehouse?: Warehouse;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function StockTransferPage() {
  const [organizationId, setOrganizationId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    productId: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    quantity: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrgId = localStorage.getItem("organizationId");
      if (storedOrgId) setOrganizationId(storedOrgId);
    }
  }, []);

  useEffect(() => {
    if (!organizationId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/master/product?organizationId=${organizationId}`).then((r) =>
        r.json()
      ),
      fetch(`/api/stock?action=warehouses&organizationId=${organizationId}`).then((r) =>
        r.json()
      ),
      fetch(`/api/stock?action=stock-transfer&organizationId=${organizationId}`).then((r) =>
        r.json()
      ),
    ]).then(([products, warehouses, transfers]) => {
      setProducts(products);
      setWarehouses(warehouses);
      setTransfers(transfers);
      setLoading(false);
    });
  }, [organizationId, submitting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    if (
      !form.productId ||
      !form.fromWarehouseId ||
      !form.toWarehouseId ||
      !form.quantity
    ) {
      setErrorMsg("Please fill all required fields.");
      setSubmitting(false);
      return;
    }
    if (form.fromWarehouseId === form.toWarehouseId) {
      setErrorMsg("Source and destination warehouses must be different.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "stock-transfer",
          organizationId,
          productId: form.productId,
          fromWarehouseId: form.fromWarehouseId,
          toWarehouseId: form.toWarehouseId,
          quantity: Number(form.quantity),
          reason: form.reason,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setSuccessMsg("Stock transfer initiated!");
      setForm({
        productId: "",
        fromWarehouseId: "",
        toWarehouseId: "",
        quantity: "",
        reason: "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to transfer stock.");
    }
    setSubmitting(false);
  };

  return (
    <div
      className="p-0 min-h-screen"
    
    >
      {/* Header */}
      <motion.div
        className="mb-6 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-10 rounded bg-[var(--color-primary)] shadow"
            aria-hidden="true"
          />
          <div className="flex items-center gap-2">
            {/* Transfer Icon */}
            <ArrowsLeftRight size={32} weight="fill" className="text-[var(--color-primary)]" />
            <h1
              className="text-3xl font-bold tracking-tight drop-shadow"
              style={{
                color: "var(--color-card-foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              Stock Transfer
            </h1>
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-muted-foreground text-base mt-2">
            Move stock between warehouses and track transfer status.
          </p>
        </div>
      </motion.div>

      {/* Transfer Form */}
      <motion.div
        className="rounded-xl shadow-md p-5 border mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
          color: "var(--color-card-foreground)",
        }}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Product *</label>
            <select
              name="productId"
              value={form.productId}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
              style={{
                background: "var(--color-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-card-foreground)",
              }}
              required
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">From Warehouse *</label>
            <select
              name="fromWarehouseId"
              value={form.fromWarehouseId}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
              style={{
                background: "var(--color-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-card-foreground)",
              }}
              required
            >
              <option value="">Select source warehouse</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">To Warehouse *</label>
            <select
              name="toWarehouseId"
              value={form.toWarehouseId}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
              style={{
                background: "var(--color-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-card-foreground)",
              }}
              required
            >
              <option value="">Select destination warehouse</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min={1}
              className="w-full rounded border px-3 py-2"
              style={{
                background: "var(--color-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-card-foreground)",
              }}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Reason / Remarks</label>
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
              style={{
                background: "var(--color-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-card-foreground)",
              }}
              placeholder="Optional"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-4 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 rounded bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-semibold shadow"
            >
              <Plus size={18} /> Transfer Stock
            </button>
            {successMsg && (
              <span className="text-green-600 text-sm">{successMsg}</span>
            )}
            {errorMsg && (
              <span className="text-red-600 text-sm">{errorMsg}</span>
            )}
          </div>
        </form>
      </motion.div>

      {/* Recent Transfers Table */}
      <motion.div
        className="rounded-xl shadow-md p-5 border"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
          color: "var(--color-card-foreground)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Stock Transfers</h2>
          <ArrowsClockwise
            size={22}
            weight="fill"
            style={{ color: "var(--color-primary)" }}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground">
            Loading...
          </div>
        ) : transfers.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No transfers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Date
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Product
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    From
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    To
                  </th>
                  <th className="py-2 px-2 text-right text-muted-foreground font-medium">
                    Quantity
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Reason
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {transfers.slice(0, 20).map((item) => (
                  <motion.tr
                    key={item.id}
                    variants={itemVariants}
                    className="border-b hover:bg-[var(--muted)]"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <td className="py-2 px-2">
                      {new Date(item.transferDate).toLocaleString()}
                    </td>
                    <td className="py-2 px-2">
                      {item.product?.name || item.productId}
                    </td>
                    <td className="py-2 px-2">
                      {item.fromWarehouse?.name || item.fromWarehouseId}
                    </td>
                    <td className="py-2 px-2">
                      {item.toWarehouse?.name || item.toWarehouseId}
                    </td>
                    <td className="py-2 px-2 text-right">{item.quantity}</td>
                    <td className="py-2 px-2">{item.reason}</td>
                    <td className="py-2 px-2">
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor:
                            item.status === "COMPLETED"
                              ? "var(--color-chart-3)"
                              : item.status === "CANCELLED"
                              ? "var(--color-destructive)"
                              : "var(--color-chart-4)",
                          color: "var(--color-primary-foreground)",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}