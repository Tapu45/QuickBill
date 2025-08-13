"use client";

import React from "react";
import { motion } from "framer-motion";
import { Store, Bell, Palette, Languages } from "lucide-react";
import Link from "next/link";

const settings = [
  {
    name: "Theme",
    description: "Switch between light and dark mode.",
    icon: <Palette className="h-6 w-6 text-[color:var(--primary)]" />,
    action: (
      <button
        className="px-4 py-1 rounded bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-medium"
        type="button"
        aria-label="Toggle Theme"
      >
        Toggle
      </button>
    ),
  },
  {
    name: "Notifications",
    description: "Enable or disable email notifications.",
    icon: <Bell className="h-6 w-6 text-[color:var(--primary)]" />,
    action: (
      <input
        type="checkbox"
        className="accent-[color:var(--primary)] h-5 w-5"
        aria-label="Enable Notifications"
      />
    ),
  },
  {
    name: "Language",
    description: "Select your preferred language.",
    icon: <Languages className="h-6 w-6 text-[color:var(--primary)]" />,
    action: (
      <select className="px-2 py-1 rounded border bg-[color:var(--card)] text-[color:var(--foreground)]">
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>
    ),
  },
];

const SettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", damping: 18 }}
      className="settings-container max-w-xl mx-auto p-8 rounded-xl shadow-lg bg-[color:var(--card)]"
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold mb-8 text-[color:var(--primary)]"
      >
        Settings
      </motion.h1>

      <div className="space-y-6">
        {settings.map((setting, idx) => (
          <motion.div
            key={setting.name}
            whileHover={{ scale: 1.03, boxShadow: "0px 4px 16px var(--shadow-md)" }}
            className="flex items-center justify-between p-4 rounded-lg bg-[color:var(--sidebar)] border border-[color:var(--sidebar-border)]"
          >
            <div className="flex items-center gap-4">
              {setting.icon}
              <div>
                <div className="font-semibold text-[color:var(--foreground)]">{setting.name}</div>
                <div className="text-sm text-[color:var(--muted-foreground)]">{setting.description}</div>
              </div>
            </div>
            <div>{setting.action}</div>
          </motion.div>
        ))}

        {/* Stores & Counters */}
        <Link href="/store" passHref>
          <motion.div
            whileHover={{ scale: 1.03, boxShadow: "0px 4px 16px var(--shadow-md)", x: 5 }}
            className="flex items-center justify-between p-4 rounded-lg bg-[color:var(--sidebar)] border border-[color:var(--sidebar-border)] cursor-pointer transition"
          >
            <div className="flex items-center gap-4">
              <Store className="h-6 w-6 text-[color:var(--primary)]" />
              <div>
                <div className="font-semibold text-[color:var(--foreground)]">Stores & Counters</div>
                <div className="text-sm text-[color:var(--muted-foreground)]">
                  Manage your stores and billing counters.
                </div>
              </div>
            </div>
            <span className="text-[color:var(--primary)] font-medium">Go</span>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default SettingsPage;