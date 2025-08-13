"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Customer, Product, SaleItem } from "@/types/Sales";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

function calculateGST(amount: number, gst: number) {
  return (amount * gst) / 100;
}

function useDebouncedCallback(
  callback: (...args: any[]) => void,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

function getOrgId() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("organizationId") || "";
  }
  return "";
}

export default function SalesPage() {
  const user = useUser();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gstin: "",
    stateCode: "",
    priceCategory: "",
    creditLimit: "",
  });
  const [items, setItems] = useState<SaleItem[]>([
    {
      productId: "",
      quantity: 1,
      rate: 0,
      discount: 0,
      gst: 0,
      amount: 0,
      gstAmount: 0,
    },
  ]);

  const [subtotal, setSubtotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalGST, setTotalGST] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountReceived, setAmountReceived] = useState(0);
  const [productQueries, setProductQueries] = useState<string[]>(
    items.map(() => "")
  );
  const [productSuggestions, setProductSuggestions] = useState<Product[][]>(
    items.map(() => [])
  );
  const [showProductSuggestions, setShowProductSuggestions] = useState<
    boolean[]
  >(items.map(() => false));
  const productSuggestionsRefs = useRef<(HTMLUListElement | null)[]>([]);

  // Autocomplete states
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState<Customer[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  

  useEffect(() => {
    setProductQueries(
      items.map((item, idx) => {
        // If productId is set, try to get the name from the current suggestion list for this row
        if (item.productId) {
          const suggestion = productSuggestions[idx]?.find(
            (p) => p.id === item.productId
          );
          if (suggestion) return suggestion.name;
        }
        return productQueries[idx] || "";
      })
    );
  }, [items, productSuggestions]);
  // Fetch customers
  const fetchCustomerSuggestions = async (query: string) => {
    const orgId = getOrgId();
    if (!query || !orgId) {
      setCustomerSuggestions([]);
      return;
    }
    const res = await fetch(
      `/api/master/customer?organizationId=${orgId}&search=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();
    setCustomerSuggestions(data.customers || []);
  };

  const fetchProductSuggestions = async (idx: number, query: string) => {
    const orgId = getOrgId();
    if (!query || !orgId) {
      setProductSuggestions((prev) => {
        const updated = [...prev];
        updated[idx] = [];
        return updated;
      });
      return;
    }
    const res = await fetch(
      `/api/master/product?organizationId=${orgId}&search=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();
    setProductSuggestions((prev) => {
      const updated = [...prev];
      updated[idx] = data.products || [];
      return updated;
    });
  };

  const debouncedFetchCustomerSuggestions = useDebouncedCallback(
    fetchCustomerSuggestions,
    800
  );
  const debouncedFetchProductSuggestions = useDebouncedCallback(
    fetchProductSuggestions,
    800
  );

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCustomerQuery(query);
    setShowSuggestions(true);
    debouncedFetchCustomerSuggestions(query); // Debounced
    setCustomerDetails(null);
    setNewCustomer({ ...newCustomer, name: query });
  };

  const handleProductInputChange = (idx: number, value: string) => {
    const updatedQueries = [...productQueries];
    updatedQueries[idx] = value;
    setProductQueries(updatedQueries);

    debouncedFetchProductSuggestions(idx, value); // Debounced

    const updatedShow = [...showProductSuggestions];
    updatedShow[idx] = true;
    setShowProductSuggestions(updatedShow);

    if (value === "") {
      handleItemChange(idx, "productId", "");
    }
  };

  // useEffect(() => {
  //   setProductQueries(
  //     items.map(
  //       (item, idx) => products.find((p) => p.id === item.productId)?.name || ""
  //     )
  //   );
  //   setProductSuggestions(items.map(() => []));
  //   setShowProductSuggestions(items.map(() => false));
  // }, [items, products]);

  // When a suggestion is clicked
  const handleCustomerSuggestionClick = (customer: Customer) => {
    setCustomerQuery(customer.name);
    setCustomerDetails(customer);
    setShowSuggestions(false);
    setNewCustomer({
      name: customer.name,
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
      gstin: customer.gstin || "",
      stateCode: customer.stateCode || "",
      priceCategory: customer.priceCategory || "",
      creditLimit: customer.creditLimit || "",
    });
  };

  // Hide suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle other customer field changes
  const handleNewCustomerInput = (
    field: keyof typeof newCustomer,
    value: string
  ) => {
    setNewCustomer({ ...newCustomer, [field]: value });
    if (field !== "name") setCustomerDetails(null);
  };

  // Save new customer
  const handleSaveNewCustomer = async () => {
    const orgId = getOrgId();
    if (!newCustomer.name || !orgId) {
      alert("Customer name and organization required");
      return;
    }
    try {
      const res = await fetch("/api/master/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCustomer, organizationId: orgId }),
      });
      const result = await res.json();
      if (result.success && result.customer) {
        setCustomers([...customers, result.customer]);
        setCustomerDetails(result.customer);
        setCustomerQuery(result.customer.name);
        setNewCustomer({
          name: result.customer.name,
          phone: result.customer.phone || "",
          email: result.customer.email || "",
          address: result.customer.address || "",
          gstin: result.customer.gstin || "",
          stateCode: result.customer.stateCode || "",
          priceCategory: result.customer.priceCategory || "",
          creditLimit: result.customer.creditLimit || "",
        });
        alert("Customer added!");
      } else {
        alert("Failed to add customer");
      }
    } catch {
      alert("Failed to add customer");
    }
  };

  // Handle product row change
  const handleItemChange = (
    idx: number,
    field:
      | "productId"
      | "quantity"
      | "rate"
      | "discount"
      | "gst"
      | "amount"
      | "gstAmount",
    value: any
  ) => {
    const updated = [...items];
    if (field === "productId") {
      const prod = products.find((p) => p.id === value);
      if (prod) {
        updated[idx] = {
          ...updated[idx],
          productId: prod.id,
          rate: prod.rate,
          gst: prod.gst,
          quantity: 1,
          discount: 0,
        };
      }
    } else {
      updated[idx][field] = value;
    }
    // Calculate amount and gst
    const rate = Number(updated[idx].rate) || 0;
    const qty = Number(updated[idx].quantity) || 0;
    const discount = Number(updated[idx].discount) || 0;
    const gst = Number(updated[idx].gst) || 0;
    const amountBeforeDiscount = rate * qty;
    const amount = amountBeforeDiscount - discount;
    const gstAmount = calculateGST(amount, gst);
    updated[idx].amount = amount;
    updated[idx].gstAmount = gstAmount;
    setItems(updated);
    recalculateSummary(updated);
  };

  // Add new product row
  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        quantity: 1,
        rate: 0,
        discount: 0,
        gst: 0,
        amount: 0,
        gstAmount: 0,
      },
    ]);
  };

  // Remove product row
  const removeItem = (idx: number) => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    recalculateSummary(updated);
  };

  // Recalculate summary
  const recalculateSummary = (updatedItems: SaleItem[]) => {
    let sub = 0,
      disc = 0,
      gst = 0;
    updatedItems.forEach((item) => {
      sub += (Number(item.rate) || 0) * (Number(item.quantity) || 0);
      disc += Number(item.discount) || 0;
      gst += Number(item.gstAmount) || 0;
    });
    setSubtotal(sub);
    setTotalDiscount(disc);
    setTotalGST(gst);
    setGrandTotal(sub - disc + gst);
  };

  // Handle payment
  // const handleAmountReceived = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setAmountReceived(Number(e.target.value));
  // };

  // Submit sale (API call)
  const handleSubmit = async () => {
    const orgId = getOrgId();
    // Use customerDetails if selected, else use newCustomer
    const customer = customerDetails || newCustomer;
    if (!customer.name || !orgId) {
      alert("Customer name and organization required");
      return;
    }
    const saleData = {
      invoiceNumber: "INV-" + Date.now(),
      saleDate: new Date().toISOString(),
      customerId: customerDetails?.id || undefined,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        rate: Number(item.rate),
        discount: Number(item.discount),
        amount: Number(item.amount),
        gstAmount: Number(item.gstAmount),
      })),
      subtotal,
      discount: totalDiscount,
      discountType: "FIXED",
      cgst: totalGST / 2,
      sgst: totalGST / 2,
      igst: 0,
      totalAmount: grandTotal,
      paymentMethod: paymentMethod.toUpperCase(),
      paymentStatus: amountReceived >= grandTotal ? "PAID" : "PENDING",
      status: "COMPLETED",
      notes: "",
      organizationId: orgId,
      createdById: user?.id,
    };
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });
      const result = await res.json();
      if (result.success) {
        alert("Sale submitted successfully!");
        // Optionally reset form here
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Failed to submit sale.");
    }
  };

  // Handle product suggestion click
  const handleProductSuggestionClick = (idx: number, product: Product) => {
    // Directly update the item with all product fields from the suggestion
    const updated = [...items];
    updated[idx] = {
      ...updated[idx],
      productId: product.id,
      rate: product.retailRate || 0,
      gst: product.gstPercentage || 0,
      quantity: 1,
      discount: 0,
      amount: product.retailRate || 0,
      gstAmount: calculateGST(
        product.retailRate || 0,
        product.gstPercentage || 0
      ),
    };
    setItems(updated);
    recalculateSummary(updated);

    // Set the input value
    const updatedQueries = [...productQueries];
    updatedQueries[idx] = product.name;
    setProductQueries(updatedQueries);

    // Hide suggestions
    const updatedShow = [...showProductSuggestions];
    updatedShow[idx] = false;
    setShowProductSuggestions(updatedShow);
  };

  // Hide suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      productSuggestionsRefs.current.forEach((ref, idx) => {
        if (ref && !ref.contains(event.target as Node)) {
          setShowProductSuggestions((prev) => {
            const updated = [...prev];
            updated[idx] = false;
            return updated;
          });
        }
      });
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const invoiceRef = useRef<HTMLDivElement>(null);
  //   const handlePrint = useReactToPrint({
  //   onBeforeGetContent: () => invoiceRef.current,
  //   pageStyle: "@media print { body { background: white; } }",
  // });

  function removeLeadingZeros(value: string) {
    return value.replace(/^0+(?=\d)/, "");
  }

 return (
    <div className="container mx-auto p-1 space-y-8">
      <div className="rounded-lg p-1">
        {/* Header Section */}
        <div className="mb-6 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-10 rounded bg-[var(--color-primary)] shadow"
              aria-hidden="true"
            />
            <div className="flex items-center gap-2">
              {/* Invoice Icon */}
              <svg
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                className="text-[var(--color-primary)]"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M8 9h8M8 13h5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <h2
                className="text-3xl font-bold tracking-tight drop-shadow"
                style={{
                  color: "var(--color-card-foreground)",
                  letterSpacing: "-0.02em",
                }}
              >
                Sales Invoice
              </h2>
            </div>
          </div>
          {/* Sales History Button */}
        <Link
            href="/sales/history"
            className="ml-auto px-5 py-2 rounded-xl font-semibold transition-colors border shadow
              bg-[var(--color-primary)] text-[var(--color-primary-foreground)]
              hover:bg-[var(--color-primary)]/90 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block"
              style={{ color: "var(--color-primary-foreground)" }}
            >
              <path
                d="M7 7h10M7 12h6M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            Sales History
          </Link>
        </div>
        <div ref={invoiceRef}>
          {/* Customer Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-muted-foreground">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerQuery}
                  onChange={handleCustomerNameChange}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Type customer name"
                  autoComplete="off"
                />
                {showSuggestions &&
                  customerQuery &&
                  customerSuggestions.length > 0 && (
                    <ul
                      ref={suggestionsRef}
                      className="absolute z-10 w-full max-h-40 overflow-y-auto bg-background border border-input rounded shadow"
                      style={{ top: "100%" }}
                    >
                      {customerSuggestions.map((c) => (
                        <li
                          key={c.id}
                          className="px-3 py-2 hover:bg-muted cursor-pointer"
                          onClick={() => handleCustomerSuggestionClick(c)}
                        >
                          {c.name}{" "}
                          {c.phone && (
                            <span className="text-xs text-muted-foreground">
                              ({c.phone})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <input
                  type="text"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    handleNewCustomerInput("phone", e.target.value)
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={newCustomer.email || ""}
                  onChange={(e) =>
                    handleNewCustomerInput("email", e.target.value)
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={newCustomer.gstin}
                  onChange={(e) =>
                    handleNewCustomerInput("gstin", e.target.value)
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) =>
                    handleNewCustomerInput("address", e.target.value)
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  State Code
                </label>
                <input
                  type="text"
                  value={newCustomer.stateCode || ""}
                  onChange={(e) =>
                    handleNewCustomerInput("stateCode", e.target.value)
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Price Category
                </label>
                <input
                  type="text"
                  value={newCustomer.priceCategory || ""}
                  onChange={(e) =>
                    handleNewCustomerInput("priceCategory", e.target.value)
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Credit Limit
                </label>
                <input
                  type="number"
                  value={newCustomer.creditLimit || ""}
                  onChange={(e) =>
                    handleNewCustomerInput("creditLimit", e.target.value)
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {!customerDetails && (
                <button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
                  onClick={handleSaveNewCustomer}
                  type="button"
                >
                  Save Customer
                </button>
              )}
            </div>
            {/* {customerDetails && (
              <div className="mt-2">
                <div className="text-sm font-semibold text-muted-foreground mb-1">
                  Selected Customer Details:
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>Phone: {customerDetails.phone || "-"}</div>
                  <div>Address: {customerDetails.address || "-"}</div>
                  <div>GSTIN: {customerDetails.gstin || "-"}</div>
                </div>
              </div>
            )} */}
          </div>

          {/* Product Entry Section */}
          <table className="w-full text-sm mb-2 border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-muted">
                <th className="text-left px-3 py-2 font-semibold">Product</th>
                <th className="text-center px-3 py-2 font-semibold">Qty</th>
                <th className="text-center px-3 py-2 font-semibold">Rate</th>
                <th className="text-center px-3 py-2 font-semibold">
                  Discount
                </th>
                <th className="text-center px-3 py-2 font-semibold">GST %</th>
                <th className="text-right px-3 py-2 font-semibold">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="align-middle bg-card rounded-lg">
                  <td className="relative min-w-[220px] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm7-1-3.5-3.5"
                          />
                        </svg>
                      </span>
                      <input
                        type="text"
                        value={productQueries[idx] || ""}
                        onChange={(e) =>
                          handleProductInputChange(idx, e.target.value)
                        }
                        onFocus={() => {
                          setShowProductSuggestions((prev) => {
                            const updated = [...prev];
                            updated[idx] = true;
                            return updated;
                          });
                        }}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition"
                        placeholder="Type product name/code"
                        autoComplete="off"
                      />
                    </div>
                    {showProductSuggestions[idx] &&
                      productQueries[idx] &&
                      productSuggestions[idx].length > 0 && (
                        <ul
                          ref={(el) => {
                            productSuggestionsRefs.current[idx] = el;
                          }}
                          className="absolute z-20 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded shadow-lg mt-1"
                          style={{ top: "100%" }}
                        >
                          {productSuggestions[idx].map((p) => (
                            <li
                              key={p.id}
                              className="px-3 py-2 hover:bg-primary/10 cursor-pointer transition"
                              onClick={() =>
                                handleProductSuggestionClick(idx, p)
                              }
                            >
                              <span className="font-medium">{p.name}</span>
                              {p.code && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  [{p.code}]
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                  </td>
                  <td className="text-center px-3 py-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity === 0 ? "" : item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          idx,
                          "quantity",
                          Number(removeLeadingZeros(e.target.value))
                        )
                      }
                      className="border rounded px-2 py-1 w-16 bg-background text-center"
                      onFocus={(e) => {
                        if (e.target.value === "0") e.target.value = "";
                      }}
                    />
                  </td>
                  <td className="text-center px-3 py-2">
                    <input
                      type="number"
                      value={item.rate === 0 ? "" : item.rate}
                      onChange={(e) =>
                        handleItemChange(
                          idx,
                          "rate",
                          Number(removeLeadingZeros(e.target.value))
                        )
                      }
                      className="border rounded px-2 py-1 w-20 bg-background text-center"
                      onFocus={(e) => {
                        if (e.target.value === "0") e.target.value = "";
                      }}
                    />
                  </td>
                  <td className="text-center px-3 py-2">
                    <input
                      type="number"
                      value={item.discount === 0 ? "" : item.discount}
                      onChange={(e) =>
                        handleItemChange(
                          idx,
                          "discount",
                          Number(removeLeadingZeros(e.target.value))
                        )
                      }
                      className="border rounded px-2 py-1 w-16 bg-background text-center"
                      onFocus={(e) => {
                        if (e.target.value === "0") e.target.value = "";
                      }}
                    />
                  </td>
                  <td className="text-center px-3 py-2">
                    <input
                      type="number"
                      value={item.gst === 0 ? "" : item.gst}
                      onChange={(e) =>
                        handleItemChange(
                          idx,
                          "gst",
                          Number(removeLeadingZeros(e.target.value))
                        )
                      }
                      className="border rounded px-2 py-1 w-14 bg-background text-center"
                      onFocus={(e) => {
                        if (e.target.value === "0") e.target.value = "";
                      }}
                    />
                  </td>
                  <td className="text-right px-3 py-2">
                    ₹{(item.amount + item.gstAmount).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {items.length > 1 && (
                      <button
                        className="text-destructive hover:bg-destructive/10 rounded-full p-1 transition"
                        onClick={() => removeItem(idx)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length > 0 && items[0].productId && (
            <div className="mb-4">
              <button
                type="button"
                onClick={addItem}
                className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded font-medium border border-yellow-300 hover:bg-yellow-200 transition"
              >
                + Add Product
              </button>
            </div>
          )}

          {/* Summary Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center gap-2">
              <span>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                  />
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M8 10h8M8 14h5"
                  />
                </svg>
              </span>
              Summary
            </h3>
            <div className="flex flex-col md:flex-row gap-2 mt-4">
              {/* Subtotal */}
              <div
                className="flex-1 flex flex-col items-center justify-center rounded-lg py-3 px-2 border"
                style={{
                  background: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="text-xs mb-1 text-[var(--muted-foreground)]">
                  Subtotal
                </span>
                <span className="font-semibold text-lg text-[var(--foreground)]">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              {/* Discount */}
              <div
                className="flex-1 flex flex-col items-center justify-center rounded-lg py-3 px-2 border"
                style={{
                  background: "var(--accent)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="text-xs mb-1 text-[var(--accent-foreground)]">
                  Discount
                </span>
                <span className="font-semibold text-lg text-[var(--accent-foreground)]">
                  - ₹{totalDiscount.toFixed(2)}
                </span>
              </div>
              {/* GST */}
              <div
                className="flex-1 flex flex-col items-center justify-center rounded-lg py-3 px-2 border"
                style={{
                  background: "var(--secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="text-xs mb-1 text-[var(--secondary-foreground)]">
                  GST (CGST+SGST)
                </span>
                <span className="font-semibold text-lg text-[var(--secondary-foreground)]">
                  + ₹{totalGST.toFixed(2)}
                </span>
              </div>
              {/* Grand Total */}
              <div
                className="flex-1 flex flex-col items-center justify-center rounded-lg py-3 px-2 border-2 shadow font-bold"
                style={{
                  background:
                    "linear-gradient(90deg, var(--chart-1), var(--chart-2))",
                  borderColor: "var(--primary)",
                }}
              >
                <span className="text-xs mb-1 text-[var(--primary-foreground)]">
                  Grand Total
                </span>
                <span className="text-2xl tracking-wide text-[var(--primary-foreground)]">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Payment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-2 flex flex-col justify-center h-full">
                <label className="text-sm font-medium text-muted-foreground mb-1">
                  Payment Method
                </label>
                <div className="flex gap-3 mt-1 min-h-[56px]">
                  {/* Cash */}
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center px-4 py-2 rounded-md border transition
            ${
              paymentMethod === "Cash"
                ? "bg-green-100 border-green-400 text-green-800 ring-2 ring-green-300"
                : "bg-background border-input text-foreground hover:bg-muted/50"
            }`}
                    onClick={() => setPaymentMethod("Cash")}
                  >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="2"
                        y="6"
                        width="20"
                        height="12"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <span className="text-xs mt-1">Cash</span>
                  </button>
                  {/* Card */}
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center px-4 py-2 rounded-md border transition
            ${
              paymentMethod === "Card"
                ? "bg-blue-100 border-blue-400 text-blue-800 ring-2 ring-blue-300"
                : "bg-background border-input text-foreground hover:bg-muted/50"
            }`}
                    onClick={() => setPaymentMethod("Card")}
                  >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="2"
                        y="7"
                        width="20"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <rect
                        x="6"
                        y="15"
                        width="4"
                        height="2"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-xs mt-1">Card</span>
                  </button>
                  {/* UPI */}
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center px-4 py-2 rounded-md border transition
            ${
              paymentMethod === "UPI"
                ? "bg-purple-100 border-purple-400 text-purple-800 ring-2 ring-purple-300"
                : "bg-background border-input text-foreground hover:bg-muted/50"
            }`}
                    onClick={() => setPaymentMethod("UPI")}
                  >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M4 17L10 7h4l6 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle cx="12" cy="17" r="1.5" fill="currentColor" />
                    </svg>
                    <span className="text-xs mt-1">UPI</span>
                  </button>
                  {/* Credit */}
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center px-4 py-2 rounded-md border transition
            ${
              paymentMethod === "Credit"
                ? "bg-yellow-100 border-yellow-400 text-yellow-800 ring-2 ring-yellow-300"
                : "bg-background border-input text-foreground hover:bg-muted/50"
            }`}
                    onClick={() => setPaymentMethod("Credit")}
                  >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="4"
                        y="7"
                        width="16"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path d="M8 11h8" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-xs mt-1">Credit</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2 flex flex-col justify-center h-full">
                <label className="text-sm font-medium text-muted-foreground mb-1">
                  Amount Received
                </label>
                <input
                  type="number"
                  value={amountReceived === 0 ? "" : amountReceived}
                  onChange={(e) =>
                    setAmountReceived(
                      Number(removeLeadingZeros(e.target.value))
                    )
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <div className="mt-2 text-sm">
                  Balance/Due:{" "}
                  <span
                    className={
                      amountReceived >= grandTotal
                        ? "text-green-600"
                        : "text-destructive"
                    }
                  >
                    ₹{(grandTotal - amountReceived).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={handleSubmit}
          >
            Save & Print Invoice
          </button>
          {/* <button
            className="bg-muted text-foreground hover:bg-muted/80 px-6 py-2 rounded-md font-medium transition-colors border"
            type="button"
            onClick={handlePrint}
          >
            Print Invoice
          </button> */}
        </div>
      </div>
    </div>
  );
}
