"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../shared/Themetoggle";

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    title: "Products",
    icon: <ShoppingBag className="h-5 w-5" />,
    href: "/products",
  },
  {
    title: "Customers",
    icon: <Users className="h-5 w-5" />,
    href: "/customers",
  },
  {
    title: "Inventory",
    icon: <Building2 className="h-5 w-5" />,
    href: "/Inventory-management/view",
  },
  {
    title: "Purchase",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/purchase",
  },
  {
    title: "Promote",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/suppliers",
  },
   {
    title: "Sales",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/sales",
  },
];

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [orgLogo, setOrgLogo] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.organization?.logo) {
          setOrgLogo(data.organization.logo);
        }
        if (data?.organization?.name) {
          setOrgName(data.organization.name);
        }
      });
  }, []);

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed left-0 z-40 h-full w-64 border-r bg-white dark:bg-zinc-900 text-sidebar-foreground "
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-4 gap-3">
        {orgLogo ? (
          <img
            src={orgLogo}
            alt="Organization Logo"
            className="h-8 w-8 rounded-full object-cover border"
          />
        ) : (
          <div className="h-8 w-8 rounded bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
            <Home className="h-5 w-5 text-primary" />
          </div>
        )}
        <span className="text-xl font-bold truncate">
          {orgName || "Dashboard"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {sidebarLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <motion.div
              key={link.href}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive
                    ? "bg-gray-100 dark:bg-zinc-800 text-primary font-medium"
                    : "hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full border-t border-sidebar-border p-4">
        <div className="flex flex-col gap-2">
          {/* Theme Toggle */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Theme
            </span>
            <ThemeToggle />
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </motion.button>
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </motion.button>
          {/* Organization Logo */}
          {orgLogo && (
            <div className="flex items-center justify-center mt-4 gap-3">
              <img
                src={orgLogo}
                alt="Organization Logo"
                className="h-10 w-10 rounded-full object-cover border"
              />
              <span className="text-lg font-semibold truncate">{orgName}</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
