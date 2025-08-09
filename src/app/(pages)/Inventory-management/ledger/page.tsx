"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowsClockwise } from "@phosphor-icons/react";

type StockLedgerItem = {
  product: any;
  warehouse: any;
  id: string;
  productId: string;
  warehouseId: string;
  organizationId: string;
  movementType: string;
  quantity: number;
  referenceType: string;
  referenceId: string;
  remarks: string;
  createdAt: string;
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

export default function InventoryLedgerPage() {
  const [ledger, setLedger] = useState<StockLedgerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrgId = localStorage.getItem("organizationId");
      if (storedOrgId) setOrganizationId(storedOrgId);
    }
  }, []);

  useEffect(() => {
    async function fetchLedger() {
      if (!organizationId) return;
      setLoading(true);
      const res = await fetch(
        `/api/stock?action=stock-ledger&organizationId=${organizationId}&limit=50`
      );
      const data = await res.json();
      setLedger(data);
      setLoading(false);
    }
    fetchLedger();
  }, [organizationId]);

  return (
    <div
      className="p-3 min-h-screen"
      style={{
        background: "var(--color-background)",
        color: "var(--color-foreground)",
      }}
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
            {/* Ledger/Stock Icon */}
            <svg
              width={32}
              height={32}
              fill="none"
              viewBox="0 0 24 24"
              className="text-[var(--color-primary)]"
              style={{ display: "inline" }}
            >
              <rect x="3" y="7" width="18" height="13" rx="2" fill="currentColor" />
              <path d="M7 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth={1.5} />
            </svg>
            <h1
              className="text-3xl font-bold tracking-tight drop-shadow"
              style={{
                color: "var(--color-card-foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              Inventory Stock Ledger
            </h1>
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-muted-foreground text-base mt-2">
            Track all stock movements and adjustments for your organization.
          </p>
        </div>
      </motion.div>

      {/* Ledger Table */}
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
          <h2 className="text-lg font-semibold">Recent Stock Movements</h2>
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
        ) : ledger.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No stock movements found.
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
                    Warehouse
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Type
                  </th>
                  <th className="py-2 px-2 text-right text-muted-foreground font-medium">
                    Quantity
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Reference
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((item) => (
                  <motion.tr
                    key={item.id}
                    variants={itemVariants}
                    className="border-b hover:bg-[var(--muted)]"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <td className="py-2 px-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-2">
                      {item.product?.name || item.productId}
                    </td>
                    <td className="py-2 px-2">
                      {item.warehouse?.name || item.warehouseId}
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor:
                            item.movementType === "IN"
                              ? "var(--color-chart-3)"
                              : item.movementType === "OUT"
                              ? "var(--color-destructive)"
                              : "var(--color-chart-4)",
                          color: "var(--color-primary-foreground)",
                        }}
                      >
                        {item.movementType}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right">{item.quantity}</td>
                    <td className="py-2 px-2">
                      {item.referenceType} ({item.referenceId})
                    </td>
                    <td className="py-2 px-2">{item.remarks}</td>
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
