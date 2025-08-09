import React from 'react';
import { motion } from "framer-motion";
import { EnvelopeSimple, PhoneCall } from "phosphor-react";

const SecondaryCTASection: React.FC = () => (
  <section
    className="secondary-cta-section"
    style={{
      background: "var(--background)",
      padding: "3rem 0 2rem 0",
      minHeight: "20vh",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "3rem",
      flexWrap: "wrap",
    }}
  >
    {/* Decorative gradients */}
    <div
      style={{
        position: "absolute",
        top: "-40px",
        left: "-40px",
        width: "120px",
        height: "120px",
        background: "radial-gradient(circle at 60% 40%, var(--primary) 0%, transparent 80%)",
        opacity: 0.07,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: "-30px",
        right: "-30px",
        width: "90px",
        height: "90px",
        background: "radial-gradient(circle at 40% 60%, var(--chart-2) 0%, transparent 80%)",
        opacity: 0.05,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "var(--card)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-md)",
        padding: "2rem 2.5rem",
        minWidth: "280px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid var(--border)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <EnvelopeSimple size={32} color="var(--primary)" style={{ marginBottom: "0.5rem" }} />
      <h3
        style={{
          color: "var(--primary)",
          fontSize: "1.25rem",
          fontWeight: 700,
          marginBottom: "1rem",
          fontFamily: "var(--font-sans)",
        }}
      >
        Stay Updated
      </h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          window.alert("Subscribed!");
        }}
        style={{
          display: "flex",
          gap: "0.5rem",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <input
          type="email"
          placeholder="Your email"
          required
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            fontSize: "1rem",
            width: "60%",
            background: "var(--input)",
            color: "var(--card-foreground)",
          }}
        />
        <button
          type="submit"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            borderRadius: "var(--radius)",
            padding: "0.6rem 1.2rem",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "var(--shadow-xs)",
            transition: "background 0.2s",
          }}
        >
          Subscribe
        </button>
      </form>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        background: "var(--card)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-md)",
        padding: "2rem 2.5rem",
        minWidth: "280px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid var(--border)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <PhoneCall size={32} color="var(--chart-2)" style={{ marginBottom: "0.5rem" }} />
      <h3
        style={{
          color: "var(--chart-2)",
          fontSize: "1.25rem",
          fontWeight: 700,
          marginBottom: "1rem",
          fontFamily: "var(--font-sans)",
        }}
      >
        Contact Us
      </h3>
      <button
        onClick={() => window.alert("Contact form coming soon!")}
        style={{
          background: "var(--chart-2)",
          color: "var(--primary-foreground)",
          border: "none",
          borderRadius: "var(--radius)",
          padding: "0.7rem 1.6rem",
          fontWeight: 600,
          fontSize: "1rem",
          cursor: "pointer",
          boxShadow: "var(--shadow-xs)",
          transition: "background 0.2s",
        }}
      >
        Get in Touch
      </button>
    </motion.div>
  </section>
);

export default SecondaryCTASection;