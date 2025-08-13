"use client";

import printJS from "print-js";

/**
 * Print the sales table by element id.
 */
export function printSalesTable() {
  if (typeof window === 'undefined') return;
  printJS({
    printable: "sales-history-table",
    type: "html",
    targetStyles: ["*"],
    documentTitle: "Sales History",
  });
}

/**
 * Print the sale details modal by element id.
 * @param saleId The sale id to print modal for.
 * @param invoiceNumber The invoice number for document title.
 */
export function printSaleDetails(saleId: string, invoiceNumber?: string) {
  if (typeof window === 'undefined') return;
  printJS({
    printable: `sale-details-modal-${saleId}`,
    type: "html",
    targetStyles: ["*"],
    documentTitle: invoiceNumber ? `Sale ${invoiceNumber}` : "Sale Details",
  });
}