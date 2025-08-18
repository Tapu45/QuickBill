"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Menu, MessageCircle, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  // Use context for user, store, counter
  const { user, activeStore, activeCounter, setActiveStore, setActiveCounter, loading } = useUser();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/80 backdrop-blur-sm "
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side - Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">{pageName}</h1>
        </div>

        {/* Store/Counter Dropdowns */}
        <div className="flex items-center gap-4">
          {/* Store Dropdown */}
          {!loading && user && user.stores.length > 0 && (
            <Select
              value={activeStore?.id || ""}
              onValueChange={(value) => {
                const selectedStore = user.stores.find((s) => s.id === value);
                if (selectedStore) setActiveStore(selectedStore);
              }}
              disabled={user.role !== "ADMIN" || user.stores.length === 1}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {user.stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          {/* Counter Dropdown (show only if page is sales or user has counters) */}
          {!loading &&
            user &&
            user.counters.length > 0 &&
            (pathname.includes("/sales") || pathname.includes("/counter")) && (
              <Select
                value={activeCounter?.id || ""}
                onValueChange={(value) => {
                  const selectedCounter = user.counters.find((c) => c.id === value);
                  if (selectedCounter) setActiveCounter(selectedCounter);
                }}
                disabled={user.role !== "ADMIN" || user.counters.length === 1}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select Counter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {user.counters
                      .filter((c) => activeStore && c.storeId === activeStore.id)
                      .map((counter) => (
                        <SelectItem key={counter.id} value={counter.id}>
                          {counter.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 shadow-sm transition focus-within:ring-2 focus-within:ring-primary">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none outline-none pl-2 w-56 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Messages"
          >
            <MessageCircle className="h-5 w-5 text-gray-900 dark:text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-900 dark:text-white" />
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-8 w-8 flex items-center justify-center overflow-hidden shadow-sm transition cursor-pointer"
            onClick={() => window.location.href = "/me"}
            title="Profile"
          >
            <img
              src={user?.image || "https://ui-avatars.com/api/?name=User&background=random"}
              alt="User"
              className="h-full w-full object-cover rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

// Helper function to get page name from pathname
function getPageName(pathname: string): string {
  if (pathname === "/") return "Home";
  const path = pathname.split("/")[1];
  if (!path) return "Home";
  return path.charAt(0).toUpperCase() + path.slice(1);
}

export default Navbar;