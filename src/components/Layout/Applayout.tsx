"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { usePathname } from "next/navigation"

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const showAppLayout = pathname !== "/" && !pathname.startsWith("/auth") &&
  pathname !== "/organization/create" &&  !pathname.startsWith("/user")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!showAppLayout) {
    // Just render children for home and auth pages
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex w-full overflow-hidden rounded-tl-2xl bg-background">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 pt-20"
          >
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">{children}</div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Layout;