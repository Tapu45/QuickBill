import React from "react";
import { motion } from "framer-motion";
import { Receipt, QrCode } from "phosphor-react";

// Animation for a bill/invoice appearing step by step
const billVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 80 } },
};

const BillAnimation: React.FC = () => (
  <motion.div
    className="relative flex flex-col items-center justify-center"
    variants={billVariants}
    initial="hidden"
    animate="visible"
    style={{
      width: 320,
      minHeight: 420,
      background: "var(--card)",
      borderRadius: "1.5rem",
      boxShadow: "var(--shadow-lg)",
      border: "1px solid var(--border)",
      padding: "2rem 1.5rem",
      position: "relative",
    }}
  >
    {/* Bill Header */}
    <motion.div
      variants={rowVariants}
      className="flex items-center gap-2 mb-4"
      style={{ justifyContent: "center" }}
    >
      <Receipt size={32} color="var(--primary)" />
      <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--primary)" }}>
        Invoice #1023
      </span>
    </motion.div>
    {/* Company Info */}
    <motion.div variants={rowVariants} className="mb-2 text-sm text-muted-foreground">
      <span style={{ fontWeight: 600 }}>TileX Pvt Ltd</span> <br />
      GSTIN: 22AAAAA0000A1Z5
    </motion.div>
    {/* Bill Rows */}
    <motion.div variants={rowVariants} className="w-full mb-2">
      <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1">
        <span>Product</span>
        <span>Qty</span>
        <span>Rate</span>
        <span>GST</span>
        <span>Total</span>
      </div>
      <motion.div variants={rowVariants} className="flex justify-between text-xs mb-1">
        <span>Glossy Tile</span>
        <span>10</span>
        <span>₹120</span>
        <span>18%</span>
        <span>₹1,416</span>
      </motion.div>
      <motion.div variants={rowVariants} className="flex justify-between text-xs mb-1">
        <span>Matte Tile</span>
        <span>5</span>
        <span>₹110</span>
        <span>18%</span>
        <span>₹649</span>
      </motion.div>
    </motion.div>
    {/* GST & Total */}
    <motion.div variants={rowVariants} className="flex justify-between w-full mt-4 mb-2 text-sm font-semibold">
      <span>GST Total</span>
      <span>₹373</span>
    </motion.div>
    <motion.div variants={rowVariants} className="flex justify-between w-full mb-4 text-lg font-bold text-primary">
      <span>Grand Total</span>
      <span>₹2,065</span>
    </motion.div>
    {/* QR Code Animation */}
    <motion.div
      variants={rowVariants}
      className="flex flex-col items-center justify-center mt-2"
      style={{ gap: "0.5rem" }}
    >
      <QrCode size={40} color="var(--chart-2)" />
      <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
        Scan for e-invoice
      </span>
    </motion.div>
    {/* GST Stamp Animation */}
    <motion.div
      variants={rowVariants}
      className="absolute top-4 right-4 bg-primary/10 px-3 py-1 rounded-full text-xs font-bold text-primary"
      style={{ boxShadow: "var(--shadow-xs)" }}
    >
      GST-Ready
    </motion.div>
  </motion.div>
);

export default BillAnimation;