"use client";

import { useState, useEffect } from "react";

/**
 * Breakpoints and their pixel ranges:
 * - `sm`: ≥ 640px
 * - `md`: ≥ 768px
 * - `lg`: ≥ 1024px
 * - `xl`: ≥ 1280px
 * - `2xl`: ≥ 1536px
 */
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * Breakpoints and their pixel ranges:
 * - `sm`: ≥ 640px
 * - `md`: ≥ 768px
 * - `lg`: ≥ 1024px
 * - `xl`: ≥ 1280px
 * - `2xl`: ≥ 1536px
 */
type Breakpoints = {
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  "2xl": boolean;
  isMobile: boolean; // New property to indicate mobile screens
};

const useResponsive = () => {
  const [breakpointStatus, setBreakpointStatus] = useState<Breakpoints>({
    sm: false,
    md: false,
    lg: false,
    xl: false,
    "2xl": false,
    isMobile: false,
  });

  const updateBreakpointStatus = () => {
    const width = window.innerWidth;

    setBreakpointStatus({
      sm: width >= breakpoints.sm,
      md: width >= breakpoints.md,
      lg: width >= breakpoints.lg,
      xl: width >= breakpoints.xl,
      "2xl": width >= breakpoints["2xl"],
      isMobile: width < breakpoints.sm, // Determine if it's a mobile screen
    });
  };

  useEffect(() => {
    // Initial check on mount
    updateBreakpointStatus();

    // Add resize event listener
    window.addEventListener("resize", updateBreakpointStatus);

    // Clean up listener on unmount
    return () => {
      window.removeEventListener("resize", updateBreakpointStatus);
    };
  }, []);

  return breakpointStatus;
};

export { useResponsive };
