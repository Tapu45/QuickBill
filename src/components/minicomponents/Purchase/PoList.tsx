import React from "react";
import { PurchaseOrder } from "@/types/Purchase";

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
  loading: boolean;
}

const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({
  purchaseOrders,
  loading,
}) => (
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
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {po.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default PurchaseOrderTable;