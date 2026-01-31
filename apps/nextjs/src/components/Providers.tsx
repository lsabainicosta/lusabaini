"use client";

import { ContactModalProvider, ContactModal } from "@/components/contact";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      {children}
      <ContactModal />
      <Toaster position="top-center" />
    </ContactModalProvider>
  );
}
