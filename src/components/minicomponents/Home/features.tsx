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
    icon: <Lightning size={36} weight="fill" color="var(--primary)" />,
    title: "Easy Invoicing",
    description:
      "Create and send invoices in seconds with a streamlined, intuitive interface. Customize your invoices and automate recurring billing.",
  },
  {
    icon: <CurrencyDollar size={36} weight="fill" color="var(--chart-2)" />,
    title: "Track Payments",
    description:
      "Monitor payments in real-time, send reminders, and get paid faster. Stay on top of your cash flow with smart notifications.",
  },
  {
    icon: <ChartBar size={36} weight="fill" color="var(--chart-1)" />,
    title: "Analytics",
    description:
      "Gain insights with real-time analytics. Visualize revenue, outstanding invoices, and customer trends with beautiful charts.",
  },
  {
    icon: <Users size={36} weight="fill" color="var(--sidebar-primary)" />,
    title: "Role-Based Access",
    description:
      "Secure your data with role-based access control for Admin, Cashier, Manager, and Salesperson.",
  },
  {
    icon: <ArchiveBox size={36} weight="fill" color="var(--primary)" />,
    title: "Inventory Management",
    description:
      "Automatic stock updates, multi-location support, and reorder alerts to prevent stockouts.",
  },
  {
    icon: <Receipt size={36} weight="fill" color="var(--chart-2)" />,
    title: "GST-Compliant Billing",
    description:
      "Generate GST-compliant invoices with auto-calculated taxes and HSN code management.",
  },
  {
    icon: <ShieldCheck size={36} weight="fill" color="var(--chart-1)" />,
    title: "Secure & Reliable",
    description:
      "Data encryption, secure login, and regular backups ensure your business data is safe.",
  },
  {
    icon: <FileText size={36} weight="fill" color="var(--sidebar-primary)" />,
    title: "Customizable Documents",
    description:
      "Personalize invoice formats (A4/POS), add logos, terms, and QR codes.",
  },
  {
    icon: <Warehouse size={36} weight="fill" color="var(--primary)" />,
    title: "Multi-Warehouse Support",
    description:
      "Manage inventory across multiple warehouses with real-time visibility.",
  },
  {
    icon: <Calculator size={36} weight="fill" color="var(--chart-2)" />,
    title: "Tile Area Calculator",
    description:
      "Built-in area calculator, box-to-sqft converter, and wastage estimator.",
  },
  {
    icon: <QrCode size={36} weight="fill" color="var(--chart-1)" />,
    title: "E-Invoice & QR Code",
    description:
      "Generate e-invoices with QR codes for easy verification and compliance.",
  },
  {
    icon: <TrendUp size={36} weight="fill" color="var(--sidebar-primary)" />,
    title: "Advanced Reporting",
    description:
      "Comprehensive sales, purchase, stock, and outstanding reports.",
  },
  {
    icon: <ClipboardText size={36} weight="fill" color="var(--primary)" />,
    title: "Customer & Supplier Ledger",
    description:
      "Track transactions, outstanding balances, and payment history.",
  },
  {
    icon: <BookOpen size={36} weight="fill" color="var(--chart-2)" />,
    title: "Accounts & Ledger",
    description:
      "Manage receipts, payments, cash book, expenses, and bank transactions.",
  },
  {
    icon: <Bank size={36} weight="fill" color="var(--chart-1)" />,
    title: "Bank & UPI Integration",
    description:
      "Record and reconcile bank, cheque, and UPI transactions for accounting.",
  },
  {
    icon: <Barcode size={36} weight="fill" color="var(--sidebar-primary)" />,
    title: "Barcode & RFID Ready",
    description:
      "Future-ready with barcode and RFID integration for fast billing.",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90 } },
};

const FeaturesSection: React.FC = () => (
  <section className="relative overflow-hidden bg-background py-10 md:py-12">
    <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-20 pointer-events-none" />
    <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-tr from-accent/10 to-transparent opacity-16 pointer-events-none" />

    <motion.div
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="mx-auto max-w-2xl text-center px-4 sm:px-6 relative z-10"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary leading-tight mb-3">
        Powerful Features for Every Business
      </h2>
      <p className="text-sm sm:text-base text-muted-foreground font-medium mb-8">
        Universal Billing Software designed for tile showrooms, retail, and more.
        <span className="block text-sidebar-primary font-semibold mt-2">
          GST-ready, scalable, and beautifully integrated.
        </span>
      </p>
    </motion.div>

    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-7xl mx-auto px-4 sm:px-6 z-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          className="relative bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center transition-transform duration-200 hover:shadow-lg"
        >
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full opacity-10 bg-primary/30 pointer-events-none" />
          <div className="bg-card shadow-sm rounded-full p-3 mb-4 flex items-center justify-center">
            {feature.icon}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

export default FeaturesSection;