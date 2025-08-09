"use client";

import React, { useEffect, useState } from "react";
import { PurchaseItem, PurchaseOrder } from "@/types/Purchase";
import PurchaseOrderTable from "@/components/minicomponents/Purchase/PoList";
import { useSession } from "next-auth/react";

export default function PurchasePage() {
  const [form, setForm] = useState<any>({
    invoiceNumber: "",
    supplierInvoiceNumber: "",
    purchaseDate: "",
    supplierId: "",
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    freight: 0,
    otherCharges: 0,
    totalAmount: 0,
    status: "PENDING",
    notes: "",
    items: [],
    createdById: "",
  });
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    const organizationId = localStorage.getItem("organizationId");
    if (!organizationId) return;

    fetch(`/api/master/suppiler?organizationId=${organizationId}`)
      .then((res) => res.json())
      .then(setSuppliers);
  }, []);

  useEffect(() => {
    const organizationId = localStorage.getItem("organizationId");
    if (!organizationId) return;

    // Fetch products
    fetch(`/api/master/product?organizationId=${organizationId}`)
      .then((res) => res.json())
      .then(setProducts);

    // Fetch warehouses
    fetch(`/api/stock?action=warehouses&organizationId=${organizationId}`)
      .then((res) => res.json())
      .then(setWarehouses);
  }, []);

  // Fetch all purchase orders
  const fetchPOs = async () => {
    const organizationId = localStorage.getItem("organizationId");
    if (!organizationId) return;
    setLoading(true);
    const res = await fetch(`/api/purchase?organizationId=${organizationId}`);
    const data = await res.json();
    setPurchaseOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPOs();
  }, []);

  // Auto-calculate subtotal, taxes, and totalAmount
  useEffect(() => {
    const subtotal = form.items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.quantity) * Number(item.rate),
      0
    );
    const totalGST = form.items.reduce(
      (sum: number, item: any) => sum + Number(item.gstAmount || 0),
      0
    );
    // Example: Split GST equally between CGST and SGST if IGST is not used
    const cgst = totalGST / 2;
    const sgst = totalGST / 2;
    const igst = 0; // Adjust as per your business logic

    const totalAmount =
      subtotal +
      (Number(form.freight) || 0) +
      (Number(form.otherCharges) || 0) +
      cgst +
      sgst +
      igst;

    setForm((prev: any) => ({
      ...prev,
      subtotal,
      cgst,
      sgst,
      igst,
      totalAmount,
    }));
  }, [form.items, form.freight, form.otherCharges]);

  // Handle form input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle PO creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const organizationId = localStorage.getItem("organizationId");
    if (!organizationId) {
      alert("Organization ID not found in localStorage.");
      return;
    }
     if (!session?.user?.id) {
    alert("User not authenticated.");
    return;
  }
    setLoading(true);
    const res = await fetch("/api/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, organizationId, createdById: session.user.id }),
    });
    if (res.ok) {
      setForm({
        invoiceNumber: "",
        supplierInvoiceNumber: "",
        purchaseDate: "",
        supplierId: "",
        subtotal: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        freight: 0,
        otherCharges: 0,
        totalAmount: 0,
        status: "PENDING",
        notes: "",
        items: [],
        createdById: "",
      });
      fetchPOs();
    } else {
      alert("Failed to create purchase order");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-1 space-y-8">
      <div className="bg-card rounded-lg  p-1">
        <h2 className="text-2xl font-bold text-card-foreground mb-6">
          Create Purchase Order
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Invoice Number *
                </label>
                <input
                  name="invoiceNumber"
                  placeholder="Enter invoice number"
                  value={form.invoiceNumber}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Supplier ID *
                </label>
                <select
                  name="supplierId"
                  value={form.supplierId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.gstin ? `(${s.gstin})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Purchase Date *
                </label>
                <input
                  name="purchaseDate"
                  type="date"
                  value={form.purchaseDate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Supplier Invoice
                </label>
                <input
                  name="supplierInvoiceNumber"
                  placeholder="Enter supplier invoice"
                  value={form.supplierInvoiceNumber}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Order Items
            </h3>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="grid grid-cols-8 gap-4 mb-2 text-sm font-medium text-muted-foreground">
                  <div className="col-span-2">Product</div>
                  <div>Quantity</div>
                  <div>Rate</div>
                  <div>Amount</div>
                  <div>GST</div>
                  <div>Warehouse</div>
                  <div></div>
                </div>
                {form.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="grid grid-cols-8 gap-4 items-center py-2"
                  >
                    <div className="col-span-2">
                      <select
                        name="productId"
                        value={item.productId}
                        onChange={(e) => {
                          const items = [...form.items];
                          items[idx].productId = e.target.value;

                          // Optionally auto-fill rate and gstAmount from selected product
                          const selectedProduct = products.find(
                            (p) => p.id === e.target.value
                          );
                          if (selectedProduct) {
                            items[idx].rate = selectedProduct.retailRate || 0;
                            items[idx].gstAmount =
                              ((selectedProduct.gstPercentage || 0) *
                                items[idx].rate *
                                items[idx].quantity) /
                              100;
                          }
                          items[idx].amount =
                            items[idx].quantity * items[idx].rate;
                          setForm({ ...form, items });
                        }}
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        name="quantity"
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => {
                          const items = [...form.items];
                          items[idx].quantity = Number(e.target.value);
                          items[idx].amount =
                            Number(e.target.value) * Number(items[idx].rate);
                          setForm({ ...form, items });
                        }}
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <input
                        name="rate"
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => {
                          const items = [...form.items];
                          items[idx].rate = Number(e.target.value);
                          items[idx].amount =
                            Number(items[idx].quantity) *
                            Number(e.target.value);
                          setForm({ ...form, items });
                        }}
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <input
                        name="amount"
                        type="number"
                        placeholder="Amount"
                        value={item.amount}
                        readOnly
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <input
                        name="gstAmount"
                        type="number"
                        placeholder="GST"
                        value={item.gstAmount}
                        onChange={(e) => {
                          const items = [...form.items];
                          items[idx].gstAmount = Number(e.target.value);
                          setForm({ ...form, items });
                        }}
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <select
                        name="warehouseId"
                        value={item.warehouseId || ""}
                        onChange={(e) => {
                          const items = [...form.items];
                          items[idx].warehouseId = e.target.value;
                          setForm({ ...form, items });
                        }}
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                        required
                      >
                        <option value="">Select Warehouse</option>
                        {warehouses.map((wh) => (
                          <option key={wh.id} value={wh.id}>
                            {wh.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-destructive/10 text-destructive"
                        onClick={() => {
                          const items = form.items.filter(
                            (_: any, i: number) => i !== idx
                          );
                          setForm({ ...form, items });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors"
                onClick={() =>
                  setForm({
                    ...form,
                    items: [
                      ...form.items,
                      {
                        productId: "",
                        quantity: 1,
                        rate: 0,
                        amount: 0,
                        gstAmount: 0,
                        warehouseId: "",
                      },
                    ],
                  })
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Item
              </button>
            </div>
          </div>

          {/* Charges & Totals Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Charges & Totals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Subtotal
                </label>
                <input
                  name="subtotal"
                  type="number"
                  value={form.subtotal}
                  readOnly
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  CGST
                </label>
                <input
                  name="cgst"
                  type="number"
                  value={form.cgst}
                  readOnly
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  SGST
                </label>
                <input
                  name="sgst"
                  type="number"
                  value={form.sgst}
                  readOnly
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  IGST
                </label>
                <input
                  name="igst"
                  type="number"
                  value={form.igst}
                  readOnly
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Freight
                </label>
                <input
                  name="freight"
                  type="number"
                  placeholder="0.00"
                  value={form.freight}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Other Charges
                </label>
                <input
                  name="otherCharges"
                  type="number"
                  placeholder="0.00"
                  value={form.otherCharges}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </label>
                <input
                  name="totalAmount"
                  type="number"
                  value={form.totalAmount}
                  readOnly
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Additional Information
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Notes
              </label>
              <textarea
                name="notes"
                placeholder="Add any additional notes or remarks"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Create Purchase Order"
              )}
            </button>
          </div>
        </form>
      </div>

      <PurchaseOrderTable purchaseOrders={purchaseOrders} loading={loading} />
    </div>
  );
}
