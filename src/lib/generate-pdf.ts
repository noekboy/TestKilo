/**
 * =============================================================================
 * PDF GENERATOR — ORCHESTRATOR
 * =============================================================================
 *
 * This is the main entry point for PDF generation. It creates the jsPDF
 * document, delegates each page to its own renderer, and saves the file.
 *
 * AI BREADCRUMB: This file should stay SMALL. Each page's rendering logic
 * lives in its own file under src/lib/pdf/. If you need to modify a specific
 * page, edit the corresponding page file, NOT this orchestrator.
 *
 * Architecture:
 *   generate-pdf.ts (this file) — creates doc, calls page renderers, saves
 *   ├── pdf/config.ts    — colors, margins, font sizes, layout constants
 *   ├── pdf/utils.ts     — shared drawing helpers (header, footer, etc.)
 *   ├── pdf/page1-cover.ts    — Page 1: Cover page
 *   ├── pdf/page2-intro.ts    — Page 2: Introduction & Topics
 *   ├── pdf/page3-elearning.ts — Page 3: E-learning overview + course table
 *   ├── pdf/page4-maatwerk.ts  — Page 4: Maatwerk e-learning details (can span multiple pages)
 *   ├── pdf/page5-borging.ts   — Page 5: Borging & Ondersteuning (can span multiple pages)
 *   ├── pdf/page6-arbo.ts      — Page 6: Fysieke trainingen en ARBO ondersteuning (can span multiple pages)
 *   └── pdf/page7-leerlijn-bouw.ts — Page 7: Voorbeeld leerlijn bouw (can span multiple pages)
 *
 * Types & data live in: src/types/index.ts
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { PAGE } from "./pdf/config";
import { drawFooter } from "./pdf/utils";
import { renderPage1 } from "./pdf/page1-cover";
import { renderPage2 } from "./pdf/page2-intro";
import { renderPage3 } from "./pdf/page3-elearning";
import { renderPage4 } from "./pdf/page4-maatwerk";
import { renderPage5 } from "./pdf/page5-borging";
import { renderPage6 } from "./pdf/page6-arbo";
import { renderPage7 } from "./pdf/page7-leerlijn-bouw";

/**
 * Generates a PDF quote document and triggers a browser download.
 * The document has at least 7 pages, but Pages 4-7 can span multiple pages
 * if the content overflows.
 *
 * @param data - Form data from the QuoteForm component
 *
 * AI BREADCRUMB: This function is called from quote-form.tsx on form submit.
 * The jsPDF doc is created here and passed to each page renderer.
 * Each renderer draws on the current page, then the orchestrator adds
 * a new page before calling the next renderer.
 */
export async function generatePDF(data: QuoteFormData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // PAGE 1: Cover page (first page is already created by jsPDF)
  renderPage1(doc, data);

  // PAGE 2: Introduction & Topics
  doc.addPage();
  renderPage2(doc, data);

  // PAGE 3: E-learning overview + course table
  doc.addPage();
  renderPage3(doc, data);

  // PAGE 4: Maatwerk e-learning details (can span multiple pages)
  doc.addPage();
  const { totalPages: page4Total } = renderPage4(doc, data, 4);

  // PAGE 5+: Borging & Ondersteuning (starts on page after Page 4's last page)
  doc.addPage();
  const { totalPages: page5Total } = renderPage5(doc, data, page4Total + 1);

  // PAGE 6+: Fysieke trainingen en ARBO ondersteuning (starts on page after Page 5's last page)
  doc.addPage();
  const { totalPages: page6Total } = renderPage6(doc, data, page5Total + 1);

  // PAGE 7+: Voorbeeld leerlijn bouw (starts on page after Page 6's last page)
  doc.addPage();
  const { totalPages: page7Total } = renderPage7(doc, data, page6Total + 1);

  const totalPages = page7Total;

  // Update footers on pages 1-3 with correct total page count
  // Note: Pages 4-7 footers are already drawn with correct count in their renderers
  drawFooter(doc, 1, data, totalPages);
  
  doc.setPage(2);
  drawFooter(doc, 2, data, totalPages);
  
  doc.setPage(3);
  drawFooter(doc, 3, data, totalPages);

  // Save — triggers browser download
  doc.save(`Offerte_${data.offerte_nummer}_${data.klantnaam.replace(/\s+/g, "_")}.pdf`);
}
