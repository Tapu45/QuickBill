"use client";

import React, { useEffect, useState } from "react";

type Supplier = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gstin?: string;
  stateCode?: string;
  isActive?: boolean;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstin: "",
    stateCode: "",
    isActive: true,
  });

  // Fetch suppliers
  const fetchSuppliers = async () => {
    setLoading(true);
    const organizationId = localStorage.getItem("organizationId");
    const res = await fetch(`/api/master/suppiler?organizationId=${organizationId}`);
    const data = await res.json();
    setSuppliers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const organizationId = localStorage.getItem("organizationId");
    if (!form.name || !organizationId) {
      alert("Supplier name and organization are required.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/master/suppiler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, organizationId }),
    });
    if (res.ok) {
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        gstin: "",
        stateCode: "",
        isActive: true,
      });
      setShowForm(false);
      fetchSuppliers();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to add supplier");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Suppliers</h2>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Close" : "Add Supplier"}
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Add Supplier</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                GSTIN
              </label>
              <input
                name="gstin"
                value={form.gstin}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                State Code
              </label>
              <input
                name="stateCode"
                value={form.stateCode}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleChange}
                className="rounded border-input"
              />
              <label className="text-sm font-medium text-muted-foreground">
                Active
              </label>
            </div>
            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Supplier"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-card-foreground">Supplier List</h3>
        {loading ? (
          <div className="text-muted-foreground py-8 text-center">Loading...</div>
        ) : suppliers.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">No suppliers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">GSTIN</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">State Code</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/50">
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">{s.email || "-"}</td>
                    <td className="px-4 py-2">{s.phone || "-"}</td>
                    <td className="px-4 py-2">{s.gstin || "-"}</td>
                    <td className="px-4 py-2">{s.stateCode || "-"}</td>
                    <td className="px-4 py-2">
                      {s.isActive ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs">Yes</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}