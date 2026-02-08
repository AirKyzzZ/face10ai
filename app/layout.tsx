import type React from "react";

// This root layout is minimal - the main layout with providers is in [locale]/layout.tsx
// This layout is needed for non-localized routes like API routes
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
