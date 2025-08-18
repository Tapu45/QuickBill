import prisma from "../src/lib/prisma";



async function clearDatabase() {
  // Delete child tables first, then parents
  await prisma.purchaseReturnItem.deleteMany({});
  await prisma.purchaseReturn.deleteMany({});
  await prisma.purchaseItem.deleteMany({});
  await prisma.purchase.deleteMany({});
  await prisma.saleReturnItem.deleteMany({});
  await prisma.saleReturn.deleteMany({});
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.quotationItem.deleteMany({});
  await prisma.quotation.deleteMany({});
  await prisma.stockLedger.deleteMany({});
  await prisma.stockTransfer.deleteMany({});
  await prisma.stockAdjustment.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.warehouse.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.taxMaster.deleteMany({});
  await prisma.bankAccount.deleteMany({});
  await prisma.receipt.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.invoiceConfig.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.counter.deleteMany({});
  await prisma.loginHistory.deleteMany({});
  await prisma.userStore.deleteMany({});
  await prisma.userCounter.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.autoCounter.deleteMany({});

  console.log('Database cleared!');
}

clearDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });