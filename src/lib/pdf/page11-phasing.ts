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
import { COLORS, LAYOUT, FONT_SIZE, FOOTER, FLOW } from "./config";
import { drawTopRightCurve, drawLogo, drawSectionTitle } from "./utils";
import type { RenderContext } from "./pdf-types";

/** Return type for renderPage11 - includes final page count and render context */
export interface Page11Result {
  totalPages: number;
  ctx: RenderContext;
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
    ctx.doc.setTextColor(...COLORS.darkGray);
    
    ctx.y = 80;
  }
}

export function renderPage11(doc: jsPDF, data: QuoteFormData, startPageNum: number = 11, incomingCtx?: RenderContext): Page11Result {
  const { margin, contentWidth } = LAYOUT;
  const clientName = data.klantnaam || "Abiant";

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
  const table1RowHeight = 7;
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
  doc.setTextColor(...COLORS.darkGray);

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

  // Pre-calculate wrapped text and dynamic row heights
  const maxRows1 = Math.max(spoor1Items.length, spoor2Items.length);
  const T1_LINE_H = 4.5; // mm per line at 9pt
  const T1_PADDING = 2;  // top padding before first text line

  doc.setFontSize(FONT_SIZE.small);

  type Table1Row = { col1Lines: string[]; col1X: number; col2Lines: string[]; col2X: number; height: number };
  const t1Rows: Table1Row[] = [];

  for (let i = 0; i < maxRows1; i++) {
    let col1Lines: string[] = [];
    let col1X = margin + table1Indent;
    let col2Lines: string[] = [];
    let col2X = margin + table1ColWidth + table1Indent;

    if (i < spoor1Items.length) {
      const item = spoor1Items[i];
      col1X = margin + table1Indent + item.indent * 4;
      const availW = table1ColWidth - table1Indent - item.indent * 4 - 2;
      col1Lines = doc.splitTextToSize(item.indent > 0 ? `• ${item.text}` : item.text, availW);
    }

    if (i < spoor2Items.length) {
      const item = spoor2Items[i];
      col2X = margin + table1ColWidth + table1Indent + item.indent * 4;
      const availW = table1ColWidth - table1Indent - item.indent * 4 - 2;
      col2Lines = doc.splitTextToSize(item.indent > 0 ? `• ${item.text}` : item.text, availW);
    }

    const maxLines = Math.max(col1Lines.length, col2Lines.length, 1);
    const height = Math.max(table1RowHeight, maxLines * T1_LINE_H + T1_PADDING * 2);
    t1Rows.push({ col1Lines, col1X, col2Lines, col2X, height });
  }

  // Draw Table 1 rows
  let t1RowY = ctx.y;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkGray);

  for (let i = 0; i < t1Rows.length; i++) {
    const { col1Lines, col1X, col2Lines, col2X, height } = t1Rows[i];

    if (i % 2 === 1) {
      doc.setFillColor(...COLORS.tableRowAlt);
      doc.rect(margin, t1RowY, table1ColWidth, height, "F");
      doc.rect(margin + table1ColWidth, t1RowY, table1ColWidth, height, "F");
    }

    doc.setDrawColor(...COLORS.lightGray);
    doc.setLineWidth(0.2);
    doc.rect(margin, t1RowY, table1ColWidth, height);
    doc.rect(margin + table1ColWidth, t1RowY, table1ColWidth, height);

    const textStartY = t1RowY + T1_PADDING + T1_LINE_H * 0.8;
    col1Lines.forEach((line, li) => doc.text(line, col1X, textStartY + li * T1_LINE_H));
    col2Lines.forEach((line, li) => doc.text(line, col2X, textStartY + li * T1_LINE_H));

    t1RowY += height;
  }

  ctx.y = t1RowY + 10;

  // =========================================================================
  // TABLE 2: Investering/Planning (3 columns)
  // Pre-calculate row heights BEFORE overflow check so we know how much space is needed
  // =========================================================================
  const col1Width = contentWidth * 0.20; // Actie (20%)
  const col2Width = contentWidth * 0.55; // Taken (55%)
  const col3Width = contentWidth * 0.25; // Uitvoerend door (25%)
  const table2RowHeight = 7;

  const T2_LINE_H = 4.5;
  const T2_PADDING = 2;
  const col2AvailW = col2Width - 4;
  const col3AvailW = col3Width - 4;

  doc.setFontSize(FONT_SIZE.small);

  type Table2Row = { taskLines: string[]; execLines: string[]; height: number };

  const buildT2Rows = (rawRows: { task: string; exec: string }[]): Table2Row[] =>
    rawRows.map(({ task, exec }) => {
      const taskLines = doc.splitTextToSize(task, col2AvailW);
      const execLines = doc.splitTextToSize(exec, col3AvailW);
      const maxLines = Math.max(taskLines.length, execLines.length, 1);
      return { taskLines, execLines, height: Math.max(table2RowHeight, maxLines * T2_LINE_H + T2_PADDING * 2) };
    });

  // Group 1: Inventarisatie
  const inventarisatieRawRows = [
    { task: "Inventarisatie huidige situatie", exec: `${clientName} / TWEB` },
    { task: "Doelstelling gewenste / wettelijke situatie", exec: `${clientName} / TWEB` },
    { task: "Afstemmen lesmethodes", exec: `${clientName} / TWEB` },
  ];
  const group1T2Rows = buildT2Rows(inventarisatieRawRows);
  const group1Height = group1T2Rows.reduce((sum, r) => sum + r.height, 0);

  // Group 2: Ontwikkeling E-Learning
  const ontwikkelingRawRows = [
    { task: "Logische leerlijn bepalen (taxonomie van bloom)", exec: "TWEB" },
    { task: "Media ontvangen werkinstructies", exec: clientName },
    { task: "Inhoud omzetten tot digitale lesstof", exec: "TWEB" },
    { task: "Evaluatie E-Learning", exec: `${clientName} / TWEB` },
    { task: "Onlinetrainingen uploaden in de betreffende cursus", exec: "TWEB" },
    { task: "Feedback verwerken", exec: "TWEB" },
  ];
  const group2T2Rows = buildT2Rows(ontwikkelingRawRows);
  const group2Height = group2T2Rows.reduce((sum, r) => sum + r.height, 0);

  // Check if Table 2 (title + subtitle + header + both groups) fits on the current page.
  // If not, move to a new page before drawing any of it.
  const estimatedTable2Height = 15 + 10 + 8 + group1Height + group2Height; // title + subtitle + header + rows
  checkOverflow(ctx, estimatedTable2Height);

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
  doc.setTextColor(...COLORS.darkGray);
  doc.text(`Eerste opzet verwachting ${clientName}:`, margin, ctx.y);
  ctx.y += 6;

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

  const group1StartY = ctx.y;

  // Draw helper for a group of Table 2 rows
  const drawT2Group = (rows: Table2Row[], startY: number, globalRowOffset: number) => {
    let rowY = startY;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkGray);

    rows.forEach(({ taskLines, execLines, height }, i) => {
      if ((globalRowOffset + i) % 2 === 1) {
        doc.setFillColor(...COLORS.tableRowAlt);
        doc.rect(margin, rowY, contentWidth, height, "F");
      }

      doc.setDrawColor(...COLORS.lightGray);
      doc.setLineWidth(0.2);
      doc.rect(margin, rowY, col1Width, height);
      doc.rect(margin + col1Width, rowY, col2Width, height);
      doc.rect(margin + col1Width + col2Width, rowY, col3Width, height);

      const textY = rowY + T2_PADDING + T2_LINE_H * 0.8;
      taskLines.forEach((line, li) => doc.text(line, margin + col1Width + 2, textY + li * T2_LINE_H));
      execLines.forEach((line, li) => doc.text(line, margin + col1Width + col2Width + 2, textY + li * T2_LINE_H));

      rowY += height;
    });
  };

  drawT2Group(group1T2Rows, group1StartY, 0);

  // "Inventarisatie" — centered horizontally and vertically in col1 over group 1
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  doc.text("Inventarisatie", margin + col1Width / 2, group1StartY + group1Height / 2, {
    align: "center",
    baseline: "middle",
  });

  ctx.y = group1StartY + group1Height;
  const group2StartY = ctx.y;

  drawT2Group(group2T2Rows, group2StartY, group1T2Rows.length);

  // "Ontwikkeling E-Learning" — centered horizontally and vertically in col1 over group 2
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.darkGray);
  const ontwikkelingCenterY = group2StartY + group2Height / 2;
  doc.text("Ontwikkeling", margin + col1Width / 2, ontwikkelingCenterY - 2.5, { align: "center" });
  doc.text("E-Learning", margin + col1Width / 2, ontwikkelingCenterY + 2.5, { align: "center" });

  ctx.y = group2StartY + group2Height;

  return { totalPages: ctx.pageNum, ctx };
}
