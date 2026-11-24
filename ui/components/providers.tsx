"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { swrConfig } from "@/lib/api/swr";
import { Toaster } from "@/components/ui/sonner";

// Tema claro/escuro (segue o sistema até a pessoa escolher), cache da API e avisos (Sonner, do shadcn).
// reducedMotion="user": as animações do motion respeitam o "reduzir movimento" do sistema.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SWRConfig value={swrConfig}>
        <MotionConfig reducedMotion="user">
          {children}
          {/* No máximo 3 avisos; o tempo pausa com o cursor em cima (comportamento do Sonner) */}
          <Toaster position="bottom-right" visibleToasts={3} closeButton mobileOffset={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }} />
        </MotionConfig>
      </SWRConfig>
    </ThemeProvider>
  );
}
