/**
 * =============================================================================
 * PAGE 1: COVER PAGE
 * =============================================================================
 *
 * Renders the quote cover page with:
 * - Blue decorative curve (top right)
 * - 't web logo with icon (left side)
 * - Slogan text
 * - Beige banner with "Maatwerk e-learning | Offerte {nummer}"
 * - Recipient address block (client name + contact person)
 * - Footer with company info
 *
 * AI BREADCRUMB: This page is mostly FIXED layout. Only the quote number,
 * client name, contact person, and date come from form data.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { COLORS, LAYOUT, FONT_SIZE, PAGE, COVER } from "./config";
import { drawTopRightCurve, drawLogo } from "./utils";

export function renderPage1(doc: jsPDF, data: QuoteFormData): void {
  const { margin } = LAYOUT;

  // --- Blue decorative curve (top right corner) ---
  drawTopRightCurve(doc);

  // --- Logo: "'t web" with icon (left side) ---
  drawLogo(doc, "left");

  // --- Slogan under logo ---
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.lightGray);
  doc.text("Jouw partner voor veiligheid, compliancy en borging", margin, 35);

  // --- Beige banner with title and quote number ---
  doc.setFillColor(...COLORS.beige);
  doc.rect(0, COVER.bannerY, PAGE.width, COVER.bannerHeight, "F");

  // Banner text: "Maatwerk e-learning | Offerte {nummer}"
  doc.setFontSize(FONT_SIZE.sectionHeader);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  doc.text("Maatwerk e-learning", margin, COVER.bannerY + 16);

  // Separator pipe
  doc.setTextColor(...COLORS.lightGray);
  doc.text("|", margin + 95, COVER.bannerY + 16);

  // Quote number (VARIABLE from form)
  doc.setTextColor(...COLORS.darkGray);
  doc.text(`Offerte ${data.offerte_nummer}`, margin + 105, COVER.bannerY + 16);

  // --- Recipient address block (below banner) ---
  const recipientY = COVER.bannerY + COVER.recipientOffsetY;

  // Client name (VARIABLE)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  doc.text(data.klantnaam, margin, recipientY);

  // Contact person (VARIABLE)
  doc.setFontSize(FONT_SIZE.subHeader);
  doc.setFont("helvetica", "normal");
  doc.text(`T.a.v. ${data.contactpersoon_volledig}`, margin, recipientY + 10);

  // Note: Footer is drawn by orchestrator after all pages are rendered
  // (to get correct total page count when Page 4 overflows)
}
