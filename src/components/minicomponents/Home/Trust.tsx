import React from 'react';

const AboutTrustSection: React.FC = () => (
  <section className="about-trust-section">
    <h2>About Us</h2>
    <p>BillCraft is dedicated to simplifying your billing process with security and privacy at its core.</p>
    <div className="privacy-badges">
      <img src="/secure.svg" alt="Secure" />
      <img src="/gdpr.svg" alt="GDPR Compliant" />
    </div>
  </section>
);

export default AboutTrustSection;