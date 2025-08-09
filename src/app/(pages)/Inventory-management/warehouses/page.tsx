"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, PencilSimple, Trash, Warehouse as WarehouseIcon } from "@phosphor-icons/react";

type Warehouse = {
  id: string;
  name: string;
  address?: string;
  isDefault?: boolean;
  isActive?: boolean;
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

export default function ManageWarehousesPage() {
  const [organizationId, setOrganizationId] = useState<string>("");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    address: "",
    isDefault: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrgId = localStorage.getItem("organizationId");
      if (storedOrgId) setOrganizationId(storedOrgId);
    }
  }, []);

  const fetchWarehouses = async () => {
    if (!organizationId) return;
    setLoading(true);
    const res = await fetch(`/api/stock?action=warehouses&organizationId=${organizationId}`);
    const data = await res.json();
    setWarehouses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWarehouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, submitting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    if (!form.name) {
      setErrorMsg("Warehouse name is required.");
      setSubmitting(false);
      return;
    }
    try {
      let res;
      if (editingId) {
        res = await fetch("/api/stock", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "warehouse-update",
            id: editingId,
            name: form.name,
            address: form.address,
            isDefault: form.isDefault,
          }),
        });
      } else {
        res = await fetch("/api/stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "warehouse-create",
            organizationId,
            name: form.name,
            address: form.address,
            isDefault: form.isDefault,
          }),
        });
      }
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setSuccessMsg(editingId ? "Warehouse updated!" : "Warehouse created!");
      setForm({ name: "", address: "", isDefault: false });
      setEditingId(null);
      fetchWarehouses();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save warehouse.");
    }
    setSubmitting(false);
  };

  const handleEdit = (wh: Warehouse) => {
    setEditingId(wh.id);
    setForm({
      name: wh.name,
      address: wh.address || "",
      isDefault: !!wh.isDefault,
    });
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this warehouse?")) return;
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/stock", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "warehouse-delete",
          id,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setSuccessMsg("Warehouse deleted!");
      fetchWarehouses();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete warehouse.");
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
            <WarehouseIcon size={32} weight="fill" className="text-[var(--color-primary)]" />
            <h1
              className="text-3xl font-bold tracking-tight drop-shadow"
              style={{
                color: "var(--color-card-foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              Manage Warehouses
            </h1>
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-muted-foreground text-base mt-2">
            Add, edit, or remove warehouses for your organization.
          </p>
        </div>
      </motion.div>

      {/* Warehouse Form */}
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Warehouse Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
              style={{
                background: "var(--color-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-card-foreground)",
              }}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
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
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              id="isDefault"
              className="mr-2"
            />
            <label htmlFor="isDefault" className="text-sm">Default Warehouse</label>
          </div>
          <div className="md:col-span-3 flex items-center gap-4 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 rounded bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-semibold shadow"
            >
              <Plus size={18} />
              {editingId ? "Update" : "Add"} Warehouse
            </button>
            {editingId && (
              <button
                type="button"
                className="px-3 py-2 rounded bg-[var(--color-muted)] text-[var(--color-card-foreground)] text-sm"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", address: "", isDefault: false });
                  setSuccessMsg("");
                  setErrorMsg("");
                }}
              >
                Cancel
              </button>
            )}
            {successMsg && (
              <span className="text-green-600 text-sm">{successMsg}</span>
            )}
            {errorMsg && (
              <span className="text-red-600 text-sm">{errorMsg}</span>
            )}
          </div>
        </form>
      </motion.div>

      {/* Warehouses Table */}
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
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <WarehouseIcon size={22} weight="fill" style={{ color: "var(--color-chart-3)" }} />
            Warehouses
          </h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground">
            Loading...
          </div>
        ) : warehouses.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No warehouses found.
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
                    Name
                  </th>
                  <th className="py-2 px-2 text-left text-muted-foreground font-medium">
                    Address
                  </th>
                  <th className="py-2 px-2 text-center text-muted-foreground font-medium">
                    Default
                  </th>
                  <th className="py-2 px-2 text-center text-muted-foreground font-medium">
                    Active
                  </th>
                  <th className="py-2 px-2 text-center text-muted-foreground font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((wh) => (
                  <motion.tr
                    key={wh.id}
                    variants={itemVariants}
                    className="border-b hover:bg-[var(--muted)]"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <td className="py-2 px-2">{wh.name}</td>
                    <td className="py-2 px-2">{wh.address || "-"}</td>
                    <td className="py-2 px-2 text-center">
                      {wh.isDefault ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-chart-3)] text-[var(--color-primary-foreground)]">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-muted)] text-[var(--color-card-foreground)]">
                          No
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {wh.isActive !== false ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-chart-3)] text-[var(--color-primary-foreground)]">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)]">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center flex gap-2 justify-center">
                      <button
                        className="p-1 rounded hover:bg-[var(--color-muted)]"
                        title="Edit"
                        onClick={() => handleEdit(wh)}
                      >
                        <PencilSimple size={18} />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-[var(--color-muted)]"
                        title="Delete"
                        onClick={() => handleDelete(wh.id)}
                        disabled={submitting}
                      >
                        <Trash size={18} color="var(--color-destructive)" />
                      </button>
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