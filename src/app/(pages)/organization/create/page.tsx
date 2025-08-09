"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ArrowRight,
  Shield,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateOrganizationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [logo, setLogo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Logo upload handler (Cloudinary example)
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setLogo(data.secure_url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/organization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        address,
        gstin,
        stateCode,
        logo,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      if (data.orgId) {
        localStorage.setItem("organizationId", data.orgId);
      }
      // Redirect to add user page with organizationId
      router.push(`/user?organizationId=${data.orgId}`);
    } else {
      setError(data.error || "Failed to create organization");
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-background p-2">
  <div className="flex w-full max-w-3xl min-h-[500px] rounded-2xl overflow-hidden shadow-xl bg-card border border-border">
    <div className="w-[45%] bg-primary flex flex-col justify-between p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-14 -left-14 w-28 h-28 bg-primary-foreground/10 rounded-full"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-8 w-20 h-20 bg-primary-foreground/5 rounded-full"
          animate={{ scale: [1.2, 1, 1.2], x: [-10, 10, -10] }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-14 left-1/3 w-16 h-16 bg-primary-foreground/10 rounded-full"
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="text-2xl font-bold mb-2 flex items-center gap-2 text-primary-foreground">
            <motion.div
              className="w-8 h-8 bg-primary-foreground/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span>QuickBill</span>
          </div>
          <p className="text-primary-foreground/80 text-base">
            Create your organization profile
          </p>
        </motion.div>
        <div className="mt-6">
          <h2 className="text-lg font-bold text-primary-foreground mb-1">
            Why create an organization?
          </h2>
          <ul className="list-disc pl-5 text-primary-foreground/80 text-sm space-y-1">
            <li>Centralize your business details</li>
            <li>Enable team collaboration</li>
            <li>Access analytics and reports</li>
            <li>Start invoicing instantly</li>
          </ul>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-xs text-primary-foreground/60 relative z-10 mt-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4" />
          <span>Secured by 256-bit SSL encryption</span>
        </div>
        <div>TERMS OF USE AND PRIVACY POLICY</div>
      </motion.div>
    </div>
    <div className="w-[55%] flex flex-col items-center justify-center p-8 bg-card">
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs"
      >
        <motion.div
          className="flex flex-col items-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="relative cursor-pointer group">
            <motion.div
              className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-card shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Organization Logo"
                  className="object-cover w-full h-full"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              )}
            </motion.div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
            <motion.span
              className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 shadow-lg hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="w-3 h-3" />
            </motion.span>
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            Upload organization logo
          </p>
        </motion.div>
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">
            Create Organization
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your organization details below
          </p>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <Input
            type="text"
            placeholder="Organization Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-10 bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200"
          />
          <Input
            type="email"
            placeholder="Organization Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200"
          />
          <Input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-10 bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200"
          />
          <Input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="h-10 bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200"
          />
          <Input
            type="text"
            placeholder="GSTIN"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            className="h-10 bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200"
          />
          <Input
            type="text"
            placeholder="State Code"
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value)}
            className="h-10 bg-input border-2 border-border rounded-xl focus:border-primary focus:ring-0 transition-all duration-200"
          />
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mt-1"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Create Organization
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  </div>
</div>
  );
}
