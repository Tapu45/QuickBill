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