import React, { useState } from "react";
import { PurchaseOrder } from "@/types/Purchase";

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
  loading: boolean;
  onRefresh?: () => void;
}

const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  purchaseOrders,
  loading,
  onRefresh,
}) => {
  const [markingId, setMarkingId] = useState<string | null>(null);

  const handleMarkReceived = async (
    id: string,
    storeId: string,
    items: any[]
  ) => {
    setMarkingId(id);
    try {
      const organizationId = localStorage.getItem("organizationId");
      await fetch(`/api/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "receive",
          purchaseId: id,
          organizationId,
          storeId,
          items, // send items with receivedQuantity, warehouseId, etc.
        }),
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      // error handling
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-card-foreground mb-6">
        Past Purchase Orders
      </h2>
      {loading ? (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          Loading...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Invoice #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Supplier
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">{po.invoiceNumber}</td>
                  <td className="px-4 py-3 text-sm">{po.supplierId}</td>
                  <td className="px-4 py-3 text-sm">
                    {po.purchaseDate?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-sm">{po.totalAmount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          po.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : po.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : po.status === "RECEIVED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {po.status === "PENDING" && (
                      <div className="inline-block">
                        <button
                          className="flex items-center gap-1 px-2 py-1 rounded font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300 shadow hover:bg-yellow-200 transition text-xs"
                          onClick={() =>
                            handleMarkReceived(
                              po.id,
                              po.storeId,
                              po.items.map((item: any) => ({
                                productId: item.productId,
                                receivedQuantity: item.quantity, // <-- This is required by backend
                                warehouseId: item.warehouseId,
                                storeId: po.storeId,
                              }))
                            )
                          }
                          disabled={markingId === po.id}
                        >
                          <span>
                            {markingId === po.id
                              ? "Marking..."
                              : "Mark as Received"}
                          </span>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderTable;
