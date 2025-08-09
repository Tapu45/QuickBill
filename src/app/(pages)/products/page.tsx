"use client";
import type React from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PencilSimple,
  Trash,
  Plus,
  X,
  Eye,
  Barcode,
  Tag,
  Cube,
  IdentificationCard,
  Percent,
  Scales,
  CurrencyDollar,
  DotsThreeOutline,
  Package,
} from "@phosphor-icons/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { Product } from "@/types/Product";
import ProductForm from "@/components/Form/ProductForm";

const API_URL = "/api/master/product";

interface ColumnMeta {
  title: string;
}

const fetchProducts = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

const ProductPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch products with TanStack Query
  const {
    data: products = [],
    isLoading: loading,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Mutations for add/update/delete
  const addOrUpdateProduct = useMutation({
    mutationFn: async (data: {
      form: Partial<Product>;
      editingId: string | null;
    }) => {
      const method = data.editingId ? "PUT" : "POST";
      const url = data.editingId ? `${API_URL}?id=${data.editingId}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.form),
      });
      if (!res.ok) throw new Error("Error saving product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowForm(false);
      setForm({});
      setEditingId(null);
    },
    onError: () => setError("Error saving product"),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error deleting product");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    onError: () => setError("Error deleting product"),
  });

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    addOrUpdateProduct.mutate({ form, editingId });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this product?")) return;
    setError(null);
    deleteProduct.mutate(id);
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleNew = () => {
    setForm({});
    setEditingId(null);
    setShowForm(true);
  };

  const handleViewDetails = async (id: string) => {
    setViewLoading(true);
    setViewProduct(null);
    try {
      const res = await fetch(`${API_URL}?id=${id}`);
      const data = await res.json();
      setViewProduct(Array.isArray(data) ? data[0] : data);
    } catch {
      setViewProduct(null);
    }
    setViewLoading(false);
  };

  const closeDetails = () => setViewProduct(null);

  // TanStack Table setup with fixed headers and alignment
  const columns = useMemo(
    () => [
      {
        accessorKey: "image",
        header: () => (
          <div className="flex items-center gap-2">
            <Cube size={16} />
            <span>Image</span>
          </div>
        ),
        meta: { title: "Image" },
        cell: ({
          row,
        }: {
          row: import("@tanstack/react-table").Row<Product>;
        }) =>
          row.original.image ? (
            <img
              src={row.original.image || "/placeholder.svg"}
              alt={row.original.name}
              className="w-12 h-12 object-cover rounded shadow"
              style={{ background: "var(--color-muted)" }}
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded bg-[var(--color-muted)] text-xs text-[var(--color-muted-foreground)]">
              N/A
            </div>
          ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "code",
        header: () => (
          <div className="flex items-center gap-2">
            <Barcode size={16} />
            <span>Code</span>
          </div>
        ),
        meta: { title: "Code" } as ColumnMeta,
        cell: ({ getValue }: any) => (
          <div className="text-left">{getValue()}</div>
        ),
      },
      {
        accessorKey: "name",
        header: () => (
          <div className="flex items-center gap-2">
            <Tag size={16} />
            <span>Name</span>
          </div>
        ),
        meta: { title: "Name" },
        cell: ({ getValue }: any) => (
          <div className="text-left font-medium">{getValue()}</div>
        ),
      },
      {
        accessorKey: "hsnCode",
        header: () => (
          <div className="flex items-center gap-2">
            <IdentificationCard size={16} />
            <span>HSN Code</span>
          </div>
        ),
        meta: { title: "HSN Code" },
        cell: ({ getValue }: any) => (
          <div className="text-left">{getValue()}</div>
        ),
      },
      {
        accessorKey: "gstPercentage",
        header: () => (
          <div className="flex items-center gap-2">
            <Percent size={16} />
            <span>GST %</span>
          </div>
        ),
        meta: { title: "GST %" },
        cell: ({ getValue }: any) => (
          <div className="text-right">{getValue()}%</div>
        ),
      },
      {
        accessorKey: "unit",
        header: () => (
          <div className="flex items-center gap-2">
            <Scales size={16} />
            <span>Unit</span>
          </div>
        ),
        meta: { title: "Unit" },
        cell: ({ getValue }: any) => (
          <div className="text-left">{getValue()}</div>
        ),
      },
      {
        accessorKey: "retailRate",
        header: () => (
          <div className="flex items-center gap-2">
            <CurrencyDollar size={16} />
            <span>Retail Rate</span>
          </div>
        ),
        meta: { title: "Retail Rate" },
        cell: ({ getValue }: any) => (
          <div className="text-right font-medium">₹{getValue()}</div>
        ),
      },
      {
        id: "actions",
        header: () => (
          <div className="flex items-center gap-2 justify-center">
            <DotsThreeOutline size={16} />
            <span>Actions</span>
          </div>
        ),
        meta: { title: "Actions" },
        cell: ({
          row,
        }: {
          row: import("@tanstack/react-table").Row<Product>;
        }) => (
          <div className="flex gap-2 justify-center">
            <button
              className="p-2 rounded-lg border shadow cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-accent-foreground)",
                borderColor: "var(--color-border)",
              }}
              onClick={() => handleEdit(row.original)}
              title="Edit Product"
            >
              <PencilSimple size={16} />
            </button>
            <button
              className="p-2 rounded-lg border shadow cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                background: "var(--color-destructive)",
                color: "var(--color-destructive-foreground)",
                borderColor: "var(--color-border)",
              }}
              onClick={() => handleDelete(row.original.id)}
              title="Delete Product"
            >
              <Trash size={16} />
            </button>
            <button
              className="p-2 rounded-lg border shadow cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-primary-foreground)",
                borderColor: "var(--color-border)",
              }}
              onClick={() => handleViewDetails(row.original.id)}
              title="View Details"
            >
              <Eye size={16} />
            </button>
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  );

  const table = useReactTable<Product>({
    data: products,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

  return (
    <div className="p-1 min-h-screen">
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
      <Cube size={32} weight="fill" className="text-[var(--color-primary)]" />
      <h1
        className="text-3xl font-bold tracking-tight drop-shadow"
        style={{
          color: "var(--color-card-foreground)",
          letterSpacing: "-0.02em",
        }}
      >
        Products
      </h1>
    </div>
  </div>
  {!showForm ? (
    <button
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow border hover:opacity-90 transition-opacity"
      style={{
        background: "var(--color-primary)",
        color: "var(--color-primary-foreground)",
        borderColor: "var(--color-border)",
      }}
      onClick={handleNew}
    >
      <Plus size={20} weight="bold" /> Add Product
    </button>
  ) : (
    <button
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow border hover:opacity-90 transition-opacity"
      style={{
        background: "var(--color-muted)",
        color: "var(--color-muted-foreground)",
        borderColor: "var(--color-border)",
      }}
      onClick={() => {
        setShowForm(false);
        setEditingId(null);
        setForm({});
      }}
    >
      <X size={20} weight="bold" /> Back to List
    </button>
  )}
</motion.div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Product Form or List */}
      {showForm ? (
        <ProductForm
          form={form}
          editingId={editingId}
          loading={addOrUpdateProduct.isPending}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
            setForm({});
          }}
        />
      ) : (
        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <input
              className="border rounded-lg px-4 py-2 text-sm w-80"
              style={{
                background: "var(--color-background)",
                color: "var(--color-foreground)",
                borderColor: "var(--color-border)",
              }}
              placeholder="Search products..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          <table
            className="min-w-full rounded-xl overflow-hidden shadow border"
            style={{
              background: "var(--color-card)",
              borderColor: "var(--color-border)",
              color: "var(--color-card-foreground)",
            }}
          >
            <thead style={{ background: "var(--color-muted)" }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-semibold align-middle"
                      style={{
                        background: "var(--color-muted)",
                        color: "var(--color-muted-foreground)",
                        verticalAlign: "middle",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="text-xs">
                          {{
                            asc: "▲",
                            desc: "▼",
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center"
                    style={{ color: "var(--color-muted-foreground)" }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Package size={48} />
                      <span>No products found.</span>
                    </div>
                  </td>
                </tr>
              )}
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-[var(--color-muted)]/30 transition-colors"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Product Details Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            className="bg-white dark:bg-[var(--color-card)] rounded-xl shadow-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              color: "var(--color-card-foreground)",
              border: "1px solid var(--color-border)",
            }}
          >
            <button
              className="absolute top-3 right-3 p-2 rounded-full bg-[var(--color-muted)] hover:opacity-80 transition-opacity"
              onClick={closeDetails}
              title="Close"
            >
              <X size={20} />
            </button>
            <div className="flex gap-4 mb-4">
              {viewProduct.image ? (
                <img
                  src={viewProduct.image || "/placeholder.svg"}
                  alt={viewProduct.name}
                  className="w-24 h-24 object-cover rounded shadow border"
                  style={{
                    background: "var(--color-muted)",
                    borderColor: "var(--color-border)",
                  }}
                />
              ) : (
                <div
                  className="w-24 h-24 flex items-center justify-center rounded shadow border bg-[var(--color-muted)] text-xs text-[var(--color-muted-foreground)]"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  N/A
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold mb-1">{viewProduct.name}</h2>
                <div className="text-sm text-muted-foreground mb-1">
                  {viewProduct.category}
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {viewProduct.id}
                </div>
                <div className="mt-2">
                  <span
                    className="inline-block px-2 py-1 rounded text-xs"
                    style={{
                      background: viewProduct.isActive
                        ? "var(--color-chart-3)"
                        : "var(--color-destructive)",
                      color: viewProduct.isActive
                        ? "var(--color-primary-foreground)"
                        : "var(--color-destructive-foreground)",
                    }}
                  >
                    {viewProduct.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Brand:</span>{" "}
              {viewProduct.brand || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Description:</span>{" "}
              {viewProduct.description || "-"}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <span className="font-semibold">Code:</span> {viewProduct.code}
              </div>
              <div>
                <span className="font-semibold">HSN:</span>{" "}
                {viewProduct.hsnCode}
              </div>
              <div>
                <span className="font-semibold">GST %:</span>{" "}
                {viewProduct.gstPercentage}
              </div>
              <div>
                <span className="font-semibold">Unit:</span> {viewProduct.unit}
              </div>
              <div>
                <span className="font-semibold">Retail Rate:</span>{" "}
                {viewProduct.retailRate}
              </div>
              <div>
                <span className="font-semibold">Wholesale Rate:</span>{" "}
                {viewProduct.wholesaleRate ?? "-"}
              </div>
              <div>
                <span className="font-semibold">Dealer Rate:</span>{" "}
                {viewProduct.dealerRate ?? "-"}
              </div>
              <div>
                <span className="font-semibold">Min Stock Level:</span>{" "}
                {viewProduct.minStockLevel ?? "-"}
              </div>
              <div>
                <span className="font-semibold">Length (in):</span>{" "}
                {viewProduct.lengthInches ?? "-"}
              </div>
              <div>
                <span className="font-semibold">Width (in):</span>{" "}
                {viewProduct.widthInches ?? "-"}
              </div>
              <div>
                <span className="font-semibold">Sqft/Box:</span>{" "}
                {viewProduct.sqftPerBox ?? "-"}
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Created:{" "}
              {viewProduct.createdAt
                ? new Date(viewProduct.createdAt).toLocaleString()
                : "-"}
              <br />
              Updated:{" "}
              {viewProduct.updatedAt
                ? new Date(viewProduct.updatedAt).toLocaleString()
                : "-"}
            </div>
          </motion.div>
        </div>
      )}

      {/* Loading overlay for details */}
      {viewLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[var(--color-card)] rounded-xl shadow-xl p-8 text-center">
            <span className="text-lg font-semibold">Loading details...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
