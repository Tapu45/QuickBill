import React from "react";
import { motion } from "framer-motion";
import {
  Lightning,
  CurrencyDollar,
  ChartBar,
  Users,
  ArchiveBox,
  Receipt,
  ShieldCheck,
  FileText,
  House as Warehouse,
  Calculator,
  QrCode,
  TrendUp,
  ClipboardText,
  BookOpen,
  Bank,
  Barcode,
  DeviceMobile,
} from "phosphor-react";

const features = [
  {
    icon: <Lightning size={40} weight="fill" color="var(--primary)" />,
    title: "Easy Invoicing",
    description: "Create and send invoices in seconds with a streamlined, intuitive interface. Customize your invoices and automate recurring billing.",
    bg: "var(--secondary)",
  },
  {
    icon: <CurrencyDollar size={40} weight="fill" color="var(--chart-2)" />,
    title: "Track Payments",
    description: "Monitor payments in real-time, send reminders, and get paid faster. Stay on top of your cash flow with smart notifications.",
    bg: "var(--accent)",
  },
  {
    icon: <ChartBar size={40} weight="fill" color="var(--chart-1)" />,
    title: "Analytics",
    description: "Gain insights with real-time analytics. Visualize revenue, outstanding invoices, and customer trends with beautiful charts.",
    bg: "var(--muted)",
  },
  {
    icon: <Users size={40} weight="fill" color="var(--sidebar-primary)" />,
    title: "Role-Based Access",
    description: "Secure your data with role-based access control for Admin, Cashier, Manager, and Salesperson. Track login history for all users.",
    bg: "var(--sidebar-accent)",
  },
  {
    icon: <ArchiveBox size={40} weight="fill" color="var(--primary)" />,
    title: "Inventory Management",
    description: "Automatic stock updates, manual adjustments, multi-location warehouse support, and reorder level alerts to prevent stockouts.",
    bg: "var(--secondary)",
  },
  {
    icon: <Receipt size={40} weight="fill" color="var(--chart-2)" />,
    title: "GST-Compliant Billing",
    description: "Generate GST-compliant invoices with auto-calculated CGST, SGST, IGST, and HSN code management. Ready for GSTR-1 and GSTR-3B.",
    bg: "var(--accent)",
  },
  {
    icon: <ShieldCheck size={40} weight="fill" color="var(--chart-1)" />,
    title: "Secure & Reliable",
    description: "Data encryption, secure login, and regular backups ensure your business data is always safe and available.",
    bg: "var(--muted)",
  },
  {
    icon: <FileText size={40} weight="fill" color="var(--sidebar-primary)" />,
    title: "Customizable Documents",
    description: "Personalize invoice formats (A4/POS), add your logo, terms, and QR codes. Configure quotations and delivery challans.",
    bg: "var(--sidebar-accent)",
  },
  {
    icon: <Warehouse size={40} weight="fill" color="var(--primary)" />,
    title: "Multi-Warehouse Support",
    description: "Manage inventory across multiple warehouses or locations, with real-time stock visibility and transfer options.",
    bg: "var(--secondary)",
  },
  {
    icon: <Calculator size={40} weight="fill" color="var(--chart-2)" />,
    title: "Tile Area Calculator",
    description: "Built-in area calculator, box-to-sqft converter, and wastage estimator for tile showrooms and similar businesses.",
    bg: "var(--accent)",
  },
  {
    icon: <QrCode size={40} weight="fill" color="var(--chart-1)" />,
    title: "E-Invoice & QR Code",
    description: "Generate e-invoices with QR codes for easy verification and compliance with government regulations.",
    bg: "var(--muted)",
  },
  {
    icon: <TrendUp size={40} weight="fill" color="var(--sidebar-primary)" />,
    title: "Advanced Reporting",
    description: "Comprehensive sales, purchase, stock, and customer outstanding reports. Day-end summaries and stock valuation.",
    bg: "var(--sidebar-accent)",
  },
  {
    icon: <ClipboardText size={40} weight="fill" color="var(--primary)" />,
    title: "Customer & Supplier Ledger",
    description: "Track all transactions, outstanding balances, and payment history for customers and suppliers.",
    bg: "var(--secondary)",
  },
  {
    icon: <BookOpen size={40} weight="fill" color="var(--chart-2)" />,
    title: "Accounts & Ledger",
    description: "Manage receipts, payments, daily cash book, expenses, and bank transactions with ease.",
    bg: "var(--accent)",
  },
  {
    icon: <Bank size={40} weight="fill" color="var(--chart-1)" />,
    title: "Bank & UPI Integration",
    description: "Record and reconcile bank, cheque, and UPI transactions for seamless accounting.",
    bg: "var(--muted)",
  },
  {
    icon: <Barcode size={40} weight="fill" color="var(--sidebar-primary)" />,
    title: "Barcode & RFID Ready",
    description: "Future-ready with barcode and RFID integration for fast billing and inventory management.",
    bg: "var(--sidebar-accent)",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } },
};

const FeaturesSection: React.FC = () => (
  <section
    className="features-section"
    style={{
      background: "var(--background)",
      padding: "4rem 0 6rem 0",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Decorative background gradients */}
    <div
      style={{
        position: "absolute",
        top: "-120px",
        left: "-120px",
        width: "340px",
        height: "340px",
        background: "",
        opacity: 0.12,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: "-100px",
        right: "-100px",
        width: "300px",
        height: "300px",
        background: "",
        opacity: 0.10,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
      className="mx-auto max-w-2xl text-center relative z-10"
    >
      <h2
        style={{
          color: "var(--primary)",
          fontSize: "2.7rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          marginBottom: "1rem",
          fontFamily: "var(--font-sans)",
        }}
      >
        Powerful Features for Every Business
      </h2>
      <p
        style={{
          color: "var(--muted-foreground)",
          fontSize: "1.25rem",
          marginBottom: "2.5rem",
          fontWeight: 500,
        }}
      >
        Universal Billing Software designed for tile showrooms, retail, and more. <br />
        <span style={{ color: "var(--sidebar-primary)", fontWeight: 600 }}>
          GST-ready, scalable, and beautifully integrated.
        </span>
      </p>
    </motion.div>
        <motion.div
      className="features-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {features.map((feature, idx) => (
               <motion.div
          key={idx}
          variants={itemVariants}
          whileHover={{
            scale: 1.045,
            boxShadow: "0 8px 32px 0 var(--shadow-lg)",
            y: -6,
          }}
          style={{
            background: "var(--card)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-md)",
            padding: "1.2rem 0.7rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "180px",
            border: "1px solid var(--border)",
            transition: "box-shadow 0.2s, transform 0.2s",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle icon background */}
          <div
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              width: "48px",
              height: "48px",
              background: "radial-gradient(circle, var(--primary) 60%, transparent 100%)",
              opacity: 0.08,
              zIndex: 1,
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              background: "var(--card)",
              borderRadius: "50%",
              padding: "0.7rem",
              marginBottom: "1rem",
              boxShadow: "var(--shadow-xs)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            {feature.icon}
          </div>
          <h3
            style={{
              color: "var(--card-foreground)",
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              textAlign: "center",
              fontFamily: "var(--font-sans)",
              zIndex: 2,
            }}
          >
            {feature.title}
          </h3>
          <p
            style={{
              color: "var(--muted-foreground)",
              fontSize: "0.95rem",
              textAlign: "center",
              lineHeight: 1.5,
              zIndex: 2,
            }}
          >
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

export default FeaturesSection;