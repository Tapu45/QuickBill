export type Customer = {
  email: string;
  stateCode: string;
  priceCategory: string;
  creditLimit: string;
  id: string;
  name: string;
  phone?: string;
  address?: string;
  gstin?: string;
};

export type Product = {
  retailRate: number;
  gstPercentage: number;
  code: any;
  id: string;
  name: string;
  hsn?: string;
  gst: number;
  rate: number;
};

export type SaleItem = {
  productId: string;
  quantity: number;
  rate: number;
  discount: number;
  gst: number;
  amount: number;
  gstAmount: number;
};

export type Sale = {
  id: string;
  invoiceNumber: string;
  saleDate: string;
  customerName: string | null;
  totalAmount: number;
  paymentStatus: string;
  customerPhone?: string | null;
  customerAddress?: string | null;
  items?: {
    id: string;
    productId: string;
    quantity: number;
    rate: number;
    discount: number;
    amount: number;
    gstAmount: number;
    product?: {
      name: string;
      hsn?: string;
    };
  }[];
  paymentMethod?: string;
  subtotal?: number;
  discount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  notes?: string;
};