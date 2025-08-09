"use client";
import { useEffect, ReactNode } from "react";
import Lenis from "@studio-freight/lenis";

// Hook for Lenis
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}

// Provider component for Lenis
export function LenisProvider({ children }: { children: ReactNode }) {
  useLenis();
  return <>{children}</>;
}