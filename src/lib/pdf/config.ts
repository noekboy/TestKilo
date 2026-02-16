/**
 * =============================================================================
 * PDF LAYOUT CONFIGURATION
 * =============================================================================
 *
 * All "magic numbers" for the PDF layout live here. When an AI model needs to
 * adjust spacing, colors, or font sizes, it only needs to edit THIS file.
 *
 * AI BREADCRUMB: This file defines the visual constants for the entire PDF.
 * Colors are RGB tuples [R, G, B]. Dimensions are in millimeters (mm).
 * The PDF is A4 portrait: 210mm × 297mm.
 * =============================================================================
 */

/** RGB color tuple type used by jsPDF */
export type RGB = [number, number, number];

// =============================================================================
// BRAND COLORS — 't WEB corporate identity
// =============================================================================

export const COLORS = {
  /** Primary brand blue: #005293 */
  blue: [0, 82, 147] as RGB,
  /** Dark blue for table headers, pyramid: #0F3C63 */
  darkBlue: [15, 60, 99] as RGB,
  /** Body text color: #333333 */
  darkGray: [51, 51, 51] as RGB,
  /** Secondary/muted text: #808080 */
  lightGray: [128, 128, 128] as RGB,
  /** White for text on dark backgrounds */
  white: [255, 255, 255] as RGB,
  /** Orange accent for pyramid label: #E67E22 */
  orange: [230, 126, 34] as RGB,
  /** Beige for cover page banner: #F5F2EB */
  beige: [245, 242, 235] as RGB,
  /** Green for language availability checkmarks */
  green: [0, 128, 0] as RGB,
  /** Light background for alternating table rows */
  tableRowAlt: [245, 245, 245] as RGB,
} as const;

// =============================================================================
// PAGE DIMENSIONS — A4 portrait in mm
// =============================================================================

export const PAGE = {
  /** A4 width in mm */
  width: 210,
  /** A4 height in mm */
  height: 297,
  /** Total number of pages in the PDF */
  totalPages: 4,
} as const;

// =============================================================================
// MARGINS & SPACING
// =============================================================================

export const LAYOUT = {
  /** Left/right margin from page edge */
  margin: 20,
  /** Usable content width (pageWidth - 2 * margin) */
  contentWidth: 210 - 2 * 20, // 170mm
  /** Standard line height for body text */
  lineHeight: 6,
  /** Smaller line height for dense text (Page 4) */
  smallLineHeight: 5,
  /** Space between paragraphs */
  paragraphSpacing: 4,
  /** Y position where content starts after header */
  contentStartY: 40,
} as const;

// =============================================================================
// FONT SIZES — Named sizes for consistency
// =============================================================================

export const FONT_SIZE = {
  /** Page titles, logo text */
  title: 24,
  /** Section headers */
  sectionHeader: 16,
  /** Sub-section headers */
  subHeader: 12,
  /** Sub-section headers (smaller) */
  subHeaderSmall: 11,
  /** Body text */
  body: 10,
  /** Table text, bullet points */
  small: 9,
  /** Slogan, footer text */
  tiny: 8,
  /** "In ontwikkeling" labels */
  micro: 7,
} as const;

// =============================================================================
// COVER PAGE (Page 1) — Specific layout positions
// =============================================================================

export const COVER = {
  /** Y position of the beige banner */
  bannerY: 120,
  /** Height of the beige banner */
  bannerHeight: 25,
  /** Y offset from banner top to recipient address block */
  recipientOffsetY: 45,
} as const;

// =============================================================================
// TABLE LAYOUT (Page 3) — Course table column widths as fractions
// =============================================================================

export const TABLE = {
  /** Row height in mm */
  rowHeight: 8,
  /** Column width ratios (must sum to ~1.0) */
  colRatios: [0.5, 0.2, 0.1, 0.1, 0.1] as const,
  /** Radius of language availability circles */
  circleRadius: 2.5,
} as const;

// =============================================================================
// PYRAMID (Page 3) — Learning retention pyramid
// =============================================================================

export const PYRAMID = {
  /** Width of intro text as fraction of content width */
  introWidthRatio: 0.55,
  /** Width of pyramid as fraction of content width */
  pyramidWidthRatio: 0.35,
  /** Height of each pyramid level bar */
  levelHeight: 8,
  /** Gap between pyramid levels */
  levelGap: 1,
  /** Pyramid level data (top = narrowest, bottom = widest) */
  levels: [
    { text: "Luisteren", pct: "10%" },
    { text: "Lezen", pct: "20%" },
    { text: "Zien en horen", pct: "30%" },
    { text: "Zien, horen en nadoen", pct: "50%" },
    { text: "Discussiëren", pct: "60%" },
    { text: "Zelf meemaken", pct: "80%" },
    { text: "Uitleggen aan anderen", pct: "95%" },
  ] as const,
} as const;

// =============================================================================
// FOOTER — Company contact info (fixed text)
// =============================================================================

export const FOOTER = {
  text: "'t Web Opleidingen en Adviezen | www.tweb.nl | Tel.: +31 (0) 528 280 888 | Zeppelinstraat 7 | 7903 BR Hoogeveen",
  /** Y position of main footer text from page bottom */
  mainY: 10,
  /** Y position of page number from page bottom */
  pageNumY: 6,
  /** Y position where footer area begins (content should not go below this) */
  footerStartY: 270,
} as const;
