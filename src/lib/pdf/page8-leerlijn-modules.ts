/**
 * =============================================================================
 * PAGE 8: LEERLIJN BOUW - MODULES 3-6 (Construction Learning Path continued)
 * =============================================================================
 *
 * Renders the continuation of the construction learning path with:
 * - Module 3: Technisch tekening lezen (basis)
 * - Module 4: Good Housekeeping (werkplek & orde)
 * - Module 5: Stellen van een woning (profielen)
 * - Module 6: Werken op hoogte & rolsteigers
 *
 * AI BREADCRUMB: This page is 100% FIXED TEXT — no dynamic data from the form.
 * Uses COMPACT SPACING to fit all 4 modules on one page.
 *
 * PAGE OVERFLOW HANDLING: This page checks if content exceeds the footer
 * boundary (270mm) and automatically adds new pages when needed.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { COLORS, LAYOUT, FONT_SIZE, FOOTER, FLOW } from "./config";
import { drawTopRightCurve, drawLogo, drawSectionTitle } from "./utils";
import type { RenderContext } from "./pdf-types";

/** Return type for renderPage8 - includes final page count and render context */
export interface Page8Result {
  totalPages: number;
  ctx: RenderContext;
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
    ctx.doc.setTextColor(...COLORS.darkGray);
    
    // Reset Y to position BELOW the blue curve graphic
    ctx.y = 80;
  }
}

export function renderPage8(doc: jsPDF, data: QuoteFormData, startPageNum: number = 8, incomingCtx?: RenderContext): Page8Result {
  const { margin, contentWidth } = LAYOUT;
  const compactLineHeight = 5.5; // Compact but readable spacing

  // Create or inherit render context
  const ctx: RenderContext = incomingCtx
    ? { ...incomingCtx }
    : { doc, y: 85, pageNum: startPageNum, data };

  if (!incomingCtx) {
    // Fresh page — draw decoratives as normal
    drawTopRightCurve(doc);
    drawLogo(doc, "right");
    doc.setFontSize(FONT_SIZE.small);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkGray);
  } else {
    // Continuing from previous section — reset font state
    ctx.doc.setFontSize(FONT_SIZE.small);
    ctx.doc.setFont("helvetica", "normal");
    ctx.doc.setTextColor(...COLORS.darkGray);

    if (ctx.y + FLOW.minSectionStartSpace >= FOOTER.footerStartY) {
      // Not enough room — open a new page with decoratives
      ctx.doc.addPage();
      ctx.pageNum++;
      drawTopRightCurve(ctx.doc);
      drawLogo(ctx.doc, "right");
      ctx.doc.setFontSize(FONT_SIZE.small);
      ctx.doc.setFont("helvetica", "normal");
      ctx.doc.setTextColor(...COLORS.darkGray);
      ctx.y = 80;
    } else {
      // Enough room — add inter-section gap
      ctx.y += FLOW.interSectionGap;
    }
  }

  // =========================================================================
  // SECTION: Module 3 – Technisch tekening lezen (basis)
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Module 3 – Technisch tekening lezen (basis)", ctx.y, {
    fontSize: FONT_SIZE.body,
    color: COLORS.blue,
  });
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  // Sub-header: E-learning
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  doc.text("E-learning", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const module3ElearningBullets = [
    "Soorten tekeningen",
    "Symbolen en maatvoering",
    "Schaal lezen",
    "Hoogtematen & peilen",
    "Wat moet je kunnen lezen als uitvoerder/handlanger",
  ];
  drawBullets(ctx, module3ElearningBullets, contentWidth, compactLineHeight);
  ctx.y += 3;

  // Sub-header: Praktijk
  doc.setFont("helvetica", "bold");
  doc.text("Praktijk", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const module3PraktijkBullets = [
    "Onderdelen op tekening terugvinden op de bouw",
    "Meten aan de hand van tekening",
    "Vragen stellen aan voorman (interpretatie)",
    "Interactieve oefeningen (wat zie je op de tekening?)",
  ];
  drawBullets(ctx, module3PraktijkBullets, contentWidth, compactLineHeight);
  ctx.y += 5;

  // =========================================================================
  // SECTION: Module 4 – Good Housekeeping (werkplek & orde)
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Module 4 – Good Housekeeping (werkplek & orde)", ctx.y, {
    fontSize: FONT_SIZE.body,
    color: COLORS.blue,
  });
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  // Sub-header: E-learning
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  doc.text("E-learning", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const module4ElearningBullets = [
    "Wat is good housekeeping",
    "Relatie veiligheid – kwaliteit – snelheid",
    "Voorbeelden goed vs. fout",
    "Dagelijkse routines",
  ];
  drawBullets(ctx, module4ElearningBullets, contentWidth, compactLineHeight);
  ctx.y += 3;

  // Sub-header: Praktijk
  doc.setFont("helvetica", "bold");
  doc.text("Praktijk", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const module4PraktijkBullets = [
    "Eigen werkplek beoordelen",
    "Opruimopdracht",
    "Teamafspraken maken",
    "Checklijst toepassen",
  ];
  drawBullets(ctx, module4PraktijkBullets, contentWidth, compactLineHeight);
  ctx.y += 5;

  // =========================================================================
  // SECTION: Module 5 – Stellen van een woning (profielen)
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Module 5 – Stellen van een woning (profielen)", ctx.y, {
    fontSize: FONT_SIZE.body,
    color: COLORS.blue,
  });
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  // Note (italic or normal text)
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLORS.darkGray);
  const noteText = "Dit betreft met name een praktische training. Waarbij de praktijkbeoordeling essentieel is.";
  drawWrappedText(ctx, noteText, contentWidth, compactLineHeight);
  ctx.y += 3;

  // Reset font
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  // Sub-header: E-learning
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  doc.text("E-learning", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const module5ElearningBullets = [
    "Wat is stellen?",
    "Waarom profielen?",
    "Basisbegrippen (haaks, waterpas, peil)",
    "Volgorde van werkzaamheden",
  ];
  drawBullets(ctx, module5ElearningBullets, contentWidth, compactLineHeight);
  ctx.y += 3;

  // Sub-header: Praktijk
  doc.setFont("helvetica", "bold");
  doc.text("Praktijk", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const module5PraktijkBullets = [
    "Profielen plaatsen",
    "Maatvoering uitzetten",
    "Waterpas/ haaks controleren",
    "Werken met meetlint, slaglijn, waterpas",
    "Fouten herkennen & herstellen",
  ];
  drawBullets(ctx, module5PraktijkBullets, contentWidth, compactLineHeight);
  ctx.y += 5;

  // =========================================================================
  // SECTION: Module 6 – Werken op hoogte & rolsteigers
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Module 6 – Werken op hoogte & rolsteigers", ctx.y, {
    fontSize: FONT_SIZE.body,
    color: COLORS.blue,
  });
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  // Sub-header: E-learning
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  doc.text("E-learning", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const module6ElearningBullets = [
    "Risico's werken op hoogte",
    "Regels & verantwoordelijkheden",
    "Onderdelen rolsteiger",
    "Opbouwvolgorde (stapsgewijs)",
    "Veelgemaakte fouten",
  ];
  drawBullets(ctx, module6ElearningBullets, contentWidth, compactLineHeight);
  ctx.y += 3;

  // Sub-header: Kennistoets (evt. VCA-achtig)
  doc.setFont("helvetica", "bold");
  doc.text("Kennistoets (evt. VCA-achtig)", margin, ctx.y);
  ctx.y += compactLineHeight + 3;

  // Sub-header: Praktijk
  doc.setFont("helvetica", "bold");
  doc.text("Praktijk", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const module6PraktijkBullets = [
    "Rolsteiger opbouwen",
    "Inspectie uitvoeren",
    "Veilig gebruik",
    "Afbouwen & opslaan",
  ];
  drawBullets(ctx, module6PraktijkBullets, contentWidth, compactLineHeight);
  ctx.y += 4;

  // Closing Note (Bold)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  doc.text("Zonder praktijk geen inzetbaarheid", margin, ctx.y);

  return { totalPages: ctx.pageNum, ctx };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

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
 * Draws a list of bullet points with proper indentation.
 * Long bullets are wrapped to fit within the content width.
 */
function drawBullets(
  ctx: RenderContext,
  items: string[],
  maxWidth: number,
  lineHeight: number = 5
): void {
  const { margin } = LAYOUT;
  const bulletIndent = 5;  // Indent for bullet character
  const textIndent = 10;   // Indent for bullet text
  
  items.forEach((item) => {
    // Split long bullet text to fit within content width (accounting for indent)
    const lines = ctx.doc.splitTextToSize(item, maxWidth - textIndent);
    
    lines.forEach((line: string, index: number) => {
      checkOverflow(ctx, lineHeight);
      
      if (index === 0) {
        // First line: draw bullet
        ctx.doc.text("•", margin + bulletIndent, ctx.y);
        ctx.doc.text(line, margin + textIndent, ctx.y);
      } else {
        // Wrapped lines: just draw text (no bullet)
        ctx.doc.text(line, margin + textIndent, ctx.y);
      }
      ctx.y += lineHeight;
    });
  });
}
