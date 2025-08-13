import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'warehouses': {
        // List all warehouses (optionally filter by organizationId)
        const organizationId = searchParams.get('organizationId');
        const where = organizationId ? { organizationId } : {};
        const warehouses = await prisma.warehouse.findMany({ where });
        return NextResponse.json(warehouses);
      }

      case 'warehouse-detail': {
        // Get warehouse details
        const warehouseId = searchParams.get('id');
        if (!warehouseId) return NextResponse.json({ error: 'Missing warehouse id' }, { status: 400 });
        const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
        return NextResponse.json(warehouse);
      }

      case 'inventory': {
        // List inventory for all products (optionally filter by warehouse, product, organization)
        const warehouseId = searchParams.get('warehouseId');
        const productId = searchParams.get('productId');
        const organizationId = searchParams.get('organizationId');
        const where: any = {};
        if (warehouseId) where.warehouseId = warehouseId;
        if (productId) where.productId = productId;
        if (organizationId) where.organizationId = organizationId;
        const inventory = await prisma.inventory.findMany({ where });
        return NextResponse.json(inventory);
      }

      case 'inventory-detail': {
        // Get inventory details for a specific product in a warehouse
        const productId = searchParams.get('productId');
        const warehouseId = searchParams.get('warehouseId');
        const organizationId = searchParams.get('organizationId');
        if (!productId || !warehouseId || !organizationId)
          return NextResponse.json({ error: 'Missing productId, warehouseId or organizationId' }, { status: 400 });
        const inventory = await prisma.inventory.findUnique({
          where: { organizationId_productId_warehouseId: { organizationId, productId, warehouseId } }
        });
        return NextResponse.json(inventory);
      }

      case 'inventory-alerts': {
        // Get products below reorder level for an organization (and optionally warehouse)
        const organizationId = searchParams.get('organizationId');
        const warehouseId = searchParams.get('warehouseId');
        if (!organizationId)
          return NextResponse.json({ error: 'Missing organizationId' }, { status: 400 });
        // Find products with inventory below minStockLevel
        const inventories = await prisma.inventory.findMany({
          where: {
            organizationId,
            ...(warehouseId ? { warehouseId } : {})
          },
          include: { product: true }
        });
        const alerts = inventories.filter(inv => inv.quantity < (inv.product.minStockLevel || 0));
        return NextResponse.json(alerts);
      }

      case 'stock-ledger': {
        // List all stock movements (optionally filter by product, warehouse, organization, date)
        const productId = searchParams.get('productId');
        const warehouseId = searchParams.get('warehouseId');
        const organizationId = searchParams.get('organizationId');
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');
        const where: any = {};
        if (productId) where.productId = productId;
        if (warehouseId) where.warehouseId = warehouseId;
        if (organizationId) where.organizationId = organizationId;
        if (fromDate || toDate) {
          where.createdAt = {};
          if (fromDate) where.createdAt.gte = new Date(fromDate);
          if (toDate) where.createdAt.lte = new Date(toDate);
        }
        const ledger = await prisma.stockLedger.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          include: {
            product: { select: { id: true, name: true } },
            warehouse: { select: { id: true, name: true } },
          },
        });
        return NextResponse.json(ledger);
      }

      case 'stock-ledger-detail': {
        // Get details of a specific stock movement
        const ledgerId = searchParams.get('id');
        if (!ledgerId) return NextResponse.json({ error: 'Missing ledger id' }, { status: 400 });
        const ledger = await prisma.stockLedger.findUnique({ where: { id: ledgerId } });
        return NextResponse.json(ledger);
      }

      case 'stock-transfer': {
        // List all stock transfers (optionally filter by organization, status, product, warehouse)
        const organizationId = searchParams.get('organizationId');
        const status = searchParams.get('status');
        const productId = searchParams.get('productId');
        const fromWarehouseId = searchParams.get('fromWarehouseId');
        const toWarehouseId = searchParams.get('toWarehouseId');
        const where: any = {};
        if (organizationId) where.organizationId = organizationId;
        if (status) where.status = status;
        if (productId) where.productId = productId;
        if (fromWarehouseId) where.fromWarehouseId = fromWarehouseId;
        if (toWarehouseId) where.toWarehouseId = toWarehouseId;
        const transfers = await prisma.stockTransfer.findMany({ where, orderBy: { transferDate: 'desc' } });
        return NextResponse.json(transfers);
      }

      case 'stock-transfer-detail': {
        // Get details of a specific transfer
        const transferId = searchParams.get('id');
        if (!transferId) return NextResponse.json({ error: 'Missing transfer id' }, { status: 400 });
        const transfer = await prisma.stockTransfer.findUnique({ where: { id: transferId } });
        return NextResponse.json(transfer);
      }

      case 'stock-adjustments': {
        // List all stock adjustments (optionally filter by organization, product, type)
        const organizationId = searchParams.get('organizationId');
        const productId = searchParams.get('productId');
        const adjustmentType = searchParams.get('adjustmentType');
        const where: any = {};
        if (organizationId) where.organizationId = organizationId;
        if (productId) where.productId = productId;
        if (adjustmentType) where.adjustmentType = adjustmentType;
        const adjustments = await prisma.stockAdjustment.findMany({
          where,
          orderBy: { adjustmentDate: 'desc' },
          include: {
            product: { select: { id: true, name: true } },
            warehouse: { select: { id: true, name: true } },
          },
        });
        return NextResponse.json(adjustments);
      }

      case 'stock-adjustment-detail': {
        // Get details of a specific adjustment
        const adjustmentId = searchParams.get('id');
        if (!adjustmentId) return NextResponse.json({ error: 'Missing adjustment id' }, { status: 400 });
        const adjustment = await prisma.stockAdjustment.findUnique({ where: { id: adjustmentId } });
        return NextResponse.json(adjustment);
      }

      case 'reports-stock-valuation': {
        // Get current stock valuation report for an organization (optionally warehouse)
        const organizationId = searchParams.get('organizationId');
        const warehouseId = searchParams.get('warehouseId');
        if (!organizationId)
          return NextResponse.json({ error: 'Missing organizationId' }, { status: 400 });
        const inventories = await prisma.inventory.findMany({
          where: {
            organizationId,
            ...(warehouseId ? { warehouseId } : {})
          },
          include: { product: true }
        });
        // Calculate total value = sum of (quantity * avgCostPrice)
        const totalValue = inventories.reduce((sum, inv) => sum + (inv.quantity * inv.avgCostPrice), 0);
        return NextResponse.json({ totalValue, inventories });
      }

      case 'reports-day-end-stock': {
        // Get day-end stock summary for an organization (optionally warehouse)
        const organizationId = searchParams.get('organizationId');
        const warehouseId = searchParams.get('warehouseId');
        if (!organizationId)
          return NextResponse.json({ error: 'Missing organizationId' }, { status: 400 });
        // Get all inventory records for the org/warehouse
        const inventories = await prisma.inventory.findMany({
          where: {
            organizationId,
            ...(warehouseId ? { warehouseId } : {})
          },
          include: { product: true }
        });
        // Optionally, you can add more summary logic here
        return NextResponse.json({ inventories });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'warehouse-create': {
        // Create a new warehouse
        const { name, address, organizationId, isDefault, storeId } = body;
        if (!name || !organizationId) {
          return NextResponse.json({ error: 'Missing name or organizationId' }, { status: 400 });
        }
        const warehouse = await prisma.warehouse.create({
          data: {
            name,
            address,
            organizationId,
            isDefault: !!isDefault,
            isActive: true,
            storeId
          },
        });
        return NextResponse.json(warehouse);
      }

      case 'inventory-adjust': {
        // Manual stock adjustment
        const { organizationId, productId, warehouseId, quantity, adjustmentType, reason, storeId } = body;
        if (!organizationId || !productId || !warehouseId || !quantity || !adjustmentType || !storeId) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        // Create StockAdjustment record
        const adjustment = await prisma.stockAdjustment.create({
          data: {
            adjustmentNumber: `ADJ-${Date.now()}`,
            adjustmentDate: new Date(),
            productId,
            warehouseId,
            organizationId,
            adjustmentType,
            quantity,
            reason,
            storeId
          },
        });
        // Update Inventory
        const inventory = await prisma.inventory.findUnique({
          where: { organizationId_productId_warehouseId: { organizationId, productId, warehouseId } },
        });
        let newQty = inventory ? inventory.quantity : 0;
        if (adjustmentType === 'INCREASE' || adjustmentType === 'FOUND') newQty += quantity;
        else newQty -= quantity;
        await prisma.inventory.upsert({
          where: { organizationId_productId_warehouseId: { organizationId, productId, warehouseId } },
          update: { quantity: newQty, lastUpdated: new Date() },
          create: {
            organizationId,
            productId,
            warehouseId,
            quantity: newQty,
            avgCostPrice: inventory?.avgCostPrice ?? 0,
            lastUpdated: new Date(),
            storeId
          },
        });
        // Add to StockLedger
        await prisma.stockLedger.create({
          data: {
            productId,
            warehouseId,
            organizationId,
            movementType: 'ADJUSTMENT',
            quantity,
            referenceId: adjustment.id,
            referenceType: 'StockAdjustment',
            remarks: reason,
            storeId
          },
        });
        return NextResponse.json(adjustment);
      }

      case 'stock-transfer': {
        // Transfer stock between warehouses
        const { organizationId, productId, fromWarehouseId, toWarehouseId, quantity, reason, storeId } = body;
        if (!organizationId || !productId || !fromWarehouseId || !toWarehouseId || !quantity || !storeId) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        // Create StockTransfer record
        const transfer = await prisma.stockTransfer.create({
          data: {
            productId,
            fromWarehouseId,
            toWarehouseId,
            quantity,
            transferDate: new Date(),
            reason,
            status: 'PENDING',
            organizationId,
            storeId
          },
        });
        // Deduct from source warehouse
        const sourceInventory = await prisma.inventory.findUnique({
          where: { organizationId_productId_warehouseId: { organizationId, productId, warehouseId: fromWarehouseId } },
        });
        const newSourceQty = (sourceInventory?.quantity ?? 0) - quantity;
        await prisma.inventory.upsert({
          where: { organizationId_productId_warehouseId: { organizationId, productId, warehouseId: fromWarehouseId } },
          update: { quantity: newSourceQty, lastUpdated: new Date() },
          create: {
            organizationId,
            productId,
            warehouseId: fromWarehouseId,
            quantity: newSourceQty,
            avgCostPrice: sourceInventory?.avgCostPrice ?? 0,
            lastUpdated: new Date(),
            storeId
          },
        });
        // Add to destination warehouse
        const destInventory = await prisma.inventory.findUnique({
          where: { organizationId_productId_warehouseId: { organizationId, productId, warehouseId: toWarehouseId } },
        });
        const newDestQty = (destInventory?.quantity ?? 0) + quantity;
        await prisma.inventory.upsert({
          where: { organizationId_productId_warehouseId: { organizationId, productId, warehouseId: toWarehouseId } },
          update: { quantity: newDestQty, lastUpdated: new Date() },
          create: {
            organizationId,
            productId,
            warehouseId: toWarehouseId,
            quantity: newDestQty,
            avgCostPrice: destInventory?.avgCostPrice ?? sourceInventory?.avgCostPrice ?? 0,
            lastUpdated: new Date(),
            storeId
          },
        });
        // Add to StockLedger (TRANSFER_OUT and TRANSFER_IN)
        await prisma.stockLedger.create({
          data: {
            productId,
            warehouseId: fromWarehouseId,
            organizationId,
            movementType: 'TRANSFER_OUT',
            quantity,
            referenceId: transfer.id,
            referenceType: 'StockTransfer',
            remarks: reason,
            storeId
          },
        });
        await prisma.stockLedger.create({
          data: {
            productId,
            warehouseId: toWarehouseId,
            organizationId,
            movementType: 'TRANSFER_IN',
            quantity,
            referenceId: transfer.id,
            referenceType: 'StockTransfer',
            remarks: reason,
            storeId
          },
        });
        return NextResponse.json(transfer);
      }

      case 'stock-adjustment-create': {
        // Create a new stock adjustment (same as inventory-adjust)
        const { organizationId, productId, warehouseId, quantity, adjustmentType, reason } = body;
        if (!organizationId || !productId || !warehouseId || !quantity || !adjustmentType) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        // Reuse inventory-adjust logic
        // ... (see above)
        return NextResponse.json({ message: 'Use inventory-adjust action for adjustments.' });
      }

      case 'stock-transfer-update': {
        // Update transfer status (complete/cancel)
        const { transferId, status } = body;
        if (!transferId || !status) {
          return NextResponse.json({ error: 'Missing transferId or status' }, { status: 400 });
        }
        const transfer = await prisma.stockTransfer.update({
          where: { id: transferId },
          data: { status },
        });
        return NextResponse.json(transfer);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'warehouse-update': {
        // Update warehouse info
        const { id, name, address, isDefault, isActive } = body;
        if (!id) {
          return NextResponse.json({ error: 'Missing warehouse id' }, { status: 400 });
        }
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (address !== undefined) updateData.address = address;
        if (isDefault !== undefined) updateData.isDefault = isDefault;
        if (isActive !== undefined) updateData.isActive = isActive;
        const warehouse = await prisma.warehouse.update({
          where: { id },
          data: updateData,
        });
        return NextResponse.json(warehouse);
      }

      case 'stock-transfer-update': {
        // Update transfer status (complete/cancel)
        const { transferId, status } = body;
        if (!transferId || !status) {
          return NextResponse.json({ error: 'Missing transferId or status' }, { status: 400 });
        }
        const transfer = await prisma.stockTransfer.update({
          where: { id: transferId },
          data: { status },
        });
        return NextResponse.json(transfer);
      }

      case 'stock-adjustment-update': {
        // Update stock adjustment details
        const { id, quantity, adjustmentType, reason } = body;
        if (!id) {
          return NextResponse.json({ error: 'Missing adjustment id' }, { status: 400 });
        }
        const updateData: any = {};
        if (quantity !== undefined) updateData.quantity = quantity;
        if (adjustmentType !== undefined) updateData.adjustmentType = adjustmentType;
        if (reason !== undefined) updateData.reason = reason;
        const adjustment = await prisma.stockAdjustment.update({
          where: { id },
          data: updateData,
        });
        return NextResponse.json(adjustment);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'warehouse-delete': {
        // Delete warehouse
        const { id } = body;
        if (!id) {
          return NextResponse.json({ error: 'Missing warehouse id' }, { status: 400 });
        }
        await prisma.warehouse.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      case 'stock-adjustment-delete': {
        // Delete stock adjustment
        const { id } = body;
        if (!id) {
          return NextResponse.json({ error: 'Missing adjustment id' }, { status: 400 });
        }
        await prisma.stockAdjustment.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      case 'stock-transfer-delete': {
        // Delete stock transfer
        const { id } = body;
        if (!id) {
          return NextResponse.json({ error: 'Missing transfer id' }, { status: 400 });
        }
        await prisma.stockTransfer.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}