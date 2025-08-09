import React, { useState } from 'react';
import { motion } from "framer-motion";
import { UserPlus, Users, FileText, Receipt, DollarSign, Archive, BarChart3, QrCode, Calculator, TrendingUp, ChevronRight } from "lucide-react";

const steps = [
  {
    icon: <UserPlus size={24} />,
    title: "Sign Up & Set Up",
    description: "Create your free account, set your company details, GSTIN, and upload your logo for branded invoices.",
    shortDesc: "Account setup & company configuration"
  },
  {
    icon: <Users size={24} />,
    title: "Add Users & Roles",
    description: "Invite team members and assign roles (Admin, Cashier, Manager, Salesperson) for secure access.",
    shortDesc: "Team management & role assignments"
  },
  {
    icon: <FileText size={24} />,
    title: "Configure Products & Customers",
    description: "Add products with HSN, GST, rates, and minimum stock. Register customers and suppliers with credit limits.",
    shortDesc: "Product catalog & customer database"
  },
  {
    icon: <Receipt size={24} />,
    title: "Purchase & Stock Entry",
    description: "Enter purchase invoices, auto-update stock, and manage multi-location warehouses.",
    shortDesc: "Inventory management & purchases"
  },
  {
    icon: <DollarSign size={24} />,
    title: "Create Quotations & Sales Invoices",
    description: "Generate quotations and GST-compliant invoices. Print in A4/POS format or share digitally.",
    shortDesc: "Sales documentation & billing"
  },
  {
    icon: <Archive size={24} />,
    title: "Inventory & Area Calculation",
    description: "Track stock, get reorder alerts, and use built-in area calculator and box-to-sqft converter.",
    shortDesc: "Stock tracking & calculations"
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Track Payments & Ledger",
    description: "Monitor payments, send reminders, and manage customer/supplier ledgers and outstanding balances.",
    shortDesc: "Financial tracking & reminders"
  },
  {
    icon: <QrCode size={24} />,
    title: "E-Invoice & QR Code",
    description: "Generate e-invoices with QR codes for compliance and easy verification.",
    shortDesc: "Digital invoicing & compliance"
  },
  {
    icon: <Calculator size={24} />,
    title: "GST & Tax Reports",
    description: "Auto-calculate GST, generate HSN summaries, and export GSTR-1, GSTR-3B reports.",
    shortDesc: "Tax calculations & reporting"
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Analyze & Grow",
    description: "View sales, purchase, stock, and day-end reports. Make informed decisions with real-time analytics.",
    shortDesc: "Analytics & business insights"
  },
];

const HowItWorksSection = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <section
      style={{
        background: "var(--background)",
        padding: "5rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-5%",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          opacity: 0.03,
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "-5%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, var(--chart-1) 0%, transparent 70%)",
          opacity: 0.02,
          borderRadius: "50%",
        }}
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            style={{
              color: "var(--foreground)",
              fontSize: "2.5rem",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              marginBottom: "1rem",
              fontFamily: "var(--font-sans)",
            }}
          >
            How It Works
          </h2>
          <p
            style={{
              color: "var(--muted-foreground)",
              fontSize: "1.2rem",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Transform your business operations with our streamlined 10-step process
          </p>
        </motion.div>

        {/* Process Flow */}
        <div className="relative">
          {/* Connection Line */}
          <div
            style={{
              position: "absolute",
              top: "60px",
              left: "50%",
              right: "0",
              height: "2px",
              background: `linear-gradient(to right, var(--primary), var(--chart-1))`,
              transform: "translateX(-50%)",
              width: "90%",
              opacity: 0.2,
              zIndex: 1,
            }}
          />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                {/* Step Number & Icon */}
                <div className="relative mb-4">
                  {/* Step Number */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      width: "24px",
                      height: "24px",
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      zIndex: 2,
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "var(--card)",
                      border: "2px solid var(--border)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                      boxShadow: "var(--shadow-sm)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                  >
                    {step.icon}
                  </motion.div>

                  {/* Connection Arrow */}
                  {index < steps.length - 1 && (
                    <div
                      className="hidden lg:block absolute top-1/2 left-full ml-4"
                      style={{
                        transform: "translateY(-50%)",
                        color: "var(--muted-foreground)",
                        opacity: 0.4,
                      }}
                    >
                      <ChevronRight size={20} />
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="text-center">
                  <h3
                    style={{
                      color: "var(--foreground)",
                      fontSize: "1rem",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--muted-foreground)",
                      fontSize: "0.85rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {step.shortDesc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Expandable Details */}
        {expandedStep !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: "3rem",
              padding: "2rem",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {steps[expandedStep].icon}
              </div>
              <div className="flex-1">
                <h4
                  style={{
                    color: "var(--foreground)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Step {expandedStep + 1}: {steps[expandedStep].title}
                </h4>
                <p
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  {steps[expandedStep].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p
            style={{
              color: "var(--muted-foreground)",
              fontSize: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            Ready to streamline your business operations?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              padding: "0.75rem 2rem",
              borderRadius: "var(--radius-md)",
              border: "none",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "all 0.2s ease",
            }}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;