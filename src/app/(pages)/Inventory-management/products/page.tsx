"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react";

type Product = {
  id: string;
  name: string;
  code: string;
  category?: string;
  isActive?: boolean;
};

type Warehouse = {
  id: string;
  name: string;
};

type InventoryItem = {
  id: string;
  productId: string;
  warehouseId: string;
  organizationId: string;
  quantity: number;
  avgCostPrice: number;
  lastUpdated: string;
  product?: Product;
  warehouse?: Warehouse;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

export default function InventoryProductsPage() {
  const [organizationId, setOrganizationId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<"" | "active" | "inactive">("");
  const [productFilter, setProductFilter] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrgId = localStorage.getItem("organizationId");
      if (storedOrgId) setOrganizationId(storedOrgId);
    }
  }, []);

  // Fetch all master data
  useEffect(() => {
    if (!organizationId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/master/product?organizationId=${organizationId}`).then((r) => r.json()),
      fetch(`/api/stock?action=warehouses&organizationId=${organizationId}`).then((r) => r.json()),
      fetch(`/api/stock?action=inventory&organizationId=${organizationId}`).then((r) => r.json()),
    ]).then(([products, warehouses, inventory]) => {
      setProducts(products);
      setWarehouses(warehouses);
      setInventory(inventory);
      setLoading(false);
    });
  }, [organizationId]);

  // Filtered inventory
  const filteredInventory = inventory
    .filter((item) => {
      // Filter by warehouse
      if (warehouseFilter && item.warehouseId !== warehouseFilter) return false;
      // Filter by product
      if (productFilter && item.productId !== productFilter) return false;
      // Filter by active/inactive
      const prod = products.find((p) => p.id === item.productId);
      if (activeFilter === "active" && prod && prod.isActive === false) return false;
      if (activeFilter === "inactive" && prod && prod.isActive !== false) return false;
      // Filter by search
      if (search) {
        const prodName = prod?.name?.toLowerCase() || "";
        const prodCode = prod?.code?.toLowerCase() || "";
        if (
          !prodName.includes(search.toLowerCase()) &&
          !prodCode.includes(search.toLowerCase())
        )
          return false;
      }
      return true;
    })
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
      warehouse: warehouses.find((w) => w.id === item.warehouseId),
    }));

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
            {/* Product/Inventory Icon */}
            <svg
              width={32}
              height={32}
              fill="none"
              viewBox="0 0 24 24"
              className="text-[var(--color-primary)]"
              style={{ display: "inline" }}
            >
              <rect x="4" y="7" width="16" height="13" rx="2" fill="currentColor" />
              <rect x="8" y="3" width="8" height="4" rx="1" fill="currentColor" opacity="0.7" />
            </svg>
            <h1
              className="text-3xl font-bold tracking-tight drop-shadow"
              style={{
                color: "var(--color-card-foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              Inventory by Product
            </h1>
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-muted-foreground text-base mt-2">
            View and filter inventory across all products and warehouses.
          </p>
        </div>
      </motion.div>

      {/* Filters */}
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
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Search product name or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border px-3 py-2"
              style={{
                background: "var(--color-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-card-foreground)",
              }}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-1/4">
            <FunnelSimple size={20} />
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="w-full rounded border px-3 py-2"
              style={{
                background: "var(--color-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-card-foreground)",
              }}
            >
              <option value="">All Warehouses</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-1/4">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as any)}
              className="w-full rounded border px-3 py-2"
              style={{
                background: "var(--color-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-card-foreground)",
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active Products</option>
              <option value="inactive">Inactive Products</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-1/4">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full rounded border px-3 py-2"
              style={{
                background: "var(--color-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-card-foreground)",
              }}
            >
              <option value="">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Inventory Table */}
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
          <h2 className="text-lg font-semibold">Product Inventory Details</h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground">
            Loading...
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No inventory records found.
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
                    Product
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Code
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Warehouse
                  </th>
                  <th className="py-2 px-2 text-right text-muted-foreground font-medium">
                    Quantity
                  </th>
                  <th className="py-2 px-2 text-right text-muted-foreground font-medium">
                    Avg. Cost Price
                  </th>
                  <th className="py-2 px-2 text-right text-muted-foreground font-medium">
                    Value
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <motion.tr
                    key={item.id}
                    variants={itemVariants}
                    className="border-b hover:bg-[var(--muted)]"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <td className="py-2 px-2">{item.product?.name || item.productId}</td>
                    <td className="py-2 px-2">{item.product?.code || "-"}</td>
                    <td className="py-2 px-2">{item.warehouse?.name || item.warehouseId}</td>
                    <td className="py-2 px-2 text-right">{item.quantity}</td>
                    <td className="py-2 px-2 text-right">
                      ₹{item.avgCostPrice?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-2 text-right">
                      ₹{(item.quantity * item.avgCostPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-2">
                      {item.product?.isActive !== false ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-chart-3)] text-[var(--color-primary-foreground)]">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)]">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      {item.lastUpdated
                        ? new Date(item.lastUpdated).toLocaleString()
                        : "-"}
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