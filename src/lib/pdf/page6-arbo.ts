/**
 * =============================================================================
 * PAGE 6: FYSIEKE TRAININGEN EN ARBO ONDERSTEUNING
 * =============================================================================
 *
 * Renders the physical training and ARBO support page with:
 * - Blue decorative curve (top right) + logo (right side)
 * - Main title: "Fysieke trainingen en ARBO ondersteuning"
 * - Intro paragraphs about training and ARBO support
 * - Bullet list of training offerings
 * - Closing sentence
 *
 * AI BREADCRUMB: This page is 100% FIXED TEXT — no dynamic data from the form.
 * It follows the same overflow handling pattern as page5-borging.ts.
 *
 * PAGE OVERFLOW HANDLING: This page checks if content exceeds the footer
 * boundary (270mm) and automatically adds new pages when needed.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { COLORS, LAYOUT, FONT_SIZE, FOOTER } from "./config";
import { drawTopRightCurve, drawLogo, drawFooter, drawSectionTitle } from "./utils";

/** Return type for renderPage6 - includes final page count */
export interface Page6Result {
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
    ctx.doc.setTextColor(...COLORS.darkGray);
    
    // Reset Y to position BELOW the blue curve graphic
    ctx.y = 80;
  }
}

export function renderPage6(doc: jsPDF, data: QuoteFormData, startPageNum: number = 6): Page6Result {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;

  // Create render context
  const ctx: RenderContext = {
    doc,
    y: 80, // Start below blue curve
    pageNum: startPageNum,
    data,
  };

  // --- Decorative elements ---
  drawTopRightCurve(doc);
  drawLogo(doc, "right");

  // Reset font after logo
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  // =========================================================================
  // MAIN TITLE: "Fysieke trainingen en ARBO ondersteuning"
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Fysieke trainingen en ARBO ondersteuning", ctx.y, {
    fontSize: FONT_SIZE.subHeader,
    color: COLORS.blue,
  });

  // Reset font for body text (section title sets blue color)
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0); // Black for body text

  // =========================================================================
  // INTRO PARAGRAPHS
  // =========================================================================
  const intro1 = "Tijdens de presentatie hebben we gesproken over de fysieke (incompany) opleidingen en de ondersteuning die onze veiligheidskundigen bieden op het gebied van ARBO-gerelateerde zaken, zoals het opstellen van een RI&E, calamiteitenplan, ontruimingsplattegronden opstellen van ongevalsrapportages ten behoeve van de Nederlandse Arbeidsinspectie.";
  drawWrappedText(ctx, intro1, contentWidth);
  ctx.y += 4;

  const intro2 = "Onze trainingen zijn ontworpen om bedrijven te ondersteunen bij het creëren van een veilige werkomgeving waarin risico's worden geminimaliseerd en de gezondheid en het welzijn van medewerkers worden bevorderd.";
  drawWrappedText(ctx, intro2, contentWidth);
  ctx.y += 4;

  // List intro
  const listIntro = "Ons trainingsaanbod omvat o.a.:";
  drawWrappedText(ctx, listIntro, contentWidth);
  ctx.y += 3;

  // =========================================================================
  // BULLET POINTS
  // =========================================================================
  const bullets = [
    "Risicoanalyse en preventie – Training voor medewerkers om potentiële risico's te herkennen en proactief maatregelen te nemen ter voorkoming van ongevallen en gezondheidsproblemen.",
    "Veiligheidscultuur – Stimuleren van een werkomgeving waarin medewerkers actief bijdragen aan het handhaven van veiligheidsnormen.",
    "Eerste hulp en reanimatie (BHV) – Praktische en interactieve scenariotrainingen volgens de nieuwste wet- en regelgeving, zodat medewerkers snel en effectief kunnen handelen bij noodgevallen.",
    "Ergonomie en fysieke belasting – Optimaliseren van werkplekken en bevorderen van goede lichaamshoudingen om lichamelijke klachten en blessures te voorkomen.",
    "Omgaan met gevaarlijke stoffen – Opleiding waarin medewerkers leren hoe zij veilig kunnen werken met gevaarlijke stoffen, met nadruk op het correct opslaan, gebruiken en afvoeren ervan, evenals het herkennen van mogelijke gevaren en het nemen van de juiste voorzorgsmaatregelen.",
    "Omgaan met diverse machines (mobiele arbeidsmiddelen, machineveiligheid, NEN 3140, praktisch storing zoeken en aanverwant).",
    "Diverse lastrainingen zoals MIG/MAG, TIG, Elektrode (ook NIL gediplomeerd en gecertificeerd)",
    "Overige trainingen, zoals Duits, code 95 en leiderschapstrainingen.",
  ];
  drawBullets(ctx, bullets, contentWidth);
  ctx.y += 4;

  // =========================================================================
  // CLOSING SENTENCE
  // =========================================================================
  const closing = "Door te investeren in ARBO-trainingen toont jullie organisatie niet alleen betrokkenheid bij het welzijn van medewerkers, maar wordt ook het risico";
  drawWrappedText(ctx, closing, contentWidth);

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
  indent: number = 0
): void {
  const { margin, smallLineHeight } = LAYOUT;
  
  const lines = ctx.doc.splitTextToSize(text, maxWidth);
  
  lines.forEach((line: string) => {
    checkOverflow(ctx, smallLineHeight);
    ctx.doc.text(line, margin + indent, ctx.y);
    ctx.y += smallLineHeight;
  });
}

/**
 * Draws a list of bullet points with proper indentation.
 * Long bullets are wrapped to fit within the content width.
 */
function drawBullets(ctx: RenderContext, items: string[], maxWidth: number): void {
  const { margin, smallLineHeight } = LAYOUT;
  const bulletIndent = 5;  // Indent for bullet character
  const textIndent = 10;   // Indent for bullet text
  
  items.forEach((item) => {
    // Split long bullet text to fit within content width (accounting for indent)
    const lines = ctx.doc.splitTextToSize(item, maxWidth - textIndent);
    
    lines.forEach((line: string, index: number) => {
      checkOverflow(ctx, smallLineHeight);
      
      if (index === 0) {
        // First line: draw bullet
        ctx.doc.text("•", margin + bulletIndent, ctx.y);
        ctx.doc.text(line, margin + textIndent, ctx.y);
      } else {
        // Wrapped lines: just draw text (no bullet)
        ctx.doc.text(line, margin + textIndent, ctx.y);
      }
      ctx.y += smallLineHeight;
    });
  });
}
