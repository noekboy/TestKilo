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
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { COLORS, LAYOUT, FONT_SIZE } from "./config";
import { drawTopRightCurve, drawLogo, drawFooter, drawSectionTitle } from "./utils";

export function renderPage4(doc: jsPDF, data: QuoteFormData): void {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;

  // --- Decorative elements ---
  drawTopRightCurve(doc);
  drawLogo(doc, "right");

  let y = 45;

  // =========================================================================
  // SECTION 1: "Wat biedt maatwerk e-learning?"
  // =========================================================================
  y = drawSectionTitle(doc, "Wat biedt maatwerk e-learning?", y, {
    fontSize: FONT_SIZE.subHeaderSmall,
    color: COLORS.darkGray,
  });

  doc.setFontSize(FONT_SIZE.small);
  y = drawSection1Bullets(doc, y);

  y += 2;

  // Transition paragraph
  doc.setFont("helvetica", "normal");
  const para1 = "Met deze maatwerk e-learningmodules kunnen medewerkers op elk moment en in hun eigen tempo leren, waardoor kennis en vaardigheden optimaal worden ontwikkeld.";
  const para1Lines = doc.splitTextToSize(para1, contentWidth);
  doc.text(para1Lines, margin, y);
  y += para1Lines.length * smallLineHeight + 6;

  // =========================================================================
  // SECTION 2: "Ontwikkeling & maatwerk e-learning"
  // =========================================================================
  y = drawSectionTitle(doc, "Ontwikkeling & maatwerk e-learning", y, {
    fontSize: FONT_SIZE.subHeader,
    color: COLORS.blue,
  });

  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  y = drawSection2Content(doc, y);

  // --- Footer ---
  drawFooter(doc, 4, data);
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

function drawSection1Bullets(doc: jsPDF, startY: number): number {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;
  let y = startY;

  SECTION1_BULLETS.forEach((bullet) => {
    // Bold title with bullet marker
    doc.setFont("helvetica", "bold");
    doc.text("• " + bullet.title, margin, y);
    y += smallLineHeight;

    // Normal description, indented
    doc.setFont("helvetica", "normal");
    const textLines = doc.splitTextToSize(bullet.text, contentWidth - 8);
    doc.text(textLines, margin + 8, y);
    y += textLines.length * smallLineHeight + 3;
  });

  return y;
}

// =============================================================================
// SECTION 2 CONTENT — "Ontwikkeling & maatwerk e-learning"
// =============================================================================

function drawSection2Content(doc: jsPDF, startY: number): number {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;
  let y = startY;

  // --- Intro paragraph ---
  const para2 = "Bij de ontwikkeling van maatwerk e-learning of het omzetten van bestaande werkinstructies naar interactieve e-learningmodules, kan Abiant tijdens dit proces live meekijken en suggesties aandragen.";
  const para2Lines = doc.splitTextToSize(para2, contentWidth);
  doc.text(para2Lines, margin, y);
  y += para2Lines.length * smallLineHeight + 4;

  // --- "Denk hierbij aan:" bullets ---
  doc.text("Denk hierbij aan:", margin, y);
  y += smallLineHeight;

  const denkHierbijItems = [
    "Eigen look & feel",
    "Voorbeelden uit de dagelijkse praktijk",
    "Relevante (bijna) ongevallen als voorbeelden en scenario's",
  ];
  denkHierbijItems.forEach((item) => {
    doc.text("• " + item, margin + 4, y);
    y += smallLineHeight;
  });
  y += 3;

  // --- Methods paragraph ---
  const para3 = "In de e-learnings wordt met verschillende methodes gewerkt. Denk hierbij aan de volgende mogelijkheden:";
  const para3Lines = doc.splitTextToSize(para3, contentWidth);
  doc.text(para3Lines, margin, y);
  y += para3Lines.length * smallLineHeight + 4;

  // --- Main bullet 1: Diverse werkvormen & media ---
  y = drawMainBulletWithSubBullets(doc, y, "Diverse werkvormen & media in de online omgeving:", [
    "Afbeeldingen en video's",
    "Optioneel 360-graden foto's met interactieve instructies en spelelementen",
    "Diverse vraagsoorten, zoals matching pairs en klikbare ontdekkingen (drag & drop)",
    "Animaties voor visuele ondersteuning (GIF of video)",
  ]);

  // --- Main bullet 2: Talen & internationalisering ---
  y = drawMainBulletWithParagraph(
    doc,
    y,
    "Talen & internationalisering:",
    "Het LMS en de e-learningmodules kunnen worden geleverd in meerdere talen, zoals Engels, Frans, Duits of Pools, zodat alle medewerkers in hun eigen taal kunnen leren."
  );

  // --- Main bullet 3: Doorlopende optimalisatie ---
  y = drawMainBulletWithParagraph(
    doc,
    y,
    "Doorlopende optimalisatie:",
    "Jaarlijks vindt een evaluatie en update plaats om het LMS en de e-learning up-to-date te houden met de laatste wet- en regelgeving en interne ontwikkelingen."
  );

  y += 3; // Extra spacing before closing paragraphs

  // --- Closing paragraph 1 (SCORM/LTI) ---
  const para4 = "Anderszins kan informatie in PDF-vorm of als video gedeeld worden, zonder kennis te toetsen. Het betreft een gebruiksvriendelijk, maar toch een interactief systeem dat kennis deelt op de gewenste manier. Eventueel worden bestaande trainingen als SCORM of middels een LTI-verbinding hieraan gekoppeld. Door 't WEB ontwikkelde e-learnings worden altijd afgesloten met een toets. Zo ben je actief aan het toetsen of alle informatie begrepen is.";
  const para4Lines = doc.splitTextToSize(para4, contentWidth);
  doc.text(para4Lines, margin, y);
  y += para4Lines.length * smallLineHeight + 6;

  // --- Closing paragraph 2 ---
  const para5 = "Met deze mogelijkheid beschikt Abiant over een slimme, flexibele en toekomstbestendige leeroplossing die medewerkers optimaal ondersteunt in hun ontwikkeling!";
  const para5Lines = doc.splitTextToSize(para5, contentWidth);
  doc.text(para5Lines, margin, y);
  y += para5Lines.length * smallLineHeight;

  return y;
}

// =============================================================================
// NESTED BULLET HELPERS
// =============================================================================

/**
 * Draws a bold main bullet followed by indented sub-bullets.
 * Used for "Diverse werkvormen & media" which has 4 sub-items.
 */
function drawMainBulletWithSubBullets(
  doc: jsPDF,
  startY: number,
  title: string,
  subItems: string[]
): number {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;
  let y = startY;

  // Main bullet (bold)
  doc.setFont("helvetica", "bold");
  doc.text("• " + title, margin, y);
  y += smallLineHeight + 1;
  doc.setFont("helvetica", "normal");

  // Sub-bullets (indented, with text wrapping)
  subItems.forEach((item) => {
    const itemLines = doc.splitTextToSize(item, contentWidth - 12);
    doc.text("•", margin + 8, y);
    doc.text(itemLines, margin + 14, y);
    y += itemLines.length * smallLineHeight;
  });
  y += 3;

  return y;
}

/**
 * Draws a bold main bullet followed by an indented paragraph.
 * Used for "Talen & internationalisering" and "Doorlopende optimalisatie".
 */
function drawMainBulletWithParagraph(
  doc: jsPDF,
  startY: number,
  title: string,
  paragraph: string
): number {
  const { margin, contentWidth, smallLineHeight } = LAYOUT;
  let y = startY;

  // Main bullet (bold)
  doc.setFont("helvetica", "bold");
  doc.text("• " + title, margin, y);
  y += smallLineHeight + 1;
  doc.setFont("helvetica", "normal");

  // Indented paragraph
  const lines = doc.splitTextToSize(paragraph, contentWidth - 12);
  doc.text(lines, margin + 8, y);
  y += lines.length * smallLineHeight + 3;

  return y;
}
