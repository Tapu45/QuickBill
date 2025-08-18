"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserListPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Fetch users
  useEffect(() => {
  fetch("/api/user/create?action=list")
    .then(res => res.json())
    .then(data => setUsers(data.users || []));
  const orgId = localStorage.getItem("organizationId") || "";
  fetch(`/api/store?action=getStores&organizationId=${orgId}`)
    .then(res => res.json())
    .then(data => setStores(data || []));
}, []);

  // Assign store to user
  const handleAssignStore = async (userId: string) => {
    if (!selectedStore[userId]) return;
    setAssigning(userId);
    setMessage("");
    const res = await fetch("/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "assignStore",
        userId,
        storeIds: [selectedStore[userId]],
      }),
    });
    const data = await res.json();
    setAssigning(null);
    setMessage(data.message || "");
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User List</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition"
          onClick={() => router.push("/user/create")}
        >
          Add User
        </button>
      </div>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-card rounded-xl shadow border">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Assign Store</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <select
                    className="bg-input border rounded px-2 py-1"
                    value={selectedStore[user.id] || ""}
                    onChange={e =>
                      setSelectedStore(s => ({ ...s, [user.id]: e.target.value }))
                    }
                  >
                    <option value="">Select Store</option>
                    {stores.map((store: any) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/80 disabled:opacity-50"
                    disabled={assigning === user.id || !selectedStore[user.id]}
                    onClick={() => handleAssignStore(user.id)}
                  >
                    {assigning === user.id ? "Assigning..." : "Assign"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}