import React from 'react';
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "BillCraft saved us hours every week! The automation and GST features are a game changer.",
    author: "Alex, Startup CEO",
    company: "TileX",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "Super intuitive and reliable. Inventory and reporting are spot on for my retail business.",
    author: "Priya, Freelancer",
    company: "Priya Designs",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "Best billing software for multi-location stores. Support is excellent.",
    author: "Rahul, Store Manager",
    company: "Urban Hardware",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

const logos = [
  "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png",
  "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
];
const ratings = "⭐️⭐️⭐️⭐️⭐️ 4.9/5 (200+ reviews)";

const SocialProofSection: React.FC = () => (
  <section
    className="social-proof-section"
    style={{
      background: "var(--background)",
      padding: "4rem 0 3rem 0",
      minHeight: "40vh",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Decorative gradient */}
    <div
      style={{
        position: "absolute",
        top: "-60px",
        left: "-60px",
        width: "180px",
        height: "180px",
        background: "",
        opacity: 0.08,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: "-40px",
        right: "-40px",
        width: "120px",
        height: "120px",
        background: "",
        opacity: 0.06,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />

    <div className="max-w-5xl mx-auto px-4 relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          color: "var(--primary)",
          fontSize: "2rem",
          fontWeight: 800,
          textAlign: "center",
          marginBottom: "2rem",
          fontFamily: "var(--font-sans)",
        }}
      >
        Trusted by Businesses Across India
      </motion.h2>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {testimonials.map((t, idx) => (
          <motion.blockquote
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            style={{
              background: "var(--card)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-md)",
              padding: "2rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid var(--border)",
              minHeight: "220px",
              position: "relative",
            }}
          >
            <img
              src={t.avatar}
              alt={t.author}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "1rem",
                boxShadow: "var(--shadow-xs)",
              }}
            />
            <p
              style={{
                color: "var(--card-foreground)",
                fontSize: "1.05rem",
                fontWeight: 500,
                textAlign: "center",
                marginBottom: "1rem",
                fontFamily: "var(--font-sans)",
              }}
            >
              “{t.quote}”
            </p>
            <footer
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.95rem",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              {t.author} <span style={{ color: "var(--primary)", fontWeight: 700 }}>· {t.company}</span>
            </footer>
          </motion.blockquote>
        ))}
      </div>

      {/* Logos */}
      <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
        {logos.map((logo, idx) => (
          <img
            key={idx}
            src={logo}
            alt="Company logo"
            style={{
              width: "64px",
              height: "auto",
              opacity: 0.8,
              filter: "grayscale(80%)",
            }}
          />
        ))}
      </div>

      {/* Ratings */}
      <div className="text-center mb-2">
        <span
          style={{
            color: "var(--sidebar-primary)",
            fontWeight: 700,
            fontSize: "1.1rem",
            background: "var(--accent)",
            borderRadius: "var(--radius)",
            padding: "0.4rem 1.2rem",
            boxShadow: "var(--shadow-xs)",
            letterSpacing: "0.02em",
          }}
        >
          {ratings}
        </span>
      </div>
    </div>
  </section>
);

export default SocialProofSection;