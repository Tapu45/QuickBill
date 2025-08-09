"use client";

import { useEffect, useState } from "react";
import {
  UserCircle,
  Buildings,
  Phone,
  EnvelopeSimple,
  Calendar,
  ShieldCheck,
} from "@phosphor-icons/react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  if (!user || user.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg text-red-500">
          User not found or unauthorized.
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto mt-1 rounded-2xl p-8 ]">
      <div className="mb-8 flex items-center gap-3">
        <UserCircle size={32} className="text-[var(--color-primary)]" />
        <h1
          className="text-3xl font-bold tracking-tight drop-shadow"
          style={{ color: "var(--color-card-foreground)" }}
        >
          Profile Details
        </h1>
      </div>
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <div className="relative">
          <img
            src={
              user.image ||
              "https://ui-avatars.com/api/?name=User&background=random"
            }
            alt="User Avatar"
            className="h-28 w-28 rounded-full object-cover border-4 border-[var(--color-primary)] shadow"
          />
          <span className="absolute bottom-2 right-2 bg-[var(--color-primary)] text-white rounded-full px-2 py-1 text-xs font-semibold shadow">
            {user.role}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <UserCircle size={28} className="text-[var(--color-primary)]" />
            {user.firstName} {user.lastName}
          </h2>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <EnvelopeSimple size={18} /> {user.email}
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Phone size={18} /> {user.phone || "N/A"}
          </div>
          <div className="mt-3 flex gap-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow ${
                user.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <ShieldCheck size={14} /> {user.isActive ? "Active" : "Inactive"}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
              <Calendar size={14} /> Joined{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserCircle size={22} className="text-[var(--color-primary)]" /> User
          Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--color-card)] rounded-lg p-4 shadow border">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Phone:
            </span>
            <div className="text-gray-600 dark:text-gray-400">
              {user.phone || "N/A"}
            </div>
          </div>
          <div className="bg-[var(--color-card)] rounded-lg p-4 shadow border">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Status:
            </span>
            <div className="text-gray-600 dark:text-gray-400">
              {user.isActive ? "Active" : "Inactive"}
            </div>
          </div>
          <div className="bg-[var(--color-card)] rounded-lg p-4 shadow border">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Created At:
            </span>
            <div className="text-gray-600 dark:text-gray-400">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : "N/A"}
            </div>
          </div>
          <div className="bg-[var(--color-card)] rounded-lg p-4 shadow border">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Updated At:
            </span>
            <div className="text-gray-600 dark:text-gray-400">
              {user.updatedAt
                ? new Date(user.updatedAt).toLocaleString()
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Organization Details */}
      {user.organization && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Buildings size={22} className="text-[var(--color-primary)]" />{" "}
            Organization Details
          </h3>
          <div className="flex items-center gap-6 mb-6">
            <img
              src={
                user.organization.logo ||
                "https://ui-avatars.com/api/?name=Org&background=random"
              }
              alt="Organization Logo"
              className="h-20 w-20 rounded-full object-cover border-4 border-[var(--color-accent)] shadow"
            />
            <div>
              <h4 className="text-lg font-bold">{user.organization.name}</h4>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <EnvelopeSimple size={16} /> {user.organization.email}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone size={16} /> {user.organization.phone || "N/A"}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--color-card)] rounded-lg p-4 shadow border">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Address:
              </span>
              <div className="text-gray-600 dark:text-gray-400">
                {user.organization.address || "N/A"}
              </div>
            </div>
            <div className="bg-[var(--color-card)] rounded-lg p-4 shadow border">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                GSTIN:
              </span>
              <div className="text-gray-600 dark:text-gray-400">
                {user.organization.gstin || "N/A"}
              </div>
            </div>
            <div className="bg-[var(--color-card)] rounded-lg p-4 shadow border">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Created At:
              </span>
              <div className="text-gray-600 dark:text-gray-400">
                {user.organization.createdAt
                  ? new Date(user.organization.createdAt).toLocaleString()
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
