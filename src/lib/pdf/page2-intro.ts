/**
 * =============================================================================
 * PAGE 2: INTRODUCTION & TOPICS
 * =============================================================================
 *
 * Renders the personalized introduction page with:
 * - Simple header (blue rect with "'t WEB")
 * - Greeting: "Beste {aanhef},"
 * - Two intro paragraphs (mentioning sector)
 * - "Besproken onderwerpen" header
 * - DYNAMIC topic list grouped by category (only selected topics shown)
 * - Closing paragraph (mentioning hourly rate)
 * - Footer
 *
 * AI BREADCRUMB: This page is HIGHLY DYNAMIC. The topic list changes based
 * on which checkboxes the user selected in the form. Topics are grouped
 * into 3 categories: Maatwerk E-learning, Standaard E-learning, Fysieke Trainingen.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { TOPIC_ITEMS } from "@/types";
import { COLORS, LAYOUT, FONT_SIZE } from "./config";
import { drawSimpleHeader, drawFooter, setSmallFont } from "./utils";

export function renderPage2(doc: jsPDF, data: QuoteFormData): void {
  const { margin, contentWidth, lineHeight, paragraphSpacing } = LAYOUT;

  // --- Header ---
  drawSimpleHeader(doc);

  let y = LAYOUT.contentStartY;

  // --- Greeting ---
  doc.setFontSize(FONT_SIZE.subHeader);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);
  doc.text(`Beste ${data.aanhef},`, margin, y);
  y += lineHeight + paragraphSpacing;

  // --- Introduction paragraphs ---
  const intro1 = "Tijdens onze laatste afspraak hebben we het gehad over maatwerk scholing en leerlijnen per sector: Agrarisch, bouw, groen, GWW, industrie & productie, transport & logistiek, zorg en techniek.";
  const intro1Lines = doc.splitTextToSize(intro1, contentWidth);
  doc.text(intro1Lines, margin, y);
  y += intro1Lines.length * lineHeight + paragraphSpacing;

  const intro2 = `Daarbij zou je graag met een leerlijn voor de ${data.sector} beginnen die opgenomen kan worden in jullie Studytube LMS d.m.v. LTI-koppeling.`;
  const intro2Lines = doc.splitTextToSize(intro2, contentWidth);
  doc.text(intro2Lines, margin, y);
  y += intro2Lines.length * lineHeight + paragraphSpacing * 2;

  // --- Topics header ---
  doc.setFont("helvetica", "bold");
  doc.text("Tijdens onze afspraak hebben we de volgende onderwerpen besproken:", margin, y);
  y += lineHeight + paragraphSpacing;

  // --- Dynamic topic list (only selected topics) ---
  const selectedTopics = data.selected_topics;

  // Helper: render a category if it has selected items
  const renderCategory = (
    categoryKey: keyof typeof TOPIC_ITEMS,
    categoryLabel: string
  ) => {
    const items = TOPIC_ITEMS[categoryKey]
      .filter((item) => selectedTopics.includes(item.id))
      .map((item) => item.label);

    if (items.length === 0) return;

    // Category header (bold)
    doc.setFont("helvetica", "bold");
    doc.text(categoryLabel, margin, y);
    y += lineHeight;

    // Bullet items (normal)
    doc.setFont("helvetica", "normal");
    items.forEach((item) => {
      doc.text(`• ${item}`, margin + 5, y);
      y += lineHeight;
    });
    y += paragraphSpacing;
  };

  doc.setFont("helvetica", "normal");
  renderCategory("maatwerk_elearning", "Maatwerk E-learning modules");
  renderCategory("standaard_elearning", "Standaard e-learning");
  renderCategory("fysieke_trainingen", "Fysieke Trainingen");

  // Fallback if nothing selected
  if (selectedTopics.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.text("(Geen onderwerpen geselecteerd)", margin, y);
    y += lineHeight + paragraphSpacing;
  }

  // --- Closing paragraph ---
  setSmallFont(doc);
  const closing = `Maatwerk e-learning kunnen we opzetten, net als onboarding. Een maatwerk e-learning kan al voor ${data.uurtarief_maatwerk} per uur worden opgezet, wanneer 't WEB de content al beschikbaar heeft. Moet alles nog ontwikkeld worden, dan kunnen we een pakketprijs afspreken.`;
  const closingLines = doc.splitTextToSize(closing, contentWidth);
  doc.text(closingLines, margin, y);

  // --- Footer ---
  drawFooter(doc, 2, data);
}
