"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Package,
  ArrowUp,
  ArrowDown,
  Warehouse,
  ShoppingBag,
  ArrowsClockwise,
  Warning,
  Cube,
} from "@phosphor-icons/react";
import { InventoryCharts } from "@/components/Graphs/Inventory";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type InventorySummary = {
  totalValue: number;
  inventories: any[];
};

type AlertItem = {
  product: { name: string };
  quantity: number;
};

type Warehouse = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  isActive: boolean;
};

type StockTransfer = {
  id: string;
  status: string;
};

type StockAdjustment = {
  id: string;
  adjustmentType: string;
  quantity: number;
  adjustmentDate: string;
  product: { name: string };
};

type StockMovement = {
  id: string;
  productId: string;
  movementType: string;
  quantity: number;
  createdAt: string;
  product?: {
    name: string;
  };
};

export default function InventoryDashboard() {
  const [stockValue, setStockValue] = useState<number>(0);
  const [lowStock, setLowStock] = useState<AlertItem[]>([]);
  const [recentMovements, setRecentMovements] = useState<StockMovement[]>([]);
  const [warehouseCount, setWarehouseCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [outOfStockCount, setOutOfStockCount] = useState<number>(0);
  const [pendingTransfers, setPendingTransfers] = useState<number>(0);
  const [damagedLostCount, setDamagedLostCount] = useState<number>(0);
  const [stockAdjustmentsMonth, setStockAdjustmentsMonth] = useState<number>(0);
  const [inactiveProducts, setInactiveProducts] = useState<number>(0);
  const [topMovingProducts, setTopMovingProducts] = useState<
    { name: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Get organizationId from localStorage
  const [organizationId, setOrganizationId] = useState<string>("");

  useEffect(() => {
    // Get organizationId from localStorage
    if (typeof window !== "undefined") {
      const storedOrgId = localStorage.getItem("organizationId");
      if (storedOrgId) {
        setOrganizationId(storedOrgId);
      }
    }
  }, []);

  // Animation variants
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

  useEffect(() => {
    async function fetchData() {
      if (!organizationId) return;
      setLoading(true);

      try {
        // Stock Valuation
        const valueRes = await fetch(
          `/api/stock?action=reports-stock-valuation&organizationId=${organizationId}`
        );
        const valueData: InventorySummary = await valueRes.json();
        setStockValue(valueData.totalValue);

        // Low Stock Alerts
        const alertRes = await fetch(
          `/api/stock?action=inventory-alerts&organizationId=${organizationId}`
        );
        const alertData: AlertItem[] = await alertRes.json();
        setLowStock(alertData);

        // Recent Stock Movements
        const movementRes = await fetch(
          `/api/stock?action=stock-ledger&organizationId=${organizationId}&limit=5`
        );
        const movementData = await movementRes.json();
        setRecentMovements(movementData);

        // Warehouses count
        const warehouseRes = await fetch(
          `/api/stock?action=warehouses&organizationId=${organizationId}`
        );
        const warehouses: Warehouse[] = await warehouseRes.json();
        setWarehouseCount(warehouses.length);

        // Products count & inactive products
        const productRes = await fetch(
          `/api/master/product?organizationId=${organizationId}`
        );
        let products = await productRes.json();
        if (!Array.isArray(products)) {
          // If the API returns { data: [...] } or similar, adjust accordingly:
          products = products.data || [];
        }
        setProductCount(products.length);
        setInactiveProducts(
          products.filter((p: Product) => !p.isActive).length
        );

        // Out-of-stock items
        const inventoryRes = await fetch(
          `/api/stock?action=inventory&organizationId=${organizationId}`
        );
        const inventories = await inventoryRes.json();
        setOutOfStockCount(
          inventories.filter((inv: any) => inv.quantity === 0).length
        );

        // Pending Stock Transfers
        const transferRes = await fetch(
          `/api/stock?action=stock-transfer&organizationId=${organizationId}&status=PENDING`
        );
        const transfers: StockTransfer[] = await transferRes.json();
        setPendingTransfers(transfers.length);

        // Damaged/Lost Stock Adjustments
        const damageRes = await fetch(
          `/api/stock?action=stock-adjustments&organizationId=${organizationId}&adjustmentType=DAMAGE`
        );
        const lostRes = await fetch(
          `/api/stock?action=stock-adjustments&organizationId=${organizationId}&adjustmentType=THEFT`
        );
        const damageAdjustments: StockAdjustment[] = await damageRes.json();
        const lostAdjustments: StockAdjustment[] = await lostRes.json();
        setDamagedLostCount(damageAdjustments.length + lostAdjustments.length);

        // Stock Adjustments This Month
        const now = new Date();
        const monthStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        ).toISOString();
        const monthEnd = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        ).toISOString();
        const monthAdjRes = await fetch(
          `/api/stock?action=stock-adjustments&organizationId=${organizationId}`
        );
        const monthAdjustments: StockAdjustment[] = await monthAdjRes.json();
        const monthCount = monthAdjustments.filter(
          (adj) =>
            adj.adjustmentDate >= monthStart && adj.adjustmentDate <= monthEnd
        ).length;
        setStockAdjustmentsMonth(monthCount);

        // Top Moving Products (by movement count)
        const ledgerRes = await fetch(
          `/api/stock?action=stock-ledger&organizationId=${organizationId}`
        );
        const ledgerData = await ledgerRes.json();
        const movementMap: Record<string, { name: string; count: number }> = {};
        ledgerData.forEach((move: any) => {
          if (!movementMap[move.productId]) {
            movementMap[move.productId] = {
              name: move.product?.name || move.productId,
              count: 0,
            };
          }
          movementMap[move.productId].count += 1;
        });
        const topMovers = Object.values(movementMap)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopMovingProducts(topMovers);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [organizationId]);

  // Prepare chart data
  const stockDistribution = {
    inStock:
      productCount - lowStock.length - outOfStockCount - damagedLostCount,
    lowStock: lowStock.length,
    outOfStock: outOfStockCount,
    damagedLost: damagedLostCount,
  };

  return (
    <div className="p-0">
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
            <Warehouse
              size={32}
              weight="fill"
              className="text-[var(--color-primary)]"
            />
            <h1
              className="text-3xl font-bold tracking-tight drop-shadow"
              style={{
                color: "var(--color-card-foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              Inventory Dashboard
            </h1>
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-muted-foreground text-base mt-2">
            Overview of your inventory status and key metrics
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="rounded-xl shadow-md p-5 border"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-card-foreground)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-muted-foreground">
              Total Stock Value
            </span>
            <Package
              size={24}
              weight="fill"
              style={{ color: "var(--color-primary)" }}
            />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">
              ₹ {stockValue.toLocaleString()}
            </span>
            <span
              className="flex items-center text-sm"
              style={{ color: "var(--color-chart-3)" }}
            >
              <ArrowUp weight="bold" className="mr-1" />
              Healthy
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl shadow-md p-5 border"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-card-foreground)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-muted-foreground">
              Total Products
            </span>
            <Cube
              size={24}
              weight="fill"
              style={{ color: "var(--color-accent)" }}
            />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">{productCount}</span>
            <span
              className="flex items-center text-sm"
              style={{
                color:
                  inactiveProducts > 0
                    ? "var(--color-chart-4)"
                    : "var(--color-chart-3)",
              }}
            >
              {inactiveProducts > 0 ? (
                <>
                  <ArrowDown weight="bold" className="mr-1" />
                  {inactiveProducts} inactive
                </>
              ) : (
                <>
                  <ArrowUp weight="bold" className="mr-1" />
                  All active
                </>
              )}
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl shadow-md p-5 border"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-card-foreground)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-muted-foreground">
              Total Warehouses
            </span>
            <Warehouse
              size={24}
              weight="fill"
              style={{ color: "var(--color-chart-3)" }}
            />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">{warehouseCount}</span>
            <Link
              href="/Inventory-management/warehouses"
              className="text-sm underline"
              style={{ color: "var(--color-primary)" }}
            >
              Manage
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl shadow-md p-5 border"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-card-foreground)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-muted-foreground">
              Stock Issues
            </span>
            <Warning
              size={24}
              weight="fill"
              style={{ color: "var(--color-destructive)" }}
            />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">
              {outOfStockCount + lowStock.length}
            </span>
            <span
              className="flex items-center text-sm"
              style={{ color: "var(--color-destructive)" }}
            >
              {outOfStockCount > 0
                ? `${outOfStockCount} out of stock`
                : "Low stock items"}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions Row */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/Inventory-management/adjustment"
            className="text-center px-3 py-3 rounded-lg text-sm font-medium shadow border transition-colors hover:opacity-90"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-accent-foreground)",
              borderColor: "var(--color-border)",
            }}
          >
            Stock Adjustment
          </Link>
          <Link
            href="/Inventory-management/transfer"
            className="text-center px-3 py-3 rounded-lg text-sm font-medium shadow border transition-colors hover:opacity-90"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-accent-foreground)",
              borderColor: "var(--color-border)",
            }}
          >
            Stock Transfer
          </Link>
          <Link
            href="/Inventory-management/warehouses"
            className="text-center px-3 py-3 rounded-lg text-sm font-medium shadow border transition-colors hover:opacity-90"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-accent-foreground)",
              borderColor: "var(--color-border)",
            }}
          >
            Manage Warehouses
          </Link>
          <Link
            href="/Inventory-management/products"
            className="text-center px-3 py-3 rounded-lg text-sm font-medium shadow border transition-colors hover:opacity-90"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-accent-foreground)",
              borderColor: "var(--color-border)",
            }}
          >
            Manage Products
          </Link>
        </div>
      </div>

      {/* Mid Section: Charts + Stock Issues */}
      <InventoryCharts
        stockDistribution={stockDistribution}
        topMovingProducts={topMovingProducts}
      />

      {/* Bottom Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Stock Movement History */}
        <motion.div
          className="rounded-xl shadow-md p-5 border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-card-foreground)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Stock Movements</h2>
            <ArrowsClockwise
              size={20}
              weight="fill"
              style={{ color: "var(--color-primary)" }}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40 text-muted-foreground">
              Loading...
            </div>
          ) : recentMovements.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No recent movements
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <th className="text-left py-2 text-muted-foreground font-medium text-sm">
                      Product
                    </th>
                    <th className="text-left py-2 text-muted-foreground font-medium text-sm">
                      Type
                    </th>
                    <th className="text-right py-2 text-muted-foreground font-medium text-sm">
                      Quantity
                    </th>
                    <th className="text-right py-2 text-muted-foreground font-medium text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentMovements.map((move, idx) => (
                    <tr
                      key={idx}
                      className="border-b"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <td className="py-3 text-sm">
                        {move.product?.name || move.productId}
                      </td>
                      <td className="py-3 text-sm">
                        <span
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor:
                              move.movementType === "IN"
                                ? "var(--color-chart-3)"
                                : move.movementType === "OUT"
                                ? "var(--color-destructive)"
                                : "var(--color-chart-4)",
                            color: "var(--color-primary-foreground)",
                          }}
                        >
                          {move.movementType}
                        </span>
                      </td>
                      <td className="py-3 text-right text-sm">
                        {move.quantity}
                      </td>
                      <td className="py-3 text-right text-sm">
                        {new Date(move.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 text-right">
            <Link
              href="/Inventory-management/ledger"
              className="text-sm"
              style={{ color: "var(--color-primary)" }}
            >
              View All Movements →
            </Link>
          </div>
        </motion.div>

        {/* Alerts and Quick Actions */}
        <motion.div
          className="rounded-xl shadow-md p-5 border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-card-foreground)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Inventory Alerts</h2>
            <ShoppingBag
              size={20}
              weight="fill"
              style={{ color: "var(--color-destructive)" }}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40 text-muted-foreground">
              Loading...
            </div>
          ) : lowStock.length === 0 ? (
            <div
              className="text-center py-4"
              style={{ color: "var(--color-chart-3)" }}
            >
              All stocks are healthy
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[200px] mb-4">
              <table className="w-full">
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <th className="text-left py-2 text-muted-foreground font-medium text-sm">
                      Product
                    </th>
                    <th className="text-right py-2 text-muted-foreground font-medium text-sm">
                      Current Stock
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <td className="py-3 text-sm">{item.product.name}</td>
                      <td
                        className="py-3 text-right"
                        style={{ color: "var(--color-destructive)" }}
                      >
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Additional Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="rounded-xl shadow-md p-5 border"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-card-foreground)",
          }}
        >
          <div className="text-center mb-1">
            <span className="text-2xl font-bold">{pendingTransfers}</span>
          </div>
          <div className="text-center text-muted-foreground">
            Pending Transfers
          </div>
          {pendingTransfers > 0 && (
            <div className="mt-2 text-center">
              <Link
                href="/Inventory-management/transfer"
                className="text-xs underline"
                style={{ color: "var(--color-primary)" }}
              >
                View Pending
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl shadow-md p-5 border"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-card-foreground)",
          }}
        >
          <div className="text-center mb-1">
            <span className="text-2xl font-bold">{damagedLostCount}</span>
          </div>
          <div className="text-center text-muted-foreground">
            Damaged/Lost Items
          </div>
          {damagedLostCount > 0 && (
            <div className="mt-2 text-center">
              <Link
                href="/Inventory-management/adjustment"
                className="text-xs underline"
                style={{ color: "var(--color-primary)" }}
              >
                View Details
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl shadow-md p-5 border"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-card-foreground)",
          }}
        >
          <div className="text-center mb-1">
            <span className="text-2xl font-bold">{stockAdjustmentsMonth}</span>
          </div>
          <div className="text-center text-muted-foreground">
            Adjustments This Month
          </div>
          <div className="mt-2 text-center">
            <Link
              href="/Inventory-management/adjustment"
              className="text-xs underline"
              style={{ color: "var(--color-primary)" }}
            >
              View History
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
