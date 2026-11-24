"use client";

import { MotionConfig } from "motion/react";
import Toaster from "./toast";

// reducedMotion="user": as animações do motion respeitam o "reduzir movimento" do sistema
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <Toaster />
    </MotionConfig>
  );
}
