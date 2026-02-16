/**
 * =============================================================================
 * PAGE 4: MAATWERK E-LEARNING
 * =============================================================================
 *
 * Renders the custom e-learning details page with:
 * - Blue decorative curve (top right) + logo (right side)
 * - Section 1: "Wat biedt maatwerk e-learning?" with 5 bullet points
 * - Transition paragraph
 * - Section 2: "Ontwikkeling & maatwerk e-learning" (blue header)
 *   - Intro paragraph + "Denk hierbij aan:" bullets
 *   - "In de e-learnings wordt met verschillende methodes gewerkt" paragraph
 *   - 3 main bullets with sub-bullets:
 *     1. Diverse werkvormen & media (4 sub-bullets)
 *     2. Talen & internationalisering (paragraph)
 *     3. Doorlopende optimalisatie (paragraph)
 * - Two closing paragraphs about SCORM/LTI
 * - Footer
 *
 * AI BREADCRUMB: This page is 100% FIXED TEXT — no dynamic data from the form.
 * It's the densest page with nested bullet points. The text wrapping for
 * sub-bullets uses indentation (margin + 8 for sub-bullet marker, margin + 14
 * for sub-bullet text) and reduced content width (contentWidth - 12).
 *
 * PAGE OVERFLOW HANDLING: This page checks if content exceeds the footer
 * boundary (270mm) and automatically adds new pages when needed.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { COLORS, LAYOUT, FONT_SIZE, FOOTER } from "./config";
import { drawTopRightCurve, drawLogo, drawFooter, drawSectionTitle } from "./utils";

/** Return type for renderPage4 - includes final page count */
export interface Page4Result {
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
    
    // Reset Y to top of content area
    ctx.y = 45;
  }
}

export function renderPage4(doc: jsPDF, data: QuoteFormData, startPageNum: number = 4): Page4Result {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;

  // Create render context
  const ctx: RenderContext = {
    doc,
    y: 45,
    pageNum: startPageNum,
    data,
  };

  // --- Decorative elements ---
  drawTopRightCurve(doc);
  drawLogo(doc, "right");

  // =========================================================================
  // SECTION 1: "Wat biedt maatwerk e-learning?"
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Wat biedt maatwerk e-learning?", ctx.y, {
    fontSize: FONT_SIZE.subHeaderSmall,
    color: COLORS.darkGray,
  });

  doc.setFontSize(FONT_SIZE.small);
  drawSection1Bullets(ctx);

  ctx.y += 2;

  // Transition paragraph
  doc.setFont("helvetica", "normal");
  const para1 = "Met deze maatwerk e-learningmodules kunnen medewerkers op elk moment en in hun eigen tempo leren, waardoor kennis en vaardigheden optimaal worden ontwikkeld.";
  drawWrappedText(ctx, para1, contentWidth);
  ctx.y += 6;

  // =========================================================================
  // SECTION 2: "Ontwikkeling & maatwerk e-learning"
  // =========================================================================
  checkOverflow(ctx, 20); // Check before section title
  ctx.y = drawSectionTitle(doc, "Ontwikkeling & maatwerk e-learning", ctx.y, {
    fontSize: FONT_SIZE.subHeader,
    color: COLORS.blue,
  });

  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  drawSection2Content(ctx);

  // --- Footer on last page ---
  drawFooter(doc, ctx.pageNum, data, ctx.pageNum);

  return { totalPages: ctx.pageNum };
}

// =============================================================================
// SECTION 1 BULLETS — "Wat biedt maatwerk e-learning?"
// =============================================================================

/** Each bullet has a bold title on line 1, then a normal description on line 2+ */
const SECTION1_BULLETS = [
  {
    title: "Aanvullend op praktijktrainingen",
    text: "Ondersteunt en versterkt fysieke trainingen met digitale leermiddelen (blended learning).",
  },
  {
    title: "Losse trainingen en toolboxen",
    text: "Korte, gerichte modules voor specifieke onderwerpen of vaardigheden.",
  },
  {
    title: "Duidelijke werkinstructies",
    text: "Stapsgewijze uitleg en toetsing voor optimale kennisborging.",
  },
  {
    title: "Interactieve leerervaring",
    text: "Optioneel: 360-graden foto's met geïntegreerde instructies en spelelementen.",
  },
  {
    title: "Gemaakt in Articulate Rise",
    text: "Een gebruiksvriendelijke en responsieve e-learningomgeving, toegankelijk op desktop, tablet en mobiel.",
  },
];

function drawSection1Bullets(ctx: RenderContext): void {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;

  SECTION1_BULLETS.forEach((bullet) => {
    // Check if we need a new page (estimate space needed for this bullet)
    checkOverflow(ctx, smallLineHeight * 3);
    
    // Bold title with bullet marker
    ctx.doc.setFont("helvetica", "bold");
    ctx.doc.text("• " + bullet.title, margin, ctx.y);
    ctx.y += smallLineHeight;

    // Normal description, indented
    ctx.doc.setFont("helvetica", "normal");
    const textLines = ctx.doc.splitTextToSize(bullet.text, contentWidth - 8);
    
    // Check if the text lines would overflow
    checkOverflow(ctx, textLines.length * smallLineHeight);
    
    ctx.doc.text(textLines, margin + 8, ctx.y);
    ctx.y += textLines.length * smallLineHeight + 3;
  });
}

// =============================================================================
// TEXT RENDERING WITH OVERFLOW CHECK
// =============================================================================

/**
 * Draws wrapped text with automatic page overflow handling.
 * Splits text into lines and checks each line against footer boundary.
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

// =============================================================================
// SECTION 2 CONTENT — "Ontwikkeling & maatwerk e-learning"
// =============================================================================

function drawSection2Content(ctx: RenderContext): void {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;

  // --- Intro paragraph ---
  const para2 = "Bij de ontwikkeling van maatwerk e-learning of het omzetten van bestaande werkinstructies naar interactieve e-learningmodules, kan Abiant tijdens dit proces live meekijken en suggesties aandragen.";
  drawWrappedText(ctx, para2, contentWidth);
  ctx.y += 4;

  // --- "Denk hierbij aan:" bullets ---
  checkOverflow(ctx, smallLineHeight * 4);
  ctx.doc.text("Denk hierbij aan:", margin, ctx.y);
  ctx.y += smallLineHeight;

  const denkHierbijItems = [
    "Eigen look & feel",
    "Voorbeelden uit de dagelijkse praktijk",
    "Relevante (bijna) ongevallen als voorbeelden en scenario's",
  ];
  denkHierbijItems.forEach((item) => {
    checkOverflow(ctx, smallLineHeight);
    ctx.doc.text("• " + item, margin + 4, ctx.y);
    ctx.y += smallLineHeight;
  });
  ctx.y += 3;

  // --- Methods paragraph ---
  const para3 = "In de e-learnings wordt met verschillende methodes gewerkt. Denk hierbij aan de volgende mogelijkheden:";
  drawWrappedText(ctx, para3, contentWidth);
  ctx.y += 4;

  // --- Main bullet 1: Diverse werkvormen & media ---
  drawMainBulletWithSubBullets(ctx, "Diverse werkvormen & media in de online omgeving:", [
    "Afbeeldingen en video's",
    "Optioneel 360-graden foto's met interactieve instructies en spelelementen",
    "Diverse vraagsoorten, zoals matching pairs en klikbare ontdekkingen (drag & drop)",
    "Animaties voor visuele ondersteuning (GIF of video)",
  ]);

  // --- Main bullet 2: Talen & internationalisering ---
  drawMainBulletWithParagraph(
    ctx,
    "Talen & internationalisering:",
    "Het LMS en de e-learningmodules kunnen worden geleverd in meerdere talen, zoals Engels, Frans, Duits of Pools, zodat alle medewerkers in hun eigen taal kunnen leren."
  );

  // --- Main bullet 3: Doorlopende optimalisatie ---
  drawMainBulletWithParagraph(
    ctx,
    "Doorlopende optimalisatie:",
    "Jaarlijks vindt een evaluatie en update plaats om het LMS en de e-learning up-to-date te houden met de laatste wet- en regelgeving en interne ontwikkelingen."
  );

  ctx.y += 3; // Extra spacing before closing paragraphs

  // --- Closing paragraph 1 (SCORM/LTI) ---
  const para4 = "Anderszins kan informatie in PDF-vorm of als video gedeeld worden, zonder kennis te toetsen. Het betreft een gebruiksvriendelijk, maar toch een interactief systeem dat kennis deelt op de gewenste manier. Eventueel worden bestaande trainingen als SCORM of middels een LTI-verbinding hieraan gekoppeld. Door 't WEB ontwikkelde e-learnings worden altijd afgesloten met een toets. Zo ben je actief aan het toetsen of alle informatie begrepen is.";
  drawWrappedText(ctx, para4, contentWidth);
  ctx.y += 6;

  // --- Closing paragraph 2 ---
  const para5 = "Met deze mogelijkheid beschikt Abiant over een slimme, flexibele en toekomstbestendige leeroplossing die medewerkers optimaal ondersteunt in hun ontwikkeling!";
  drawWrappedText(ctx, para5, contentWidth);
}

// =============================================================================
// NESTED BULLET HELPERS
// =============================================================================

/**
 * Draws a bold main bullet followed by indented sub-bullets.
 * Used for "Diverse werkvormen & media" which has 4 sub-items.
 */
function drawMainBulletWithSubBullets(
  ctx: RenderContext,
  title: string,
  subItems: string[]
): void {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;

  // Check if we have space for the main bullet
  checkOverflow(ctx, smallLineHeight * 2);

  // Main bullet (bold)
  ctx.doc.setFont("helvetica", "bold");
  ctx.doc.text("• " + title, margin, ctx.y);
  ctx.y += smallLineHeight + 1;
  ctx.doc.setFont("helvetica", "normal");

  // Sub-bullets (indented, with text wrapping)
  subItems.forEach((item) => {
    const itemLines = ctx.doc.splitTextToSize(item, contentWidth - 12);
    
    // Check if this sub-bullet would overflow
    checkOverflow(ctx, itemLines.length * smallLineHeight);
    
    ctx.doc.text("•", margin + 8, ctx.y);
    ctx.doc.text(itemLines, margin + 14, ctx.y);
    ctx.y += itemLines.length * smallLineHeight;
  });
  ctx.y += 3;
}

/**
 * Draws a bold main bullet followed by an indented paragraph.
 * Used for "Talen & internationalisering" and "Doorlopende optimalisatie".
 */
function drawMainBulletWithParagraph(
  ctx: RenderContext,
  title: string,
  paragraph: string
): void {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;

  // Check if we have space for the main bullet
  checkOverflow(ctx, smallLineHeight * 2);

  // Main bullet (bold)
  ctx.doc.setFont("helvetica", "bold");
  ctx.doc.text("• " + title, margin, ctx.y);
  ctx.y += smallLineHeight + 1;
  ctx.doc.setFont("helvetica", "normal");

  // Indented paragraph with overflow check
  drawWrappedText(ctx, paragraph, contentWidth - 12, 8);
  ctx.y += 3;
}
