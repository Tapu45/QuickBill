"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Upload, Link, ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/Product";

type ProductFormProps = {
  form: Partial<Product>;
  editingId: string | null;
  loading: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  editingId,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);

  // Cloudinary upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (data.secure_url) {
          onChange({
            target: {
              name: "image",
              value: data.secure_url,
            },
          } as any);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setUploading(false);
      }
    }
  };

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
      className="w-full max-w-9xl mx-auto"
    >
      <Card className="">
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Image Section - Moved to Top */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Product Image</Label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Tabs
                    value={imageMode}
                    onValueChange={(value) =>
                      setImageMode(value as "url" | "upload")
                    }
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="url"
                        className="flex items-center gap-2"
                      >
                        <Link className="h-4 w-4" />
                        URL
                      </TabsTrigger>
                      <TabsTrigger
                        value="upload"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="mt-4">
                      <Input
                        name="image"
                        placeholder="Enter image URL"
                        value={form.image || ""}
                        onChange={onChange}
                        className="w-full"
                      />
                    </TabsContent>
                    <TabsContent value="upload" className="mt-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {uploading
                                ? "Uploading..."
                                : "Click to upload image"}
                            </span>
                          </div>
                        </label>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Image Preview */}
                <div className="flex items-center justify-center">
                  {form.image ? (
                    <div className="relative group">
                      <img
                        src={form.image || "/placeholder.svg"}
                        alt="Product preview"
                        className="max-w-full max-h-48 rounded-lg shadow-md object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Badge variant="secondary">Preview</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <span className="text-sm text-muted-foreground">
                          No image selected
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Basic Information</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Product Code *</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="Enter product code"
                    value={form.code || ""}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter product name"
                    value={form.name || ""}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    placeholder="Enter brand name"
                    value={form.brand || ""}
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="Enter category"
                    value={form.category || ""}
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Input
                    id="unit"
                    name="unit"
                    placeholder="e.g., kg, pcs, ltr"
                    value={form.unit || ""}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Financial Information
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hsnCode">HSN Code *</Label>
                  <Input
                    id="hsnCode"
                    name="hsnCode"
                    placeholder="Enter HSN code"
                    value={form.hsnCode || ""}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstPercentage">GST Percentage *</Label>
                  <Input
                    id="gstPercentage"
                    name="gstPercentage"
                    type="number"
                    placeholder="Enter GST %"
                    value={form.gstPercentage ?? ""}
                    onChange={onChange}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retailRate">Retail Rate *</Label>
                  <Input
                    id="retailRate"
                    name="retailRate"
                    type="number"
                    placeholder="Enter retail rate"
                    value={form.retailRate ?? ""}
                    onChange={onChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Description</Label>
              <Textarea
                name="description"
                placeholder="Enter product description (optional)"
                value={form.description || ""}
                onChange={onChange}
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="submit"
                className="flex items-center gap-2 flex-1 sm:flex-none"
                disabled={loading || uploading}
              >
                <Check className="h-4 w-4" />
                {loading
                  ? "Processing..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 flex-1 sm:flex-none bg-transparent"
                onClick={onCancel}
                disabled={loading || uploading}
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

export default ProductForm;
