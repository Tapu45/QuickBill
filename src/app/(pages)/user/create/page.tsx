"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Plus, Shield, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";

export default function AddUserPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddUserPageContent />
    </Suspense>
  );
}

function AddUserPageContent() {
  const router = useRouter();

  // Get organizationId from localStorage
  const [organizationId, setOrganizationId] = useState<string>("");

  useEffect(() => {
    const orgId = localStorage.getItem("organizationId") || "";
    setOrganizationId(orgId);
  }, []);

  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    image: "",
    role: "MANAGER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addedUsers, setAddedUsers] = useState<string[]>([]);
  const { user: currentUser } = useUser();

  // Avatar upload handler (Cloudinary)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setUser((u) => ({ ...u, image: data.secure_url }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUser((u) => ({ ...u, [e.target.name]: e.target.value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...user,
        organizationId,
        action: "create",
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuccess("User added!");
      setAddedUsers((prev) => [...prev, user.email]);
      setUser({
        email: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        image: "",
        role: "MANAGER",
      });
    } else {
      setError(data.error || "Failed to add user");
    }
  };
//

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl bg-card border border-border">
        <div className="w-full flex flex-col items-center justify-center p-8 bg-card">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Add User
              </h2>
              <p className="text-muted-foreground">
                Fill in details for each team member
              </p>
            </div>
            {/* Avatar Upload */}
            <motion.div
              className="flex flex-col items-center mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <label className="relative cursor-pointer group">
                <motion.div
                  className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-card shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="User Avatar"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                  )}
                </motion.div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <motion.span
                  className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.span>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Upload user avatar
              </p>
            </motion.div>
            <form className="space-y-4" onSubmit={handleAddUser}>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && (
                <div className="text-green-600 text-sm">{success}</div>
              )}
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={user.email}
                onChange={handleChange}
                required
                className="h-10 bg-input border-2 border-border rounded-xl"
              />
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={user.username}
                onChange={handleChange}
                required
                className="h-10 bg-input border-2 border-border rounded-xl"
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChange}
                required
                className="h-10 bg-input border-2 border-border rounded-xl"
              />
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={user.firstName}
                onChange={handleChange}
                className="h-10 bg-input border-2 border-border rounded-xl"
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={user.lastName}
                onChange={handleChange}
                className="h-10 bg-input border-2 border-border rounded-xl"
              />
              <Input
                type="text"
                name="phone"
                placeholder="Phone"
                value={user.phone}
                onChange={handleChange}
                className="h-10 bg-input border-2 border-border rounded-xl"
              />
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                className="h-10 w-full bg-input border-2 border-border rounded-xl text-muted-foreground"
              >
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
                <option value="CASHIER">Cashier</option>
                <option value="SALESPERSON">Salesperson</option>
              </select>
             
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg transition-all duration-200 mt-2"
              >
                {loading ? "Adding..." : "Add User"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
