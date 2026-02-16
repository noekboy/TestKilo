/**
 * =============================================================================
 * PAGE 7: VOORBEELD LEERLIJN BOUW (Construction Learning Path)
 * =============================================================================
 *
 * Renders the construction learning path example page with:
 * - Blue decorative curve (top right) + logo (right side)
 * - Main title: "Voorbeeld leerlijn bouw"
 * - Intro text
 * - Tree structure with indentation (Leerlijn Bouw – Basis)
 * - Multiple sections: Basistraining, Module 1, Module 2
 * - Sub-headers and bullet points
 *
 * AI BREADCRUMB: This page is 100% FIXED TEXT — no dynamic data from the form.
 * Uses COMPACT SPACING to fit all content on one page.
 *
 * PAGE OVERFLOW HANDLING: This page checks if content exceeds the footer
 * boundary (270mm) and automatically adds new pages when needed.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { COLORS, LAYOUT, FONT_SIZE, FOOTER } from "./config";
import { drawTopRightCurve, drawLogo, drawFooter, drawSectionTitle } from "./utils";

/** Return type for renderPage7 - includes final page count */
export interface Page7Result {
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

export function renderPage7(doc: jsPDF, data: QuoteFormData, startPageNum: number = 7): Page7Result {
  const { margin, contentWidth } = LAYOUT;
  const compactLineHeight = 4.5; // Compact spacing for this content-heavy page

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
  // MAIN TITLE: "Voorbeeld leerlijn bouw"
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Voorbeeld leerlijn bouw", ctx.y, {
    fontSize: FONT_SIZE.subHeader,
    color: COLORS.blue,
  });

  // Reset font for body text
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // =========================================================================
  // INTRO TEXT
  // =========================================================================
  const introText = "De volgende opzet is een voorbeeld van hoe de leerlijn in de bouw (basisvaardigheden) opgezet kan worden:";
  drawWrappedText(ctx, introText, contentWidth, compactLineHeight);
  ctx.y += 5;

  // =========================================================================
  // TREE STRUCTURE: Leerlijn (Bouw – Basis)
  // =========================================================================
  // Main tree item
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.blue);
  doc.text("Leerlijn (Bouw – Basis)", margin, ctx.y);
  ctx.y += compactLineHeight;

  // Reset for tree items
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Tree items with indentation
  const treeItems = [
    "Module 0 – Basistraining bouw",
    "Module 1 – Veilig werken op de bouw",
    "Module 2 – Gereedschapskennis",
    "Module 3 – Technisch tekening lezen (basis)",
    "Module 4 – Good Housekeeping (werkplek)",
    "Module 5 – Werken op hoogte & rolsteigers",
    "Module 6 – Stellen van een woning (profielen)",
  ];

  treeItems.forEach((item) => {
    checkOverflow(ctx, compactLineHeight);
    doc.text("└── " + item, margin + 10, ctx.y);
    ctx.y += compactLineHeight;
  });

  ctx.y += 6;

  // =========================================================================
  // SECTION: Start: Basistraining Bouw
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Start: Basistraining Bouw", ctx.y, {
    fontSize: FONT_SIZE.body,
    color: COLORS.blue,
  });
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Sub-header: Doel van de training
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Doel van de training", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const doelText = "De deelnemer leert de basisvaardigheden en -kennis die nodig zijn om veilig en effectief te werken op een bouwplaats, met focus op woningbouw.";
  drawWrappedText(ctx, doelText, contentWidth, compactLineHeight);
  ctx.y += 4;

  // Sub-header: Doelgroep
  doc.setFont("helvetica", "bold");
  doc.text("Doelgroep", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const doelgroepBullets = [
    "Beginnende bouwplaats medewerkers",
    "Leerlingen/ stagiairs",
    "Zij-instromers zonder (of met beperkte) bouwervaring",
  ];
  drawBullets(ctx, doelgroepBullets, contentWidth, compactLineHeight);
  ctx.y += 2;

  // Note
  doc.setFontSize(FONT_SIZE.tiny);
  doc.setTextColor(...COLORS.darkGray);
  const noteText = "D.m.v. een e-learning met introductie werken in de bouw met afsluitend een kort examen (veiligheid, basisbegrippen).";
  drawWrappedText(ctx, noteText, contentWidth, compactLineHeight);
  ctx.y += 5;

  // Reset font size
  doc.setFontSize(FONT_SIZE.small);
  doc.setTextColor(0, 0, 0);

  // =========================================================================
  // SECTION: Module 1 – Veilig werken op de bouw
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Module 1 – Veilig werken op de bouw", ctx.y, {
    fontSize: FONT_SIZE.body,
    color: COLORS.blue,
  });
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Sub-header: Theorie d.m.v. E-learning incl. examenvragen
  doc.setFont("helvetica", "bold");
  doc.text("Theorie d.m.v. E-learning incl. examenvragen", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  doc.text("Doel: kennis & bewustwording", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  const theorieBullets = [
    "Arbo & verantwoordelijkheden",
    "Gevaren op de bouwplaats",
    "PBM's (wat, wanneer, waarom)",
    "Onveilige situaties herkennen (foto/video)",
  ];
  drawBullets(ctx, theorieBullets, contentWidth, compactLineHeight);
  ctx.y += 4;

  // Sub-header: Praktijk
  doc.setFont("helvetica", "bold");
  doc.text("Praktijk", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  doc.text("Doel: gedrag & toepassing", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  const praktijkBullets = [
    "Werkplek inspecteren",
    "Onveilige situaties aanwijzen",
    "Correct gebruik PBM's",
    "Opruimen / werkplek netjes maken",
  ];
  drawBullets(ctx, praktijkBullets, contentWidth, compactLineHeight);
  ctx.y += 2;

  // Footer note
  doc.setFontSize(FONT_SIZE.tiny);
  doc.setTextColor(...COLORS.darkGray);
  doc.text("Aftekenen door leermeester / voorman", margin, ctx.y);
  ctx.y += 5;

  // Reset font size
  doc.setFontSize(FONT_SIZE.small);
  doc.setTextColor(0, 0, 0);

  // =========================================================================
  // SECTION: Module 2 – Gereedschapskennis
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Module 2 – Gereedschapskennis", ctx.y, {
    fontSize: FONT_SIZE.body,
    color: COLORS.blue,
  });
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Sub-header: E-learning
  doc.setFont("helvetica", "bold");
  doc.text("E-learning", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const gereedschapBullets = [
    "Handgereedschap vs. elektrisch",
    "Juiste gereedschap per taak",
    "Veilig gebruik (do's & don'ts)",
    "Onderhoud & opslag",
    "Herkennen van defecten",
  ];
  drawBullets(ctx, gereedschapBullets, contentWidth, compactLineHeight);
  ctx.y += 4;

  // Sub-header: Praktijk
  doc.setFont("helvetica", "bold");
  doc.text("Praktijk", margin, ctx.y);
  ctx.y += compactLineHeight + 1;

  doc.setFont("helvetica", "normal");
  const gereedschapPraktijkBullets = [
    "Gereedschap uitgifte & controle",
    "Correct gebruiken",
    "Oefenopdrachten (schroeven, zagen, meten)",
    "Veilig wegzetten na gebruik",
  ];
  drawBullets(ctx, gereedschapPraktijkBullets, contentWidth, compactLineHeight);

  // --- Footer on last page ---
  drawFooter(doc, ctx.pageNum, data, ctx.pageNum);

  return { totalPages: ctx.pageNum };
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
