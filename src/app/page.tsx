"use client";

import SecondaryCTASection from "@/components/minicomponents/Home/CTA";
import ProductDemoSection from "@/components/minicomponents/Home/Demo";
import FeaturesSection from "@/components/minicomponents/Home/features";
import HeroSection from "@/components/minicomponents/Home/Hero";
import HowItWorksSection from "@/components/minicomponents/Home/HowItWorks";
import SocialProofSection from "@/components/minicomponents/Home/Testimonials";
import AboutTrustSection from "@/components/minicomponents/Home/Trust";
import FooterSection from "@/components/minicomponents/Home/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-0 flex-1 items-center px-4 sm:px-20 ">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      
         <SocialProofSection />
       <SecondaryCTASection />
      </main>
      <FooterSection />
    </div>
  );
}