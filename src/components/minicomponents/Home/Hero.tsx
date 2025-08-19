import React from "react";
import { motion } from "framer-motion";
import { Receipt, Users, House as Warehouse, ChartBar } from "phosphor-react";
import { ThemeToggle } from "@/components/shared/Themetoggle";
import DotGrid from "@/components/Animation/DotGrid";
import type { Variants } from "framer-motion";
import BlurText from "@/components/Animation/BlurText";

const floatingIconVariants: Variants = {
  initial: { opacity: 0, scale: 0.7, y: 40 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, type: "spring" as const },
  },
};

const Navbar: React.FC = () => (
  <nav className="fixed top-0 left-0 w-full z-30 bg-white/80 dark:bg-background/80 backdrop-blur border-b border-border shadow-sm flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 md:py-4 gap-2 md:gap-0">
    <div className="flex items-center gap-2">
      <span className="text-xl md:text-2xl font-bold text-primary">QuickBill</span>
      <span className="ml-2 px-2 py-0.5 rounded bg-primary/10 text-xs text-primary font-semibold">
        Beta
      </span>
    </div>
    <div className="flex items-center gap-4 md:gap-6 mt-2 md:mt-0">
      <a
        href="#features"
        className="text-muted-foreground hover:text-primary transition font-medium text-sm md:text-base"
      >
        Features
      </a>
      <a
        href="#pricing"
        className="text-muted-foreground hover:text-primary transition font-medium text-sm md:text-base"
      >
        Pricing
      </a>
      <a
        href="#contact"
        className="text-muted-foreground hover:text-primary transition font-medium text-sm md:text-base"
      >
        Contact
      </a>
      <ThemeToggle />
    </div>
  </nav>
);

const HeroSection: React.FC = () => (
  <>
    <Navbar />

    <section className="w-screen min-h-[100vh] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 pt-[70px] md:pt-[80px]">
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <DotGrid
          dotSize={1}
          gap={20}
          baseColor="#c96442"
          activeColor="#c96442"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {/* Floating icons */}
      <motion.div
        className="absolute top-16 left-4 md:top-24 md:left-10 z-10"
        variants={floatingIconVariants}
        initial="initial"
        animate="animate"
      >
        <Receipt
          size={36}
          weight="duotone"
          className="text-primary drop-shadow-lg bg-white rounded-2xl p-2"
        />
      </motion.div>
      <motion.div
        className="absolute top-16 right-4 md:top-24 md:right-16 z-10"
        variants={floatingIconVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
      >
        <Users
          size={36}
          weight="duotone"
          className="text-secondary drop-shadow-lg bg-white rounded-2xl p-2"
        />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-6 md:bottom-16 md:left-24 z-10"
        variants={floatingIconVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4 }}
      >
        <Warehouse
          size={36}
          weight="duotone"
          className="text-accent drop-shadow-lg bg-white rounded-2xl p-2"
        />
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-6 md:bottom-10 md:right-24 z-10"
        variants={floatingIconVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.6 }}
      >
        <ChartBar
          size={36}
          weight="duotone"
          className="text-primary drop-shadow-lg bg-white rounded-2xl p-2"
        />
      </motion.div>
      {/* Main content */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center max-w-lg md:max-w-2xl mx-auto"
        >
          <span className="inline-block bg-primary/20 text-primary font-semibold px-3 md:px-4 py-2 rounded-full mb-4 md:mb-6 text-xs md:text-sm shadow">
            🚀 New! Universal Billing for Multi-domain Businesses
          </span>
          <BlurText
            text="One Billing Platform For Every Business"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-2xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 tracking-tight leading-tight"
          />
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8">
            <span className="font-semibold text-primary">
              Transform your business operations
            </span>{" "}
            from{" "}
            <span className="font-semibold">
              tile showrooms to retail stores
            </span>
            .
            <br />
            <span className="var(--muted-foreground)">
              GST-compliant, inventory-smart, and brilliantly adaptable to any
              industry.
            </span>
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-primary text-primary-foreground px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold shadow-md transition mb-3 md:mb-4 text-sm md:text-base"
            onClick={() => (window.location.href = "/auth")}
          >
            Get Started – It's Free
          </motion.button>
        </motion.div>
      </div>
    </section>
  </>
)

export default HeroSection;