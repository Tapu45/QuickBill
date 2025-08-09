import React from 'react';
import { EnvelopeSimple, PhoneCall, MapPin, GithubLogo, LinkedinLogo, Globe } from "phosphor-react";

const FooterSection: React.FC = () => (
  <footer
    className="footer-section"
    style={{
      background: "var(--sidebar)",
      color: "var(--sidebar-foreground)",
      padding: "3.5rem 0 2rem 0",
      borderTop: "1px solid var(--sidebar-border)",
      fontFamily: "var(--font-sans)",
      position: "relative",
      zIndex: 10,
    }}
  >
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-12">
      {/* Logo & About */}
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem" }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
            alt="BillCraft Logo"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              objectFit: "cover",
              boxShadow: "var(--shadow-xs)",
              background: "var(--card)",
            }}
          />
          <span style={{
            fontWeight: 800,
            fontSize: "1.7rem",
            color: "var(--sidebar-primary)",
            letterSpacing: "-0.03em",
            fontFamily: "var(--font-sans)",
          }}>
            BillCraft
          </span>
        </div>
        <p style={{
          color: "var(--muted-foreground)",
          fontSize: "1.05rem",
          marginBottom: "1.2rem",
          maxWidth: 320,
        }}>
          Universal Billing Software for tile showrooms, retail, and more. GST-ready, scalable, and secure. Trusted by businesses across India.
        </p>
      </div>
      {/* Navigation */}
      <nav style={{ flex: 1, minWidth: 180 }}>
        <h4 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--sidebar-primary)" }}>Quick Links</h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li><a href="/about" style={{ color: "var(--sidebar-primary)", textDecoration: "none", marginBottom: "0.5rem", display: "inline-block" }}>About</a></li>
          <li><a href="/contact" style={{ color: "var(--sidebar-primary)", textDecoration: "none", marginBottom: "0.5rem", display: "inline-block" }}>Contact</a></li>
          <li><a href="/privacy" style={{ color: "var(--sidebar-primary)", textDecoration: "none", marginBottom: "0.5rem", display: "inline-block" }}>Privacy Policy</a></li>
          <li><a href="/terms" style={{ color: "var(--sidebar-primary)", textDecoration: "none", marginBottom: "0.5rem", display: "inline-block" }}>Terms & Conditions</a></li>
          <li><a href="/faq" style={{ color: "var(--sidebar-primary)", textDecoration: "none", marginBottom: "0.5rem", display: "inline-block" }}>FAQ</a></li>
        </ul>
      </nav>
      {/* Contact Info */}
      <div style={{ flex: 1, minWidth: 180 }}>
        <h4 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--sidebar-primary)" }}>Contact Us</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          <span><EnvelopeSimple size={18} color="var(--sidebar-primary)" style={{ marginRight: 6 }} /> support@billcraft.com</span>
          <span><PhoneCall size={18} color="var(--sidebar-primary)" style={{ marginRight: 6 }} /> +1-234-567-890</span>
          <span><MapPin size={18} color="var(--sidebar-primary)" style={{ marginRight: 6 }} /> 123 Business Rd, Suite 100, City, Country</span>
        </div>
        <div style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
          Mon-Fri: 9am - 7pm<br />
          Sat: 10am - 4pm<br />
          <span style={{ color: "var(--sidebar-primary)", fontWeight: 600 }}>24x7 Email Support</span>
        </div>
      </div>
      {/* Social & Company */}
      <div style={{ flex: 1, minWidth: 180 }}>
        <h4 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--sidebar-primary)" }}>Connect</h4>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <a href="https://github.com/billcraft" target="_blank" rel="noopener noreferrer"><GithubLogo size={24} color="var(--sidebar-primary)" /></a>
          <a href="https://linkedin.com/company/billcraft" target="_blank" rel="noopener noreferrer"><LinkedinLogo size={24} color="var(--sidebar-primary)" /></a>
          <a href="https://billcraft.com" target="_blank" rel="noopener noreferrer"><Globe size={24} color="var(--sidebar-primary)" /></a>
        </div>
        <div style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>
          &copy; {new Date().getFullYear()} BillCraft. All rights reserved.
        </div>
        <div style={{ fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
          Made with ❤️ by Nexus Infotech
        </div>
      </div>
    </div>
  </footer>
  );

export default FooterSection;