/**
 * =============================================================================
 * PDF UTILITY FUNCTIONS
 * =============================================================================
 *
 * Reusable drawing helpers that eliminate repetitive jsPDF setup code.
 * Each function handles one visual concern (header, footer, decorative curve).
 *
 * AI BREADCRUMB: These utilities are called by every page renderer.
 * They handle the repetitive font/color setup so page files stay clean.
 * All coordinates are in mm. The jsPDF doc instance is always the first param.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { formatDateDutch } from "@/types";
import { COLORS, LAYOUT, FONT_SIZE, PAGE, FOOTER } from "./config";

// =============================================================================
// DECORATIVE ELEMENTS
// =============================================================================

/**
 * Draws the blue decorative curve in the top-right corner.
 * Used on Pages 1, 3, and 4.
 *
 * AI BREADCRUMB: This creates two overlapping filled circles that form
 * a curved blue shape extending off the top-right of the page.
 */
export function drawTopRightCurve(doc: jsPDF): void {
  doc.setFillColor(...COLORS.blue);
  doc.circle(PAGE.width - 30, -20, 80, "F");
  doc.circle(PAGE.width - 10, -40, 60, "F");
}

// =============================================================================
// LOGO
// =============================================================================

/**
 * Draws the "'t web" logo with icon square.
 * @param position - "left" for Page 1, "right" for Pages 3 & 4
 *
 * AI BREADCRUMB: The logo consists of bold blue text "'t web" and a small
 * blue square icon. Position "left" places it at the left margin,
 * "right" places it near the right margin.
 */
export function drawLogo(doc: jsPDF, position: "left" | "right"): void {
  const { margin } = LAYOUT;

  doc.setFontSize(FONT_SIZE.title);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.blue);

  if (position === "left") {
    doc.text("'t web", margin, 25);
    doc.setFillColor(...COLORS.blue);
    doc.rect(margin + 45, 15, 8, 8, "F");
  } else {
    doc.text("'t web", PAGE.width - margin - 50, 25);
    doc.setFillColor(...COLORS.blue);
    doc.rect(PAGE.width - margin - 5, 15, 8, 8, "F");
  }
}

// =============================================================================
// HEADER (Pages 2+)
// =============================================================================

/**
 * Draws the standard page header with logo placeholder (blue rect + text).
 * Used on Page 2 which has a simpler header than Pages 1/3/4.
 *
 * AI BREADCRUMB: This is the SIMPLE header — just a blue rectangle with
 * "'t WEB" text. Pages 1, 3, 4 use drawLogo() + drawTopRightCurve() instead.
 */
export function drawSimpleHeader(doc: jsPDF): void {
  const { margin } = LAYOUT;

  doc.setFillColor(...COLORS.blue);
  doc.rect(margin, 10, 40, 12, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("'t WEB", margin + 20, 18, { align: "center" });

  // Reset text color for content that follows
  doc.setTextColor(...COLORS.darkGray);
}

// =============================================================================
// FOOTER
// =============================================================================

/**
 * Draws the page footer with company info, page number, and optional date.
 * @param pageNum - Current page number (1-based)
 * @param data - Form data (used for date display)
 * @param totalPages - Optional total pages count (defaults to PAGE.totalPages)
 *
 * AI BREADCRUMB: Footer appears on ALL pages. It shows:
 * - Center: company contact info line
 * - Center below: "Pagina X van Y"
 * - Left below: "Datum {formatted date}" (if date is set)
 */
export function drawFooter(doc: jsPDF, pageNum: number, data: QuoteFormData, totalPages?: number): void {
  const { margin } = LAYOUT;
  const actualTotalPages = totalPages ?? PAGE.totalPages;

  doc.setFontSize(FONT_SIZE.tiny);
  doc.setTextColor(...COLORS.lightGray);

  // Company contact info (centered)
  doc.text(FOOTER.text, PAGE.width / 2, PAGE.height - FOOTER.mainY, { align: "center" });

  // Page number (centered)
  doc.text(
    `Pagina ${pageNum} van ${actualTotalPages}`,
    PAGE.width / 2,
    PAGE.height - FOOTER.pageNumY,
    { align: "center" }
  );

  // Date (left-aligned)
  if (data.datum) {
    doc.text(`Datum ${formatDateDutch(data.datum)}`, margin, PAGE.height - FOOTER.pageNumY);
  }
}

// =============================================================================
// TEXT HELPERS
// =============================================================================

/**
 * Sets up font for body text (normal weight, dark gray, size 10).
 * Returns the doc for chaining convenience.
 */
export function setBodyFont(doc: jsPDF): jsPDF {
  doc.setFontSize(FONT_SIZE.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);
  return doc;
}

/**
 * Sets up font for small text (normal weight, dark gray, size 9).
 */
export function setSmallFont(doc: jsPDF): jsPDF {
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);
  return doc;
}

/**
 * Draws a wrapped paragraph and returns the new Y position after the text.
 * @param text - The paragraph text
 * @param startY - Y position to start drawing
 * @param maxWidth - Maximum width for text wrapping (defaults to contentWidth)
 * @param lineHeight - Line height (defaults to LAYOUT.smallLineHeight)
 * @returns New Y position after the drawn text
 */
export function drawParagraph(
  doc: jsPDF,
  text: string,
  startY: number,
  maxWidth: number = LAYOUT.contentWidth,
  lineHeight: number = LAYOUT.smallLineHeight
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, LAYOUT.margin, startY);
  return startY + lines.length * lineHeight;
}

/**
 * Draws a section title in bold with specified color.
 * @returns New Y position after the title
 */
export function drawSectionTitle(
  doc: jsPDF,
  title: string,
  y: number,
  options?: { fontSize?: number; color?: [number, number, number] }
): number {
  const fontSize = options?.fontSize ?? FONT_SIZE.sectionHeader;
  const color = options?.color ?? COLORS.darkBlue;

  doc.setFontSize(fontSize);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...color);
  doc.text(title, LAYOUT.margin, y);

  return y + (fontSize <= 11 ? 7 : 10);
}
