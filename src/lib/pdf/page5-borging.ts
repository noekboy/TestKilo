/**
 * =============================================================================
 * PAGE 5: BORGING & ONDERSTEUNING
 * =============================================================================
 *
 * Renders the compliance and HR support page with:
 * - Blue decorative curve (top right) + logo (right side)
 * - Section 1: "Borging m.b.v. koppeling met klantenportaal (compliance)"
 * - Section 2: "Ondersteuning HR (bij fysieke trainingen)"
 * - Section 3: "Pasjesapp"
 *
 * AI BREADCRUMB: This page is 100% FIXED TEXT — no dynamic data from the form.
 * It follows the same overflow handling pattern as page4-maatwerk.ts.
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

/** Return type for renderPage5 - includes final page count and render context */
export interface Page5Result {
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

export function renderPage5(doc: jsPDF, data: QuoteFormData, startPageNum: number = 5, incomingCtx?: RenderContext): Page5Result {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;

  // Create or inherit render context
  const ctx: RenderContext = incomingCtx
    ? { ...incomingCtx }
    : { doc, y: 80, pageNum: startPageNum, data };

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
  // SECTION 1: "Borging m.b.v. koppeling met klantenportaal (compliance)"
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Borging m.b.v. koppeling met klantenportaal (compliance)", ctx.y, {
    fontSize: FONT_SIZE.subHeader,
    color: COLORS.blue,
  });

  // Reset font for body text (section title sets blue color)
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  // Body text
  const section1Body = "Altijd overzicht en aantoonbaar resultaat van de training in het dashboard. Registratie van certificaten is mogelijk in het klantportaal: TWEB.insight of, indien van toepassing, rechtstreeks ingeschoten worden in jullie HR-systeem.";
  drawWrappedText(ctx, section1Body, contentWidth);
  ctx.y += 4;

  // Sub-text
  const section1SubText = `Voor de registratie van alle opleidingen wordt een specifiek ${data.klantnaam} klantenportaal ontwikkeld waarin jullie overzichtelijk alle opleidingen die ze volgen kunnen inzien. In dit portaal komen alle medewerkers te staan die bij ons geschoold zijn. Dit portal geeft inzicht in:`;
  drawWrappedText(ctx, section1SubText, contentWidth);
  ctx.y += 3;

  // Bullets
  const section1Bullets = [
    "Wie, wat, wanneer geschoold heeft",
    "Binnenkort verlopen certificaten",
    "Verlopen certificaten",
    "Aanvragen/aanmelden cursussen",
    "Certificaten",
  ];
  drawBullets(ctx, section1Bullets);
  ctx.y += 6;

  // =========================================================================
  // SECTION 2: "Ondersteuning HR (bij fysieke trainingen)"
  // =========================================================================
  checkOverflow(ctx, 20);
  ctx.y = drawSectionTitle(doc, "Ondersteuning HR (bij fysieke trainingen)", ctx.y, {
    fontSize: FONT_SIZE.subHeader,
    color: COLORS.blue,
  });

  // Reset font for body text (section title sets blue color)
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  // Body text
  const section2Body = `Vooraf worden er samen met ${data.klantnaam} regie afspraken gemaakt. Hierbij kan 't WEB de volgende activiteiten uitvoeren om de HR-afdeling te ontzorgen:`;
  drawWrappedText(ctx, section2Body, contentWidth);
  ctx.y += 3;

  // Bullets
  const section2Bullets = [
    "Versturen van uitnodigingen",
    "Versturen reminders",
    "Evaluatie trainingen",
    "Uploaden certificaten",
  ];
  drawBullets(ctx, section2Bullets);
  ctx.y += 4;

  // Closing text
  const section2Closing = "De opgedane kennis maak je dit aantoonbaar met een certificaat. Bij gebruik van het TWEB.insight (of een koppeling hiermee), zijn behaalde certificaten automatisch geborgd in het portaal of in het relevante HR-pakket.";
  drawWrappedText(ctx, section2Closing, contentWidth);
  ctx.y += 4;

  const section2Closing2 = "Door een combinatie van didactische, veiligheidskundige en ICT-ervaring biedt 't WEB een snelle aanpak. Het draait voor de organisatie vooral om het aanleveren van de juiste informatie.";
  drawWrappedText(ctx, section2Closing2, contentWidth);
  ctx.y += 6;

  // =========================================================================
  // SECTION 3: "Pasjesapp"
  // =========================================================================
  checkOverflow(ctx, 15);
  ctx.y = drawSectionTitle(doc, "Pasjesapp", ctx.y, {
    fontSize: FONT_SIZE.subHeader,
    color: COLORS.blue,
  });

  // Reset font for body text (section title sets blue color)
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  // Body text
  const section3Body = "Voor de medewerkers wordt er een app beschikbaar gesteld waarin ze alle behaalde certificaten en verloopdata kunnen inzien.";
  drawWrappedText(ctx, section3Body, contentWidth);

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
 */
function drawBullets(ctx: RenderContext, items: string[]): void {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;
  
  items.forEach((item) => {
    checkOverflow(ctx, smallLineHeight);
    ctx.doc.text("• " + item, margin + 5, ctx.y);
    ctx.y += smallLineHeight;
  });
}
