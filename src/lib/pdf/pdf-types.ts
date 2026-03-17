/**
 * =============================================================================
 * SHARED PDF TYPES
 * =============================================================================
 *
 * Types shared across all PDF page renderers.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import type { QuoteFormData } from "@/types";

/** Context object passed through drawing functions for page tracking */
export interface RenderContext {
  doc: jsPDF;
  y: number;
  pageNum: number;
  data: QuoteFormData;
}
