import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stub out optional jsPDF server-side deps (canvg, html2canvas, dompurify).
  // These are not needed for browser-side PDF generation.
  turbopack: {
    resolveAlias: {
      canvg: { browser: "./src/lib/empty-module.ts" },
      html2canvas: { browser: "./src/lib/empty-module.ts" },
      dompurify: { browser: "./src/lib/empty-module.ts" },
    },
  },
};

export default nextConfig;
