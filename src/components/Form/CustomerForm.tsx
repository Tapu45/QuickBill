"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type CustomerFormProps = {
  form: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    gstin?: string;
    stateCode?: string;
    priceCategory?: string;
    creditLimit?: number;
    isActive?: boolean;
    organizationId?: string;
  };
  editingId: string | null;
  loading: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

const priceCategories = [
  { value: "RETAIL", label: "Retail" },
  { value: "WHOLESALE", label: "Wholesale" },
  { value: "DEALER", label: "Dealer" },
];

const CustomerForm: React.FC<CustomerFormProps> = ({
  form,
  editingId,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) => {
  React.useEffect(() => {
    const orgId = localStorage.getItem("organizationId");
    if (orgId && !form.organizationId) {
      onChange({
        target: {
          name: "organizationId",
          value: orgId,
        },
      } as any);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Customer Information</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter customer name"
                    value={form.name || ""}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    value={form.phone || ""}
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={form.email || ""}
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    name="gstin"
                    placeholder="Enter GSTIN"
                    value={form.gstin || ""}
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stateCode">State Code</Label>
                  <Input
                    id="stateCode"
                    name="stateCode"
                    placeholder="Enter state code"
                    value={form.stateCode || ""}
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceCategory">Price Category</Label>
                  <select
                    id="priceCategory"
                    name="priceCategory"
                    value={form.priceCategory || ""}
                    onChange={onChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select category</option>
                    {priceCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit</Label>
                  <Input
                    id="creditLimit"
                    name="creditLimit"
                    type="number"
                    placeholder="Enter credit limit"
                    value={form.creditLimit ?? ""}
                    onChange={onChange}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Active</Label>
                  <select
                    id="isActive"
                    name="isActive"
                    value={form.isActive ? "true" : "false"}
                    onChange={onChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Address</Label>
              <Textarea
                name="address"
                placeholder="Enter address"
                value={form.address || ""}
                onChange={onChange}
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="submit"
                className="flex items-center gap-2 flex-1 sm:flex-none"
                disabled={loading}
              >
                <Check className="h-4 w-4" />
                {loading
                  ? "Processing..."
                  : editingId
                  ? "Update Customer"
                  : "Add Customer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 flex-1 sm:flex-none bg-transparent"
                onClick={onCancel}
                disabled={loading}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomerForm;