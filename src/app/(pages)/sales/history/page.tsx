"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sale } from "@/types/Sales";
import { printSaleDetails, printSalesTable } from "@/utils/print";

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handlePrintTable = printSalesTable;
  const handlePrintModal = () => {
    if (selectedSale)
      printSaleDetails(selectedSale.id, selectedSale.invoiceNumber);
  };

 useEffect(() => {
  if (typeof window !== "undefined") {
    const orgId = localStorage.getItem("organizationId");
    setOrganizationId(orgId);
  }
}, []);

  useEffect(() => {
    if (!organizationId) return;
    async function fetchSales() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("organizationId", organizationId!);
        if (invoiceSearch) params.append("invoiceNumber", invoiceSearch);
        if (dateFrom) params.append("dateFrom", dateFrom);
        if (dateTo) params.append("dateTo", dateTo);

        const res = await fetch(`/api/sales?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setSales(data.sales);
        } else {
          setError(data.error || "Failed to fetch sales");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, [organizationId, invoiceSearch, dateFrom, dateTo]);

  return (
    <div
      className="max-w-7xl mx-auto py-0 px-4"
      style={{
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-10 rounded bg-[var(--color-primary)] shadow"
            aria-hidden="true"
          />
          <div className="flex items-center gap-2">
            {/* Book/History Icon */}
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              className="text-[var(--color-primary)]"
            >
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M8 9h8M8 13h5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <h1
              className="text-3xl font-bold tracking-tight drop-shadow"
              style={{
                color: "var(--color-card-foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              Sales History
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="px-5 py-2 rounded-xl font-semibold transition-colors border shadow
              bg-[var(--color-accent)] text-[var(--color-accent-foreground)]
              hover:bg-[var(--color-accent)]/90 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onClick={handlePrintTable}
         
            title="Export (coming soon)"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block"
              style={{ color: "var(--color-accent-foreground)" }}
            >
              <path
                d="M12 16v-8M8 12l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="3"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
            Export
          </button>
          <Link
            href="/sales"
            className="px-5 py-2 rounded-xl font-semibold transition-colors border shadow
              bg-[var(--color-primary)] text-[var(--color-primary-foreground)]
              hover:bg-[var(--color-primary)]/90 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block"
              style={{ color: "var(--color-primary-foreground)" }}
            >
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Sales
          </Link>
        </div>
      </div>

      {/* Unified Filters + Table Card */}
      <div
        className="rounded-xl shadow-lg border mb-8"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
          color: "var(--color-card-foreground)",
        }}
      >
        {/* Filters */}
        <div
          className="flex flex-wrap gap-4 items-end bg-[var(--color-muted)] rounded-t-xl px-6 py-4 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex flex-col">
            <label
              className="block text-xs font-semibold mb-1 uppercase tracking-wide"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              Invoice No.
            </label>
            <input
              type="text"
              value={invoiceSearch}
              onChange={(e) => setInvoiceSearch(e.target.value)}
              placeholder="Search by invoice number"
              className="px-4 py-2 rounded-lg border outline-none bg-[var(--color-card)] text-[var(--color-card-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] transition"
              style={{ borderColor: "var(--color-border)", minWidth: 180 }}
            />
          </div>
          <div className="flex flex-col">
            <label
              className="block text-xs font-semibold mb-1 uppercase tracking-wide"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2 rounded-lg border outline-none bg-[var(--color-card)] text-[var(--color-card-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] transition"
              style={{ borderColor: "var(--color-border)", minWidth: 150 }}
            />
          </div>
          <div className="flex flex-col">
            <label
              className="block text-xs font-semibold mb-1 uppercase tracking-wide"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2 rounded-lg border outline-none bg-[var(--color-card)] text-[var(--color-card-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] transition"
              style={{ borderColor: "var(--color-border)", minWidth: 150 }}
            />
          </div>
          <div className="flex-1 flex justify-end">
            <button
              className="px-5 py-2 rounded-xl font-semibold transition-colors border shadow
              bg-[var(--color-accent)] text-[var(--color-accent-foreground)]
              hover:bg-[var(--color-accent)]/90 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
              style={{ minWidth: 120 }}
              onClick={() => {
                setInvoiceSearch("");
                setDateFrom("");
                setDateTo("");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        {!organizationId && (
          <div className="text-red-500 mb-4 p-6">
            Organization ID not found.
          </div>
        )}
        {loading && organizationId && (
          <div className="p-6 text-[var(--color-muted-foreground)]">
            Loading...
          </div>
        )}
        {error && <div className="text-red-500 mb-4 p-6">{error}</div>}
        {!loading && !error && organizationId && (
          <div className="overflow-x-auto">
            <table
              id="sales-history-table"
              className="min-w-full rounded-xl overflow-hidden shadow border"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
                color: "var(--color-card-foreground)",
              }}
            >
              <thead style={{ background: "var(--color-muted)" }}>
                <tr>
                  <th
                    className="px-4 py-3 text-left font-semibold align-middle"
                    style={{
                      background: "var(--color-muted)",
                      color: "var(--color-muted-foreground)",
                      verticalAlign: "middle",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Invoice #
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold align-middle"
                    style={{
                      background: "var(--color-muted)",
                      color: "var(--color-muted-foreground)",
                      verticalAlign: "middle",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Date
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold align-middle"
                    style={{
                      background: "var(--color-muted)",
                      color: "var(--color-muted-foreground)",
                      verticalAlign: "middle",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Customer
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold align-middle"
                    style={{
                      background: "var(--color-muted)",
                      color: "var(--color-muted-foreground)",
                      verticalAlign: "middle",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold align-middle"
                    style={{
                      background: "var(--color-muted)",
                      color: "var(--color-muted-foreground)",
                      verticalAlign: "middle",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Payment Status
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold align-middle"
                    style={{
                      background: "var(--color-muted)",
                      color: "var(--color-muted-foreground)",
                      verticalAlign: "middle",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-[var(--color-muted-foreground)]"
                    >
                      No sales found.
                    </td>
                  </tr>
                )}
                {sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-[var(--color-muted)] transition"
                  >
                    <td
                      className="py-3 px-4 border-b"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      {sale.invoiceNumber}
                    </td>
                    <td
                      className="py-3 px-4 border-b"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </td>
                    <td
                      className="py-3 px-4 border-b"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      {sale.customerName || "-"}
                    </td>
                    <td
                      className="py-3 px-4 border-b font-semibold"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      ₹{sale.totalAmount.toFixed(2)}
                    </td>
                    <td
                      className="py-3 px-4 border-b"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium`}
                        style={{
                          background:
                            sale.paymentStatus === "Paid"
                              ? "var(--color-chart-3)"
                              : sale.paymentStatus === "Partial"
                              ? "var(--color-accent)"
                              : "var(--color-muted)",
                          color:
                            sale.paymentStatus === "Paid"
                              ? "var(--color-card-foreground)"
                              : sale.paymentStatus === "Partial"
                              ? "var(--color-accent-foreground)"
                              : "var(--color-muted-foreground)",
                        }}
                      >
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td
                      className="py-3 px-4 border-b"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <button
                        className="px-4 py-1 rounded-lg font-medium bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary)]/90 transition cursor-pointer"
                        onClick={() => setSelectedSale(sale)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setSelectedSale(null)}
        >
          <div
            id={`sale-details-modal-${selectedSale?.id}`}
            className="bg-[var(--color-card)] rounded-2xl shadow-2xl border p-8 max-w-3xl w-full relative animate-in fade-in zoom-in"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-card-foreground)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-2xl text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition cursor-pointer"
              onClick={() => setSelectedSale(null)}
              aria-label="Close"
            >
              {/* Phosphor X Icon */}
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              {/* Phosphor Receipt Icon */}
              <svg
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                className="text-[var(--color-primary)]"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M8 9h8M8 13h5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ color: "var(--color-primary)" }}
              >
                Sale Details
              </h2>
            </div>
            {/* Main Info */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* Phosphor NumberCircleIcon */}
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-[var(--color-muted-foreground)]"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <text
                      x="12"
                      y="16"
                      textAnchor="middle"
                      fontSize="12"
                      fill="currentColor"
                    >
                      {selectedSale.invoiceNumber}
                    </text>
                  </svg>
                  <span className="font-semibold text-[var(--color-muted-foreground)]">
                    Invoice #
                  </span>
                  <span className="ml-1">{selectedSale.invoiceNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Phosphor CalendarBlank */}
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-[var(--color-muted-foreground)]"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M16 3v4M8 3v4M3 9h18"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="font-semibold text-[var(--color-muted-foreground)]">
                    Date
                  </span>
                  <span className="ml-1">
                    {new Date(selectedSale.saleDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Phosphor User */}
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-[var(--color-muted-foreground)]"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="font-semibold text-[var(--color-muted-foreground)]">
                    Customer
                  </span>
                  <span className="ml-1">
                    {selectedSale.customerName || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Phosphor Phone */}
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-[var(--color-muted-foreground)]"
                  >
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.06.73 3.03a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.97.36 1.98.6 3.03.73A2 2 0 0 1 22 16.92z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="font-semibold text-[var(--color-muted-foreground)]">
                    Phone
                  </span>
                  <span className="ml-1">
                    {selectedSale.customerPhone || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Phosphor MapPin */}
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-[var(--color-muted-foreground)]"
                  >
                    <path
                      d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="11"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="font-semibold text-[var(--color-muted-foreground)]">
                    Address
                  </span>
                  <span className="ml-1">
                    {selectedSale.customerAddress || "-"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* Phosphor CreditCard */}
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-[var(--color-muted-foreground)]"
                  >
                    <rect
                      x="2"
                      y="5"
                      width="20"
                      height="14"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="font-semibold text-[var(--color-muted-foreground)]">
                    Payment Method
                  </span>
                  <span className="ml-1">
                    {selectedSale.paymentMethod || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Phosphor CheckCircle */}
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-[var(--color-muted-foreground)]"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-semibold text-[var(--color-muted-foreground)]">
                    Payment Status
                  </span>
                  <span className="ml-1">{selectedSale.paymentStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Phosphor NotePencil */}
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-[var(--color-muted-foreground)]"
                  >
                    <path
                      d="M16.862 5.487l1.65 1.65a2 2 0 0 1 0 2.828l-8.485 8.485a2 2 0 0 1-1.414.586H5v-3.613a2 2 0 0 1 .586-1.414l8.485-8.485a2 2 0 0 1 2.828 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="font-semibold text-[var(--color-muted-foreground)]">
                    Notes
                  </span>
                  <span className="ml-1">{selectedSale.notes || "-"}</span>
                </div>
              </div>
            </div>
            {/* Sale Items Table */}
            <div className="mb-6">
              <div className="font-semibold text-[var(--color-muted-foreground)] mb-2 flex items-center gap-2">
                {/* Phosphor ListBullets */}
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-[var(--color-muted-foreground)]"
                >
                  <circle cx="6" cy="7" r="1.5" fill="currentColor" />
                  <circle cx="6" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="6" cy="17" r="1.5" fill="currentColor" />
                  <rect
                    x="10"
                    y="6"
                    width="8"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="10"
                    y="11"
                    width="8"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="10"
                    y="16"
                    width="8"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
                Sale Items
              </div>
              <div
                className="overflow-x-auto rounded-lg border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th
                        className="px-3 py-2 text-left font-semibold"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        Product
                      </th>
                      <th
                        className="px-3 py-2 text-left font-semibold"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        HSN
                      </th>
                      <th
                        className="px-3 py-2 text-left font-semibold"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        Qty
                      </th>
                      <th
                        className="px-3 py-2 text-left font-semibold"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        Rate
                      </th>
                      <th
                        className="px-3 py-2 text-left font-semibold"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        Discount
                      </th>
                      <th
                        className="px-3 py-2 text-left font-semibold"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        GST
                      </th>
                      <th
                        className="px-3 py-2 text-left font-semibold"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items && selectedSale.items.length > 0 ? (
                      selectedSale.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2">
                            {item.product?.name || "-"}
                          </td>
                          <td className="px-3 py-2">
                            {item.product?.hsn || "-"}
                          </td>
                          <td className="px-3 py-2">{item.quantity}</td>
                          <td className="px-3 py-2">₹{item.rate.toFixed(2)}</td>
                          <td className="px-3 py-2">{item.discount}</td>
                          <td className="px-3 py-2">{item.gstAmount}</td>
                          <td className="px-3 py-2">
                            ₹{item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-2 text-[var(--color-muted-foreground)]"
                        >
                          No items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-2">
                {/* Phosphor Calculator */}
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-[var(--color-muted-foreground)]"
                >
                  <rect
                    x="4"
                    y="3"
                    width="16"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="8"
                    y="7"
                    width="8"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                  <circle cx="8.5" cy="13.5" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="13.5" r="1.5" fill="currentColor" />
                  <circle cx="15.5" cy="13.5" r="1.5" fill="currentColor" />
                  <circle cx="8.5" cy="17" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="17" r="1.5" fill="currentColor" />
                  <circle cx="15.5" cy="17" r="1.5" fill="currentColor" />
                </svg>
                <span className="font-semibold text-[var(--color-muted-foreground)]">
                  Subtotal
                </span>
                <span className="ml-1">
                  ₹{selectedSale.subtotal?.toFixed(2) ?? "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Phosphor Percent */}
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-[var(--color-muted-foreground)]"
                >
                  <circle
                    cx="7"
                    cy="17"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="17"
                    cy="7"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="font-semibold text-[var(--color-muted-foreground)]">
                  Discount
                </span>
                <span className="ml-1">
                  ₹{selectedSale.discount?.toFixed(2) ?? "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Phosphor ArrowFatUp */}
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-[var(--color-muted-foreground)]"
                >
                  <path
                    d="M12 19V5M5 12l7-7 7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-semibold text-[var(--color-muted-foreground)]">
                  CGST
                </span>
                <span className="ml-1">
                  ₹{selectedSale.cgst?.toFixed(2) ?? "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Phosphor ArrowFatDown */}
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-[var(--color-muted-foreground)]"
                >
                  <path
                    d="M12 5v14M19 12l-7 7-7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-semibold text-[var(--color-muted-foreground)]">
                  SGST
                </span>
                <span className="ml-1">
                  ₹{selectedSale.sgst?.toFixed(2) ?? "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Phosphor GlobeHemisphereWest */}
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-[var(--color-muted-foreground)]"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M2 12h20" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M12 2a15.3 15.3 0 0 1 0 20"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span className="font-semibold text-[var(--color-muted-foreground)]">
                  IGST
                </span>
                <span className="ml-1">
                  ₹{selectedSale.igst?.toFixed(2) ?? "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Phosphor CurrencyInr */}
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-[var(--color-primary)]"
                >
                  <path
                    d="M6 6h12M6 12h12M6 18h7a5 5 0 0 0 5-5V6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span className="font-semibold text-[var(--color-primary)]">
                  Total
                </span>
                <span className="ml-1 font-bold text-lg text-[var(--color-primary)]">
                  ₹{selectedSale.totalAmount?.toFixed(2) ?? "-"}
                </span>
              </div>
              <button
                className="px-5 py-2 rounded-xl font-semibold transition-colors border shadow
              bg-[var(--color-accent)] text-[var(--color-accent-foreground)]
              hover:bg-[var(--color-accent)]/90 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onClick={handlePrintModal}
               
                title="Export (coming soon)"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block"
                  style={{ color: "var(--color-accent-foreground)" }}
                >
                  <path
                    d="M12 16v-8M8 12l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
