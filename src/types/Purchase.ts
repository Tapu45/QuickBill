export type PurchaseItem = {
  productId: string;
  quantity: number;
  rate: number;
  amount: number;
  gstAmount: number;
  warehouseId?: string;
};

export type PurchaseOrder = {
  id: string;
  invoiceNumber: string;
  supplierInvoiceNumber: string;
  purchaseDate: string;
  supplierId: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  freight: number;
  otherCharges: number;
  totalAmount: number;
  status: string;
  notes: string;
  items: PurchaseItem[];
};