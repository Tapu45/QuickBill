export type Product = {
  createdAt: any
  updatedAt: any
  id: string
  code: string
  name: string
  brand?: string
  image?: string
  category?: string
  description?: string
  hsnCode: string
  gstPercentage: number
  unit: string
  retailRate: number
  wholesaleRate?: number
  dealerRate?: number
  minStockLevel?: number
  isActive?: boolean
  lengthInches?: number
  widthInches?: number
  sqftPerBox?: number
  organizationId: string
}