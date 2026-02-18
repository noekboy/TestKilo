/**
 * =============================================================================
 * PAGE 11: PHASING & PLANNING TABLES
 * =============================================================================
 *
 * Renders two tables for project phasing and planning:
 * - Table 1: Fasering (Spoor 1 & Spoor 2 side by side)
 * - Table 2: Investering maatwerk e-learning en klantenportaal
 *
 * AI BREADCRUMB: This page uses DYNAMIC DATA for client name replacement.
 * All instances of "Abiant" in the source text are replaced with data.klantnaam.
 * The "Uitvoerend door" column uses dynamic client name.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";
import { COLORS, LAYOUT, FONT_SIZE, FOOTER } from "./config";
import { drawTopRightCurve, drawLogo, drawFooter, drawSectionTitle } from "./utils";

/** Return type for renderPage11 - includes final page count */
export interface Page11Result {
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
 */
function checkOverflow(ctx: RenderContext, neededSpace: number = 0): void {
  if (ctx.y + neededSpace >= FOOTER.footerStartY) {
    ctx.doc.addPage();
    ctx.pageNum++;
    
    drawTopRightCurve(ctx.doc);
    drawLogo(ctx.doc, "right");
    
    ctx.doc.setFontSize(FONT_SIZE.small);
    ctx.doc.setFont("helvetica", "normal");
    ctx.doc.setTextColor(0, 0, 0);
    
    ctx.y = 80;
  }
}

export function renderPage11(doc: jsPDF, data: QuoteFormData, startPageNum: number = 11): Page11Result {
  const { margin, contentWidth } = LAYOUT;
  const clientName = data.klantnaam || "Abiant";

  // Create render context
  const ctx: RenderContext = {
    doc,
    y: 85,
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
  // TITLE: Fasering samenwerking
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Fasering samenwerking", ctx.y, {
    fontSize: FONT_SIZE.sectionHeader,
    color: COLORS.blue,
  });
  ctx.y += 5;

  // =========================================================================
  // TABLE 1: Fasering (Two columns side by side)
  // =========================================================================
  const table1ColWidth = contentWidth / 2;
  const table1RowHeight = 6;
  const table1Indent = 3;

  // Table 1 Header
  doc.setFillColor(...COLORS.blue);
  doc.rect(margin, ctx.y, table1ColWidth, 8, "F");
  doc.rect(margin + table1ColWidth, ctx.y, table1ColWidth, 8, "F");
  
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.white);
  doc.text("Spoor 1 (trainingen en planning)", margin + 2, ctx.y + 5);
  doc.text("Spoor 2 (ICT)", margin + table1ColWidth + 2, ctx.y + 5);
  ctx.y += 8;

  // Table 1 Content
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const spoor1Items = [
    { text: "Aanstelling planning/ coördinatie 't Web", indent: 0 },
    { text: "Aanstelling docent leerlijn", indent: 0 },
    { text: "Afstemming procesbeschrijving", indent: 0 },
    { text: "Afstemming opzet en inhoud trainingen", indent: 0 },
    { text: "Ontwikkeling maatwerk lesplannen", indent: 1 },
    { text: "Taxonomie Bloom", indent: 1 },
    { text: "Welke les vormen (doen i.p.v. luisteren)", indent: 1 },
    { text: "Scenario's bepalen", indent: 1 },
    { text: `Scenario evt. leskaarten: inhoud en look and feel ${clientName}`, indent: 1 },
    { text: "Trainingen inplannen docenten en organisatie", indent: 0 },
  ];

  const spoor2Items = [
    { text: "Afstemming evt. koppeling met HR-systeem", indent: 0 },
    { text: "Bepaling indeling klantenportaal* (* optioneel)", indent: 0 },
    { text: "Afstemming koppeling e-learning", indent: 0 },
    { text: `De ${clientName} e-learning klant specifiek maken`, indent: 0 },
    { text: "Optioneel real time meekijken en mogelijkheid opmerkingen", indent: 1 },
    { text: "Inhoud afstemmen", indent: 1 },
    { text: "Optioneel klant specifieke filmpjes toevoegen", indent: 1 },
    { text: `Look and feel ${clientName} aanpassen`, indent: 1 },
  ];

  // Calculate max rows needed
  const maxRows1 = Math.max(spoor1Items.length, spoor2Items.length);
  
  // Draw table borders and content
  for (let i = 0; i < maxRows1; i++) {
    const rowY = ctx.y + (i * table1RowHeight);
    
    // Draw cell borders
    doc.setDrawColor(...COLORS.lightGray);
    doc.setLineWidth(0.2);
    doc.rect(margin, rowY, table1ColWidth, table1RowHeight);
    doc.rect(margin + table1ColWidth, rowY, table1ColWidth, table1RowHeight);
    
    // Draw content for Spoor 1
    if (i < spoor1Items.length) {
      const item = spoor1Items[i];
      const xPos = margin + table1Indent + (item.indent * 4);
      doc.text(item.indent > 0 ? `• ${item.text}` : item.text, xPos, rowY + 4);
    }
    
    // Draw content for Spoor 2
    if (i < spoor2Items.length) {
      const item = spoor2Items[i];
      const xPos = margin + table1ColWidth + table1Indent + (item.indent * 4);
      doc.text(item.indent > 0 ? `• ${item.text}` : item.text, xPos, rowY + 4);
    }
  }
  
  ctx.y += maxRows1 * table1RowHeight + 10;

  // =========================================================================
  // TITLE 2: Investering maatwerk e-learning en klantenportaal
  // =========================================================================
  ctx.y = drawSectionTitle(doc, "Investering maatwerk e-learning en klantenportaal", ctx.y, {
    fontSize: FONT_SIZE.body,
    color: COLORS.blue,
  });
  ctx.y += 2;

  // Subtitle
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(0, 0, 0);
  doc.text(`Eerste opzet verwachting ${clientName}:`, margin, ctx.y);
  ctx.y += 6;

  // =========================================================================
  // TABLE 2: Investering/Planning (3 columns)
  // =========================================================================
  const col1Width = contentWidth * 0.20; // Actie (20%)
  const col2Width = contentWidth * 0.55; // Taken (55%)
  const col3Width = contentWidth * 0.25; // Uitvoerend door (25%)
  const table2RowHeight = 6;

  // Table 2 Header
  doc.setFillColor(...COLORS.blue);
  doc.rect(margin, ctx.y, col1Width, 8, "F");
  doc.rect(margin + col1Width, ctx.y, col2Width, 8, "F");
  doc.rect(margin + col1Width + col2Width, ctx.y, col3Width, 8, "F");
  
  doc.setFontSize(FONT_SIZE.small);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.white);
  doc.text("Actie", margin + 2, ctx.y + 5);
  doc.text("Taken", margin + col1Width + 2, ctx.y + 5);
  doc.text("Uitvoerend door", margin + col1Width + col2Width + 2, ctx.y + 5);
  ctx.y += 8;

  // Table 2 Content - Group 1: Inventarisatie (3 rows)
  const inventarisatieRows = [
    { task: "Inventarisatie huidige situatie", exec: `${clientName} / TWEB` },
    { task: "Doelstelling gewenste / wettelijke situatie", exec: `${clientName} / TWEB` },
    { task: "Afstemmen lesmethodes", exec: `${clientName} / TWEB` },
  ];

  const group1Rows = inventarisatieRows.length;
  const group1StartY = ctx.y;
  const group1Height = group1Rows * table2RowHeight;

  // Draw Group 1 cells
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  
  for (let i = 0; i < group1Rows; i++) {
    const rowY = ctx.y + (i * table2RowHeight);
    
    // Draw cell borders
    doc.setDrawColor(...COLORS.lightGray);
    doc.setLineWidth(0.2);
    doc.rect(margin, rowY, col1Width, table2RowHeight);
    doc.rect(margin + col1Width, rowY, col2Width, table2RowHeight);
    doc.rect(margin + col1Width + col2Width, rowY, col3Width, table2RowHeight);
    
    // Draw task and exec
    doc.text(inventarisatieRows[i].task, margin + col1Width + 2, rowY + 4);
    doc.text(inventarisatieRows[i].exec, margin + col1Width + col2Width + 2, rowY + 4);
  }

  // Draw "Inventarisatie" centered vertically in the group
  doc.setFont("helvetica", "bold");
  const inventarisatieY = group1StartY + (group1Height / 2) + 1.5;
  doc.text("Inventarisatie", margin + 2, inventarisatieY, { baseline: "middle" });
  
  ctx.y += group1Height;

  // Table 2 Content - Group 2: Ontwikkeling E-Learning (6 rows)
  const ontwikkelingRows = [
    { task: "Logische leerlijn bepalen (taxonomie van bloom)", exec: "TWEB" },
    { task: "Media ontvangen werkinstructies", exec: clientName },
    { task: "Inhoud omzetten tot digitale lesstof", exec: "TWEB" },
    { task: "Evaluatie E-Learning", exec: `${clientName} / TWEB` },
    { task: "Onlinetrainingen uploaden in de betreffende cursus", exec: "TWEB" },
    { task: "Feedback verwerken", exec: "TWEB" },
  ];

  const group2Rows = ontwikkelingRows.length;
  const group2StartY = ctx.y;
  const group2Height = group2Rows * table2RowHeight;

  // Draw Group 2 cells
  doc.setFont("helvetica", "normal");
  
  for (let i = 0; i < group2Rows; i++) {
    const rowY = ctx.y + (i * table2RowHeight);
    
    // Draw cell borders
    doc.setDrawColor(...COLORS.lightGray);
    doc.setLineWidth(0.2);
    doc.rect(margin, rowY, col1Width, table2RowHeight);
    doc.rect(margin + col1Width, rowY, col2Width, table2RowHeight);
    doc.rect(margin + col1Width + col2Width, rowY, col3Width, table2RowHeight);
    
    // Draw task and exec
    doc.text(ontwikkelingRows[i].task, margin + col1Width + 2, rowY + 4);
    doc.text(ontwikkelingRows[i].exec, margin + col1Width + col2Width + 2, rowY + 4);
  }

  // Draw "Ontwikkeling E-Learning" centered vertically in the group (split across lines if needed)
  doc.setFont("helvetica", "bold");
  const ontwikkelingY = group2StartY + (group2Height / 2) - 2;
  doc.text("Ontwikkeling", margin + 2, ontwikkelingY);
  doc.text("E-Learning", margin + 2, ontwikkelingY + 4);
  
  ctx.y += group2Height;

  // --- Footer on last page ---
  drawFooter(doc, ctx.pageNum, data, ctx.pageNum);

  return { totalPages: ctx.pageNum };
}
