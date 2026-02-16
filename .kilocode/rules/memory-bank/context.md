# Active Context: 't WEB OfferteMaker

## Current State

**Application Status**: 🔄 In Development - Codebase Refactored (Modular Architecture)

The application is a PDF quote generator for 't WEB account managers. Users fill in a form with variable data, and a standardized PDF quote is generated with fixed text and branding.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] jsPDF library for PDF generation
- [x] QuoteForm component with all required input fields
- [x] PDF generation with 5+ page layout
- [x] 't WEB branding (blue #005293, gray, white)
- [x] Dutch language interface
- [x] Page 1 cover page layout redesign with blue curve, logo, beige banner
- [x] Form fields grouped by PDF page (Pagina 1-3 sections)
- [x] Date field with today's date as default
- [x] Individually selectable topic checkboxes for Page 2
- [x] Dynamic topic display in PDF based on selection
- [x] E-learning section as Page 3 (replaced old Investment & Signature pages)
- [x] 15 selectable e-learning courses with checkboxes
- [x] Learning retention pyramid diagram (7 levels)
- [x] Course table with language availability (NL, UK, PL checkmarks)
- [x] Page 4 - Maatwerk e-learning with full text content
- [x] Improved text formatting on Page 4 (proper wrapping for nested bullets)
- [x] Dynamic footer with quote number and date on all pages
- [x] Modular architecture refactor (Composer Pattern)
- [x] Shared types extracted to src/types/index.ts
- [x] PDF config with named constants (no magic numbers)
- [x] PDF utils for reusable drawing helpers
- [x] Each PDF page in its own file (page1-cover, page2-intro, page3-elearning, page4-maatwerk, page5-borging)
- [x] AI breadcrumb comments throughout codebase
- [x] Page 5 - Borging & Ondersteuning (compliance, HR support, Pasjesapp)
- [x] Page 6 - Fysieke trainingen en ARBO ondersteuning (physical training, ARBO support)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main page with form | ✅ Complete |
| `src/app/layout.tsx` | Root layout | ✅ Complete |
| `src/app/globals.css` | Global styles with 't WEB branding | ✅ Complete |
| `src/types/index.ts` | Shared types, constants, data (single source of truth) | ✅ Complete |
| `src/components/quote-form.tsx` | Form component (imports from @/types) | ✅ Complete |
| `src/lib/generate-pdf.ts` | PDF orchestrator (delegates to page renderers) | ✅ Complete |
| `src/lib/pdf/config.ts` | Layout constants, colors, font sizes | ✅ Complete |
| `src/lib/pdf/utils.ts` | Reusable PDF drawing helpers | ✅ Complete |
| `src/lib/pdf/page1-cover.ts` | Page 1: Cover page renderer | ✅ Complete |
| `src/lib/pdf/page2-intro.ts` | Page 2: Introduction & Topics renderer | ✅ Complete |
| `src/lib/pdf/page3-elearning.ts` | Page 3: E-learning overview + course table | ✅ Complete |
| `src/lib/pdf/page4-maatwerk.ts` | Page 4: Maatwerk e-learning details | ✅ Complete |
| `src/lib/pdf/page5-borging.ts` | Page 5+: Borging & Ondersteuning | ✅ Complete |
| `src/lib/pdf/page6-arbo.ts` | Page 6+: Fysieke trainingen en ARBO | ✅ New |

## Features

### Form Fields (Input) - Grouped by PDF Page
**Pagina 1 - Voorblad:**
- Offertenummer (quote number)
- Datum (date field, defaults to today)
- Klantnaam (client name)
- Contactpersoon volledig (full contact name)

**Pagina 2 - Introductie & Onderwerpen:**
- Aanhef (salutation/first name)
- Sector/Leerlijn (dropdown with 8 sectors)
- Uurtarief Maatwerk (hourly rate)
- Topic checkboxes (individually selectable):
  - **Maatwerk E-learning**: Virtuele tours, Onboardingmodules, Documentenbeheer, Trainingsvideo's, Leerpaden
  - **Standaard E-learning**: Klantenportaal & Compliance, Borging trainingen, Structuur kennisdeling
  - **Fysieke Trainingen**: Opleidingstrajecten locatie, Certificering pasjesapp

**Pagina 3 - E-learning Cursussen:**
- Course checkboxes (15 selectable courses):
  - BHV, Eerste hulp & Reanimatie, Blussen & Ontruimen
  - Eerste Hulp aan Baby's en Kinderen, VCA Basisveiligheid
  - Elektrische Pallet Truck (EPT), Heftruck, Reachtruck
  - Hoogwerker, Veilig Hijsen, NEN 3140 VOP
  - ADR 1.3 Awareness, Besloten ruimte + gasmeten
  - Polyurethaan, ATEX

### PDF Output (6+ Pages)
1. **Cover Page**: Blue decorative curve (top right), 't web logo with slogan, beige banner with "Maatwerk e-learning | Offerte {nummer}", recipient address block
2. **Introduction & Topics**: Personalized greeting, selected topics only (dynamic)
3. **E-learning Section**: 
   - 5 intro paragraphs about e-learning
   - Learning retention pyramid (7 levels: Luisteren 10% → Uitleggen aan anderen 95%)
   - Course table with selected courses, duration, and language availability (✓ for NL/UK/PL)
4. **Maatwerk E-learning Section**:
   - "Wat biedt maatwerk e-learning?" section with 5 bullet points
   - "Ontwikkeling & maatwerk e-learning" section (blue header)
   - Detailed content about development process and possibilities
   - Nested bullet points for: Diverse werkvormen & media, Talen & internationalisering, Doorlopende optimalisatie
   - Final paragraphs about PDF/video sharing and SCORM/LTI integration
   - Small PDCA cycle diagram (bottom right corner)
   - "Borging" label indicating continuous improvement
5. **Borging & Ondersteuning Section**:
   - "Borging m.b.v. koppeling met klantenportaal (compliance)" - dashboard overview, TWEB.insight, HR-system integration
   - "Ondersteuning HR (bij fysieke trainingen)" - regie afspraken, uitnodigingen, reminders, evaluatie, certificaten
   - "Pasjesapp" - mobile app for employees to view certificates and expiry dates
6. **Fysieke Trainingen & ARBO Ondersteuning Section**:
   - Intro paragraphs about physical training and ARBO support
   - Training offerings bullet list: Risicoanalyse, Veiligheidscultuur, BHV, Ergonomie, Gevaarlijke stoffen, Machines, Lastrainingen, Overige trainingen
   - Closing sentence about investing in ARBO training

### Page 1 Design Elements
- Blue decorative curve (top right corner) - FIXED
- Logo: "'t web" with icon - FIXED
- Slogan: "Jouw partner voor veiligheid, compliancy en borging" - FIXED
- Beige banner with "Maatwerk e-learning" - FIXED
- Quote number in banner - VARIABLE
- Recipient name and "T.a.v. {contact}" - VARIABLE
- Footer with company contact info - FIXED

### Page 3 E-learning Section
- Intro text (left side): 5 paragraphs about 't WEB e-learning offerings
- Pyramid diagram (right side): 7-level learning retention pyramid
  - Levels: Luisteren (10%), Lezen (20%), Zien en horen (30%), Zien/horen/nadoen (50%), Discussiëren (60%), Zelf meemaken (80%), Uitleggen aan anderen (95%)
  - Percentages displayed outside the pyramid bars (to the right)
- Course table: Shows selected courses (or all if none selected)
  - Columns: E-learning name, Duration, NL, UK, PL
  - Language availability shown with bold green ✔ checkmarks
  - "In ontwikkeling" for courses in development

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| jsPDF | PDF generation |
| Bun | Package manager |

## Brand Colors

- **Primary Blue**: #005293
- **Dark Blue**: #0F3C63 (table headers, pyramid)
- **Dark Gray**: #333333
- **Light Gray**: #808080
- **White**: #FFFFFF
- **Beige**: #F5F2EB (banner background)
- **Orange**: #E67E22 (pyramid label)

## Session History

| Date | Changes |
|------|---------|
| 2026-02-16 | Added Page 6 (Fysieke trainingen en ARBO ondersteuning): intro paragraphs, 8 bullet points for training offerings, closing sentence; follows same overflow handling pattern as Page 5 |
| 2026-02-16 | Added Page 5 (Borging & Ondersteuning): compliance section with klantenportaal, HR support section, Pasjesapp section; follows same overflow handling pattern as Page 4 |
| 2026-02-16 | Fixed Page 4 overflow handling: text on overflow pages now starts at y=80mm (below blue curve) with correct font settings reset |
| 2026-02-16 | Added page overflow detection for Page 4: content automatically flows to new pages when exceeding footer boundary (270mm); dynamic page numbering in footers |
| 2026-02-13 | Added full text content to Page 4: "Wat biedt maatwerk e-learning?" section with 5 bullets, "Ontwikkeling & maatwerk e-learning" section, nested bullets for werkvormen/talen/optimalisatie, final paragraphs about SCORM/LTI; moved PDCA diagram to bottom right as smaller decorative element |
| 2026-02-13 | Added Page 4 with PDCA diagram for Maatwerk e-learning; implemented 4-block PDCA cycle (PLAN, DO, CHECK, ACT) with single blue color; added orange arrows showing cycle flow; added "Borging" label; updated total pages to 4; added dynamic footer with quote number and date |
| 2026-02-13 | Improved Page 3 visual design: moved pyramid percentages outside bars (to the right); changed language checkmarks to bold ✔ symbol with green color for better visibility |
| 2026-02-13 | Fixed form validation by removing unused fields (totaalprijs, prijs per deelnemer, accountmanager) from interface and validation |
| 2026-02-13 | Replaced Page 3 (Investment) and Page 4 (Signature) with new E-learning Page 3; added 15 course selection checkboxes; implemented pyramid diagram; added course table with language availability |
| 2026-02-13 | Added date field with today's default; added individual topic checkboxes; updated PDF to show selected topics only; added date to footer |
| 2026-02-13 | Redesigned Page 1 cover page layout with blue curve, logo, beige banner; grouped form fields by PDF page |
| 2026-02-12 | Built complete OfferteMaker MVP with PDF generation |
| Initial | Template created with base setup |
