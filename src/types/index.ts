/**
 * =============================================================================
 * SHARED TYPES & DATA for 't WEB OfferteMaker
 * =============================================================================
 *
 * This file is the SINGLE SOURCE OF TRUTH for all types, constants, and
 * reference data shared between the Form (quote-form.tsx) and the PDF
 * generator (generate-pdf.ts).
 *
 * AI BREADCRUMB: If you need to add a new form field, update QuoteFormData
 * here AND the form component. The PDF pages import from this file.
 * =============================================================================
 */

// =============================================================================
// TOPIC ITEMS — Used on Page 2 (Introduction & Topics)
// Each sub-item is individually selectable via checkboxes in the form.
// =============================================================================

export const TOPIC_ITEMS = {
  maatwerk_elearning: [
    { id: "virtuele_tours", label: "Virtuele tours door de productie" },
    { id: "onboarding_modules", label: "Onboardingmodules voor nieuwe medewerkers (functiegericht)" },
    { id: "documentenbeheer", label: "Documentenbeheer: handleidingen en werkinstructies op één plek" },
    { id: "trainings_videos", label: "Korte trainingsvideo's & instructies voor efficiënter inwerken" },
    { id: "leerpaden", label: "Leerpaden en persoonlijke ontwikkeling per functie/branche" },
  ],
  standaard_elearning: [
    { id: "klantenportaal_compliance", label: "Klantenportaal & Compliance" },
    { id: "borging_trainingen", label: "Borging van trainingen via een gekoppeld klantenportaal" },
    { id: "structuur_kennisdeling", label: "Structuur voor terugkerende vragen en kennisdeling" },
  ],
  fysieke_trainingen: [
    { id: "opleidingstrajecten_locatie", label: "Opleidingstrajecten op locatie, volledig geïntegreerd in het LMS" },
    { id: "certificering_pasjesapp", label: "Optioneel certificeringsborging via klantenportaal en pasjesapp" },
  ],
} as const;

/** Union type of all possible topic item IDs */
export type TopicItemId = typeof TOPIC_ITEMS[keyof typeof TOPIC_ITEMS][number]["id"];

// =============================================================================
// E-LEARNING COURSES — Used on Page 3 (Course Table)
// Each course can be selected via checkboxes. Language availability is fixed.
// =============================================================================

export const ELEARNING_COURSES = [
  { id: "bhv", label: "BHV", duration: "± 4 uren", nl: true, uk: true, pl: true },
  { id: "eerste_hulp_reanimatie", label: "Eerste hulp & Reanimatie", duration: "± 2 uren", nl: true, uk: true, pl: true },
  { id: "blussen_ontruimen", label: "Blussen & Ontruimen", duration: "± 2 uren", nl: true, uk: true, pl: true },
  { id: "eerste_hulp_babys_kinderen", label: "Eerste Hulp aan Baby's en Kinderen", duration: "± 4 uren", nl: true, uk: "in_dev" as const, pl: false },
  { id: "vca_basisveiligheid", label: "VCA Basisveiligheid", duration: "± 4 uren", nl: true, uk: false, pl: false },
  { id: "ept", label: "Elektrische Pallet Truck (EPT)", duration: "± 2 uren", nl: true, uk: "in_dev" as const, pl: false },
  { id: "heftruck", label: "Heftruck", duration: "± 4 uren", nl: true, uk: "in_dev" as const, pl: false },
  { id: "reachtruck", label: "Reachtruck", duration: "± 4 uren", nl: true, uk: "in_dev" as const, pl: false },
  { id: "hoogwerker", label: "Hoogwerker", duration: "± 4 uren", nl: true, uk: false, pl: false },
  { id: "veilig_hijsen", label: "Veilig Hijsen", duration: "± 4 uren", nl: true, uk: "in_dev" as const, pl: "in_dev" as const },
  { id: "nen_3140_vop", label: "NEN 3140 VOP", duration: "± 4 uren", nl: true, uk: false, pl: false },
  { id: "adr_13_awareness", label: "ADR 1.3 Awareness", duration: "± 3 uren", nl: true, uk: false, pl: false },
  { id: "besloten_ruimte", label: "Besloten ruimte + gasmeten", duration: "± 2 uren", nl: true, uk: false, pl: false },
  { id: "polyurethaan", label: "Polyurethaan", duration: "± 2 uren", nl: true, uk: false, pl: false },
  { id: "atex", label: "ATEX", duration: "± 2 uren", nl: true, uk: false, pl: false },
] as const;

/** Union type of all possible course IDs */
export type CourseId = typeof ELEARNING_COURSES[number]["id"];

// =============================================================================
// FORM DATA INTERFACE — The contract between Form and PDF Generator
// =============================================================================

export interface QuoteFormData {
  /** Quote number, e.g. "2602051" */
  offerte_nummer: string;
  /** Client/company name */
  klantnaam: string;
  /** Full name of contact person (used in "T.a.v." line) */
  contactpersoon_volledig: string;
  /** First name / salutation (used in "Beste {aanhef}," greeting) */
  aanhef: string;
  /** Sector/learning track, e.g. "industrie & productie" */
  sector: string;
  /** Hourly rate for custom e-learning, e.g. "€ 69,-" */
  uurtarief_maatwerk: string;
  /** Date in YYYY-MM-DD format */
  datum: string;
  /** Selected topic IDs for Page 2 */
  selected_topics: TopicItemId[];
  /** Selected course IDs for Page 3 table */
  selected_courses: CourseId[];
  // =============================================================================
  // PAGE 10 - INVESTMENT & FINANCIALS
  // =============================================================================
  /** Price for Module leerlijn bouw in euros (default: 2760) */
  price_module_bouw: number;
  /** Hourly rate for custom work in euros (default: 69) */
  price_custom_hourly: number;
  /** Estimated hours for custom work (default: 40) */
  hours_custom_estimated: number;
  /** Optional items text (free-form, bullet points) */
  text_optional: string;
  /** Exclusions text (free-form, bullet points) */
  text_exclusions: string;
}

// =============================================================================
// SECTOR OPTIONS — Dropdown values for the form
// =============================================================================

export const SECTOR_OPTIONS = [
  { value: "agrarisch", label: "Agrarisch" },
  { value: "bouw", label: "Bouw" },
  { value: "groen", label: "Groen" },
  { value: "gww", label: "GWW" },
  { value: "industrie & productie", label: "Industrie & Productie" },
  { value: "transport & logistiek", label: "Transport & Logistiek" },
  { value: "zorg", label: "Zorg" },
  { value: "techniek", label: "Techniek" },
] as const;

// =============================================================================
// UTILITY FUNCTIONS — Shared between form and PDF
// =============================================================================

/** Get today's date in YYYY-MM-DD format for the date input default */
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

/** Format a YYYY-MM-DD date string to Dutch format, e.g. "13 februari 2026" */
export const formatDateDutch = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

/** Initial (empty) form data with today's date pre-filled */
export const INITIAL_FORM_DATA: QuoteFormData = {
  offerte_nummer: "",
  klantnaam: "",
  contactpersoon_volledig: "",
  aanhef: "",
  sector: "",
  uurtarief_maatwerk: "",
  datum: getTodayDate(),
  selected_topics: [],
  selected_courses: [],
  // Page 10 - Investment & Financials
  price_module_bouw: 2760,
  price_custom_hourly: 69,
  hours_custom_estimated: 40,
  text_optional: `• Advisering van de "Even Voorstellen" tekst
• Werkinstructies omzetten in e-learning (veiligheidsboekje)
• Maatwerkontwikkeling van het klantenportaal
• Vertaalkosten van losse modules naar het Engels (middels ChatGPT)
• Projectbegeleiding door 't WEB
• API- koppeling TWEB`,
  text_exclusions: `• Foto's, films, animaties, tekeningen/schetsen
• Incompany trainingen
• Vertaalkosten van de losse modules indien Chat GPT niet mogelijk is
• Jaarlijks onderhoud ICT contract € 2500,-
  o Klantenportaal (Service, onderhoud, beveiliging)
  o E-learning (Kleine wijzigingen (updates/ jaarlijkse vernieuwing), tekstuele aanpassingen)
  o Op basis van fair use (indicatie 5 dagdelen per jaar)
• BTW 21 %`,
};

/** Field labels for validation error messages (Dutch) */
export const FIELD_LABELS: Record<keyof Omit<QuoteFormData, "selected_topics" | "selected_courses" | "text_optional" | "text_exclusions">, string> = {
  offerte_nummer: "Offertenummer",
  klantnaam: "Klantnaam",
  contactpersoon_volledig: "Contactpersoon (volledige naam)",
  aanhef: "Aanhef (voornaam)",
  sector: "Sector/Leerlijn",
  uurtarief_maatwerk: "Uurtarief Maatwerk",
  datum: "Datum",
  // Page 10 - Investment & Financials
  price_module_bouw: "Prijs Module leerlijn bouw",
  price_custom_hourly: "Uurtarief maatwerk",
  hours_custom_estimated: "Geschatte uren maatwerk",
};
