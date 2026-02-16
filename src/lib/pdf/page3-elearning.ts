/**
 * =============================================================================
 * PAGE 3: E-LEARNING SECTION
 * =============================================================================
 *
 * Renders the e-learning overview page with:
 * - Blue decorative curve (top right) + logo (right side)
 * - "E-learning" title
 * - 5 intro paragraphs (left side, ~55% width)
 * - Learning retention pyramid diagram (right side, ~35% width)
 * - Course table with selected courses (or all if none selected)
 * - Footer
 *
 * AI BREADCRUMB: This page has a TWO-COLUMN layout for the top half
 * (text left, pyramid right), then a FULL-WIDTH table below.
 * The pyramid has 7 levels from narrow (top) to wide (bottom).
 * The course table shows language availability with green circles.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { ELEARNING_COURSES } from "@/types";
import { COLORS, LAYOUT, FONT_SIZE, PAGE, PYRAMID, TABLE } from "./config";
import { drawTopRightCurve, drawLogo } from "./utils";

// =============================================================================
// MAIN PAGE RENDERER
// =============================================================================

export function renderPage3(doc: jsPDF, data: QuoteFormData): void {
  const { margin, contentWidth } = LAYOUT;

  // --- Decorative elements ---
  drawTopRightCurve(doc);
  drawLogo(doc, "right");

  let y = 45;

  // --- "E-learning" title ---
  doc.setFontSize(FONT_SIZE.sectionHeader);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkBlue);
  doc.text("E-learning", margin, y);
  y += 10;

  // --- Two-column layout: intro text (left) + pyramid (right) ---
  const introWidth = contentWidth * PYRAMID.introWidthRatio;
  const pyramidMaxWidth = contentWidth * PYRAMID.pyramidWidthRatio;
  const pyramidX = margin + introWidth + 10;

  // Draw intro paragraphs (left column)
  const textEndY = drawIntroText(doc, y, introWidth);

  // Draw pyramid (right column)
  const pyramidEndY = drawPyramid(doc, y, pyramidX, pyramidMaxWidth);

  // Move past both columns
  y = Math.max(textEndY, pyramidEndY) + 10;

  // --- Course table ---
  drawCourseTable(doc, y, data);

  // Note: Footer is drawn by orchestrator after all pages are rendered
  // (to get correct total page count when Page 4 overflows)
}

// =============================================================================
// INTRO TEXT (Left column)
// =============================================================================

const INTRO_PARAGRAPHS = [
  "'t WEB ontwikkelt maatwerk e-learnings om invulling te geven aan intern beleid en kennis hieromtrent te borgen. Bijvoorbeeld een werkinstructie kan zodoende tijd- en plaats onafhankelijk & meertalig gedeeld worden.",
  "Tevens heeft 't WEB een serie standaard e-learnings beschikbaar die direct ingezet kunnen worden. Indien gewenst kunnen deze ook op maat toegespitst worden. Op basis van de juiste bronbestanden kunnen standaard e-learnings tot maatwerktraining doorontwikkeld worden.",
  "Deze digitale trainingen zorgen voor een effectieve en flexibele leerervaring, afgestemd op de specifieke behoeften van medewerkers en functies.",
  "Online trainen kan onderdeel zijn van een sterk leerbeleid. Klassikale trainingen zullen voor veel doeleinden altijd belangrijk blijven. E-learning wordt vaak toegepast t.b.v. blended learning.",
  "Zie hieronder het huidige overzicht van beschikbare e-learnings. Niet elke training wordt volledig afgerond door enkel de digitale training, vaak is het van belang om ook praktisch te trainen (blended learning).",
];

function drawIntroText(doc: jsPDF, startY: number, maxWidth: number): number {
  const { margin } = LAYOUT;

  doc.setFontSize(FONT_SIZE.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  let y = startY;
  INTRO_PARAGRAPHS.forEach((text) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  });

  return y;
}

// =============================================================================
// LEARNING RETENTION PYRAMID (Right column)
// =============================================================================

/**
 * Draws the 7-level learning retention pyramid.
 * Each level is a rounded rectangle with text inside and percentage outside.
 *
 * AI BREADCRUMB: The pyramid goes from narrow (top, "Luisteren 10%")
 * to wide (bottom, "Uitleggen aan anderen 95%"). Width starts at 40%
 * of max and increases by 10% per level.
 */
function drawPyramid(
  doc: jsPDF,
  startY: number,
  pyramidX: number,
  maxWidth: number
): number {
  const { levelHeight, levelGap, levels } = PYRAMID;

  // "e-learning" label (rotated, orange)
  doc.setFontSize(FONT_SIZE.subHeader);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.orange);
  doc.text("e-learning", pyramidX + maxWidth + 5, startY + 40, { angle: 90 });

  // Draw each pyramid level
  doc.setFontSize(FONT_SIZE.tiny);
  levels.forEach((level, index) => {
    const widthPercent = 0.4 + index * 0.1; // 40% → 100%
    const levelWidth = maxWidth * widthPercent;
    const levelX = pyramidX + (maxWidth - levelWidth) / 2;
    const levelY = startY + index * (levelHeight + levelGap);

    // Bar rectangle
    doc.setFillColor(...COLORS.darkBlue);
    doc.roundedRect(levelX, levelY, levelWidth, levelHeight, 1, 1, "F");

    // Text inside bar (white)
    doc.setTextColor(...COLORS.white);
    doc.setFont("helvetica", "normal");
    doc.text(level.text, levelX + 3, levelY + 5);

    // Percentage outside bar (dark gray, to the right)
    doc.setTextColor(...COLORS.darkGray);
    doc.text(level.pct, levelX + levelWidth + 3, levelY + 5);
  });

  return startY + levels.length * (levelHeight + levelGap);
}

// =============================================================================
// COURSE TABLE
// =============================================================================

/**
 * Draws the e-learning course table with columns:
 * E-learning | Duur | NL | UK | PL
 *
 * AI BREADCRUMB: If no courses are selected, ALL courses are shown.
 * Language availability is shown as green filled circles (true),
 * "In ontwikkeling" italic text (in_dev), or nothing (false).
 */
function drawCourseTable(doc: jsPDF, startY: number, data: QuoteFormData): void {
  const { margin, contentWidth } = LAYOUT;
  const { rowHeight, colRatios, circleRadius } = TABLE;

  // Determine which courses to show
  const selectedCourses = data.selected_courses;
  const coursesToShow =
    selectedCourses.length > 0
      ? ELEARNING_COURSES.filter((c) => selectedCourses.includes(c.id))
      : [...ELEARNING_COURSES];

  if (coursesToShow.length === 0) return;

  // Calculate column positions (absolute X positions)
  const colWidths = colRatios.map((r) => contentWidth * r);
  const colX: number[] = [margin]; // First column starts at margin
  for (let i = 1; i < colWidths.length; i++) {
    colX.push(colX[i - 1] + colWidths[i - 1]);
  }

  let y = startY;

  // --- Table header row ---
  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(margin, y, contentWidth, rowHeight, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT_SIZE.small);

  doc.text("E-learning", colX[0] + 3, y + 5.5);
  doc.text("Duur", colX[1] + 3, y + 5.5);
  doc.text("NL", colX[2] + colWidths[2] / 2, y + 5.5, { align: "center" });
  doc.text("UK", colX[3] + colWidths[3] / 2, y + 5.5, { align: "center" });
  doc.text("PL", colX[4] + colWidths[4] / 2, y + 5.5, { align: "center" });

  y += rowHeight;

  // --- Table data rows ---
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);
  doc.setFontSize(FONT_SIZE.small);

  coursesToShow.forEach((course, index) => {
    // Alternating row background
    if (index % 2 === 1) {
      doc.setFillColor(...COLORS.tableRowAlt);
      doc.rect(margin, y, contentWidth, rowHeight, "F");
    }

    // Row border line
    doc.setDrawColor(...COLORS.blue);
    doc.setLineWidth(0.1);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    // Course name
    doc.setTextColor(...COLORS.darkGray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONT_SIZE.small);
    doc.text(course.label, colX[0] + 3, y + 5.5);

    // Duration
    doc.text(course.duration, colX[1] + 3, y + 5.5);

    // Language availability columns
    const langCenterX = [
      colX[2] + colWidths[2] / 2,
      colX[3] + colWidths[3] / 2,
      colX[4] + colWidths[4] / 2,
    ];
    const langValues = [course.nl, course.uk, course.pl];

    langValues.forEach((val, langIdx) => {
      if (val === true) {
        // Green filled circle
        doc.setFillColor(...COLORS.green);
        doc.circle(langCenterX[langIdx], y + 4, circleRadius, "F");
      } else if (val === "in_dev") {
        // "In ontwikkeling" italic text
        doc.setFont("helvetica", "italic");
        doc.setFontSize(FONT_SIZE.micro);
        doc.setTextColor(...COLORS.lightGray);
        doc.text("In ontwikkeling", langCenterX[langIdx], y + 5.5, { align: "center" });
        // Reset font
        doc.setFont("helvetica", "normal");
        doc.setFontSize(FONT_SIZE.small);
        doc.setTextColor(...COLORS.darkGray);
      }
    });

    y += rowHeight;
  });
}
