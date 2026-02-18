/**
 * =============================================================================
 * PAGE 10: INVESTMENT & FINANCIALS
 * =============================================================================
 *
 * Renders the investment page with:
 * - Intro text about custom e-learning pricing
 * - Investment lines with calculated totals (Module leerlijn bouw + custom hours)
 * - Optional items (free-form text area)
 * - Exclusions (free-form text area)
 * - Timeline section (fixed text)
 * - Signature section
 *
 * AI BREADCRUMB: This page uses DYNAMIC DATA from the form for investment
 * calculations. The PDF calculates totals dynamically from numeric inputs.
 *
 * PAGE OVERFLOW HANDLING: This page checks if content exceeds the footer
 * boundary (270mm) and automatically adds new pages when needed.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { COLORS, LAYOUT, FONT_SIZE, FOOTER } from "./config";
import { drawTopRightCurve, drawLogo, drawFooter, drawSectionTitle } from "./utils";

/** Return type for renderPage10 - includes final page count */
export interface Page10Result {
  totalPages: number;
}

/** Context object passed through all drawing functions for page tracking */
interface RenderContext {
  doc: jsPDF;
  y: number;
  pageNum: number;
  data: QuoteFormData;
}

/**
 * Formats a number as Dutch currency, e.g., 2760 -> "2.760,-"
 */
function formatCurrency(amount: number): string {
  return amount.toLocaleString("nl-NL") + ",-";
}

/**
 * Checks if content would overflow into footer area and adds a new page if needed.
 * Updates ctx.y and ctx.pageNum if a new page is added.
 */
function checkOverflow(ctx: RenderContext, neededSpace: number = 0): void {
  if (ctx.y + neededSpace >= FOOTER.footerStartY) {
    // Add new page
    ctx.doc.addPage();
    ctx.pageNum++;
    
    // Draw decorative elements on new page
    drawTopRightCurve(ctx.doc);
    drawLogo(ctx.doc, "right");
    
    // Reset font settings for content (logo sets blue color and large font)
    ctx.doc.setFontSize(FONT_SIZE.small);
    ctx.doc.setFont("helvetica", "normal");
    ctx.doc.setTextColor(0, 0, 0);
    
    // Reset Y to position BELOW the blue curve graphic
    ctx.y = 80;
  }
}

export function renderPage10(doc: jsPDF, data: QuoteFormData, startPageNum: number = 10): Page10Result {
  const { margin, contentWidth } = LAYOUT;
  const lineHeight = 5;

  // Create render context
  const ctx: RenderContext = {
    doc,
    y: 85, // Start below blue curve
    pageNum: startPageNum,
    data,
  };

  // --- Decorative elements ---
  drawTopRightCurve(doc);
  drawLogo(doc, "right");

  // Reset font after logo
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // =========================================================================
  // SECTION: Investering (Title)
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Investering", ctx.y, {
    fontSize: FONT_SIZE.sectionHeader,
    color: COLORS.blue,
  });
  ctx.y += 5;

  // =========================================================================
  // INTRO TEXT
  // =========================================================================
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const introText = `Een maatwerk e-learning kan al voor ${formatCurrency(data.price_custom_hourly)} per uur worden opgezet, wanneer 't WEB in de breedte voor Abiant schoolt. Denk bijvoorbeeld aan het omzetten van bestaand materiaal. We schrijven onze e-learnings in Articulate Rise 360 en Storyline. Tijdsindicatie is sterk afhankelijk van het aanwezige (beeld)materiaal.`;

  drawWrappedText(ctx, introText, contentWidth, lineHeight);
  ctx.y += 8;

  // =========================================================================
  // FINANCIAL LINES
  // =========================================================================
  
  // Calculate totals
  const customTotal = data.hours_custom_estimated * data.price_custom_hourly;
  const grandTotal = data.price_module_bouw + customTotal;

  // Line 1: Module leerlijn bouw
  drawInvestmentLine(ctx, "Investering Module leerlijn bouw", data.price_module_bouw);
  ctx.y += 3;

  // Line 2: Custom work
  const customDescription = `Inschatting maatwerk (${data.hours_custom_estimated} uur x ${formatCurrency(data.price_custom_hourly)})`;
  drawInvestmentLine(ctx, customDescription, customTotal);
  ctx.y += 3;

  // Total line
  doc.setDrawColor(...COLORS.blue);
  doc.setLineWidth(0.5);
  doc.line(margin, ctx.y, margin + contentWidth, ctx.y);
  ctx.y += 5;

  doc.setFontSize(FONT_SIZE.body);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.blue);
  const totalText = `Totaal: ${formatCurrency(grandTotal)}`;
  doc.text(totalText, margin + contentWidth, ctx.y, { align: "right" });
  ctx.y += 10;

  // Reset font
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // =========================================================================
  // SECTION: Optioneel
  // =========================================================================
  if (data.text_optional && data.text_optional.trim()) {
    ctx.y = drawSectionTitle(doc, "Optioneel:", ctx.y, {
      fontSize: FONT_SIZE.body,
      color: COLORS.blue,
    });
    ctx.y += 2;

    doc.setFontSize(FONT_SIZE.small);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    drawBulletText(ctx, data.text_optional, contentWidth, lineHeight);
    ctx.y += 5;
  }

  // =========================================================================
  // SECTION: Deze prijs is exclusief
  // =========================================================================
  if (data.text_exclusions && data.text_exclusions.trim()) {
    ctx.y = drawSectionTitle(doc, "Deze prijs is exclusief:", ctx.y, {
      fontSize: FONT_SIZE.body,
      color: COLORS.blue,
    });
    ctx.y += 2;

    doc.setFontSize(FONT_SIZE.small);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    drawBulletText(ctx, data.text_exclusions, contentWidth, lineHeight);
    ctx.y += 5;
  }

  // =========================================================================
  // SECTION: Aanvang ontwikkeling (FIXED TEXT)
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Aanvang ontwikkeling", ctx.y, {
    fontSize: FONT_SIZE.body,
    color: COLORS.blue,
  });
  ctx.y += 2;

  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const timelineText = `Indien akkoord met opzet, dan wordt er een tijdspad gemaakt.
Bij de ontwikkeling is er een afhankelijkheid van beide partijen, zodra er vertraging ontstaat bij bijvoorbeeld het aanleveren van data, zal dit invloed hebben op de streefdatum dat het portaal operationeel is.`;

  drawWrappedText(ctx, timelineText, contentWidth, lineHeight);
  ctx.y += 10;

  // =========================================================================
  // SIGNATURE SECTION
  // =========================================================================
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Met vriendelijke groet,", margin, ctx.y);
  ctx.y += 10;

  doc.setFont("helvetica", "normal");
  doc.text("'t WEB", margin, ctx.y);
  ctx.y += 15;

  // Signature lines
  const sigWidth = 70;
  const sigSpacing = 20;
  
  // Left signature line
  doc.setDrawColor(...COLORS.darkGray);
  doc.setLineWidth(0.3);
  doc.line(margin, ctx.y, margin + sigWidth, ctx.y);
  doc.setFontSize(FONT_SIZE.tiny);
  doc.text("Handtekening", margin, ctx.y + 4);
  doc.text("klant", margin, ctx.y + 8);

  // Right signature line
  doc.line(margin + sigWidth + sigSpacing, ctx.y, margin + sigWidth + sigSpacing + sigWidth, ctx.y);
  doc.text("Handtekening", margin + sigWidth + sigSpacing, ctx.y + 4);
  doc.text("'t WEB", margin + sigWidth + sigSpacing, ctx.y + 8);

  // --- Footer on last page ---
  drawFooter(doc, ctx.pageNum, data, ctx.pageNum);

  return { totalPages: ctx.pageNum };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Draws an investment line with description and amount.
 */
function drawInvestmentLine(
  ctx: RenderContext,
  description: string,
  amount: number
): void {
  const { margin, contentWidth } = LAYOUT;
  const amountWidth = 35;
  const descWidth = contentWidth - amountWidth - 5;

  ctx.doc.setFontSize(FONT_SIZE.small);
  ctx.doc.setFont("helvetica", "normal");
  ctx.doc.setTextColor(0, 0, 0);

  // Draw description (left-aligned)
  const descLines = ctx.doc.splitTextToSize(description, descWidth);
  descLines.forEach((line: string) => {
    checkOverflow(ctx, 6);
    ctx.doc.text(line, margin, ctx.y);
    ctx.y += 5;
  });

  // Draw amount (right-aligned)
  ctx.doc.setFont("helvetica", "bold");
  const amountText = `${formatCurrency(amount)}`;
  const amountX = margin + contentWidth;
  ctx.doc.text(amountText, amountX, ctx.y - 5, { align: "right" });
  ctx.doc.setFont("helvetica", "normal");
}

/**
 * Draws wrapped text with automatic page overflow handling.
 */
function drawWrappedText(
  ctx: RenderContext,
  text: string,
  maxWidth: number,
  lineHeight: number = 5
): void {
  const { margin } = LAYOUT;
  
  const lines = ctx.doc.splitTextToSize(text, maxWidth);
  
  lines.forEach((line: string) => {
    checkOverflow(ctx, lineHeight);
    ctx.doc.text(line, margin, ctx.y);
    ctx.y += lineHeight;
  });
}

/**
 * Draws bullet text from a multi-line string.
 * Handles both main bullets (with leading spaces) and sub-bullets.
 */
function drawBulletText(
  ctx: RenderContext,
  text: string,
  maxWidth: number,
  lineHeight: number = 5
): void {
  const { margin } = LAYOUT;
  const lines = text.split("\n");
  
  lines.forEach((line) => {
    if (!line.trim()) return; // Skip empty lines
    
    checkOverflow(ctx, lineHeight);
    
    // Check if it's a sub-bullet (starts with spaces then 'o')
    const isSubBullet = /^\s*o\s/.test(line);
    // Check if it's a main bullet (starts with '·' or '>')
    const isMainBullet = line.trim().startsWith("·") || line.trim().startsWith(">");
    
    if (isSubBullet) {
      // Sub-bullet: indent more and use 'o' as bullet
      const bulletIndent = 15;
      const textIndent = 20;
      const cleanLine = line.trim().replace(/^o\s*/, "");
      const wrappedLines = ctx.doc.splitTextToSize(cleanLine, maxWidth - textIndent);
      
      wrappedLines.forEach((wrappedLine: string, index: number) => {
        checkOverflow(ctx, lineHeight);
        if (index === 0) {
          ctx.doc.text("o", margin + bulletIndent, ctx.y);
        }
        ctx.doc.text(wrappedLine, margin + textIndent, ctx.y);
        ctx.y += lineHeight;
      });
    } else if (isMainBullet || line.includes("·")) {
      // Main bullet: use bullet character
      const bulletIndent = 5;
      const textIndent = 10;
      const cleanLine = line.trim().replace(/^[·>]\s*/, "");
      const wrappedLines = ctx.doc.splitTextToSize(cleanLine, maxWidth - textIndent);
      
      wrappedLines.forEach((wrappedLine: string, index: number) => {
        checkOverflow(ctx, lineHeight);
        if (index === 0) {
          ctx.doc.text("·", margin + bulletIndent, ctx.y);
        }
        ctx.doc.text(wrappedLine, margin + textIndent, ctx.y);
        ctx.y += lineHeight;
      });
    } else {
      // Regular line (no bullet)
      const wrappedLines = ctx.doc.splitTextToSize(line.trim(), maxWidth);
      wrappedLines.forEach((wrappedLine: string) => {
        checkOverflow(ctx, lineHeight);
        ctx.doc.text(wrappedLine, margin, ctx.y);
        ctx.y += lineHeight;
      });
    }
  });
}
